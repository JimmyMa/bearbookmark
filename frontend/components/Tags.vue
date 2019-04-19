<template>
  <div class="tags">
    <nuxt-link  v-for="tag in tags" :key="tag.id" class="tag is-primary" :to="tagLink(tag.name)">{{tag.name}}</nuxt-link>
  </div>
</template>

<script>

export default {
  name: 'Tags',
  props: ['tags', 'linkRootPath'],
  methods: {
    tagLink(tagName) {
      return this.linkRootPath + "/tag/" + tagName
    }
  }
};
</script>
