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
        class="absolute flex items-center justify-center w-8 h-8 text-gray-400 border-2 border-white rounded-full -top-2 -right-2 bg-primary hover:text-gray-600"
      >
        <i class="text-xl text-white ri-close-line"></i>
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

.animate-slide-up-reverse {
  animation: slide-up 0.25s ease-out reverse;
}
</style>
