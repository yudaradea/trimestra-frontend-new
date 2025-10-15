<template>
  <div class="overflow-x-auto">
    <table class="min-w-full text-sm border rounded">
      <thead class="text-gray-600 bg-gray-50">
        <tr>
          <th class="px-4 py-2 text-center">No</th>
          <th class="px-4 py-2 text-center">Nama</th>
          <th class="px-4 py-2 text-center">Order</th>
          <th class="px-4 py-2 text-center">Icon</th>
          <th class="px-4 py-2 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(foodCategory, index) in foodCategories"
          :key="foodCategory.id"
          class="border-t hover:bg-gray-50"
        >
          <td class="px-4 py-2 font-medium text-center">
            {{ index + 1 }}
          </td>
          <td class="px-4 py-2 font-medium text-center">
            {{ foodCategory.name }}
          </td>
          <td class="px-4 py-2 font-medium text-center">
            {{ foodCategory.order }}
          </td>
          <td class="px-4 py-2 text-center">
            <img
              :src="foodCategory.icon_url"
              alt="icon"
              class="object-cover w-10 h-10 mx-auto rounded-full"
            />
          </td>
          <td class="px-4 py-2">
            <div class="flex items-center justify-center w-full gap-2">
              <button
                @click="$emit('edit', foodCategory)"
                class="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                @click="$emit('delete', foodCategory)"
                class="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="foodCategories.length === 0">
          <td colspan="4" class="px-4 py-4 italic text-center text-gray-500">
            Tidak ada data
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  foodCategories: Array,
});
defineEmits(['edit', 'delete']);
</script>
