'use strict'

const Model = use('Model')

class Bookmark extends Model {

    user () {
        return this.belongsTo('App/Models/User')
    }

    tags () {
        return this
            .belongsToMany('App/Models/Tag')
            .pivotTable('bookmark_tags')
    }
}

module.exports = Bookmark
