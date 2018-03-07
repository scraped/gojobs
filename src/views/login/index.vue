<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-half">
            <h1 class="title">Sign Up</h1>
            <b-message>
              <b>Welcome to GTA Online Jobs site.</b><br>
            </b-message>
            <h2 class="subtitle is-4">Step 1</h2>
            <form method="post" @submit.prevent="signup">
              <b-field label="Your Rockstar Games Social Club Username">
                <b-input
                  size="is-large"
                  v-model="username"
                  required>
                </b-input>
              </b-field>

              <template v-if="step2">
                <b-field label="Password" v-if="step2">
                  <b-input
                    type="password"
                    size="is-large"
                    v-model="password"
                    required>
                  </b-input>
                </b-field>

                <b-field label="E-mail (can be empty)">
                  <b-input
                    size="is-large"
                    v-model="email">
                  </b-input>
                </b-field>

                <b-field>
                  <b-checkbox v-model="confirm">
                    I confirm that I have published a job named <b>{{ jobname }}</b>.
                  </b-checkbox>
                </b-field>
              </template>

              <button
                class="button is-primary"
                :disabled="step2 && !confirm">
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      email: '',
      step2: false,
      jobname: '',
      confirm: false
    }
  },

  methods: {
    async signup() {
      const { username, password, email, step2, confirm } = this;

      if (!step2) {
        const response = await axios.post(
          '/auth/signup',
          { username }
        );

        if (response.data.success) {
          this.jobname = response.data.jobname;
          this.step2 = true;
        } else {
          this.$snackbar.open({
            message: response.data.message,
            duration: 10000,
            position: 'is-top'
          });
        }
      } else {
        const response = await axios.post(
          '/auth/completesignup',
          { username, password, email }
        );
      }
    }
  }
};
</script>

