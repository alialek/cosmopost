import Vue from 'vue';
import Router from 'vue-router';
import feed from './views/Feed.vue';
import login from './views/Login.vue';
import profile from './views/Profile.vue';
import saved from './views/Saved.vue';
import search from './views/Search.vue';
import recomendations from './views/Recomendations.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Лента',
      component: feed
    },
    {
      path: '/login',
      name: 'Авторизация',
      component: login
    },
    {
      path: '/profile/:id',
      name: 'Профиль',
      component: profile
    },
    {
      path: '/saved',
      name: 'Сохраненные',
      component: saved
    },
    {
      path: '/search',
      name: 'Каталог',
      component: search
    },

    {
      path: '/recommendations',
      name: 'Рекомендации',
      component: recomendations
    }
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/login');
  }
  next();
});

export default router;
