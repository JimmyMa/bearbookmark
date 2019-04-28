<template>

  <section class="container">
    <div class="columns">
      <div class="column is-3 sidebar" id="sidebar">
        <a class="button is-primary is-block is-alt is-large" href="#" v-on:click="addFlashcard">添加卡片</a>
        <aside class="menu">
          <div class="buttons">
            <span class="button is-small" :class="{ 'is-info': flashcardShowBack }" @click="toggleFlashcardShowBack">显示背面</span>
          </div>
          <nuxt-link :to="flashcardsRootPath">Tags  (全部)</nuxt-link>
          <Tags :tags="tags" :linkRootPath="flashcardsRootPath"></Tags>
        </aside>
      </div>
      <div class="column is-9">

        <div class="columns is-multiline is-marginless">
          <div class="column is-one-third" v-for="flashcard in flashcards" :key="flashcard.id">
            <Flashcard :flashcard="flashcard" :showBack="flashcardShowBack" :refresh="refresh" :deleteFlashcard='showDeleteDialog' :updateFlashcard="updateFlashcard"/>
          </div>
        </div>

        <div class="has-text-centered" id="loader">
          {{loadingMessage}}
        </div>  
    
      </div>
    </div>

    <NewFlashcard :status="newFlashcardStatus" :success="refresh" :flashcard="flashcard"/>
    <Dialog :status="deleteDialogStatus" :title="'确认'" :message="'确定删除吗？'" :confirmFunc="doDeleteFlashcard"/>

  </section>

</template>

<script>
import Tags from '~/components/Tags';
import Flashcard from '~/components/Flashcard';
import NewFlashcard from '~/components/NewFlashcard';
import Dialog from '~/components/Dialog';
// import { isMobileDevice } from '~/utils/CommonUtils';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    Tags,
    Flashcard,
    NewFlashcard,
    Dialog
  },

  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser', 'flashcardShowBack', 'flashcardsRootPath', 'tagRootPath']),
  },

  data() {
    return {
      newFlashcardStatus: {isActive: false, operation: 'new'},
      flashcard: { 
          front: "",
          back: "",
          public: true,
          tags: []
        },
      deleteDialogStatus: {isActive: false},
      deleteFlashcard: null,
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

    let queryUrl = store.state.flashcardsRootPath

    let {tagName} = params

    if (tagName) {
      queryUrl = store.state.flashcardsRootPath + '/tag/' + tagName
    }

    let [tagsRes, flashcardsRes] = await Promise.all([
      app.$axios.get(store.state.tagRootPath + '/tags'),
      app.$axios.get(queryUrl),
    ])
    return {
       tags: tagsRes.data.data,
       flashcards: flashcardsRes.data.data.data,
       queryUrl: queryUrl,
       pagination: {
        lastPage: flashcardsRes.data.data.lastPage,
        page: parseInt(flashcardsRes.data.data.page),
        perPage: flashcardsRes.data.data.perPage,
        total: flashcardsRes.data.data.total
       }
    }
  },

  mounted() {
    if (window.innerWidth > 800) {
      const scene = this.$scrollmagic.scene({
            triggerElement: '#sidebar',
            triggerHook: 'onLeave'
          }).setPin('#sidebar')
          
      this.$scrollmagic.addScene(scene)
    } 

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
    ...mapMutations([
      'toggleFlashcardShowBack',
    ]),
    addFlashcard() {
      if (this.isAuthenticated) {
        this.flashcard = { 
          front: "",
          back: "",
          public: true,
          tags: []
        },
        this.newFlashcardStatus = {
          isActive: true,
          operation: 'new'
        }
      } else {
        this.$router.push({path: "/login"})
      }
    },

    updateFlashcard(flashcard) {
      if (this.isAuthenticated) {
        this.flashcard = {
            id: flashcard.id,
            front: flashcard.front,
            back: flashcard.back,
            public: flashcard.public,
            tags: flashcard.tags.map( (tag) => { return tag.name})
          },
        this.newFlashcardStatus = {
          isActive: true,
          operation: 'update'
        }
      } else {
        this.$router.push({path: "/login"})
      }
    },

    async refresh() {
      try {
        let [tagsRes, flashcardsRes] = await Promise.all([
          this.$axios.get(this.tagRootPath + "/tags"),
          this.$axios.get(this.queryUrl),
        ])
        this.tags = tagsRes.data.data
        this.flashcards = flashcardsRes.data.data.data

        this.pagination = {
          lastPage: flashcardsRes.data.data.lastPage,
          page: parseInt(flashcardsRes.data.data.page),
          perPage: flashcardsRes.data.data.perPage,
          total: flashcardsRes.data.data.total
        }

      } catch (e) {
        this.error = e.response.data.message;
      }

    },

    showDeleteDialog(flashcard) {
      this.deleteFlashcard = flashcard
      this.deleteDialogStatus.isActive = true
    },

    async doDeleteFlashcard() {
      await this.$axios.delete( 'flashcard/' + this.deleteFlashcard.id)
      this.deleteDialogStatus.isActive = false
      this.refresh()
    },

    async loadingMore() {
      try {
        // console.log(JSON.stringify(this.pagination))
        let flashcardsRes = await this.$axios.get(this.$route.path + "/" + (1 + this.pagination.page))
        this.flashcards = this.flashcards.concat(flashcardsRes.data.data.data)

        this.pagination = {
          lastPage: flashcardsRes.data.data.lastPage,
          page: parseInt(flashcardsRes.data.data.page),
          perPage: flashcardsRes.data.data.perPage,
          total: flashcardsRes.data.data.total
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

