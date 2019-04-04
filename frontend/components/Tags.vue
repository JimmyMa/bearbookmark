<template>
  <div class="tags">
    <nuxt-link  v-for="tag in tags" :key="tag.id" class="tag is-primary" :to="tagLink(tag.name)">{{tag.name}}</nuxt-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Tags',
  props: ['tags', 'onTagClicked'],
  computed: {
    ...mapGetters(['my']),
  },
  methods: {
    tagLink(tagName) {
      return this.my === '' ? "/tag/" + tagName : "/" + this.my + "tag/" + tagName
    }
  }
};
</script>
