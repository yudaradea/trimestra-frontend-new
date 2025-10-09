<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar
      :isOpen="sidebarOpen"
      @close="sidebarOpen = false"
      @logout="handleLogout"
    />
    <Header
      :title="title"
      :name="adminName"
      :foto="foto"
      @toggle="sidebarOpen = !sidebarOpen"
    />

    <main class="p-4 md:p-6 md:ml-64">
      <div class="mx-auto max-w-7xl">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';

defineProps({ title: String });
const router = useRouter();
const authStore = useAuthStore();

const sidebarOpen = ref(false);
const adminName = authStore.user?.name || 'Admin';
const foto = authStore.user?.profile?.foto_profile || '';

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>
