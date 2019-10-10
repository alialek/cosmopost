<template>
  <div>
    <v-progress-linear color="primary" indeterminate v-if="!loaded" height="3"></v-progress-linear>
    <v-row v-if="posts.length == 0 && loaded" fill-height class="justify-center align-center mt-4">
      <p class="ml-4">
        Вы еще ни на кого не подписались. Перейдите в
        <router-link to="/search">каталог</router-link>
      </p>
    </v-row>
    <v-row class="justify-center align-start">
     <post-card :show-name="true" :posts="posts"></post-card>
    </v-row>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="2000">
      {{ snackbarText }}
      <v-btn color="white" text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

  </div>
</template>

<script>
import postCard from '../components/postCard.vue'
import { mapState } from "vuex";
export default {
  name: "feed",
  components: {
    postCard
  },
  data() {
    return {
      dialog: false,
      loaded: false,
      snackbar: false,
      snackbarColor: null,
      snackbarText: null,
    };
  },
  computed: {
    ...mapState({
      posts: state => state.feed.posts
    })
  },
  beforeCreate() {
    this.$store
      .dispatch("getFeed")
      .then(res => {
        this.loaded = true;
        if (res.status == 401) {
          localStorage.removeItem('user')
          window.location.href = 'login';
          this.snackbar = true;
          this.snackbarColor = "error";
          this.snackbarText = "Упс, кажется, слетела авторизация";
        } else if (res.status >= 500) {
          this.snackbar = true;
          this.snackbarColor = "error";
          this.snackbarText = "Ошибка где-то далеко-далеко на сервере";
        }
      })
      .catch(error => {
        this.snackbar = true;
        this.snackbarColor = "error";
        this.snackbarText = error;
      });
  }
};
</script>

<style scoped>
</style>