import router from '../router';
import url from '../helper/url';

const user = localStorage.getItem('user');
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

const worker = {
  state: initialState,
  actions: {
    login({ commit }, data) {
      return new Promise((resolve, reject) => {
        const requestOptions = {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify(data)
        };
        fetch(url + 'api/login/', requestOptions).then(
          res =>
            res.json().then(data => {
              localStorage.setItem('user', data.access);
              router.push('/');
              commit('loginSuccess');
              resolve(res);
            }),
          error => {
            reject(error);
          }
        );
      });
    },
    register({ commit }, data) {
      return new Promise((resolve, reject) => {
        const requestOptions = {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify(data)
        };

        fetch(url + 'api/registration/register/', requestOptions).then(
          res =>
            res.json().then(data => {
              localStorage.setItem('user', data.access);
              resolve({ res, data });
            }),
          error => {
            reject(error);
          }
        );
      });
    },
    logout({ commit }) {
      commit('logout');
    }
  },
  mutations: {
    loginRequest(state, user) {
      state.status = { loggingIn: true };
      state.user = user;
    },
    loginSuccess(state, user) {
      state.status = { loggedIn: true };
      state.user = user;
    },
    loginFailure(state) {
      state.status = {};
      state.user = null;
    },
    logout(state) {
      state.status = {};
      state.user = null;
      localStorage.removeItem('user');
      router.push('/login');
    }
  }
};

export default worker;
