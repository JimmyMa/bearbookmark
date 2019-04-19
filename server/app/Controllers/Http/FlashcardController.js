'use strict'

const Flashcard = use('App/Models/Flashcard')
const Tag = use('App/Models/Tag')
const FlashcardTag = use('App/Models/FlashcardTag')
const UserTag = use('App/Models/UserTag')
const Database = use('Database')

class FlashcardController {
  async create ({ request, auth, response }) {
    const newFlashcard = request.only(['front', 'back', 'tags', 'public'])

    console.log("Data " + JSON.stringify(newFlashcard))

    var trx = null

    try {
      const newFlashcardData = {
        'user_id': auth.user.id,
        'front': newFlashcard.front,
        'back': newFlashcard.back,
        'public': newFlashcard.public
      }

      trx = await Database.beginTransaction()

      const flashcard = await Flashcard.create(newFlashcardData)

      if (newFlashcard.tags != null) {
        for(let tagIndex in newFlashcard.tags) {
          let tagName = newFlashcard.tags[tagIndex]
          console.log("Tag " + tagName)
          let tagData = {
            name: tagName
          }
          let tag = await Tag.findOrCreate(tagData, tagData)
          // console.log("Tag1 " + tag)
          // tag.bookmarks_num = tag.bookmarks_num + 1
          // await tag.save()

          let flashcardTagData = {
            flashcard_id: flashcard.id,
            tag_id: tag.id
          }
          let flashcardTag = await FlashcardTag.create(flashcardTagData)

          let userTagData = {
            user_id: auth.user.id,
            tag_id: tag.id
          }

          let userTage = await UserTag.findOrCreate(userTagData, userTagData)
          // userTage.bookmarks_num = userTage.bookmarks_num + 1
          // await userTage.save()
        }
      }

      trx.commit()

      return response.json({
        status: 'success'
      })
    } catch (error) {
      if (trx != null) {
        await trx.rollback()
      }
      
      console.debug(error)
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem creating flashcard, please try again later.'
      })
    }
  }

  async update ({ params, request, auth, response }) {
    const flashcardData = request.only(['front', 'back', 'tags', 'public'])

    var trx = null

    try {
      let flashcard = await Flashcard.find(params.id)

      if (flashcard.user_id != auth.user.id) {
        return response.status(401).json({
          status: 'error',
          message: 'You don\'t have authority to update this flashcard'
        })
      }
      
      flashcard.front = flashcardData.front
      flashcard.back = flashcardData.back
      flashcard.public = flashcardData.public
      
      let tags = await flashcard.tags().fetch()
      tags = tags.toJSON()

      trx = await Database.beginTransaction()

      flashcard.save()

      if (flashcardData.tags != null) {
        for(let tagIndex in flashcardData.tags) {
          let tagName = flashcardData.tags[tagIndex]

          let foundTag = tags.filter((e) => {
            return e.name === tagName
          })

          if (foundTag.length > 0) {
            tags = tags.filter((e) => {
              return e.name != tagName
            })
            continue;
          }

          let tagData = {
            name: tagName
          }
          let tag = await Tag.findOrCreate(tagData, tagData)

          // tag.bookmarks_num = tag.bookmarks_num + 1
          // await tag.save()

          let flashcardTagData = {
            flashcard_id: flashcard.id,
            tag_id: tag.id
          }
          let flashcardTag = await FlashcardTag.create(flashcardTagData)

          let userTagData = {
            user_id: auth.user.id,
            tag_id: tag.id
          }

          let userTage = await UserTag.findOrCreate(userTagData, userTagData)
          // userTage.bookmarks_num = userTage.bookmarks_num + 1
          // await userTage.save()
        }

        for(let tagIndex in tags) {
          let tag = tags[tagIndex]
          await Database
            .table('flashcard_tags')
            .where('tag_id', tag.id)
            .where('flashcard_id', params.id)
            .delete()
        }
      }

      trx.commit()

      return response.json({
        status: 'success'
      })
    } catch (error) {
      if (trx != null) {
        await trx.rollback()
      }
      
      console.debug(error)
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem updating the flashcard, please try again later.'
      })
    }
  }

  async delete ({ params, request, auth, response }) {
    try {
      let flashcard = await Flashcard.find(params.id)

      if (flashcard.user_id != auth.user.id) {
        return response.status(401).json({
          status: 'error',
          message: 'You don\'t have authority to delete this flashcard'
        })
      }

      flashcard.delete()

      return response.json({
        status: 'success'
      })
    } catch (error) {
      console.debug(error)
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem creating the flashcard, please try again later.'
      })
    }
  }

  async list ({ params, request, response }) {
    try {
      const page = params.page ? params.page : 1
      const flashcards = await Flashcard.query().where('public', true).orderBy('id', 'desc')
        .with('tags', (builder) => builder.select('name'))
        .with('user', (builder) => builder.select('id', 'username'))
        .paginate(page)

      return response.json({
        status: 'success',
        data: flashcards
      })
    } catch (error) {
      console.debug(error)
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem list flashcards, please try again later.'
      })
    }
    
  }

  async listFlashcardsByTag ({ params, request, response }) {
    try {
      let tagName = decodeURI(params.tagName)

      const page = params.page ? params.page : 1
      const flashcards = await Flashcard.query().select('flashcards.*')
        .innerJoin('flashcard_tags', 'flashcards.id', 'flashcard_tags.flashcard_id')
        .innerJoin('tags', 'tags.id', 'flashcard_tags.tag_id')
        .where('tags.name', tagName)
        .where('public', true).orderBy('flashcards.id', 'desc')
        .with('tags', (builder) => builder.select('name'))
        .with('user', (builder) => builder.select('id', 'username'))
        .paginate(page)

      return response.json({
        status: 'success',
        data: flashcards
      })
    } catch (error) {
      console.debug(error)
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem list flashcards, please try again later.'
      })
    }
    
  }

  async listTags ({ request, response }) {
    try {
      const tags = await Tag.all()

      return response.json({
        status: 'success',
        data: tags
      })
    } catch (error) {
      console.debug(error)
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem list flashcards, please try again later.'
      })
    }
  }

  async myList ({ auth, params, request, response }) {
    try {
      const page = params.page ? params.page : 1
      const flashcards = await Flashcard.query().where("user_id", auth.user.id).orderBy('id', 'desc')
        .with('tags', (builder) => builder.select('name'))
        .with('user', (builder) => builder.select('id', 'username'))
        .paginate(page)

      return response.json({
        status: 'success',
        data: flashcards
      })
    } catch (error) {
      console.debug(error)
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem list flashcards, please try again later.'
      })
    }
    
  }

  async myListFlashcardsByTag ({ auth, params, request, response }) {
    try {
      let tagName = decodeURI(params.tagName)

      const page = params.page ? params.page : 1
      const flashcards = await Flashcard.query().select('flashcards.*')
        .innerJoin('flashcard_tags', 'flashcards.id', 'flashcard_tags.flashcard_id')
        .innerJoin('tags', 'tags.id', 'flashcard_tags.tag_id')
        .where('tags.name', tagName).where('flashcards.user_id', auth.user.id).orderBy('flashcards.id', 'desc')
        .with('tags', (builder) => builder.select('name'))
        .with('user', (builder) => builder.select('id', 'username'))
        .paginate(page)

      return response.json({
        status: 'success',
        data: flashcards
      })
    } catch (error) {
      console.debug(error)
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem list flashcards, please try again later.'
      })
    }
    
  }

  async myListTags ({ auth, request, response }) {
    try {
      const tags = await Tag.query().select('tags.*')
        .innerJoin('user_tags', 'tags.id', 'user_tags.tag_id')
        .where('user_tags.user_id', auth.user.id)

      return response.json({
        status: 'success',
        data: tags
      })
    } catch (error) {
      console.debug(error)
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem list tags, please try again later.'
      })
    }
  }

}

module.exports = FlashcardController
