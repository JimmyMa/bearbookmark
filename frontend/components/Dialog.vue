<template>
  <div class="modal" v-bind:class="{'is-active':status.isActive}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{title}}</p>
        <button class="delete" aria-label="close" @click="doCancelFunc"></button>
      </header>
      <section class="modal-card-body">
        {{message}}
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" @click="confirmFunc(data)">确认</button>
        <button class="button" @click="doCancelFunc">取消</button>
      </footer>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Dialog',
  components: {

  },
  props: ['status', 'title', 'message', 'confirmFunc', 'cancelFunc', 'data'],

  methods: {
    doCancelFunc() {
      this.status.isActive = false
      if (this.cancelFunc !== undefined) {
        this.cancelFunc(this.data)
      }
      
    }
  }
};
</script>
