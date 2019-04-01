'use strict'

const Route = use('Route')

Route.group(() => {
  Route.post('login', 'AuthenticationController.login')
  Route.post('register', 'AuthenticationController.register')
  Route.get('me', 'AuthenticationController.me').middleware(['auth'])
  Route.put('change_password', 'AuthenticationController.changePassword').middleware(['auth'])
  Route.post('bookmark/create', 'BookmarkController.create').middleware(['auth'])
  Route.get('bookmarks/:page?', 'BookmarkController.list')
  Route.get('tags', 'BookmarkController.listTags')
  Route.get('bookmarks/tag/:tagName/:page?', 'BookmarkController.listBookmarksByTag')

  Route.get('my/bookmarks/:page?', 'BookmarkController.myList').middleware(['auth'])
  Route.get('my/tags', 'BookmarkController.myListTags').middleware(['auth'])
  Route.get('my/bookmarks/tag/:tagName/:page?', 'BookmarkController.myListBookmarksByTag').middleware(['auth'])
}).prefix('api')
