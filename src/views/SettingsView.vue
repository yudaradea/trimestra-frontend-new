<template>
  <div class="max-w-md min-h-screen mx-auto bg-white">
    <Header title="Pengaturan" showBack />

    <div class="flex flex-col px-6 py-6 space-y-6">
      <!-- Notifikasi -->
      <button
        @click="goTo('/settings/notification')"
        class="flex items-center justify-between w-full p-4 transition bg-white border border-gray-100 shadow-sm rounded-2xl hover:bg-gray-50"
      >
        <div class="flex items-center space-x-3">
          <i class="text-2xl text-teal-500 ri-notification-3-fill"></i>
          <span class="font-medium text-gray-800">Notifikasi</span>
        </div>
        <i class="text-xl text-gray-400 ri-arrow-right-s-line"></i>
      </button>

      <!-- Password -->
      <button
        @click="goTo('/settings/password')"
        class="flex items-center justify-between w-full p-4 transition bg-white border border-gray-100 shadow-sm rounded-2xl hover:bg-gray-50"
      >
        <div class="flex items-center space-x-3">
          <i class="text-2xl text-teal-500 ri-key-2-fill"></i>
          <span class="font-medium text-gray-800">Password</span>
        </div>
        <i class="text-xl text-gray-400 ri-arrow-right-s-line"></i>
      </button>

      <!-- Hapus Akun -->
      <button
        @click="goTo('/settings/delete-account')"
        class="flex items-center justify-between w-full p-4 transition bg-white border border-gray-100 shadow-sm rounded-2xl hover:bg-gray-50"
      >
        <div class="flex items-center space-x-3">
          <i class="text-2xl text-teal-500 ri-user-unfollow-fill"></i>
          <span class="font-medium text-gray-800">Hapus Akun</span>
        </div>
        <i class="text-xl text-gray-400 ri-arrow-right-s-line"></i>
      </button>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import BottomNav from '@/components/BottomNav.vue';

const router = useRouter();

const goTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
button {
  transition: all 0.2s ease;
}
</style>
