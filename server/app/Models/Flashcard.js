'use strict'

const Model = use('Model')

class Flashcard extends Model {

    user () {
        return this.belongsTo('App/Models/User')
    }

    tags () {
        return this
            .belongsToMany('App/Models/Tag')
            .pivotTable('flashcard_tags')
    }
}

module.exports = Flashcard
