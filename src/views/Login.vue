<template>
  <v-content style="background-color: white">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" xs="10" md="5">
          <div align="center">
            <img src="https://cosmopost.website.yandexcloud.net/files/logo.jpg" width="80%" />
          </div>
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
                    name="input-10-1"
                    :rules="[rules.length]"
                    label="Пароль"
                    type="password"
                    hint="Минимум 8 символов"
                    v-model="password"
                    prepend-icon="mdi-lock"
                  ></v-text-field>
                  <v-text-field
                    name="input-10-2"
                    label="Пароль"
                    type="password"
                    :rules="[rules.length]"
                    v-model="passwordConfirm"
                    hint="Минимум 8 символов"
                    prepend-icon="mdi-lock"
                  ></v-text-field>
                </v-form>
                <v-btn
                  :loading="regLoading"
                  text
                  @click="register"
                  prepend-icon="mdi-lock"
                  color="primary"
                >Регистрация</v-btn>
                <video
                  playsinline
                  preload="metadata"
                  type="video/mp4"
                  src="blob:https://www.instagram.com/bc015067-5940-47d3-b565-7938f8d61ba4"
                ></video>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar multi-line v-model="snackbar" vertical :color="snackbarColor" :timeout="8000">
      <p>{{ snackbarText }}</p>
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
    snackbar: false,
    snackbarColor: null,
    snackbarText: [],
    rules: {
      length: value => value.length >= 8 || "Минимум 8 символов"
    }
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
          console.log(res);
          this.regLoading = false;
          if (res.res.status == 400) {
            this.snackbar = true;
            this.snackbarColor = "error";
            let errors = [];
            Object.keys(res.data).map(key => {
              return errors.push([key + ": " + res.data[key][0]]);
            });
            this.snackbarText = errors.join("   ");
          } else if (res.res.status == 201) {
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