<template>
  <div class="max-w-md min-h-screen mx-auto bg-white">
    <Header title="Pengaturan Notifikasi" showBack />

    <div class="px-6 py-6 space-y-6">
      <!-- Item -->
      <div
        v-for="(item, index) in notificationSettings"
        :key="index"
        class="flex items-center justify-between py-2 border-b border-gray-100"
      >
        <span class="font-medium text-gray-800">{{ item.label }}</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="item.enabled" class="sr-only peer" />
          <div
            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"
          ></div>
        </label>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from '@/components/Header.vue';
import BottomNav from '@/components/BottomNav.vue';

// Daftar opsi pengaturan
const notificationSettings = ref([
  { label: 'Notifikasi', enabled: false },
  { label: 'Suara', enabled: false },
  { label: 'Mode hening', enabled: false },
  { label: 'Getar', enabled: true },
  { label: 'Layar kunci', enabled: true },
  { label: 'Pengingat', enabled: false },
]);
</script>

<style scoped>
/* Sedikit penyesuaian animasi toggle */
input:checked + div {
  background-color: #009688;
}
</style>
