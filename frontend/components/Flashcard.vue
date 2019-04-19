<template>
  <div class="card" @mouseover="showMenu = true" @mouseleave="showMenu = false">
    <div class="card-content">
      <div class="content" v-html="renderMarkdown(flashcard.front)">
      </div>
    </div>
    <footer v-if="showBack || showBackSelf" class="card-content">
      <div class="content" v-html="renderMarkdown(flashcard.back)">
      </div>
    </footer>
    <div class="card-content" style="padding-top: 5px; padding-bottom: 5px">
      <div class="columns is-gapless is-marginless">
        <div class="column">
          <Tags :tags="flashcard.tags" :linkRootPath="flashcardsRootPath"/>
        </div>
        <div class="column is-one-third">
          <a v-if="this.currentActiveMenu === 'myflashcards' && showMenu" class="icon is-pulled-right" style="margin-left: 3px;" @click="deleteFlashcard(flashcard)"><img src="/images/delete.png"/></a>
          <a v-if="this.currentActiveMenu === 'myflashcards' && showMenu" class="icon is-pulled-right" style="margin-left: 3px;" @click="updateFlashcard(flashcard)"><img src="/images/edit.png"/></a>
          <a v-if="!showBack && showMenu" class="icon is-pulled-right" @click="showBackSelf = !showBackSelf"><img src="/images/show.png"/></a>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import Tags from '~/components/Tags';
import marked from 'marked'
import { mapGetters } from 'vuex';

export default {
  name: 'Flashcard',
  props: ['flashcard', 'updateFlashcard', 'deleteFlashcard', 'refresh', 'showBack'],
  computed: {
    ...mapGetters(['flashcardsRootPath', 'currentActiveMenu']),
  },
  data() {
    return {
      showMenu: false,
      showBackSelf: false
    }
  },
  components: {
    Tags
  },

  methods: {
    renderMarkdown(md) {
      return marked(md)
    },
  }
};
</script>

<style>

</style>