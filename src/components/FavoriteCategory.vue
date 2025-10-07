<template>
  <div class="mb-6">
    <h3 class="mb-3 font-semibold text-gray-700">Pilih Nutrisi Favorit</h3>

    <Swiper
      :slides-per-view="'auto'"
      :space-between="12"
      grabCursor
      class="px-1"
    >
      <SwiperSlide
        v-for="item in categories"
        :key="item.id"
        class="!w-[110px] flex-shrink-0"
      >
        <button
          @click="goToFoodWithCategory(item.id)"
          class="bg-white p-4 rounded-xl shadow text-center cursor-pointer transition-all select-none hover:shadow-md hover:scale-105 border border-gray-100 h-[120px] flex flex-col w-full"
        >
          <div
            class="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-emerald-50"
          >
            <img :src="item.icon_url" alt="" class="object-contain w-8 h-8" />
          </div>
          <p class="text-sm font-medium leading-tight text-gray-800">
            {{ item.name }}
          </p>
        </button>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import { useRouter } from 'vue-router';
import { useFoodFilterStore } from '@/stores/foodFilterStore';

const router = useRouter();
const foodFilter = useFoodFilterStore();

const goToFoodWithCategory = (id) => {
  foodFilter.selectedCategoryId = id;
  router.push('/food');
};

defineProps({
  categories: Array,
});
</script>
