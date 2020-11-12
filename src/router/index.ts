import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:saveId?',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    meta: {
      title: "MapToGlobe"
    }
  },
  {
    path: "/help",
    name: "Help",
    component: () => import(/* webpackChunkName: "help" */ '../views/Help.vue'),
    meta: {
      title: "Help"
    }
  },
  {
    path: "/contact",
    name: "Contact",
    component: () => import(/* webpackChunkName: "help" */ '../views/Contact.vue'),
    meta: {
      title: "Contact"
    }
  },
  {
    path: "/legal",
    name: "Legal",
    component: () => import(/* webpackChunkName: "help" */ '../views/Legal.vue'),
    meta: {
      title: "Legal"
    }
  },
  {
    path: "/legal/licenses",
    name: "Licenses",
    component: () => import(/* webpackChunkName: "help" */ '../views/Licenses.vue'),
    meta: {
      title: "Licenses"
    }
  },
  {
    path: "/legal/privacy",
    name: "Privacy",
    component: () => import(/* webpackChunkName: "help" */ '../views/Privacy.vue'),
    meta: {
      title: "Privacy Policy"
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
  document.title = nearestWithTitle?.meta.title;
  next();
})

export default router
