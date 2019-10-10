<template>
  <v-app>
    <v-navigation-drawer temporary clipped width="250px" fixed v-model="drawer">
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <img src="https://cosmopost.website.yandexcloud.net/files/logo.jpg" width="100%" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-col>
        <v-list dense nav>
          <v-list-item v-for="item in items" :key="item.title" link :to="item.link">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-divider />
      <v-col class="mt-auto">
        <v-list dense>
          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Выход</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-navigation-drawer>
    <v-app-bar v-if="authorized" flat app clipped-left dense color="white">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{pageName}}</v-toolbar-title>
    </v-app-bar>
    <router-view style="margin-top:48px; overflow-x: hidden" />
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    drawer: false,
    dark: true,
    items: [
      { title: "Лента", icon: "mdi-newspaper", link: "/" },
      { title: "Сохраненные", icon: "mdi-star", link: "/saved" },
      { title: "Каталог", icon: "mdi-book", link: "/search" },
      {
        title: "Рекомендации",
        icon: "mdi-account-question",
        link: "/recommendations"
      }
    ]
  }),
  computed: {
    isLoggedIn() {
      return localStorage.getItem("user") ? true : false;
    },
    authorized() {
      return this.$route.path !== "/login" ? true : false;
    },
    pageName() {
      return this.$route.name;
    }
  },
  methods: {
    logout() {
      this.$store.commit("logout");
    }
  }
};
</script>
