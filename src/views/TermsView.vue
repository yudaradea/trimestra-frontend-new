<template>
  <div class="max-w-md min-h-screen mx-auto bg-white">
    <!-- Header -->
    <Header title="Syarat & Kebijakan" showBack />

    <!-- Tabs -->
    <div class="flex justify-around border-b">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        class="flex-1 py-3 text-sm font-medium"
        :class="
          activeTab === tab
            ? 'border-b-2 border-primary text-primary'
            : 'text-gray-500'
        "
      >
        {{ tab }}
      </button>
    </div>

    <!-- Search -->
    <div class="p-4">
      <div class="relative">
        <input
          v-model="search"
          type="text"
          placeholder="Cari"
          class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
        />
        <i class="ri-search-line absolute right-3 top-2.5 text-gray-400"></i>
      </div>
    </div>

    <!-- Accordion -->
    <div class="px-4 space-y-2">
      <div
        v-for="(item, index) in filteredItems"
        :key="index"
        class="border rounded-lg"
      >
        <button
          class="flex items-center justify-between w-full px-3 py-2 text-left"
          @click="toggle(index)"
        >
          <span class="font-medium text-gray-700">{{ item.question }}</span>
          <i
            :class="
              openIndex === index
                ? 'ri-arrow-up-s-line'
                : 'ri-arrow-down-s-line'
            "
            class="text-xl text-gray-500"
          ></i>
        </button>
        <div v-if="openIndex === index" class="px-3 pb-3 text-sm text-gray-600">
          {{ item.answer }}
        </div>
      </div>
    </div>
  </div>

  <BottomNav />
</template>

<script setup>
import { ref, computed } from 'vue';
import Header from '@/components/Header.vue';
import { termsData } from '@/data/terms';
import BottomNav from '@/components/BottomNav.vue';

const tabs = ['General', 'Account', 'Services'];
const activeTab = ref('General');
const search = ref('');
const openIndex = ref(null);

const items = computed(() => {
  if (activeTab.value === 'General') return termsData.general;
  if (activeTab.value === 'Account') return termsData.account;
  return termsData.services;
});

const filteredItems = computed(() =>
  items.value.filter((i) =>
    i.question.toLowerCase().includes(search.value.toLowerCase())
  )
);

const toggle = (index) => {
  openIndex.value = openIndex.value === index ? null : index;
};
</script>
