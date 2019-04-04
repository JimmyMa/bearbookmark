<template>

  <article class="media" @mouseover="showEdit = true" @mouseleave="showEdit = false">
    <!-- <div class="media-left image is-128x128">
      <img src="https://via.placeholder.com/250">
    </div> -->
    <div class="media-content">
      <div class="content">
          <a :href="bookmark.url" target="_blank" class="bookmark-title">
            <strong style="font-size:18px">{{bookmark.title}}</strong>
            <br>
            {{bookmark.excerpt}}
          </a>
          <div v-if="this.my === ''">
            @{{bookmark.user.username}}
            {{bookmark.created_at}}
          </div>
          <Tags :tags="bookmark.tags"/>

      </div>
      <!-- <nav class="level is-mobile">
        <div class="level-left">
          <a class="level-item">
            <span class="icon is-small"><i class="fas fa-reply"></i></span>
          </a>
          <a class="level-item">
            <span class="icon is-small"><i class="fas fa-retweet"></i></span>
          </a>
          <a class="level-item">
            <span class="icon is-small"><i class="fas fa-heart"></i></span>
          </a>
        </div>
      </nav> -->
    </div>
    <div class="media-right">
      <div v-if="this.my !== '' && showEdit">
        <span class="icon" @click="deleteBookmark(bookmark)"> <i class="fa fa-trash"></i> </span>
        <br>
        <span class="icon" @click="updateBookmark(bookmark)"> <i class="fa fa-edit"></i> </span>
        <!-- <button class="delete" @click="deleteBookmark(bookmark)"></button>
        <br>
        <button class="edit" @click="updateBookmark(bookmark)"></button> -->
      </div>
    </div>
  </article>


</template>

<script>
import Tags from '~/components/Tags';
import { mapGetters } from 'vuex';

export default {
  name: 'Bookmark',
  props: ['bookmark', 'updateBookmark', 'deleteBookmark', 'refresh'],
  computed: {
    ...mapGetters(['my']),
  },
  data() {
    return {
      showEdit: false
    }
  },
  components: {
    Tags
  },

  methods: {

  }
};
</script>

<style>

.bookmark-title {
  color: black;
}

.bookmark-title:hover {
  color: red;
}

</style>