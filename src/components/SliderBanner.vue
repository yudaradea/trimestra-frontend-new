<template>
  <div class="relative pb-6">
    <Swiper
      :modules="modules"
      :slides-per-view="1"
      :pagination="paginationConfig"
      class="overflow-hidden rounded-xl"
    >
      <SwiperSlide v-for="(item, index) in banners" :key="index">
        <div
          class="px-4 md:px-10 py-10 bg-gradient-to-r from-[#FFF2F0]/50 to-[#FFF8EB] rounded-[32px]"
        >
          <div class="grid items-center grid-cols-2">
            <div>
              <h4 class="text-sm font-semibold text-[#FF806E] tracking-[4px]">
                {{ item.label }}
              </h4>
              <p
                class="text-base text-[#330600] mt-1 text-[16px] leading-tight"
              >
                {{ item.title }}
              </p>
              <!-- menambahkan link -->
              <div class="mt-4">
                <RouterLink
                  :to="item.link"
                  class="px-6 py-2 text-sm text-white rounded-lg bg-[#FF806E]"
                >
                  Mulai <i class="ml-2 ri-arrow-right-line"></i>
                </RouterLink>
              </div>
            </div>
            <div class="flex justify-end">
              <img :src="item.image" alt="" />
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- Pagination (custom style) - Sekarang di luar kotak gradient -->
    <div class="flex justify-center mt-4">
      <div class="custom-pagination"></div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import banner1 from '@/assets/banner-home-1.png';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      modules: [Pagination],
      paginationConfig: {
        el: '.custom-pagination',
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '"></span>';
        },
      },
      banners: [
        {
          label: 'Diari Sehat',
          title: 'Catat setiap asupan, jaga setiap nutrisi!',
          image: banner1,
          link: '/diary',
        },
        {
          label: 'Aktivitas Sehat',
          title: 'Pantau aktivitasmu setiap hari!',
          image: banner1,
          link: '/exercise',
        },
      ],
    };
  },
};
</script>

<style scoped>
.custom-pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
}

.custom-pagination :deep(.swiper-pagination-bullet) {
  background-color: #ffc0b8;
  opacity: 0.5;
  width: 12px;
  height: 8px;
  border-radius: 4px;
  margin: 0 !important;
  transition: all 0.3s ease;
  cursor: pointer;
}

.custom-pagination :deep(.swiper-pagination-bullet-active) {
  background-color: #ff8473;
  width: 20px;
  opacity: 1;
}
</style>
