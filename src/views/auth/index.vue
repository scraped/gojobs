<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-half">
            <h1 class="title">
              Welcome to GTA Online Jobs site
            </h1>
            <div
              v-if="signup"
              class="box"
            >
              <b-message
                type="is-warning"
                has-icon
              >
                <div class="notification__header">Registration is limited</div>
                Note that the registration is not open for everybody as of now and most likely you won't be able to sign up (unless you don't have an invite). Nevertheless your chances are higher if you have previously published some relatively popular jobs.
              </b-message>
              <b-message
                type="is-danger"
                has-icon
              >
                <div class="notification__header">You'll have to access to GTA Online in the next hour</div>
                <p>Please make sure you'll be able to run GTA Online in the next hour.</p>
              </b-message>

              <hr>
              <form
                method="post"
                @submit.prevent="auth"
              >
                <div class="field">
                  <label
                    class="label"
                    for="username"
                  >Your RGSC Username *</label>
                  <div class="control">
                    <input
                      id="username"
                      v-model="username"
                      class="input"
                      size="is-large"
                      name="username"
                      minlength="6"
                      maxlength="16"
                      autocomplete="off"
                      placeholder="andreww2012"
                      required
                    >
                  </div>
                </div>

                <div class="field">
                  <label
                    class="label"
                    for="email"
                  >E-mail (just recommended)</label>
                  <div class="control">
                    <input
                      id="email"
                      v-model="email"
                      class="input"
                      type="email"
                      name="email"
                      placeholder="test@gmail.com"
                      required
                    >
                  </div>
                </div>

                <div class="field">
                  <label
                    class="label"
                    for="password"
                  >Password *</label>
                  <div class="control">
                    <input
                      id="password"
                      v-model="password"
                      class="input"
                      type="password"
                      name="password"
                      minlength="6"
                      maxlength="40"
                      required
                    >
                  </div>
                </div>

                <div class="field is-grouped">
                  <p class="control is-expanded">
                    <button
                      class="button is-primary is-medium is-rounded button_shadow button_responsible"
                    >
                      Sign up
                    </button>
                  </p>

                  <p class="control">
                    <a
                      v-if="signup && username"
                      :href="`https://socialclub.rockstargames.com/member/${username}`"
                      class="button is-medium is-rounded"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Go to your RGSC profile
                    </a>
                  </p>


                  <a
                    v-if="!signup && !recovery"
                    class="button"
                    @click="recovery = true"
                  >
                    Forgot your password?
                  </a>

                  <a
                    v-if="!signup && recovery"
                    class="button"
                    @click="recovery = false"
                  >
                    Log In
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  watch: {
    username() {
      this.confirm = false;
    }
  },

  data() {
    return {
      signup: true,
      recovery: false,
      username: '',
      password: '',
      repPassword: '',
      email: '',
      invCode: '',
      confirm: false
    }
  },

  methods: {
    async auth() {
      const { username, password, email, signup, recovery } = this;

      let url;

      if (signup) {
        url = '/api/auth/signup';
      } else if (recovery) {
        url = '/api/auth/recovery';
      } else {
        url = '/api/auth/login';
      }

      try {
        const res = await this.$http.post(
          url,
          { username, password, email }
        );

        const { jobname, date } = res.data;

        if (!recovery) {
          this.$store.commit('user/setUsername', { username });
          this.$store.commit('user/setJobname', { jobname });
          this.$store.commit('user/setDate', { date });
          if (email) {
            this.$store.commit('user/setEmail', { email });
          }
          this.$router.push({ name: 'profile', params: { username } });
        }
      } catch (e) {}
    }
  }
};
</script>
