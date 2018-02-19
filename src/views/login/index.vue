<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">Log In or Sign Up</h1>
        <b-message type="is-warning">
          Для регистрации или входа на сайт введите своё имя пользователя, совпадающее с <b>внутриигровым никнеймом</b>.
          <br>
          Если вы ещё не зарегистрированы, введите логин и пароль в этих же полях и следуйте дальнейшим инструкциям.
        </b-message>

        <div class="columns is-centered">
          <div class="column is-half">
            <b-field label="Rockstar Games Social Club Username">
              <b-input size="is-large"></b-input>
            </b-field>
            <b-field label="Password">
              <b-input type="password" size="is-large"></b-input>
            </b-field>
            <button class="button is-primary">Continue</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  methods: {
    test() {

    }
  }
};
</script>

