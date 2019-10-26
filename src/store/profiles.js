import authHeader from '../helper/authHandler';
import url from '../helper/url';

const initialState = {
  celebrities: [],
  celebrity: {
    profile: {
      photo: ''
    }
  },
  saved: {
    posts: []
  },
  graph: {}
};

const profiles = {
  state: initialState,
  mutations: {
    setCelebrities(state, data) {
      state.celebrities = data;
    },
    setCelebrity(state, data) {
      state.celebrity = data;
    },
    pushCelebrityPosts(state, data) {
      state.celebrity.posts = state.celebrity.posts.concat(data);
    },
    cleanState(state) {
      state = initialState;
    },
    setGraph(state, data) {
      state.graph = data;
    },
    setSaved(state, data) {
      state.saved = data;
    }
  },
  actions: {
    getCelebrities({ commit }) {
      return new Promise((resolve, reject) => {
        const requestOptions = {
          headers: authHeader(),
          method: 'GET'
        };
        fetch(url + 'api/profiles/', requestOptions).then(
          res => {
            resolve(res);
            res.json().then(data => commit('setCelebrities', data));
          },
          error => {
            reject(error);
          }
        );
      });
    },
    getSearchQuery({ commit }, item) {
      return new Promise((resolve, reject) => {
        const requestOptions = {
          headers: authHeader(),
          method: 'GET'
        };
        fetch(url + 'api/profiles/?scope=' + item.value, requestOptions).then(
          res => {
            resolve(res);
            res.json().then(data => commit('setCelebrities', data));
          },
          error => {
            reject(error);
          }
        );
      });
    },
    getSuggestions({ commit }) {
      return new Promise((resolve, reject) => {
        const requestOptions = {
          headers: authHeader(),
          method: 'GET'
        };
        fetch(url + 'api/suggestions/', requestOptions).then(
          res => {
            resolve(res);
            res.json().then(data => commit('setCelebrities', data));
          },
          error => {
            reject(error);
          }
        );
      });
    },
    getSaved({ commit }) {
      return new Promise((resolve, reject) => {
        const requestOptions = {
          headers: authHeader(),
          method: 'GET'
        };
        fetch(url + 'api/favorites/', requestOptions).then(
          res => {
            resolve(res);
            res.json().then(data => commit('setSaved', data));
          },
          error => {
            reject(error);
          }
        );
      });
    },
    addCelebrity({ commit }, data) {
      return new Promise((resolve, reject) => {
        const requestOptions = {
          headers: authHeader(),
          method: 'POST',
          body: JSON.stringify({
            first_name: data.firstName,
            last_name: data.lastName,
            scope: data.activity.value
          })
        };
        fetch(url + 'api/profiles/', requestOptions).then(
          res => {
            resolve(res);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    addCelebrityAccounts({ commit }, data) {
      return new Promise((resolve, reject) => {
        const requestOptions = {
          headers: authHeader(),
          method: 'POST',
          body: JSON.stringify({ data })
        };
        fetch(url + 'api/accounts/', requestOptions).then(
          res => {
            resolve(res);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    deleteProfile({ commit }, data) {
      return new Promise((resolve, reject) => {
        const requestOptions = {
          headers: authHeader(),
          method: 'DELETE',
          body: JSON.stringify(data)
        };
        fetch(url + 'api/profiles/' + data, requestOptions).then(
          res => {
            resolve(res);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    getCelebrity({ commit }, data) {
      return new Promise((resolve, reject) => {
        const requestOptions = {
          headers: authHeader(),
          method: 'GET'
        };
        fetch(
          url + 'api/profiles/' + data.id + '/?page=' + data.page,
          requestOptions
        ).then(
          res => {
            resolve(res);
            res.json().then(celeb => {
              if (data.page > 1) {
                commit('pushCelebrityPosts', celeb.posts);
              } else {
                res.status == 200 ? commit('setCelebrity', celeb) : '';
              }
            });
          },
          error => {
            reject(error);
          }
        );
      });
    },
    getCelebrityPosts({ commit }, id) {
      return new Promise((resolve, reject) => {
        const requestOptions = {
          headers: authHeader(),
          method: 'GET'
        };
        fetch(url + 'api/profiles/' + id + '?page=2', requestOptions).then(
          res => {
            resolve(res);
            res.json().then(data => {
              commit('setCelebrityPosts', data);
              console.log(data);
            });
          },
          error => {
            reject(error);
          }
        );
      });
    },
    getGraph({ commit }, data) {
      return new Promise((resolve, reject) => {
        const requestOptions = {
          headers: authHeader(),
          method: 'GET'
        };
        fetch(
          url + 'api/profiles/' + data.id + '/social_graph/?days=' + data.date,
          requestOptions
        ).then(res => {
          resolve(res);
        }),
          error => {
            reject(error);
          };
      });
    },
    searchProfiles({ commit }, search) {
      return new Promise((resolve, reject) => {
        const requestOptions = {
          headers: authHeader(),
          method: 'GET'
        };
        fetch(url + 'api/profiles/?search=' + search, requestOptions).then(
          res => {
            resolve(res);
            res.json().then(data => {
              commit('setCelebrities', data);
            });
          }
        ),
          error => {
            reject(error);
          };
      });
    },
    subscribe({ commit }, data) {
      return new Promise((resolve, reject) => {
        const requestOptions = {
          headers: authHeader(),
          method: 'POST',
          body: JSON.stringify({ type: data.type })
        };
        fetch(
          url + 'api/profiles/' + data.id + '/subscribe/',
          requestOptions
        ).then(
          res => {
            resolve(res);
          },
          error => {
            reject(error);
          }
        );
      });
    }
  },
  getters: {}
};

export default profiles;
