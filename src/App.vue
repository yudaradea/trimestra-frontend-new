<!-- menambahkan router view -->

<template>
  <div class="min-h-screen bg-gray-50">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchUser();
  }
});
</script>
