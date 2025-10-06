<template>
  <transition name="slide-up">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center max-w-md mx-auto bg-black/40"
    >
      <div
        class="absolute bottom-0 w-full max-w-md p-6 pb-20 shadow-lg bg-primary rounded-t-[25px]"
      >
        <h3 class="mb-4 text-lg font-semibold text-center text-gray-800">
          {{ title }}
        </h3>
        <p class="mb-6 text-sm text-gray-600">
          {{ message }}
        </p>
        <div class="flex justify-center gap-3 pt-4">
          <button
            @click="$emit('cancel')"
            class="px-4 py-2 font-medium bg-gray-100 rounded-lg text-primary active:scale-95"
          >
            Batal
          </button>
          <button
            @click="$emit('confirm')"
            class="px-4 py-2 font-semibold text-gray-800 rounded-lg bg-[#E2F163] active:scale-95"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>

<script setup>
defineProps({
  show: Boolean,
  title: { type: String, default: 'Konfirmasi' },
  message: { type: String, default: '' },
});
</script>
