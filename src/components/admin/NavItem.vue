<template>
  <RouterLink
    :to="to"
    class="flex items-center gap-3 px-3 py-2 text-sm transition rounded-md hover:bg-gray-100"
    :class="
      isActive ? 'bg-gray-100 font-semibold text-primary' : 'text-gray-700'
    "
  >
    <i :class="`${icon} text-lg`"></i>
    <span>{{ label }}</span>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const props = defineProps({ to: String, icon: String, label: String });
const route = useRoute();
const isActive = computed(() => route.path.startsWith(props.to));
</script>
