<template>
  <div class="relative w-full">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center justify-between w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
    >
      <span>{{ selectedOption.label }}</span>
      <svg
        class="w-5 h-5 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <ul
        v-if="isOpen"
        class="absolute z-10 w-full py-1 mt-2 overflow-auto text-base bg-white border border-gray-200 shadow-lg rounded-xl max-h-60"
      >
        <li
          v-for="option in mealOptions"
          :key="option.value"
          @click="selectOption(option)"
          class="px-4 py-2 text-gray-900 cursor-pointer select-none hover:bg-teal-100"
          :class="{
            'bg-teal-500 text-white hover:bg-teal-600':
              option.value === selectedOption.value,
          }"
        >
          {{ option.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// Definisikan props untuk menerima v-model dan options
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  mealOptions: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// Definisikan emit untuk mengirim update ke parent
const emit = defineEmits(['update:modelValue']);

// --- State Lokal ---
const isOpen = ref(false);

// Cari opsi yang sesuai dengan v-model awal atau default ke yang pertama
const selectedOption = ref(
  props.mealOptions.find((opt) => opt.value === props.modelValue) ||
    props.mealOptions[0]
);

// --- Fungsi ---
function selectOption(option) {
  selectedOption.value = option; // Update tampilan lokal
  isOpen.value = false; // Tutup dropdown
  emit('update:modelValue', option.value); // Kirim nilai baru ke parent (v-model)
}

// Watcher untuk jika nilai v-model diubah dari parent
watch(
  () => props.modelValue,
  (newValue) => {
    selectedOption.value =
      props.mealOptions.find((opt) => opt.value === newValue) ||
      props.mealOptions[0];
  }
);
</script>
