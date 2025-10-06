import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import RegisterSuccessView from '@/views/RegisterSuccessView.vue';
import ProfileSetupView from '@/views/ProfileSetupView.vue';
import ProfileView from '@/views/ProfileView.vue';
import ProfileUpdate from '@/views/ProfileUpdate.vue';
import SettingsView from '@/views/SettingsView.vue';
import SettingNotificationView from '@/views/SettingNotificationView.vue';
import SettingPasswordView from '@/views/SettingPasswordView.vue';
import TermsView from '@/views/TermsView.vue';
import HelpView from '@/views/HelpView.vue';
import DiaryView from '@/views/DiaryView.vue';
import FoodSelectView from '@/views/FoodSelectView.vue';
import ExerciseSelectView from '@/views/ExerciseSelectView.vue';
import notFound from '@/errorPages/notFound.vue';
import Unauthorize from '@/errorPages/Unauthorize.vue';
import Forbidden from '@/errorPages/Forbidden.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresNoAuth: true },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresNoAuth: true },
  },
  {
    path: '/register-success',
    name: 'register-success',
    component: RegisterSuccessView,
    meta: { requiresNoAuth: true },
  },
  {
    path: '/profile-setup',
    name: 'profile-setup',
    component: ProfileSetupView,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/edit',
    name: 'profile-edit',
    component: ProfileUpdate,
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/settings/notification',
    name: 'notifications',
    component: SettingNotificationView,
    meta: { requiresAuth: true },
  },
  {
    path: '/settings/password',
    name: 'password',
    component: SettingPasswordView,
    meta: { requiresAuth: true },
  },

  {
    path: '/terms',
    name: 'terms',
    component: TermsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/help',
    name: 'help',
    component: HelpView,
    meta: { requiresAuth: true },
  },
  {
    path: '/diary',
    name: 'diary',
    component: DiaryView,
    meta: { requiresAuth: true },
  },
  {
    path: '/food-select',
    name: 'food-select',
    component: FoodSelectView,
    meta: { requiresAuth: true },
  },
  {
    path: '/exercise-select',
    name: 'exercise-select',
    component: ExerciseSelectView,
    meta: { requiresAuth: true },
  },

  // error pages
  { path: '/401', name: 'Unauthorized', component: Unauthorize },
  { path: '/403', name: 'Forbidden', component: Forbidden },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: notFound }, // catch-all
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath }, // Simpan tujuan awal
    });
  } else if (to.meta.requiresNoAuth && isAuthenticated) {
    // Jika user sudah login dan mengakses login/register, redirect ke home atau profile setup
    if (to.name === 'login' || to.name === 'register') {
      // Cek apakah user punya profile
      if (!authStore.user) {
        await authStore.fetchUser();
      }

      if (!authStore.hasProfile) {
        next('/profile-setup');
      } else {
        next('/');
      }
    } else {
      next();
    }
  } else if (to.meta.requiresAuth && isAuthenticated) {
    // Jika user mengakses halaman yang membutuhkan auth, cek apakah punya profile
    if (!authStore.user) {
      await authStore.fetchUser();
    }
    if (to.name === 'profile-setup') {
      if (authStore.hasProfile) {
        next('/');
      } else {
        next();
      }
    } else {
      // Jika user mengakses halaman lain
      if (!authStore.hasProfile) {
        // Jika belum punya profile, redirect ke profile setup
        next('/profile-setup');
      } else {
        next();
      }
    }
  } else {
    next();
  }
});
export default router;
