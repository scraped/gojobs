<template>
<div class="modal-card">
  <form @submit.prevent="logIn">
    <header class="modal-card-head">
      <p class="modal-card-title">
        <span>Login</span>
        <span class="is-pulled-right">
          <b-icon icon="close" size="is-small"></b-icon>
        </span>
      </p>
    </header>
    <section class="modal-card-body">
      <b-field>
        <b-input
          v-model="username"
          size="is-large"
          icon-pack="fa"
          icon="user"
          placeholder="Username"
          required
        >
        </b-input>
      </b-field>

      <b-field>
        <b-input
          v-model="password"
          size="is-large"
          icon-pack="fa"
          icon="unlock"
          type="password"
          placeholder="Password"
          required
        >
        </b-input>
      </b-field>

      <div>
        <a class="button is-light is-fullwidth" @click="$parent.close">Forgot a password?</a>
      </div>
    </section>

    <footer class="modal-card-foot">
      <div class="buttons">
        <button class="button is-primary">Send</button>
        <router-link
          :to="{name: 'auth'}"
          class="button is-primary is-outlined is-pulled-right"
          @click.native="$parent.close"
        >Sign up (a separate page)</router-link>
      </div>
    </footer>
  </form>
</div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },

  methods: {
    async logIn() {
      try {
        await this.$http.post('/api/auth/login', {
          username,
          password
        });
      } catch (error) {
      }
    }
  }
};
</script>
