<template>
  <div class="flex flex-col items-center w-40 p-4 border">
    <qrcode-vue :value="code" :size="50" />
    <span class="mt-2 font-bold">{{ code }}</span>
  </div>
</template>

<script setup>
import QrcodeVue from 'qrcode.vue';
defineProps({ code: String });
</script>
