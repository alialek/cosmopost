import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import vuetify from './plugins/vuetify';
import VueMasonry from 'vue-masonry-css';
import ScrollLoader from 'vue-scroll-loader';

Vue.use(ScrollLoader);

Vue.use(VueMasonry);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
