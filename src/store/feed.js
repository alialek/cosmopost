import router from '../router';
import url from '../helper/url';
import authHeader from '../helper/authHandler';

const feed = {
  state: {
    posts: []
  },
  actions: {
    getFeed({ commit }) {
      return new Promise((resolve, reject) => {
        const requestOptions = {
          headers: authHeader(),
          method: 'GET'
        };
        fetch(url + 'api/feed/', requestOptions).then(
          res =>
            res.json().then(data => {
              commit('setFeed', data);
              resolve(res);
            }),
          error => {
            reject(error);
          }
        );
      });
    },
    updateSaved({ commit }, data) {
      return new Promise((resolve, reject) => {
        const requestOptions = {
          headers: authHeader(),
          method: 'POST',
          body: JSON.stringify({ is_saved: data.isSaved })
        };
        fetch(url + 'api/posts/' + data.id + '/save/', requestOptions).then(
          res =>
            res.json().then(data => {
              resolve(res);
            }),
          error => {
            reject(error);
          }
        );
      });
    }
  },
  mutations: {
    setFeed(state, data) {
      state.posts = data.posts;
    }
  }
};

export default feed;
