<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-half">
            <h1 class="title is-spaced">Sign Up</h1>
            <b-message>
              <b>Welcome to GTA Online Jobs site.</b><br>
              Процесс регистрации может быть пройден игроками, имеющими действующую учётную запись Rockstar Games Social Club, использующуюся для игры в GTA Online.<br>
              Для завершения регистрации вам будет предложено опубликовать <b>дело GTA Online</b> с определённым названием <b>в течение 60 минут</b> после начала процесса регистрации, поэтому убедитесь, что:
              <ul>
                <li>Вы введёте имя пользователя, совпадающее с ВАШИМ именем пользователя на сайте Rockstar Games Social Club;</li>
                <li>Вы будете иметь возможность ЗАЙТИ и ОПУБЛИКОВАТЬ дело в GTA Online в течение следующих 60 минут.</li>
              </ul>
            </b-message>
            <b-message type="is-danger">
              <b>Обратите внимание:</b> на данный момент регистрация доступна далеко не всем пользователям. Просим извинения за доставленные неудобства.
            </b-message>

            <form method="post" @submit.prevent="signup">
              <section class="section">
              <h2 class="subtitle is-4">Step 1</h2>
              <b-field label="Your valid Rockstar Games Social Club Username *">
                <b-input
                  size="is-large"
                  v-model="username"
                  required>
                </b-input>
              </b-field>

              <a
                class="button is-primary is-outlined"
                href="https://socialclub.rockstargames.com/"
                target="_blank">Go to RGSC site</a>
              </section>

              <section class="section" v-if="jobname">
                <h2 class="subtitle is-4">Step 2</h2>
                <p>In order to confirm your identity, please publish a job named:</p>
                <div class="title is-4">{{ jobname }}</div>
                <a
                  class="button is-primary is-outlined"
                  href="http://socialclub.rockstargames.com/"
                  target="_blank">How to publish a job in GTA Online</a><br><br>

                <b-field label="E-mail (optional)">
                  <b-input
                    size="is-large"
                    v-model="email">
                  </b-input>
                </b-field>

                <b-field label="Password *">
                  <b-input
                    type="password"
                    size="is-large"
                    v-model="password"
                    required>
                  </b-input>
                </b-field>

                <b-field>
                  <b-checkbox v-model="confirm">
                    I confirm that I have published a job named <b>{{ jobname }}</b>.
                  </b-checkbox>
                </b-field>
              </section>

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
import { mapState } from 'vuex';

export default {
  data() {
    return {
      password: '',
      email: '',
      confirm: false
    }
  },

  computed: {
    username: {
      get() {
        return this.$store.state.auth.username;
      },

      set(value) {
        this.$store.commit('auth/setUsername', { username: value });
      }
    },
    ...mapState('auth', [
      'jobname'
    ])
  },

  methods: {
    async signup() {
      const { username, password, email, confirm } = this;

      if (!step2) {
        const response = await axios.post(
          '/auth/signup',
          { username }
        );

        if (response.status === 200) {
          const { jobname } = response.data;
          this.$store.commit('auth/setJobname', { jobname });
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

