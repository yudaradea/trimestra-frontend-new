<template>
  <header
    class="flex items-center justify-between px-4 py-3 bg-white shadow-sm md:ml-64"
  >
    <button
      @click="$emit('toggle')"
      class="text-xl text-gray-600 hover:text-gray-800 md:hidden"
    >
      <i class="ri-menu-2-line"></i>
    </button>

    <h1 class="w-full text-lg font-semibold text-gray-800">{{ title }}</h1>

    <div class="relative flex items-center w-full gap-3" ref="dropdownRef">
      <div class="flex items-center justify-end w-full gap-2">
        <img
          :src="foto"
          alt="avatar"
          class="object-cover rounded-full cursor-pointer w-9 h-9"
        />
        <div
          class="flex items-center gap-1 cursor-pointer"
          @click="dropdownOpen = !dropdownOpen"
        >
          <p class="font-semibold">{{ name }}</p>
          <i class="ri-arrow-down-s-line"></i>
        </div>
      </div>
      <Transition name="fade">
        <div
          v-if="dropdownOpen"
          class="absolute right-0 z-50 w-48 pb-2 mt-2 bg-white border rounded shadow-lg top-full"
        >
          <div class="px-4 py-2 text-sm text-gray-700 border-b">
            Halo, <strong>{{ name }}</strong>
          </div>
          <RouterLink to="/admin/profile" class="dropdown-item">
            <div class="flex items-center gap-2">
              <i class="ri-edit-line"></i>
              <p>Edit Profil</p>
            </div>
          </RouterLink>

          <button @click="$emit('logout')" class="text-red-500 dropdown-item">
            <i class="mr-1 ri-logout-box-line"></i> Keluar
          </button>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

defineProps({ title: String, name: String, foto: String });
defineEmits(['toggle', 'logout']);

const dropdownOpen = ref(false);
const dropdownRef = ref(null);

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.dropdown-item {
  @apply block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
