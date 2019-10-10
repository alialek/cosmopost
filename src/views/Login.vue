<template>
  <v-content style="background-color: white">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
      
        <v-col cols="12" xs="10" md="5">
         <div align=center>
            <img
              src="https://cosmopost.website.yandexcloud.net/files/logo.jpg"
              width="80%"
            /></div>
          <v-tabs background-color="transparent" v-model="tab" color="primary" grow>
            <v-tab v-for="item in action" :key="item">{{item}}</v-tab>

            <v-tab-item background-color="transparent">
              <v-card flat background-color="transparent">
                <v-form @keyup.enter="login" color="transparent">
                  <v-text-field
                    label="Логин"
                    name="login"
                    prepend-icon="mdi-login"
                    v-model="username"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    label="Пароль"
                    name="password"
                    v-model="password"
                    prepend-icon="mdi-lock"
                    type="password"
                  ></v-text-field>
                </v-form>
                <v-btn :loading="regLoading" text @click="login" color="primary">Вход</v-btn>
              </v-card>
            </v-tab-item>
            <v-tab-item color="transparent">
              <v-card flat color="transparent">
                <v-form>
                  <v-text-field
                    label="Имя"
                    name="FI"
                    prepend-icon="mdi-account"
                    v-model="firstname"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    label="Фамилия"
                    name="login"
                    prepend-icon="mdi-account"
                    v-model="lastname"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    label="Email"
                    name="login"
                    prepend-icon="mdi-email"
                    v-model="email"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    label="Имя пользователя"
                    name="username"
                    prepend-icon="mdi-pencil"
                    v-model="username"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    :append-icon="show4 ?  'eye' : 'eye-off'"
                    :type="show4 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Пароль"
                    hint="Минимум 8 символов"
                    v-model="password"
                    prepend-icon="mdi-lock"
                    error
                    @click:append="show4 = !show4"
                  ></v-text-field>
                  <v-text-field
                    :append-icon="show5 ? 'eye' : 'eye-off'"
                    :type="show5 ? 'text' : 'password'"
                    name="input-10-2"
                    label="Пароль"
                    v-model="passwordConfirm"
                    hint="Минимум 8 символов"
                    error
                    prepend-icon="mdi-lock"
                    @click:append="show5 = !show5"
                  ></v-text-field>
                </v-form>
                <v-btn
                  :loading="regLoading"
                  text
                  @click="register"
                  prepend-icon="mdi-lock"
                  color="primary"
                >Регистрация</v-btn>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="2000">
      {{ snackbarText }}
      <v-btn color="white" text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    
  </v-content>
</template>

<script>
export default {
  name: "login",
  data: () => ({
    action: ["ВХОД", "РЕГИСТРАЦИЯ"],
    drawer: null,
    username: null,
    password: null,
    regLoading: false,
    tab: 0,
    firstname: null,
    email: null,
    lastname: null,
    passwordConfirm: null,
    show4: false,
    show5: false,
    snackbar: false,
    snackbarColor: null,
    snackbarText: null
  }),
  methods: {
    login() {
      this.regLoading = true;
      this.$store
        .dispatch("login", {
          username: this.username,
          password: this.password
        })
        .then(() => {
          this.regLoading = true;
        });
    },
    register() {
      this.regLoading = true;
      this.$store
        .dispatch("register", {
          username: this.username,
          password: this.password,
          first_name: this.firstname,
          last_name: this.lastname,
          password_confirm: this.passwordConfirm,
          email: this.email
        })
        .then(res => {
          this.regLoading = false;
          if (res.status == 400) {
            this.snackbar = true;
            this.snackbarColor = "error";
            this.snackbarText = "Что-то пошло не так";
          } else if (res.status == 201) {
            this.snackbar = true;
            this.snackbarColor = "success";
            this.snackbarText = "Успешная регистрация";
            this.tab = 0;
          }
        })
        .catch(error => {
          this.snackbar = true;
            this.snackbarColor = "error";
            this.snackbarText = error;
        });
    },
    isLoggedIn() {
      return localStorage.getItem("user") ? true : false;
    }
  },
  beforeMount() {
    localStorage.getItem("user") ? this.$router.push("/") : "";
  }
};
</script>

<style scoped>
</style>