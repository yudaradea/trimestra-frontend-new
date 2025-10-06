<!-- src/pages/NotFound.vue -->
<template>
  <ErrorPage
    code="404"
    title="Halaman Tidak Ditemukan"
    message="Ups, halaman yang kamu cari tidak tersedia."
  />
</template>
<script setup>
import ErrorPage from '@/components/ErrorPage.vue';
</script>
