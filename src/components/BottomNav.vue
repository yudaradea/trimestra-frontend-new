<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)]"
  >
    <div class="flex justify-around py-2">
      <router-link
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center"
        :class="isActive(item.to) ? 'text-emerald-600' : 'text-gray-500'"
      >
        <component :is="item.icon" class="w-6 h-6" />
        <span class="mt-1 text-xs">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { Home, LineChart, Activity, User, History } from 'lucide-vue-next';

const route = useRoute();
const menuItems = [
  { label: 'Laporan', to: '/reports', icon: LineChart },
  { label: 'History', to: '/diary', icon: History },
  { label: 'Home', to: '/', icon: Home },
  { label: 'Exercise', to: '/exercise', icon: Activity },
  { label: 'Profile', to: '/profile', icon: User },
];

const isActive = (path) => route.path === path;
</script>
