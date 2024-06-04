import { createRouter, createWebHistory } from 'vue-router';
import { isUserLoggedIn, hasAnyRole } from './utils';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => {
    // always scroll to top
    return { top: 0, behavior: 'smooth' };
  },
  routes: [
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
      path: '/not-authorized',
      name: 'not-authorized',
      component: () => import('@/views/pages/miscellaneous/MiscNotAuthorized.vue'),
      meta: {
        layout: 'blank',
        requiresAuth: true,
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
  ],
});

// Inside your navigation guard
router.beforeEach(async (to, from, next) => {
  try {
    const authStore = useAuthStore();
    console.log('authStore', authStore.isAuthenticated());
    const isAuthenticated = await isUserLoggedIn();
    const requiredRoles = to.meta.requiredRoles;

    if (to.meta.requiresAuth && !isAuthenticated) {
      return next('login');
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = await hasAnyRole(requiredRoles);
      if (!hasRole) {
        return next('not-authorized');
      }
    }

    return next();
  } catch (error) {
    console.error('Error in route navigation guard:', error);
    return next('error');
  }
});

export default router;
