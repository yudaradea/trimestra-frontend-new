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
import FoodView from '@/views/FoodView.vue';
import FoodSelectView from '@/views/FoodSelectView.vue';
import ExerciseSelectView from '@/views/ExerciseSelectView.vue';
import ExerciseView from '@/views/ExerciseView.vue';
import ExerciseDetailView from '@/views/ExerciseDetailView.vue';
import LaporanView from '@/views/LaporanView.vue';
import NotificationView from '@/views/NotificationView.vue';

// admin
import DashboardView from '@/views/admin/DashboardView.vue';
import UserView from '@/views/admin/UserView.vue';
import CreateUserView from '@/views/admin/CreateUserView.vue';
import EditUserView from '@/views/admin/EditUserView.vue';

import CreateFoodCategoryView from '@/views/admin/CreateFoodCategoryView.vue';
import FoodCategoryView from '@/views/admin/FoodCategoryView.vue';
import AdminFoodView from '@/views/admin/FoodView.vue';
import CreateFoodView from '@/views/admin/CreateFoodView.vue';
import EditFoodView from '@/views/admin/EditFoodView.vue';

import AllergyView from '@/views/admin/AllergyView.vue';

// error pages
import NotFound from '@/errorPages/NotFound.vue';
import Unauthorize from '@/errorPages/Unauthorize.vue';
import Forbidden from '@/errorPages/Forbidden.vue';

const routes = [
  // admin
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  {
    path: '/admin/users',
    name: 'admin-user',
    component: UserView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  {
    path: '/admin/users/create',
    name: 'admin-user-create',
    component: CreateUserView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  {
    path: '/admin/users/edit/:id',
    name: 'admin-user-edit',
    component: EditUserView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  {
    path: '/admin/food-category/create',
    name: 'admin-food-category-create',
    component: CreateFoodCategoryView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  {
    path: '/admin/food-category',
    name: 'admin-food-category',
    component: FoodCategoryView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  {
    path: '/admin/food',
    name: 'admin-food',
    component: AdminFoodView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  {
    path: '/admin/food/create',
    name: 'admin-food-create',
    component: CreateFoodView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  {
    path: '/admin/food/edit/:id',
    name: 'admin-food-edit',
    component: EditFoodView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  {
    path: '/admin/allergy',
    name: 'admin-allergy',
    component: AllergyView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },

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
    name: 'notifications-setting', // Diubah agar tidak konflik dengan '/notifications'
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
    path: '/food',
    name: 'food',
    component: FoodView,
    meta: { requiresAuth: true },
  },

  {
    path: '/exercise',
    name: 'exercise',
    component: ExerciseView,
    meta: { requiresAuth: true },
  },
  {
    path: '/exercise/:id',
    name: 'exercise-detail',
    component: ExerciseDetailView,
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

  {
    path: '/reports',
    name: 'laporan',
    component: LaporanView,
    meta: { requiresAuth: true },
  },

  {
    path: '/notifications',
    name: 'notifications',
    component: NotificationView,
    meta: { requiresAuth: true },
  },
  // error pages
  { path: '/401', name: 'Unauthorized', component: Unauthorize },
  { path: '/403', name: 'Forbidden', component: Forbidden },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }, // catch-all
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // Pastikan data user sudah ada jika sudah terotentikasi, untuk cek role dan hasProfile
  if (isAuthenticated && !authStore.user) {
    await authStore.fetchUser();
  }
  const isAdmin = authStore.user?.role === 'admin';
  const hasProfile = authStore.hasProfile; // Gunakan getter dari store

  // --- Logic 1: Halaman yang membutuhkan Otentikasi (requiresAuth) ---
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // Belum login, redirect ke login
      return next({
        name: 'login',
        query: { redirect: to.fullPath }, // Simpan tujuan awal
      });
    }

    // Sudah login, cek otorisasi dan kelengkapan profil

    // Cek Akses Admin
    if (to.meta.requiresAdmin && !isAdmin) {
      // Membutuhkan admin tapi user bukan admin -> Forbidden
      return next('/403');
    }

    // Cek Profile Setup
    if (!hasProfile && !isAdmin && to.name !== 'profile-setup') {
      // Belum punya profil dan mencoba akses halaman lain (selain profile-setup)
      return next({ name: 'profile-setup' });
    }

    if (hasProfile && to.name === 'profile-setup') {
      // Sudah punya profil tapi mencoba akses profile-setup -> Redirect ke home
      return next({ name: 'home' });
    }

    // Lanjut ke halaman yang dituju
    return next();
  }

  // --- Logic 2: Halaman yang TIDAK membutuhkan Otentikasi (requiresNoAuth) ---
  if (to.meta.requiresNoAuth && isAuthenticated) {
    // Sudah login tapi mencoba akses login/register/register-success
    if (isAdmin) {
      // Jika Admin, redirect ke dashboard admin
      return next({ name: 'admin-dashboard' });
    } else if (!hasProfile) {
      // Jika Belum ada profil, redirect ke profile setup
      return next({ name: 'profile-setup' });
    } else {
      // Sudah lengkap, redirect ke home
      return next({ name: 'home' });
    }
  }

  // --- Logic 3: Halaman lainnya (Error pages, atau tidak punya meta) ---
  // Jika tidak ada meta requiresAuth atau requiresNoAuth, atau jika requiresNoAuth dan tidak login
  next();
});

export default router;
