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
                  <li
                    :class="{ 'is-active': signup }"
                    @click="signup = true; recovery = false">
                    <a>Sign Up</a>
                  </li>
                  <li
                    :class="{ 'is-active': !signup }"
                    @click="signup = false">
                    <a>Log In</a>
                  </li>
                </ul>
              </div>
              <template v-if="signup">
                <div class="box">
                  <div class="content">
                  <h3>Welcome to GTA Online Jobs site.</h3>
                  <p>Процесс регистрации может быть пройден игроками, имеющими действующую учётную запись Rockstar Games Social Club, использующуюся для игры в GTA Online.</p>
                  <p>Для завершения регистрации вам будет предложено  опубликовать дело GTA Online с определённым названием в течение 60 минут после начала процесса регистрации, поэтому убедитесь, что:</p>
                  <ul>
                    <li>Вы введёте имя пользователя, совпадающее с вашим именем пользователя на сайте Rockstar Games Social Club;</li>
                    <li>Вы будете иметь возможность <b>зайти и опубликовать дело в GTA Online в течение следующих 60 минут.</b></li>
                  </ul>
                  </div>
                <b-message type="is-warning">
                  Note that the registration is not open for everybody as of now and most likely you won't be able to sign up (unless you don't have an invite).<br>
                  But your chances are higher if you have previously published some relatively popular jobs.
                </b-message>
                </div>
              </template>

              <div class="box">
                <form method="post" @submit.prevent="auth">
                  <b-field
                    v-if="!recovery"
                    :label="signup ? 'Your valid Rockstar Games Social Club Username *' : 'Username *'">
                    <b-input
                      size="is-large"
                      v-model="username"
                      name="username"
                      minlength="6"
                      maxlength="16"
                      key="username"
                      autocomplete="off"
                      required>
                    </b-input>
                  </b-field>

                  <b-field
                    v-if="signup || recovery"
                    :label="signup ? 'E-mail (optional, but recommended)' : 'E-mail *'">
                    <b-input
                      type="email"
                      size="is-large"
                      v-model="email"
                      key="email"
                      :required="recovery">
                    </b-input>
                  </b-field>

                  <b-field
                    v-if="!recovery"
                    label="Password *">
                    <b-input
                      type="password"
                      size="is-large"
                      v-model="password"
                      minlength="6"
                      maxlength="30"
                      key="password"
                      required>
                    </b-input>
                  </b-field>

                  <b-field
                    v-if="signup"
                    label="An invitation code (if you have it)">
                    <b-input
                      size="is-large"
                      v-model="invCode"
                      minlength="16"
                      maxlength="16"
                      placeholder="Currenlty unavailable"
                      disabled>
                    </b-input>
                  </b-field>

                  <b-field v-if="signup">
                    <b-checkbox v-if="username" v-model="confirm">
                      I confirm that <b>@{{ username }}</b> is my GTA Online account I can use right now.
                    </b-checkbox>
                  </b-field>

                  <div class="buttons">
                    <button
                      class="button is-primary"
                      :disabled="signup && !confirm">
                      Continue
                    </button>

                    <a
                      class="button"
                      v-if="signup && username"
                      :href="`https://socialclub.rockstargames.com/member/${username}`"
                      target="_blank">
                      Go to your RGSC profile
                    </a>

                    <a
                      class="button"
                      v-if="!signup && !recovery"
                      @click="recovery = true">
                      Forget your password?
                    </a>

                    <a
                      class="button"
                      v-if="!signup && recovery"
                      @click="recovery = false">
                      Log In
                    </a>
                  </div>
                </form>
              </div>
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
      recovery: false,
      username: '',
      password: '',
      email: '',
      invCode: '',
      confirm: false,
      success: false
    }
  },

  methods: {
    async auth() {
      const { username, password, email, signup, recovery } = this;

      let url;

      if (signup) {
        url = '/auth/signup';
      } else if (recovery) {
        url = '/auth/recovery';
      } else {
        url = '/auth/login';
      }

      try {
        const res = await this.$axios.post(url, { username, password, email });

        const { jobname, date } = res.data;
        this.$store.commit('user/setUsername', { username });
        this.$store.commit('user/setJobname', { jobname });
        this.$store.commit('user/setDate', { date });
        if (email) this.$store.commit('user/setEmail', { email });
        this.$snackbar.open({
          message: 'Success! Now you need to verify your account.',
          duration: 20000,
          position: 'is-top'
        });
        this.$router.push({ name: 'profile', params: { username } });
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
