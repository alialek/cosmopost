<template>
  <div>
    <v-row class="justify-center">
      <masonry :cols="{default: 4, 1020: 3, 800: 2, 530: 1}">
        <v-card
          v-for="(post, n) in posts"
          :key="n"
          class="my-4 mx-2"
          ripple
          min-width="250"
          max-width="350"
          min-height="100"
        >
          <v-card-text v-if="showName">
            <router-link :to="'/profile/'+post.profile.id">
              <v-row class="align-center ml-2 align-content-center">
                <v-img max-width="30" style="border-radius: 100px" :src="post.profile.photo"></v-img>
                <span class="ml-2">{{post.profile.first_name +' ' + post.profile.last_name }}</span>
              </v-row>
            </router-link>
          </v-card-text>
          <video
            @click="openDialog(post)"
            width="100%"
            v-if="post.special_params.type == 1"
            :src="post.attachment_link"
          />
          <v-img
            v-else
            @click="openDialog(post)"
            class="white--text"
            height="250px"
            :src="post.attachment_link"
          ></v-img>

          <v-card-text @click="openDialog(post)" style="max-height: 100px; overflow: hidden">
            <span class="text--primary">{{post.text}}</span>
          </v-card-text>
          <v-card-text>
            <v-row class="justify-space-between align-center align-content-center">
              <div class="ml-2">
                <router-link :to="post.link">
                  <v-icon
                    color="primary"
                  >{{ post.network == 2 ? 'mdi-instagram' : post.network == 0 ? 'mdi-vk' : post.network == 1 ? 'mdi-facebook' : 'mdi-question' }}</v-icon>
                </router-link>
              </div>
              <div>
                <v-btn :loading="post.saveLoading" small fab text color="primary">
                  <v-icon
                    @click="updateSaved(post.is_saved, post.id, post.saveLoading)"
                  >{{post.is_saved ? 'mdi-bookmark' : 'mdi-bookmark-outline' }}</v-icon>
                </v-btn>
                <v-btn @click="getCode(post.network, post.link)" small fab text color="gray">
                  <v-icon>mdi-xml</v-icon>
                </v-btn>
              </div>
            </v-row>
          </v-card-text>
        </v-card>
      </masonry>
    </v-row>
    <v-dialog style="overflow: hidden" v-model="fullDialog">
      <v-row class="align-center justify-space-between d-none d-sm-flex" style="height: 100%; background-color:white; margin: 0 !important;">
        <div style="height: 80vh; width: 60%">
          <video
            style="height: 100%; width: 100%; object-fit: contain;"
            v-if="activeItem.special_params.type == 1"
            :src="activeItem.attachment_link"
            controls
          />
          <v-img
            v-else
            style="height: 100%; width: 100%; object-fit: contain;"
            contain
            :src="activeItem.attachment_link"
          ></v-img>
        </div>
        <div class="px-4" style="height: 100%; width: 40%;overflow-y: scroll">
          {{activeItem.text}}
          <v-divider class="my-4" />
          {{activeItem.date_posted.split('T')[0]}}
        </div>
      </v-row>
      <v-col class="d-sm-none" style="overflow: hidden; background-color:white">
        <div style="height: 40vh">
          <video
            style="height: 100%; width: 100%;  object-fit: contain;"
            v-if="activeItem.special_params.type == 1"
            :src="activeItem.attachment_link"
            controls
          />
          <v-img
            v-else
            style="height: 100%; width: 100%; object-fit: contain;"
            contain
            :src="activeItem.attachment_link"
          ></v-img>
        </div>
        <div style="overflow-y: scroll">
          {{activeItem.text}}
          <v-divider class="my-4" />
          {{activeItem.date_posted.split('T')[0]}}
        </div>
      </v-col>
    </v-dialog>
    <v-snackbar class="mt-2" v-model="snackbar" :color="snackbarColor" :timeout="2000">
      {{ snackbarText }}
      <v-btn color="white" text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  props: ["posts", "showName"],
  name: "postCard",
  data: () => ({
    fullDialog: false,
    activeItem: {
      attachment_link: "",
      link: "",
      network: "",
      special_params: "",
      text: "",
      date_posted: ""
    },
    snackbar: false,
    snackbarColor: null,
    snackbarText: null
  }),
  methods: {
    openDialog(item) {
      this.activeItem = item;
      this.fullDialog = true;
    },
    updateSaved(bool, id) {
      let isSaved = !bool;
      this.$store.dispatch("updateSaved", { isSaved, id }).then(res => {
        if (res.status == 200) {
          this.$store.state.profiles.celebrity.posts = this.$store.state.profiles.celebrity.posts.map(
            post => {
              if (post.id == id) {
                post.is_saved = !post.is_saved;
              }
              return post;
            }
          );
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
    async showCopySnack(code) {
      await navigator.clipboard.writeText(code);
      this.snackbar = true;
      this.snackbarColor = "success";
      this.snackbarText = "Код для вставки скопирован в буфер";
    },
    getCode(id, link) {
      let code = "";
      switch (id) {
        case 0:
          let numbers = link.split("wall")[1].split("_");
          let idVK = numbers[0];
          let post = numbers[1];
          code = `<div id="vk_post_${idVK}_${post}"></div><script type="text/javascript">(function(d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = "https://vk.com/js/api/openapi.js?162"; fjs.parentNode.insertBefore(js, fjs); }(document, 'script', 'vk_openapi_js')); (function() {  if (!window.VK || !VK.Widgets || !VK.Widgets.Post || !VK.Widgets.Post('vk_post_${idVK}_${post}', ${idVK}, ${post}, 'b8Q6bNxlow0aeMBWXJaugK1mcg4')) setTimeout(arguments.callee, 50);  }());<\/script>`;
          this.showCopySnack(code);
          break;

        case 1:
          code = `<div id="fb-root"></div><script async defer crossorigin="anonymous" src="https://connect.facebook.net/ru_RU/sdk.js#xfbml=1&version=v4.0"><\/script><div class="fb-post" data-href="${link}" data-width="500" data-show-text="true"></div>`;
          this.showCopySnack(code);
          break;

        case 2:
          code =
            '<iframe class="instagram-media instagram-media-rendered" id="instagram-embed-0" src="' +
            link +
            '/embed/captioned/" allowtransparency="true" allowfullscreen="true" frameborder="0" height="879" data-instgrm-payload-id="instagram-media-payload-0" scrolling="no" style="background: white; max-width: 658px; width: calc(100% - 2px); border-radius: 3px; border: 1px solid rgb(219, 219, 219); box-shadow: none; display: block; margin: 0px 0px 12px; min-width: 326px; padding: 0px;"></iframe>';
          this.showCopySnack(code);
          break;

        default:
          break;
      }
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
