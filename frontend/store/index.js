export const state = () => ({
  currentActiveMenu: '',
  my: ''
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

  my(state) {
    return state.my
  }
}

export const mutations = {
  setCurrentActiveMenu(state, currentActiveMenu) {
    state.currentActiveMenu = currentActiveMenu
  },
  setMy (state, my) {
    state.my = my
  }
}
