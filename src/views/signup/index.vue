<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-half">
            <template v-if="success">
              <h1 class="title">Success!</h1>
              <b-message type="is-success">
                <b>{{ username }}</b>, welcome to GTA Online Jobs site!<br>
                First of all, <a href="/profile">go to your profile</a> and confirm your identity<template v-if="email"> and email</template>.
              </b-message>
            </template>
            <template v-else>
              <div class="tabs is-large">
                <ul>
                  <li :class="{ 'is-active': signup }"><a>Sign Up</a></li>
                  <li :class="{ 'is-active': !signup }"><a>Log In</a></li>
                </ul>
              </div>
              <h1 class="title">Sign Up</h1>
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
                <b-field label="Your valid Rockstar Games Social Club Username *">
                  <b-input
                    size="is-large"
                    v-model="username"
                    minlength="6"
                    maxlength="16"
                    required>
                  </b-input>
                </b-field>

                <div class="buttons">
                  <a
                    class="button is-primary is-outlined"
                    href="https://socialclub.rockstargames.com/"
                    target="_blank">
                    Go to RGSC site
                  </a>
                </div>

                <b-field label="E-mail (optional, but recommended)">
                  <b-input
                    type="email"
                    size="is-large"
                    v-model="email">
                  </b-input>
                </b-field>

                <b-field label="Password *">
                  <b-input
                    type="password"
                    size="is-large"
                    v-model="password"
                    minlength="6"
                    maxlength="30"
                    required>
                  </b-input>
                </b-field>

                <b-field>
                  <b-checkbox v-if="username" v-model="confirm">
                    I confirm that <b>@{{ username }}</b> is my GTA Online account I can use right now.
                  </b-checkbox>
                </b-field>

                <button
                  class="button is-primary"
                  :disabled="!confirm || !password">
                  Continue
                </button>
              </form>
            </template>
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
      signup: true,
      username: '',
      password: '',
      email: '',
      confirm: false,
      success: false
    }
  },

  methods: {
    async signup() {
      const { username, password, email, confirm } = this;

      try {
        const res = await axios.post(
          '/auth/signup',
          { username, password, email }
        );

        const { jobname } = res.data;
        this.$store.commit('user/setUsername', { username });
        this.$store.commit('user/setJobname', { jobname });
        this.success = true;
      } catch (error) {
        this.$snackbar.open({
          message: error.response.data.message,
          duration: 10000,
          position: 'is-top'
        });
      }
    }
  }
};
</script>
