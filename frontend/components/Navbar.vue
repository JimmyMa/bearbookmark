<template>
  <nav class="navbar has-shadow">
    <div class="container">
      <div class="navbar-brand">
        <nuxt-link class="navbar-item" to="/">
          <img src="/images/logo.png" width="38" height="38"> 小熊书签
        </nuxt-link>

        <button class="button navbar-burger" @click="showNav = !showNav" :class="{ 'is-active': showNav }">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': showNav }">
        <div class="navbar-start">
          <nuxt-link class="navbar-item" :class="{ 'menu-item-active': currentActiveMenu === 'bookmarks' }" to="/">书签</nuxt-link>
          <nuxt-link class="navbar-item" :class="{ 'menu-item-active': currentActiveMenu === 'flashcards' }" to="/flashcards">卡片</nuxt-link>
          <nuxt-link v-if="isAuthenticated" class="navbar-item" :class="{ 'menu-item-active': currentActiveMenu === 'mybookmarks' }" to="/my/bookmarks">我的书签</nuxt-link>
          <nuxt-link v-if="isAuthenticated" class="navbar-item" :class="{ 'menu-item-active': currentActiveMenu === 'myflashcards' }" to="/my/flashcards">我的卡片</nuxt-link>
        </div>
        <div class="navbar-end">
          <div class="navbar-item has-dropdown is-hoverable" v-if="isAuthenticated">
            <a class="navbar-link">
              {{ loggedInUser.username }}
            </a>
            <div class="navbar-dropdown">
              <nuxt-link class="navbar-item" to="/profile">个人中心</nuxt-link>
              <hr class="navbar-divider">
              <a class="navbar-item" @click="logout">退出</a>
            </div>
          </div>
          <template v-else>
            <nuxt-link class="navbar-item" to="/register">注册</nuxt-link>
            <nuxt-link class="navbar-item" to="/login">登录</nuxt-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser', 'currentActiveMenu']),
  },

  data() {
    return {
      showNav: false
    };
  },

  methods: {
    async logout() {
      await this.$auth.logout();
    },
  },
};
</script>


<style>

.menu-item-active, .menu-item-active:hover, .menu-item-active:active  {
    background-color: royalblue!important;
    color: white!important;
}

</style>