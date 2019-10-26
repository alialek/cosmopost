<template>
  <div>
    <v-progress-linear
      color="primary"
      fixed
      style="top:50;"
      indeterminate
      v-if="!loaded"
      height="3"
    ></v-progress-linear>
    <div v-else>
      <v-row class="ml-2 mt-2 justify-center">
        <v-img
          style="border-radius: 100px;"
          class="elevation-1 mx-2"
          :src="checkPhoto(celebrity.profile.photo)"
          max-width="140"
          max-height="140"
        />
        <v-col>
          <v-row class>
            <v-col>
              <h1>{{celebrity.profile.first_name + ' ' + celebrity.profile.last_name}}</h1>
              <v-btn
                :loading="subLoading"
                @click="changeSub(celebrity.subscribed)"
                outlined
                :color="celebrity.subscribed ? 'grey' : 'primary'"
              >
                <v-icon left>{{celebrity.subscribed ? 'mdi-check': 'mdi-plus'}}</v-icon>
                {{celebrity.subscribed ? 'ВЫ ПОДПИСАНЫ' : 'ПОДПИСАТЬСЯ'}}
              </v-btn>
            </v-col>
          </v-row>
          <v-row class="align-center mt-2">
            <v-tooltip v-for="account in celebrity.accounts" :key="account.account" bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  fab
                  class="mr-1"
                  color="grey"
                  v-on="on"
                >{{account.network == 0 ? 'mdi-vk' : account.network == 1 ? 'mdi-facebook' : account.network == 2 ? 'mdi-instagram' : 'mdi-browser'}}</v-icon>
              </template>
              <span>{{account.username}}</span>
            </v-tooltip>
            <v-icon
              fab
              class="mx-3"
              @click="editAccounts(celebrity.accounts)"
              color="grey"
            >mdi-pencil</v-icon>
          </v-row>
        </v-col>
      </v-row>
      <v-tabs class="justify-center" background-color="transparent" color="primary" grow>
        <v-tab>ПОСТЫ</v-tab>
        <v-tab @click="getGraph">СОЦИАЛЬНЫЙ ГРАФ</v-tab>

        <v-tab-item>
          <post-card :show-name="false" :posts="celebrity.posts"></post-card>
        </v-tab-item>
        <v-tab-item ref="network">
          <v-row class="counter">
            <v-text-field
              v-model="date"
              hide-details
              label="Количество дней"
              type="number"
              style="width: 100px !important"
            ></v-text-field>
            <v-btn outlined text color="primary" @click="getGraph">ОТРИСОВАТЬ</v-btn>
          </v-row>
          <v-row
            min-height="100"
            style="min-height: 100px"
            class="mt-2 justify-center align-center"
          >
            <v-progress-circular class="mt-2" v-if="graphLoading" indeterminate color="primary"></v-progress-circular>
            <d3-network
              v-if="!graphLoading"
              @node-click="accountView"
              :net-nodes="graph.nodes"
              :net-links="graph.links"
              :options="options"
            />
          </v-row>
        </v-tab-item>
      </v-tabs>
    </div>
    <v-snackbar class="mt-2" v-model="snackbar" :color="snackbarColor" :timeout="2000">
      {{ snackbarText }}
      <v-btn color="white" text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-dialog v-model="newAccountsDialog">
      <v-card>
        <v-card-title color="primary">Редактировать аккаунты</v-card-title>
        <v-card-text>
          <span>Общая информация</span>
          <v-col>
            <v-row>
              <v-text-field class="mx-2" label="Имя" v-model="newCelebrity.firstName"></v-text-field>
              <v-text-field label="Фамилия" class="mx-2" v-model="newCelebrity.lastName"></v-text-field>

              <v-select
                class="mx-2"
                :items="items"
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
    <v-dialog v-model="editAccountsDialog">
      <v-card>
        <v-card-title color="primary">Редактировать аккаунты</v-card-title>
        <v-card-text>
          <span>Никнеймы в соц.сетях</span>
          <v-col>
            <v-row>
              <v-text-field class="mx-2" label="Instagram" v-model="editAccountsLinks.instagram"></v-text-field>
              <v-text-field label="Вконтакте" class="mx-2" v-model="editAccountsLinks.vk"></v-text-field>
              <v-text-field label="Facebook" class="mx-2" v-model="editAccountsLinks.fb"></v-text-field>
            </v-row>
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="error" @click="deleteProfile">УДАЛИТЬ ПРОФИЛЬ</v-btn>
          <v-btn text color="primary" @click="updateAccounts">ДОБАВИТЬ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import D3Network from "vue-d3-network";
import postCard from "../components/postCard.vue";
import { checkPhoto } from "../mixins/photoFallback.js";

