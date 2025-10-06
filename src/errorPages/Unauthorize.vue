<template>
  <ErrorPage
    code="401"
    title="Tidak Terotorisasi"
    message="Kamu harus login untuk mengakses halaman ini."
  />
</template>
<script setup>
import ErrorPage from '@/components/ErrorPage.vue';
</script>
