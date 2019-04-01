<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">修改密码</h2>

          <Notification :message="error" v-if="error"/>

          <form method="post" @submit.prevent="changePassword">

            <div class="field">
              <label class="label">旧密码</label>

              <div class="control">
                <input
                  type="text"
                  class="input"
                  name="password"
                  v-model="password"
                  required
                >
              </div>
            </div>

            <div class="field">
              <label class="label">新密码</label>

              <div class="control">
                <input
                  type="text"
                  class="input"
                  name="newPassword"
                  v-model="newPassword"
                  required
                >
              </div>
            </div>

            <div class="buttons is-centered">
              <button type="submit" class="button is-primary" @click="changePassword">修改</button>
              <button class="button" @click="$router.back()">取消</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Notification from '~/components/Notification';

export default {
  components: {
    Notification,
  },

  data() {
    return {
      newPassword: '',
      password: '',
      error: null,
    };
  },

  methods: {
    async changePassword() {
      try {
        await this.$axios.put('change_password', {
          newPassword: this.newPassword,
          password: this.password,
        });

        this.$router.push('/profile');
      } catch (e) {
        this.error = e.response.data.message;
      }
    },
  },
};
</script>

