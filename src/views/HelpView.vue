<template>
  <div class="max-w-md min-h-screen mx-auto bg-white">
    <!-- Header -->
    <Header title="Bantuan" showBack />

    <div class="p-4 space-y-2">
      <div
        v-for="(item, index) in helpOptions"
        :key="index"
        @click="handleClick(item)"
        class="flex items-center justify-between px-4 py-3 rounded-lg shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
      >
        <div class="flex items-center space-x-3">
          <div class="p-2 rounded-lg bg-gray-50">
            <i :class="item.icon" class="text-xl text-primary"></i>
          </div>
          <span class="font-medium text-gray-700">{{ item.label }}</span>
        </div>
        <i class="text-xl text-gray-400 ri-arrow-right-s-line"></i>
      </div>
    </div>
  </div>

  <BottomNav />
</template>

<script setup>
import Header from '@/components/Header.vue';
import { helpOptions } from '@/data/help';
import BottomNav from '@/components/BottomNav.vue';

const handleClick = (item) => {
  if (item.type === 'link') {
    window.open(item.value, '_blank');
  }
};
</script>
