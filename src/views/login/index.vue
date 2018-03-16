<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-half">
            <h1 class="title is-spaced">Sign Up</h1>
            <h2 class="subtitle is-4">Step 1</h2>
            <b-message>
              <b>Welcome to GTA Online Jobs site.</b><br>
              Процесс регистрации может быть пройден игроками, имеющими действующую учётную запись Rockstar Games Social Club, использующуюся для игры в GTA Online.<br>
              Для завершения регистрации вам будет предложено опубликовать <b>GTA Online Job</b> с определённым названием <b>в течение 60 минут</b> после начала процесса регистрации, поэтому убедитесь, что:
              <ul>
                <li>Вы введёте имя пользователя, совпадающее с ВАШИМ именем пользователя на сайте Rockstar Games Social Club;</li>
                <li>Вы будете иметь возможность ЗАЙТИ и ОПУБЛИКОВАТЬ дело в GTA Online в течение следующих 60 минут.</li>
              </ul>
            </b-message>
            <b-message type="is-warning">
              <b>Обратите внимание:</b> на данный момент регистрация доступна далеко не всем пользователям: просим извинения за доставленные неудобства.<br>
              <b>Однако</b>, если она будет доступна - мы ВОЗМОЖНО отправим вам письмо по указанному e-mail.
            </b-message>
            <form method="post" @submit.prevent="signup">
              <b-field label="YOUR VALID Rockstar Games Social Club Username">
                <b-input
                  size="is-large"
                  v-model="username"
                  required>
                </b-input>
              </b-field>

              <b-field label="E-mail (can be empty)">
                <b-input
                  size="is-large"
                  v-model="email">
                </b-input>
              </b-field>

              <template v-if="step2">
                <h2 class="subtitle is-4">Step 2</h2>
                <b-field label="Password" v-if="step2">
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
  fetchData({ store }) {
    return store.dispatch('user/getUserInfo');
  },

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

        if (response.status === 200) {
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