export default {
  name: "profile",
  mixins: [checkPhoto],
  components: {
    D3Network,
    postCard
  },
  data() {
    return {
      page: 1,
      date: 30,
      loaded: false,
      snackbar: false,
      snackbarColor: null,
      snackbarText: null,
      fullDialog: false,
      subLoading: false,
      saveLoading: false,
      newAccountsDialog: false,
      graphLoading: true,
      items: [
        {
          value: "0",
          text: "Бизнес"
        },
        { value: "1", text: "Музыка" },
        { value: "2", text: "Спорт" },
        { value: "3", text: "Кино" },
        { value: "4", text: "Интернет" },
        { value: "5", text: "Другое" }
      ],
      newCelebrity: {
        instagram: "",
        vk: "",
        fb: "",
        firstName: "",
        lastName: "",
        activity: ""
      },
      activeItem: {
        attachment_link: "",
        link: "",
        network: "",
        special_params: "",
        text: "",
        date_posted: ""
      },
      graph: null,
      editAccountsDialog: false,
      editAccountsLinks: {
        vk: null,
        fb: null,
        instagram: null
      }
    };
  },

  beforeMount() {
    this.getCelebrity();
  },
  mounted() {
    this.scroll();
  },
  computed: {
    ...mapState({
      celebrity: state => state.profiles.celebrity
    }),
    options() {
      return {
        nodeSize: 60,
        nodeLabels: true,
        force: 4000,
        fontSize: 12
      };
    }
  },

  watch: {
    //Чистим значения в диалоговом окне после закрытия
    newAccountsDialog: function(val) {
      if (!val) {
        this.newCelebrity = {
          instagram: "",
          vk: "",
          fb: "",
          firstName: "",
          lastName: "",
          activity: ""
        };
      }
    }
  },
  methods: {
    deleteProfile() {
      this.$store.dispatch("deleteProfile", this.$route.params.id).then(res => {
        if (res.status == 204) {
          this.snackbar = true;
          this.snackbarColor = "success";
          this.snackbarText = "Профиль удален";
          setTimeout(window.history.back(), 3000);
        }
      });
    },
    updateAccounts() {
      this.$store
        .dispatch("addCelebrityAccounts", {
          data: [
            {
              profile_id: celebrity.profile.id,
              username: this.editAccountsLinks.vk,
              network: 0
            },
            {
              profile_id: celebrity.profile.id,
              username: this.editAccountsLinks.fb,
              network: 1
            },
            {
              profile_id: celebrity.profile.id,
              username: this.editAccountsLinks.instagram,
              network: 2
            }
          ]
        })
        .then(res => {
          if (res.status == 200) {
            this.snackbar = true;
            this.snackbarColor = "success";
            this.snackbarText = "Аккаунты добавлены";
          }
        });
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

                    this.newAccountsDialog = true;
                  }
                });
            });
          } else {
            this.snackbar = true;
            this.snackbarColor = "error";
            this.snackbarText = "Что-то пошло не так";
          }
        });
    },
    editAccounts(account) {
      this.editableAccount = account;
      this.editAccountsDialog = true;
    },

    accountView(event, node) {
      if (node.data.id == -1) {
        this.newAccountsDialog = true;
        switch (node.data.network) {
          case 0:
            this.newCelebrity.vk = node.name;
            break;
          case 1:
            this.newCelebrity.fb = node.name;
            break;
          case 2:
            this.newCelebrity.instagram = node.name;
            break;

          default:
            break;
        }
      } else {
        this.$router.go("profiles/" + node.data.id);
      }
    },

    getGraph() {
      this.graphLoading = true;
      this.$store
        .dispatch("getGraph", { id: this.$route.params.id, date: this.date })
        .then(res => {
          this.loaded = true;
          if (res.status == 200) {
            res.json().then(data => {
              data.nodes.forEach(node => {
                node.svgIcon = null;
                node.svgObj = null;
                node.svgSym =
                  '<svg width="5cm" height="5cm" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink"><image xlink:href="' +
                  node.data.photo +
                  '" x="0" y="0" height="60px" width="60px" /></svg>';
              });
              this.graphLoading = false;
              this.graph = data;
            });
          }
          if (res.status == 401) {
            this.snackbar = true;
            this.snackbarColor = "error";
            this.snackbarText = "Упс, кажется, слетела авторизация";
          } else if (res.status >= 500) {
            this.snackbar = true;
            this.snackbarColor = "error";
            this.snackbarText = "Ошибка получения графа";
          }
        })
        .catch(error => {
          this.snackbar = true;
          this.snackbarColor = "error";
          this.snackbarText = error;
        });
    },
    getCelebrity() {
      this.$store
        .dispatch("getCelebrity", {
          id: this.$route.params.id,
          page: this.page
        })
        .then(res => {
          this.loaded = true;
          if (res.status == 401) {
            this.snackbar = true;
            this.snackbarColor = "error";
            this.snackbarText = "Упс, кажется, слетела авторизация";
          } else if (res.status == 404) {
            this.snackbar = true;
            this.snackbarColor = "warning";
            this.snackbarText = "Все посты загружены";
          } else if (res.status >= 500) {
            this.snackbar = true;
            this.snackbarColor = "error";
            this.snackbarText = "Ошибка получения постов";
          } else if (res.status == 200) {
            this.page++;
          }
        })
        .catch(error => {
          this.snackbar = true;
          this.snackbarColor = "error";
          this.snackbarText = error;
        });
    },
    changeSub(sub) {
      this.subLoading = true;
      let type = sub ? "unsubscribe" : "subscribe";
      this.$store
        .dispatch("subscribe", { type, id: this.$route.params.id })
        .then(res => {
          this.subLoading = false;
          if (res.status == 200) {
            this.celebrity.subscribed = !sub;
            this.snackbar = true;
            this.snackbarColor = "success";
            this.snackbarText = "Изменения сохранены";
          } else {
            this.snackbar = true;
            this.snackbarColor = "error";
            res.json().then(data => (this.snackbarText = data.status));
          }
        });
    },
    scroll() {
      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight ===
          document.documentElement.offsetHeight;
        if (bottomOfWindow) {
          this.getCelebrity();
        }
      };
    }
  }
};
</script>

<style>
.net {
  width: 100%;
  margin: auto;
  text-align: center;
}

.counter {
  width: 200px;
  text-align: center;
  margin: auto;
  padding-top: 15px;
}
</style>
