'use strict'

const Schema = use('Schema')

class TokensSchema extends Schema {
  up () {
    this.create('flashcards', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.text('front').notNullable()
      table.text('back').notNullable()
      table.boolean('public').notNullable().defaultTo(true)
      table.timestamps()
    })

    this.create('flashcard_tags', (table) => {
      table.integer('tag_id').notNullable().unsigned().references('id').inTable('tags')
      table.integer('flashcard_id').notNullable().unsigned().references('id').inTable('flashcards')
      table.timestamps()
    })

    this.create('user_flashcards', (table) => {
      table.increments()
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users')
      table.integer('flashcard_id').notNullable().unsigned().references('id').inTable('flashcards')
      table.boolean('known').notNullable().defaultTo(false)
      table.timestamps()
    })

  }

  down () {
    this.drop('flashcards')
    this.drop('flashcard_tags')
    this.drop('user_flashcards')
  }
}

module.exports = TokensSchema
