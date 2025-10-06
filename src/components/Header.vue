<template>
  <div class="max-w-md pt-2 mx-auto bg-white">
    <div class="flex items-center justify-between max-w-md px-4 mx-auto">
      <div class="flex items-center py-3 bg-white">
        <button v-if="showBack" @click="goBack" class="mr-2 text-gray-600">
          <i class="text-xl ri-arrow-left-line"></i>
        </button>
        <h1 class="text-lg font-semibold text-gray-700">{{ title }}</h1>
      </div>
      <!-- Tombol Notifikasi -->
      <router-link to="/notifications">
        <i class="text-2xl text-teal-600 ri-notification-3-line"></i>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const props = defineProps({
  title: String,
  showBack: { type: Boolean, default: false },
});
const router = useRouter();
const goBack = () => router.back();
</script>

<style scoped>
/* biar tetap tinggi tapi tidak terlalu besar */
header {
  height: 56px;
}
</style>
