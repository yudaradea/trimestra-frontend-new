<template>
  <div class="max-w-md min-h-screen pb-16 mx-auto bg-white">
    <!-- Header -->
    <Header title="Profile" showBack />

    <!-- Loading State -->
    <div
      v-if="initialLoading"
      class="flex flex-col items-center justify-center max-w-md min-h-screen py-12 mx-auto"
    >
      <div class="text-4xl animate-spin">⏳</div>
      <span class="mt-4 text-sm text-gray-600">Memuat data...</span>
    </div>

    <!-- Content -->
    <div v-else class="flex flex-col items-center px-4 mt-6">
      <!-- Avatar -->
      <div class="relative">
        <img
          :src="profile?.profile.foto_profile || '/default-avatar.png'"
          alt="Avatar"
          class="object-cover border-4 rounded-full border-primary w-28 h-28"
        />
        <button
          class="absolute bottom-0 right-0 w-8 h-8 text-white border-white border-2 bg-[#FF9385] rounded-full shadow-md cursor-default"
        >
          <i class="ri-vip-crown-fill"></i>
        </button>
      </div>

      <!-- Info -->
      <h2 class="mt-4 text-lg font-semibold text-gray-800">
        {{ profile?.name || '-' }}
      </h2>
      <p class="mb-4 text-sm text-gray-500">
        {{ profile?.email || '-' }}
      </p>

      <!-- Cards -->
      <div
        class="flex items-center justify-around w-full gap-2 px-4 py-4 bg-primary rounded-xl"
      >
        <div class="font-semibold text-center text-white">
          {{ profile?.profile.weight ? profile.profile.weight + ' Kg' : '' }}
        </div>

        <div class="w-px h-12 bg-white"></div>

        <div class="font-semibold text-center text-white">
          {{ age ? age + ' Tahun' : '' }}
        </div>

        <div class="w-px h-12 bg-white"></div>

        <div class="font-semibold text-center text-white">
          {{ profile?.profile.height ? profile.profile.height + ' CM' : '' }}
        </div>
      </div>

      <!-- Menu List -->
      <div class="w-full mt-8 space-y-2">
        <div
          v-for="(item, index) in menuItems"
          :key="index"
          @click="handleMenuClick(item)"
          class="flex items-center justify-between px-4 py-3 rounded-lg shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div class="flex items-center space-x-3">
            <div class="bg-[#FFF8EE] p-2 rounded-lg">
              <i :class="item.icon" class="text-[#FF9385] text-xl"></i>
            </div>
            <span class="font-medium text-gray-700">{{ item.label }}</span>
          </div>
          <i class="text-xl text-gray-400 ri-arrow-right-s-line"></i>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->

    <ConfirmModal
      :show="showLogoutModal"
      title="Apakah Yakin ingin keluar?"
      @cancel="showLogoutModal = false"
      @confirm="confirmLogout"
    />
  </div>
  <BottomNav />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useProfileStore } from '@/stores/useProfileStore';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import BottomNav from '@/components/BottomNav.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';

const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const profile = computed(() => profileStore.profile);
const initialLoading = ref(true);

const showLogoutModal = ref(false);

// Hitung umur dari tanggal lahir
const age = computed(() => {
  if (!profile.value?.profile?.birth_date) return null;
  const birthDate = new Date(profile.value.profile.birth_date);
  const diff = Date.now() - birthDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
});

// Ambil data profil dengan loading state
onMounted(async () => {
  try {
    initialLoading.value = true;
    await profileStore.fetchProfile();
  } catch (error) {
    console.error('Gagal mengambil profil:', error);
  } finally {
    initialLoading.value = false;
  }
});

// Daftar menu
const menuItems = [
  { label: 'Ubah Profil', icon: 'ri-user-line', route: '/profile/edit' },
  { label: 'Pengaturan', icon: 'ri-settings-line', route: '/settings' },
  { label: 'Syarat & Kebijakan', icon: 'ri-sticky-note-fill', route: '/terms' },
  { label: 'Bantuan', icon: 'ri-message-2-line', route: '/help' },
  { label: 'Keluar', icon: 'ri-logout-box-r-line', action: 'logout' },
];

// Klik menu
const handleMenuClick = (item) => {
  if (item.action === 'logout') {
    showLogoutModal.value = true;
  } else if (item.route) {
    router.push(item.route);
  }
};

const confirmLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
body {
  background-color: #fff;
}
</style>
