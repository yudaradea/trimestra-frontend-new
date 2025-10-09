<template>
  <!-- Overlay -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        @click="$emit('close')"
        class="fixed inset-0 z-30 bg-black/40 md:hidden"
      />
    </Transition>
  </Teleport>

  <!-- Sidebar -->
  <aside
    class="fixed top-0 left-0 z-40 w-64 h-full transition-transform duration-300 ease-in-out bg-white shadow-xl md:translate-x-0"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b">
      <span class="text-xl font-bold text-primary">NutriAdmin</span>
      <button
        @click="$emit('close')"
        class="text-gray-500 hover:text-gray-700 md:hidden"
      >
        <i class="text-2xl ri-close-line"></i>
      </button>
    </div>

    <!-- Nav -->
    <nav class="px-4 mt-6 space-y-1">
      <NavItem
        to="/admin/dashboard"
        icon="ri-dashboard-line"
        label="Dashboard"
      />
      <NavItem to="/admin/users" icon="ri-user-line" label="Pengguna" />
      <NavItem
        to="/admin/notifications"
        icon="ri-notification-3-line"
        label="Notifikasi"
      />
      <NavItem to="/admin/reports" icon="ri-file-chart-line" label="Laporan" />
      <NavItem to="/admin/content" icon="ri-book-open-line" label="Edukasi" />
      <NavItem
        to="/admin/settings"
        icon="ri-settings-3-line"
        label="Pengaturan"
      />
    </nav>
  </aside>
</template>

<script setup>
import NavItem from './NavItem.vue';
defineProps({ isOpen: Boolean });
defineEmits(['close', 'logout']);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
