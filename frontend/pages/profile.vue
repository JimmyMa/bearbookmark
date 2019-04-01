<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">个人信息</h2>
          
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">用户名</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  {{ loggedInUser.username }}
                </div>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">邮箱</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  {{ loggedInUser.email }}
                </div>
              </div>
            </div>
          </div>

          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">密码</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <nuxt-link class="button is-primary" to="/changePassword">修改密码</nuxt-link>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  </section>


</template>

<script>
import { mapGetters } from 'vuex';

export default {
  middleware: 'auth',

  computed: {
    ...mapGetters(['loggedInUser']),
  },
};
</script>
