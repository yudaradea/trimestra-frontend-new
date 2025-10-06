<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  >
    <div
      class="relative w-full max-w-md p-6 mx-4 bg-white shadow-lg rounded-xl animate-slide-up"
    >
      <!-- Tombol close -->
      <button
        @click="$emit('close')"
        class="absolute text-gray-400 top-3 right-3 hover:text-gray-600"
      >
        ✕
      </button>

      <!-- Slot konten -->
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
});
</script>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-slide-up {
  animation: slide-up 0.25s ease-out;
}
</style>
