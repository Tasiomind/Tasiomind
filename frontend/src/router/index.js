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
    name: 'user-list',
    component: () => import('@/views/apps/user/list/index.vue'),
    meta: {
      layout: 'content',
      requiresAuth: true,
      requiredRoles: ['developer', 'moderator'],
    },
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/Login.vue'),
    meta: {
      layout: 'blank',
      guestOnly: true,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/Register.vue'),
    meta: {
      layout: 'blank',
      guestOnly: true,
    },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/auth/ForgotPassword.vue'),
    meta: {
      layout: 'blank',
      guestOnly: true,
    },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/views/auth/ResetPassword.vue'),
    meta: {
      layout: 'blank',
      guestOnly: true,
    },
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: () => import('@/views/auth/VerifyEmail.vue'),
    meta: {
      layout: 'blank',
      guestOnly: true,
    },
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: () => import('@/views/pages/miscellaneous/MiscNotAuthorized.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      layout: 'blank',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
  routes,
  strict: true,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = await authStore.isAuthenticated();
  const { requiredRoles = ['*'], requiresAuth = false, guestOnly = false } = to.meta;
  if (!requiresAuth) return next();

  if (requiresAuth && !isAuthenticated && to.name !== 'login') {
    return next({ name: 'login' });
  }

  if (
    !requiredRoles.includes('*') &&
    Array.isArray(requiredRoles) &&
    requiredRoles.length > 0 &&
    isAuthenticated
  ) {
    const userHasRequiredRoles = authStore.hasAnyRole(requiredRoles);
    if (!userHasRequiredRoles) {
      return next({ name: 'accessDenied' });
    }
  }

  if (guestOnly && isAuthenticated && to.name === 'login') {
    return next({ name: 'home' });
  }
  return next();
});

export default router;
