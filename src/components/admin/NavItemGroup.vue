<template>
  <div>
    <!-- Induk -->
    <button
      @click="isExpanded = !isExpanded"
      :class="[
        'flex items-center w-full px-3 py-2 text-sm font-medium rounded hover:bg-gray-100 transition',
        isActiveGroup
          ? 'bg-gray-100 text-primary font-semibold'
          : 'text-gray-700',
      ]"
    >
      <i :class="`${icon} text-lg mr-2`"></i>
      <span class="flex-1 text-left">{{ label }}</span>
      <i :class="`ri-arrow-${isExpanded ? 'up' : 'down'}-s-line text-xs`"></i>
    </button>

    <!-- Anak -->
    <Transition name="fade">
      <div v-if="isExpanded" class="mt-1 ml-6 space-y-1">
        <RouterLink
          v-for="item in children"
          :key="item.to"
          :to="item.to"
          :class="[
            'block px-3 py-1 text-sm rounded hover:bg-gray-100 transition',
            route.path === item.to
              ? 'bg-gray-100 text-primary font-semibold'
              : 'text-gray-600',
          ]"
        >
          {{ item.label }}
        </RouterLink>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  icon: String,
  label: String,
  children: {
    type: Array,
    required: true,
  },
});
const route = useRoute();
const isExpanded = ref(false);

const isActiveGroup = computed(() =>
  props.children?.some((item) => route.path.startsWith(item.to))
);

watch(
  () => route.path,
  () => {
    if (isActiveGroup.value) {
      isExpanded.value = true;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
