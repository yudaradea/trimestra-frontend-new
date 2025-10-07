import { defineStore } from 'pinia';

export const useFoodFilterStore = defineStore('foodFilter', {
  state: () => ({
    selectedCategoryId: null,
  }),
});
