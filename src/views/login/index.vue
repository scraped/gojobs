<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">Log In or Sign Up</h1>

        <div class="columns is-centered">
          <div class="column is-half">
            <form method="post" @submit.prevent="login">
              <b-field label="Rockstar Games Social Club Username">
                <b-input
                  size="is-large"
                  v-model="username"
                  required>
                </b-input>
              </b-field>

              <b-field label="Password">
                <b-input
                  type="password"
                  size="is-large"
                  v-model="password"
                  required>
                </b-input>
              </b-field>

              <template v-if="signUp">
                <b-message>
                  Добро пожаловать на сайт GTA Online Jobs.
                  Ещё раз обращаем ваше внимание на то, что вы должны
                  были ввести никнейм, полностью совпадающий с вашим
                  никнеймом на сайте RGSC: после регистрации вам придётся
                  подтвердить свою личность, иначе доступ к сайту
                  будет ограничен.<br>
                  Также вы можете ввести свой e-mail (для восстановления
                  пароля), хотя это необязательно.
                </b-message>

                <b-field label="E-mail (can be empty)">
                  <b-input
                    size="is-large"
                    v-model="email">
                  </b-input>
                </b-field>

                <b-field>
                  <b-checkbox v-model="agree">
                    I understand that <b>{{ username }}</b> also need
                    to be my RGSC nickname.
                  </b-checkbox>
                </b-field>
              </template>

              <button
                class="button is-primary"
                :disabled="signUp && !agree">
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
      agree: false,
      signUp: false
    }
  },

  methods: {
    async login() {
      const { username, password, email, agree } = this,
        URL_LOGIN = '/auth/login';

      const response = await axios.post(
        URL_LOGIN,
        { username, password }
      );

      // User's signing up
      if (response.data.signup) {
        this.signUp = true;
      } else {
        // User's logging in

      }
    }
  }
};
</script>

