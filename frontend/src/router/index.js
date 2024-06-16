import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores';
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: {
      layout: 'content',
      requiresAuth: true,
    },
  },
  {
    path: '/users/list',
    name: 'apps-user-list',
    component: () => import('@/views/apps/user/list/index.vue'),
    meta: {
      layout: 'content',
      requiresAuth: true,
      requiredRoles: ['admin', 'editor', 'developer', 'moderator'],
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/Login.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/Register.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/auth/ForgotPassword.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/views/auth/ResetPassword.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: () => import('@/views/auth/VerifyEmail.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/accessDenied',
    name: 'accessDenied',
    component: () => import('@/views/pages/miscellaneous/MiscNotAuthorized.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      layout: 'blank',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => {
    return { top: 0, behavior: 'smooth' };
  },
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = await authStore.isAuthenticated();
  const requiredRoles = to.meta.requiredRoles || ['*'];
  const requiresAuth = to.meta.requiresAuth || false;

  const authPages = ['login', 'register', 'forgot-password', 'reset-password'];
  if (isAuthenticated && authPages.includes(to.name)) {
    return next({ name: 'home' });
  }

  if (requiresAuth && !isAuthenticated) {
    return next({ name: 'login' });
  }

  if (!requiredRoles.includes('*') && Array.isArray(requiredRoles) && requiredRoles.length > 0) {
    const userHasRequiredRoles = authStore.hasAnyRole(requiredRoles);
    if (!userHasRequiredRoles) {
      return next({ name: 'accessDenied' });
    }
  }

  return next();
});

export default router;
