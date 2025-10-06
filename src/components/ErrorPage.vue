<!-- src/components/ErrorPage.vue -->
<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-100"
  >
    <h1 class="text-6xl font-bold text-primary">{{ code }}</h1>
    <h2 class="mt-4 text-2xl font-semibold text-gray-800">{{ title }}</h2>
    <p class="mt-2 text-gray-600">{{ message }}</p>
    <router-link
      to="/"
      class="inline-block px-6 py-2 mt-6 text-white transition rounded-lg shadow bg-primary hover:bg-slate-600"
    >
      Kembali ke Beranda
    </router-link>
  </div>
</template>

<script setup>
defineProps({
  code: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
});
</script>
