<template>
  <div class="flex items-center gap-4 p-4 bg-white rounded shadow">
    <i :class="`${icon} text-2xl text-primary`"></i>
    <div>
      <div class="text-sm text-gray-500">{{ title }}</div>
      <div class="text-xl font-bold">{{ value }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: Number,
  icon: String,
});
</script>
