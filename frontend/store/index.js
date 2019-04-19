export const state = () => ({
  currentActiveMenu: '',
  tagRootPath: '',
  bookmarksRootPath: '',
  flashcardsRootPath: '',
  path: '',

  flashcardShowBack: true,
})

export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },

  loggedInUser(state) {
    return state.auth.user
  },

  currentActiveMenu(state) {
    return state.currentActiveMenu
  },

  tagRootPath(state) {
    return state.tagRootPath
  },

  bookmarksRootPath(state) {
    return state.bookmarksRootPath
  },

  flashcardsRootPath(state) {
    return state.flashcardsRootPath
  },

  path(state) {
    return state.path
  },

  flashcardShowBack(state) {
    return state.flashcardShowBack
  }
}

export const mutations = {

  toggleFlashcardShowBack(state) {
    state.flashcardShowBack = !state.flashcardShowBack
  },

  setPath (state, path) {
    if (path.startsWith("/my/")) {
      state.tagRootPath = "/my"
    } else {
      state.tagRootPath = ""
    }
    console.log("Paht:" + path)
    if (path.startsWith("/my/bookmarks")) {
      state.currentActiveMenu = "mybookmarks"
      state.bookmarksRootPath = "/my/bookmarks"
    }
    if (path.startsWith("/my/flashcards")) {
      state.currentActiveMenu = "myflashcards"
      state.flashcardsRootPath = "/my/flashcards"
    }
    if (path === "/" || path.startsWith("/bookmarks")) {
      state.currentActiveMenu = "bookmarks"
      state.bookmarksRootPath = "/bookmarks"
    }
    if (path.startsWith("/flashcards")) {
      state.currentActiveMenu = "flashcards"
      state.flashcardsRootPath = "/flashcards"
    }

    state.path = path
  }
}
