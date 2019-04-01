'use strict'

const Schema = use('Schema')

class TokensSchema extends Schema {
  up () {
    this.create('bookmarks', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('url').notNullable()
      table.string('title').notNullable()
      table.string('image_url').notNullable().defaultTo("")
      table.text('excerpt').notNullable().defaultTo("")
      table.boolean('public').notNullable().defaultTo(true)
      table.integer('min_read_time').unsigned().notNullable().defaultTo(0)
      table.integer('max_read_time').unsigned().notNullable().defaultTo(0)
      table.timestamps()
    })

    this.create('tags', (table) => {
      table.increments()
      table.text('name').notNullable().unique()
      table.integer('bookmarks_num').defaultTo(0)
      table.timestamps()
    })

    this.create('user_tags', (table) => {
      table.increments()
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users')
      table.integer('tag_id').notNullable().unsigned().references('id').inTable('tags')
      table.integer('bookmarks_num').defaultTo(0)
      table.timestamps()
    })

    this.create('bookmark_tags', (table) => {
      table.integer('tag_id').notNullable().unsigned().references('id').inTable('tags')
      table.integer('bookmark_id').notNullable().unsigned().references('id').inTable('bookmarks')
      table.timestamps()
    })

  }

  down () {
    this.drop('bookmarks')
    this.drop('tags')
    this.drop('bookmark_tags')
    this.drop('user_tags')
  }
}

module.exports = TokensSchema
