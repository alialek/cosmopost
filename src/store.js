import Vue from 'vue';
import Vuex from 'vuex';
import worker from './store/user.js';
import profiles from './store/profiles.js';
import feed from './store/feed.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { worker, profiles, feed }
});
