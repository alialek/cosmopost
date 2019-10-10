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
    getCelebrity({ commit }, id) {
      return new Promise((resolve, reject) => {
        const requestOptions = {
          headers: authHeader(),
          method: 'GET'
        };
        fetch(url + 'api/profiles/' + id + '/', requestOptions).then(
          res => {
            resolve(res);
            res.json().then(data => {
              commit('setCelebrity', data);
            });
          },
          error => {
            reject(error);
          }
        );
      });
    },
    getCelebrityPosts({ commit }, data) {
      return new Promise((resolve, reject) => {
        const requestOptions = {
          headers: authHeader(),
          method: 'GET'
        };
        fetch(url + 'api/profiles/' + data.id + '/posts/', requestOptions).then(
          res => {
            resolve(res);
            res.json().then(data => {
              commit('setCelebrity', data);
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
