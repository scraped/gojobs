<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-half">
              <h1 class="title">
                Sign Up
              </h1>
              <div
                v-if="signup"
                class="box"
              >
                <div class="content">
                  <div class="subtitle">Welcome to GTA Online Jobs site</div>

                  <p>You can only register if you have a valid Rockstar Games Social Club account that you're using to play GTA Online.</p>

                  <p>Follow this instruction to complete the registration:</p>

                  <ol>
                    <li>Fill the form down below;</li>
                    <li>Go to GTA Online > Pause > Online > Creator;</li>
                    <li>Create any job, fullfill the requirements, give the specific name (that will be given to you after completing the step <span class="tag is-rounded">1</span>), test and <b>publish</b> it;</li>
                    <li>When you will be ready, follow the further instructions.</li>
                  </ol>
                </div>
                <b-notification
                  type="is-warning"
                  has-icon
                  :closable="false"
                >
                  <div class="notification__header">Registration is limited</div>
                  Note that the registration is not open for everybody as of now and most likely you won't be able to sign up (unless you don't have an invite). Nevertheless your chances are higher if you have previously published some relatively popular jobs.
                </b-notification>
              <form
                method="post"
                @submit.prevent="auth"
              >
                <b-field
                  v-if="!recovery"
                  :label="signup ? 'Your valid Rockstar Games Social Club Username *' : 'Username *'"
                >
                  <b-input
                    size="is-large"
                    v-model="username"
                    name="username"
                    minlength="6"
                    maxlength="16"
                    key="username"
                    autocomplete="off"
                    required
                  ></b-input>
                </b-field>

                <b-field
                  v-if="signup || recovery"
                  :label="signup ? 'E-mail (optional, but recommended)' : 'E-mail *'"
                >
                  <b-input
                    type="email"
                    size="is-large"
                    v-model="email"
                    key="email"
                    :required="recovery"
                  ></b-input>
                </b-field>

                <b-field
                  v-if="!recovery"
                  label="Password *"
                >
                  <b-input
                    type="password"
                    size="is-large"
                    v-model="password"
                    minlength="6"
                    maxlength="30"
                    key="password"
                    required
                  ></b-input>
                </b-field>

                <!-- <b-field
                  v-if="signup"
                  label="Repeat password *">
                  <b-input
                    type="rep-password"
                    size="is-large"
                    v-model="repPassword"
                    minlength="6"
                    maxlength="30"
                    key="rep-password"
                    required>
                  </b-input>
                </b-field> -->

                <b-field
                  v-if="signup"
                  label="An invitation code (if you have it)"
                >
                  <b-input
                    size="is-large"
                    v-model="invCode"
                    minlength="16"
                    maxlength="16"
                    placeholder="Currenlty unavailable"
                    disabled
                  ></b-input>
                </b-field>

                <b-field v-if="signup">
                  <b-checkbox
                    v-if="username"
                    v-model="confirm"
                  >
                    I confirm that <b>@{{ username }}</b> is my GTA Online account I can use right now.
                  </b-checkbox>
                </b-field>

                <div class="buttons">
                  <button
                    class="button is-primary"
                    :disabled="signup && !confirm"
                  >
                    Continue
                  </button>

                  <a
                    v-if="signup && username"
                    class="button"
                    :href="`https://socialclub.rockstargames.com/member/${username}`"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Go to your RGSC profile
                  </a>

                  <a
                    v-if="!signup && !recovery"
                    @click="recovery = true"
                    class="button"
                  >
                    Forgot your password?
                  </a>

                  <a
                    v-if="!signup && recovery"
                    @click="recovery = false"
                    class="button"
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
