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
      <NavItemGroup
        icon="ri-user-line"
        label="Users"
        :children="[
          { to: '/admin/users/create', label: 'Add User' },
          { to: '/admin/users', label: 'List User' },
        ]"
      />

      <NavItemGroup
        icon="ri-restaurant-2-line"
        label="Foods"
        :children="[
          { to: '/admin/food-category/create', label: 'Add Food Category' },
          { to: '/admin/food-category', label: 'List Food Category' },
          { to: '/admin/food/create', label: 'Add Food' },
          { to: '/admin/food', label: 'List Food' },
        ]"
      />

      <NavItemGroup
        icon="ri-square-root"
        label="Exercises"
        :children="[
          // { to: '/admin/food-category/create', label: 'Add Food Category' },
          { to: '/admin/exercise', label: 'List Exercises' },
        ]"
      />

      <NavItemGroup
        icon="ri-bar-chart-line"
        label="Nutrition Target"
        :children="[
          // { to: '/admin/food-category/create', label: 'Add Food Category' },
          {
            to: '/admin/nutrition-requirement',
            label: 'List Nutrition Target',
          },
        ]"
      />

      <NavItemGroup
        icon="ri-command-fill"
        label="Allergies"
        :children="[
          // { to: '/admin/food-category/create', label: 'Add Food Category' },
          { to: '/admin/allergy', label: 'List Allergies' },
        ]"
      />

      <NavItemGroup
        icon="ri-timer-flash-line"
        label="ESP Devices"
        :children="[
          // { to: '/admin/food-category/create', label: 'Add Food Category' },
          { to: '/admin/devices', label: 'List Devices' },
          { to: '/admin/linked-devices', label: 'List User Devices' },
        ]"
      />
    </nav>
  </aside>
</template>

<script setup>
import NavItem from './NavItem.vue';
import NavItemGroup from './NavItemGroup.vue';
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
