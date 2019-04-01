<template>
  <div class="modal" v-bind:class="{'is-active':status.isActive}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">添加书签</p>
        <button class="delete" aria-label="close" v-on:click="status.isActive=false"></button>
      </header>
      <section class="modal-card-body">

        <Notification :message="error" v-if="error"/>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">网址</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input v-model="url" class="input" type="text" placeholder="请输入网址">
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">标签</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input v-model="tag" v-on:keyup.enter="addTag" class="input" type="text" placeholder="输入标签后请按回车">
                
                <div class="tags" style="padding-top: 10px">
                  <span v-for="tag in tags" :key="tag.id" class="tag is-primary">
                    {{tag}}
                    <button class="delete is-small" v-on:click="deleteTag(tag)"></button>
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">公开书签</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input v-model="isPublic" type="checkbox">
              </div>
            </div>
          </div>
        </div>

      </section>
      <footer class="modal-card-foot">
        <button class="button is-success"  v-bind:class="{'is-loading':saving}" v-on:click="addBookmark">保存</button>
        <button class="button" v-on:click="status.isActive=false">取消</button>
      </footer>
    </div>
  </div>
</template>

<script>
import Notification from '~/components/Notification';
export default {
  name: 'NewBookmark',
  components: {
    Notification,
  },
  props: {
    status: {
      type: Object,
      default: function () {
        return { isActive: false }
      }
    },
    success: {
      type: Function
    }
  },

  data() {
    return {
      error: null,
      tag: "",
      url: "",
      isPublic: true,
      tags: [],
      saving: false
    }
  },

  methods: {
    async addBookmark() {
      if (this.url.length == 0) {
        this.error = '请输入网址！'
        return
      }
      if (this.tags.length == 0) {
        this.error = '请输入标签！'
        return
      }
      this.saving = true
      await this.$axios.post( 'bookmark/create', {
        url: this.url,
        tags: this.tags,
        public: this.isPublic
      })
      this.url = ""
      this.tags = []
      this.saving = false
      this.status.isActive = false
      this.success()
    },

    addTag() {
      if (this.tag.length == 0) {
        return;
      }
      let _this = this

      let existedTag = this.tags.filter(function(value, index, arr){
        return value === _this.tag;
      });

      if (existedTag.length == 0) {
        this.tags.push(this.tag)
      }

      this.tag = ""
    },

    deleteTag(tag) {
      this.tags = this.tags.filter(function(value, index, arr){
            return value !== tag;
        });
    }
  }
};
</script>
