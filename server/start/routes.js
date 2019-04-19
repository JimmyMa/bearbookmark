'use strict'

const Route = use('Route')

Route.group(() => {
  Route.post('login', 'AuthenticationController.login')
  Route.post('register', 'AuthenticationController.register')
  Route.get('me', 'AuthenticationController.me').middleware(['auth'])
  Route.put('change_password', 'AuthenticationController.changePassword').middleware(['auth'])

  Route.post('bookmark', 'BookmarkController.create').middleware(['auth'])
  Route.put('bookmark/:id', 'BookmarkController.update').middleware(['auth'])
  Route.delete('bookmark/:id', 'BookmarkController.delete').middleware(['auth'])

  Route.get('my/bookmarks/:page?', 'BookmarkController.myList').middleware(['auth'])
  Route.get('my/tags', 'BookmarkController.myListTags').middleware(['auth'])
  Route.get('my/bookmarks/tag/:tagName/:page?', 'BookmarkController.myListBookmarksByTag').middleware(['auth'])

  Route.get('bookmarks/:page?', 'BookmarkController.list')
  Route.get('tags', 'BookmarkController.listTags')
  Route.get('bookmarks/tag/:tagName/:page?', 'BookmarkController.listBookmarksByTag')


  Route.post('flashcard', 'FlashcardController.create').middleware(['auth'])
  Route.put('flashcard/:id', 'FlashcardController.update').middleware(['auth'])
  Route.delete('flashcard/:id', 'FlashcardController.delete').middleware(['auth'])

  Route.get('my/flashcards/tags', 'FlashcardController.myListTags').middleware(['auth'])
  Route.get('my/flashcards/tag/:tagName/:page?', 'FlashcardController.myListFlashcardsByTag').middleware(['auth'])
  Route.get('my/flashcards/:page?', 'FlashcardController.myList').middleware(['auth'])

  Route.get('flashcards/tags', 'FlashcardController.listTags')
  Route.get('flashcards/tag/:tagName/:page?', 'FlashcardController.listFlashcardsByTag')
  Route.get('flashcards/:page?', 'FlashcardController.list')

}).prefix('api')
