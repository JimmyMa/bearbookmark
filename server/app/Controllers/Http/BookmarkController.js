'use strict'

const Bookmark = use('App/Models/Bookmark')
const Tag = use('App/Models/Tag')
const BookmarkTag = use('App/Models/BookmarkTag')
const UserTag = use('App/Models/UserTag')
const Database = use('Database')
const read = require('read-art');

class BookmarkController {
  async create ({ request, auth, response }) {
    const newBookmarkData = request.only(['url', 'title', 'excerpt', 'tags', 'public'])

    var trx = null

    try {
      if ( newBookmarkData.title == null || newBookmarkData.title.trim().length == 0) {
        const article = await read(newBookmarkData.url, {output: 'text'})
        newBookmarkData.title = article.title;
        newBookmarkData.excerpt = article.content != null ? article.content.substring(0, 255) : "";
      }
      

      const bookmarkData = {
        user_id: auth.user.id,
        url: newBookmarkData.url,
        public: newBookmarkData.public,
        title: newBookmarkData.title,
        excerpt: newBookmarkData.excerpt
      }

      trx = await Database.beginTransaction()

      console.log("Begin Transaction1" + newBookmarkData.tags)

      const bookmark = await Bookmark.create(bookmarkData)

      if (newBookmarkData.tags != null) {
        for(let tagIndex in newBookmarkData.tags) {
          let tagName = newBookmarkData.tags[tagIndex]
          console.log("Tag " + tagName)
          let tagData = {
            name: tagName
          }
          let tag = await Tag.findOrCreate(tagData, tagData)
          console.log("Tag1 " + tag)
          tag.bookmarks_num = tag.bookmarks_num + 1
          await tag.save()

          let bookmarkTagData = {
            bookmark_id: bookmark.id,
            tag_id: tag.id
          }
          let bookmarkTag = await BookmarkTag.create(bookmarkTagData)

          let userTagData = {
            user_id: auth.user.id,
            tag_id: tag.id
          }

          let userTage = await UserTag.findOrCreate(userTagData, userTagData)
          userTage.bookmarks_num = userTage.bookmarks_num + 1
          await userTage.save()
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
        message: 'There was a problem creating the user, please try again later.'
      })
    }
  }

  async update ({ params, request, auth, response }) {
    const bookmarkData = request.only(['url', 'title', 'excerpt', 'tags', 'public'])

    var trx = null

    try {
      let bookmark = await Bookmark.find(params.id)

      if (bookmark.user_id != auth.user.id) {
        return response.status(401).json({
          status: 'error',
          message: 'You don\'t have authority to update this bookmark'
        })
      }

      if ( bookmarkData.title == null || bookmarkData.title.trim().length == 0) {
        const article = await read(newBookmarkData.url, {output: 'text'})
        bookmarkData.title = article.title;
        bookmarkData.excerpt = article.content != null ? article.content.substring(0, 255) : "";
      }

      bookmark.url = bookmarkData.url
      bookmark.public = bookmarkData.public
      bookmark.title = bookmarkData.title
      bookmark.excerpt = bookmarkData.excerpt
      
      let tags = await bookmark.tags().fetch()
      tags = tags.toJSON()

      trx = await Database.beginTransaction()

      bookmark.save()

      if (bookmarkData.tags != null) {
        for(let tagIndex in bookmarkData.tags) {
          let tagName = bookmarkData.tags[tagIndex]

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

          tag.bookmarks_num = tag.bookmarks_num + 1
          await tag.save()

          let bookmarkTagData = {
            bookmark_id: bookmark.id,
            tag_id: tag.id
          }
          let bookmarkTag = await BookmarkTag.create(bookmarkTagData)

          let userTagData = {
            user_id: auth.user.id,
            tag_id: tag.id
          }

          let userTage = await UserTag.findOrCreate(userTagData, userTagData)
          userTage.bookmarks_num = userTage.bookmarks_num + 1
          await userTage.save()
        }

        for(let tagIndex in tags) {
          let tag = tags[tagIndex]
          await Database
            .table('bookmark_tags')
            .where('tag_id', tag.id)
            .where('bookmark_id', params.id)
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
        message: 'There was a problem updating the bookmark, please try again later.'
      })
    }
  }

  async delete ({ params, request, auth, response }) {
    try {
      let bookmark = await Bookmark.find(params.id)

      if (bookmark.user_id != auth.user.id) {
        return response.status(401).json({
          status: 'error',
          message: 'You don\'t have authority to delete this bookmark'
        })
      }

      bookmark.delete()

      return response.json({
        status: 'success'
      })
    } catch (error) {
      console.debug(error)
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem creating the bookmark, please try again later.'
      })
    }
  }

  async list ({ params, request, response }) {
    try {
      const page = params.page ? params.page : 1
      const bookmarks = await Bookmark.query().where('public', true).orderBy('id', 'desc')
        .with('tags', (builder) => builder.select('name'))
        .with('user', (builder) => builder.select('id', 'username'))
        .paginate(page)

      return response.json({
        status: 'success',
        data: bookmarks
      })
    } catch (error) {
      console.debug(error)
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem list bookmarks, please try again later.'
      })
    }
    
  }

  async listBookmarksByTag ({ params, request, response }) {
    try {
      let tagName = decodeURI(params.tagName)

      const page = params.page ? params.page : 1
      const bookmarks = await Bookmark.query().select('bookmarks.*')
        .innerJoin('bookmark_tags', 'bookmarks.id', 'bookmark_tags.bookmark_id')
        .innerJoin('tags', 'tags.id', 'bookmark_tags.tag_id')
        .where('tags.name', tagName)
        .where('public', true).orderBy('bookmarks.id', 'desc')
        .with('tags', (builder) => builder.select('name'))
        .with('user', (builder) => builder.select('id', 'username'))
        .paginate(page)

      return response.json({
        status: 'success',
        data: bookmarks
      })
    } catch (error) {
      console.debug(error)
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem list bookmarks, please try again later.'
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
        message: 'There was a problem list bookmarks, please try again later.'
      })
    }
  }

  async myList ({ auth, params, request, response }) {
    try {
      const page = params.page ? params.page : 1
      const bookmarks = await Bookmark.query().where("user_id", auth.user.id).orderBy('id', 'desc')
        .with('tags', (builder) => builder.select('name'))
        .with('user', (builder) => builder.select('id', 'username'))
        .paginate(page)

      return response.json({
        status: 'success',
        data: bookmarks
      })
    } catch (error) {
      console.debug(error)
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem list bookmarks, please try again later.'
      })
    }
    
  }

  async myListBookmarksByTag ({ auth, params, request, response }) {
    try {
      let tagName = decodeURI(params.tagName)

      const page = params.page ? params.page : 1
      const bookmarks = await Bookmark.query().select('bookmarks.*')
        .innerJoin('bookmark_tags', 'bookmarks.id', 'bookmark_tags.bookmark_id')
        .innerJoin('tags', 'tags.id', 'bookmark_tags.tag_id')
        .where('tags.name', tagName).where('bookmarks.user_id', auth.user.id).orderBy('bookmarks.id', 'desc')
        .with('tags', (builder) => builder.select('name'))
        .with('user', (builder) => builder.select('id', 'username'))
        .paginate(page)

      return response.json({
        status: 'success',
        data: bookmarks
      })
    } catch (error) {
      console.debug(error)
      return response.status(400).json({
        status: 'error',
        message: 'There was a problem list bookmarks, please try again later.'
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
        message: 'There was a problem list bookmarks, please try again later.'
      })
    }
  }

}

module.exports = BookmarkController
