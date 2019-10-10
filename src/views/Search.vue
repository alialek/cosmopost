<template>
  <div>
    <v-progress-linear color="primary" indeterminate v-if="!loaded" height="3"></v-progress-linear>
    <v-row class="mx-2 align-center align-content-center">
      <v-text-field
        label="Поиск"
        @input="getProfiles"
        v-model="search"
        class="mx-4"
        prepend-icon="mdi-magnify"
      ></v-text-field>
    </v-row>
    <v-select
      class="mx-2"
      :items="activity"
      v-model="searchID"
      label="Сфера деятельности"
      @change="filterSearch"
      return-object
    ></v-select>
    <v-layout v-if="loaded" >
      <v-row class="justify-center">
        <div v-for="(item, n) in celebrities" :key="n" class="mt-2 mx-2">
          <router-link :to="'profile/'+item.id">
            <v-col class="justify-center">
              <v-img
                v-ripple
               max-width="140"
                max-height="140"
                :src="item.photo"
                style="border-radius: 360px;"
                class="elevation-5 v-ripple"
                color="primary"
              ></v-img>
              <div class="mt-2" align="center">
                <b style="text-align:center; color: black">{{item.first_name +' '+ item.last_name}}</b>
              </div>
            </v-col>
          </router-link>
        </div>
      </v-row>
    </v-layout>
    <v-btn fab small bottom right fixed @click="newCelebrityDialog = true" color="primary">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog v-model="newCelebrityDialog">
      <v-card>
        <v-card-title color="primary">Добавить новый профиль</v-card-title>
        <v-card-text>
          <span>Общая информация</span>
          <v-col>
            <v-row>
              <v-text-field class="mx-2" label="Имя" v-model="newCelebrity.firstName"></v-text-field>
              <v-text-field label="Фамилия" class="mx-2" v-model="newCelebrity.lastName"></v-text-field>

              <v-select
                class="mx-2"
                :items="activity"
                v-model="newCelebrity.activity"
                label="Сфера деятельности"
                return-object
              ></v-select>
            </v-row>
          </v-col>
          <v-divider></v-divider>
          <br />
          <span>Ссылки на соц.сети</span>
          <v-col>
            <v-row>
              <v-text-field class="mx-2" label="Instagram" v-model="newCelebrity.instagram"></v-text-field>
              <v-text-field label="Вконтакте" class="mx-2" v-model="newCelebrity.vk"></v-text-field>
              <v-text-field label="Facebook" class="mx-2" v-model="newCelebrity.fb"></v-text-field>
            </v-row>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="primary" @click="addCelebrity">ДОБАВИТЬ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="2000">
      {{ snackbarText }}
      <v-btn color="white" text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "search",
  data() {
    return {
      loaded: false,
      newCelebrityDialog: false,
      searchID: null,
      newCelebrity: {
        instagram: "",
        vk: "",
        fb: "",
        firstName: "",
        lastName: "",
        activity: ""
      },
      search: "",
      snackbar: false,
      snackbarColor: null,
      snackbarText: null,
      activity: [
        {
          value: "0",
          text: "Бизнес"
        },
        { value: "1", text: "Музыка" },
        { value: "2", text: "Спорт" },
        { value: "3", text: "Кино" },
        { value: "4", text: "Интернет" },
        { value: "5", text: "Другое" }
      ]
    };
  },
  methods: {
    filterSearch(){
      this.loaded = false;
      this.$store.dispatch("getSearchQuery",this.searchID).then(res => {
      this.loaded = true;
      if (res.status == 401) {
        this.snackbar = true;
        this.snackbarColor = "error";
        this.snackbarText = "Упс, кажется, слетела авторизация";
      }
    });
    },
    getSuggestions() {
      this.$store.dispatch("getSuggestions").then(res => {
        this.loaded = false;
        if (res.status >= 400) {
          this.snackbar = true;
          this.loaded = true;
          this.snackbarColor = "error";
          this.snackbarText = "Упс, кажется, слетела авторизация";
        } else if (res.status == 200) {
          this.loaded = false;
        }
      });
    },
    getProfiles() {
      this.loaded = false;
      this.$store
        .dispatch("searchProfiles", this.search)
        .then(() => (this.loaded = true));
    },
    addCelebrity() {
      this.$store
        .dispatch("addCelebrity", {
          firstName: this.newCelebrity.firstName,
          lastName: this.newCelebrity.lastName,
          activity: this.newCelebrity.activity
        })
        .then(res => {
          if (res.status == 200 || 201) {
            this.snackbar = true;
            this.snackbarColor = "success";
            this.snackbarText = "Профиль создан";
            res.json().then(data => {
              this.$store
                .dispatch("addCelebrityAccounts", {
                  data: [
                    {
                      profile_id: data.id,
                      username: this.newCelebrity.vk,
                      network: 0
                    },
                    {
                      profile_id: data.id,
                      username: this.newCelebrity.fb,
                      network: 1
                    },
                    {
                      profile_id: data.id,
                      username: this.newCelebrity.instagram,
                      network: 2
                    }
                  ]
                })
                .then(res => {
                  if (res.status == 200) {
                    this.snackbar = true;
                    this.snackbarColor = "success";
                    this.snackbarText = "Аккаунты добавлены";
                    this.newCelebrityDialog = false;
                    this.newCelebrity = {
                      instagram: "",
                      vk: "",
                      fb: "",
                      firstName: "",
                      lastName: "",
                      activity: ""
                    };
                  }
                });
            });
          } else {
            this.snackbar = true;
            this.snackbarColor = "error";
            this.snackbarText = "Что-то пошло не так";
          }
        });
    }
  },
  computed: {
    ...mapState({
      celebrities: state => state.profiles.celebrities
    })
  },
  beforeCreate() {
    this.$store.dispatch("getCelebrities").then(res => {
      this.loaded = true;
      if (res.status == 401) {
        this.snackbar = true;
        this.snackbarColor = "error";
        this.snackbarText = "Упс, кажется, слетела авторизация";
      }
    });
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}
</style>