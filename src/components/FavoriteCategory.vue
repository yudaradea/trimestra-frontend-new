<template>
  <div class="mb-6">
    <h3 class="mb-3 font-semibold text-gray-700">Pilih Nutrisi Favorit</h3>
    <div
      ref="scrollContainer"
      @wheel="handleWheel"
      class="overflow-x-auto overflow-y-hidden no-scrollbar"
    >
      <div class="flex gap-3 w-max">
        <RouterLink
          v-for="item in categories"
          :key="item.id"
          :to="`/`"
          class="flex-shrink-0 w-[100px] bg-white p-4 rounded-xl shadow text-center cursor-pointer transition-all select-none hover:shadow-md hover:scale-105"
        >
          <div
            class="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-emerald-50"
          >
            <img :src="item.icon_url" alt="" class="object-contain w-8 h-8" />
          </div>
          <p class="text-sm font-medium text-gray-800">{{ item.name }}</p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  categories: Array,
});

const scrollContainer = ref(null);

// Mouse wheel horizontal scroll
const handleWheel = (e) => {
  if (scrollContainer.value) {
    e.preventDefault();
    scrollContainer.value.scrollLeft += e.deltaY;
  }
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Hilangkan underline default RouterLink */
a {
  text-decoration: none;
}
</style>
