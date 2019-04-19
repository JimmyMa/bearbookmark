<template>

  <section class="container">
    <div class="columns">
      <div class="column is-3 sidebar" id="sidebar">
        <a class="button is-primary is-block is-alt is-large" href="#" v-on:click="addBookmark">添加书签</a>
        <aside class="menu">
          <nuxt-link :to="bookmarksRootPath">Tags  (全部)</nuxt-link>
          <Tags :tags="tags" :linkRootPath="bookmarksRootPath"></Tags>
        </aside>
      </div>
      <div class="column is-9">
        <div class="box content"  id="bookmarks">
          <Bookmark v-for="bookmark in bookmarks" :key="bookmark.id" :bookmark="bookmark" :refresh="refresh" :deleteBookmark='showDeleteDialog' :updateBookmark="updateBookmark"/>
          <div class="has-text-centered" id="loader">
            {{loadingMessage}}
          </div>  
        </div>      
      </div>
    </div>

    <NewBookmark :status="newBookmarkStatus" :success="refresh" :bookmark="bookmark"/>
    <Dialog :status="deleteDialogStatus" :title="'确认'" :message="'确定删除吗？'" :confirmFunc="doDeleteBookmark"/>

  </section>

</template>

<script>
import Tags from '~/components/Tags';
import Bookmark from '~/components/Bookmark';
import NewBookmark from '~/components/NewBookmark';
import Dialog from '~/components/Dialog';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    Tags,
    Bookmark,
    NewBookmark,
    Dialog
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser', 'bookmarksRootPath', 'tagRootPath']),
  },

  data() {
    return {
      newBookmarkStatus: {isActive: false, operation: 'new'},
      bookmark: { 
          url: "",
          public: true,
          tags: []
        },
      deleteDialogStatus: {isActive: false},
      deleteBookmark: null,
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

    store.commit('setPath', route.path)

    let queryUrl = store.state.bookmarksRootPath
    let {tagName} = params

    if (tagName) {
      queryUrl = store.state.bookmarksRootPath + '/tag/' + tagName
    }

    let [tagsRes, bookmarksRes] = await Promise.all([
      app.$axios.get(store.state.tagRootPath + '/tags'),
      app.$axios.get(queryUrl),
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
          triggerElement: '#sidebar',
          triggerHook: 'onLeave'
        }).setPin('#sidebar')
        
    this.$scrollmagic.addScene(scene)

    var _this = this
    const loader = this.$scrollmagic.scene({triggerElement: '#loader', triggerHook: 'onEnter'})
        .on('enter', function(e) {

          if (_this.pagination.page >= _this.pagination.lastPage) {
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
        this.bookmark = { 
          url: "",
          public: true,
          tags: []
        },
        this.newBookmarkStatus = {
          isActive: true,
          operation: 'new'
        }
      } else {
        this.$router.push({path: "/login"})
      }
    },

    updateBookmark(bookmark) {
      if (this.isAuthenticated) {
        this.bookmark = {
            id: bookmark.id,
            url: bookmark.url,
            public: bookmark.public,
            tags: bookmark.tags.map( (tag) => { return tag.name})
          },
        this.newBookmarkStatus = {
          isActive: true,
          operation: 'update'
        }
      } else {
        this.$router.push({path: "/login"})
      }
    },

    async refresh() {
      try {
        let [tagsRes, bookmarksRes] = await Promise.all([
          this.$axios.get(this.tagRootPath + "/tags"),
          this.$axios.get(this.queryUrl),
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

    showDeleteDialog(bookmark) {
      this.deleteBookmark = bookmark
      this.deleteDialogStatus.isActive = true
    },

    async doDeleteBookmark() {
      await this.$axios.delete( 'bookmark/' + this.deleteBookmark.id)
      this.deleteDialogStatus.isActive = false
      this.refresh()
    },

    async loadingMore() {
      try {
        let bookmarksRes = await this.$axios.get(this.$route.path + "/" + (1 + this.pagination.page))
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

<style>
.sidebar {
  background-color: #F2F6FA;
}
</style>

