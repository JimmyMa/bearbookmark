<template>

  <section class="container">
    <div class="columns">
      <div class="column is-3" id="sidebar">
        <a class="button is-primary is-block is-alt is-large" href="#" v-on:click="addBookmark">添加书签</a>
        <aside class="menu">
          <nuxt-link class="navbar-item" :to="allTagsLink()">Tags  (全部)</nuxt-link>
          <Tags :tags="tags"></Tags>
        </aside>
      </div>
      <div class="column is-9">
        <div class="box content"  id="bookmarks">
          <Bookmark v-for="bookmark in bookmarks" :key="bookmark.id" :bookmark="bookmark"/>
          <div class="has-text-centered" id="loader">
            {{loadingMessage}}
          </div>  
        </div>      
      </div>
    </div>

    <NewBookmark :status="newBookmarkStatus" :success="refresh"/>
  </section>

</template>

<script>
import Tags from '~/components/Tags';
import Bookmark from '~/components/Bookmark';
import NewBookmark from '~/components/NewBookmark';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    Tags,
    Bookmark,
    NewBookmark
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser', 'my']),
  },

  data() {
    return {
      newBookmarkStatus: {isActive: false},
      selectedTag: null,
      loadingMessage: "",
      pagination: {
        lastPage: 0,
        page: 1,
        perPage: 0,
        total: 0
      }
    }
  },

  async asyncData ({route, store, app, params }) {

    let my = route.path.startsWith('/my/') ? 'my/' : ''
    let currentActiveMenu = route.path.startsWith('/my/') ? 'my' : 'public'
    store.commit('setMy', my)
    store.commit('setCurrentActiveMenu', currentActiveMenu)

    let queryUrl = 'bookmarks'
    let {tagName, pageIndex} = params
    console.log(tagName)
    if (tagName) {
      queryUrl = 'bookmarks/tag/' + tagName
    }

    let url = queryUrl

    if (pageIndex) {
      url = queryUrl + "?page=" + pageIndex
    }

    let [tagsRes, bookmarksRes] = await Promise.all([
      app.$axios.get(my + 'tags'),
      app.$axios.get(my + url),
    ])
    return {
       tags: tagsRes.data.data,
       bookmarks: bookmarksRes.data.data.data,
       queryUrl: queryUrl,
       pagination: {
        lastPage: bookmarksRes.data.data.lastPage,
        page: parseInt(bookmarksRes.data.data.page),
        perPage: bookmarksRes.data.data.perPage,
        total: bookmarksRes.data.data.total
       }
    }
  },

  mounted() {
    const scene = this.$scrollmagic.scene({
            offset: 100    // start this scene after scrolling for 50px
        }).setPin('#sidebar')
        
    this.$scrollmagic.addScene(scene)

    var _this = this
    const loader = this.$scrollmagic.scene({triggerElement: '#loader', triggerHook: 'onEnter'})
        .on('enter', function(e) {
          console.log(_this.pagination)
          if (_this.pagination.page === _this.pagination.lastPage) {
            _this.loadingMessage = "没有更多了。"
          } else {
            _this.loadingMessage = "加载中 ..."
            _this.loadingMore()
          }
        })
        
    this.$scrollmagic.addScene(loader)
  },

  methods: {
    addBookmark() {
      if (this.isAuthenticated) {
        this.newBookmarkStatus.isActive=true
      } else {
        this.$router.push({path: "/login"})
      }
    },

    allTagsLink() {
      return this.my === '' ? '' : '/my/'
    },

    async onTagClicked(tag) {
      this.$router.push({path: "/tag/" + tag + "/1"})
    },

    async refresh() {
      try {
        let [tagsRes, bookmarksRes] = await Promise.all([
          this.$axios.get(this.my + 'tags'),
          this.$axios.get(this.my + this.queryUrl),
        ])
        this.tags = tagsRes.data.data
        this.bookmarks = bookmarksRes.data.data.data

        this.pagination = {
          lastPage: bookmarksRes.data.data.lastPage,
          page: parseInt(bookmarksRes.data.data.page),
          perPage: bookmarksRes.data.data.perPage,
          total: bookmarksRes.data.data.total
        }

      } catch (e) {
        this.error = e.response.data.message;
      }

    },

    async loadingMore() {
      try {
        let bookmarksRes = await this.$axios.get(this.my + this.queryUrl + "/" + (1 + this.pagination.page))
        this.bookmarks = this.bookmarks.concat(bookmarksRes.data.data.data)

        this.pagination = {
          lastPage: bookmarksRes.data.data.lastPage,
          page: parseInt(bookmarksRes.data.data.page),
          perPage: bookmarksRes.data.data.perPage,
          total: bookmarksRes.data.data.total
        }

      } catch (e) {
        this.error = e.response.data.message;
      }
    },
  },
};
</script>

