<!-- src/pages/Forbidden.vue -->
<template>
  <ErrorPage
    code="403"
    title="Akses Ditolak"
    message="Kamu tidak memiliki izin untuk membuka halaman ini."
  />
</template>
<script setup>
import ErrorPage from '@/components/ErrorPage.vue';
</script>
