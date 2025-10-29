<template>
  <!-- Kontainer Card yang Modern -->
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
    <div class="overflow-x-auto rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <!-- Header Tabel -->
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              No
            </th>
            <th
              scope="col"
              class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              Nama Kategori
            </th>
            <th
              scope="col"
              class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              Icon
            </th>
            <th
              scope="col"
              class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              Order
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="">Aksi</span>
            </th>
          </tr>
        </thead>
        <!-- Body Tabel -->
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- State Jika Data Ada -->
          <template v-if="foodCategories.length > 0">
            <tr
              v-for="(foodCategory, index) in foodCategories"
              :key="foodCategory.id"
              class="transition-all hover:bg-gray-50"
            >
              <td
                class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap"
              >
                {{ index + 1 }}
              </td>
              <td
                class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap"
              >
                {{ foodCategory.name }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                <img
                  :src="foodCategory.icon_url"
                  alt="icon"
                  class="object-cover w-10 h-10 rounded-full"
                  @error="
                    $event.target.src =
                      'https://placehold.co/40x40/e2e8f0/94a3b8?text=Icon'
                  "
                />
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {{ foodCategory.order }}
              </td>
              <td
                class="relative px-6 py-4 text-sm font-medium text-right whitespace-nowrap"
              >
                <!-- Tombol Aksi dengan Desain Baru + Ikon -->
                <div class="flex items-center justify-center gap-3">
                  <button
                    @click="$emit('edit', foodCategory)"
                    class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-all bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <!-- Ikon Edit (Heroicons) -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    @click="$emit('delete', foodCategory)"
                    class="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 transition-all rounded-md shadow-sm bg-red-50 ring-1 ring-inset ring-red-200 hover:bg-red-100"
                  >
                    <!-- Ikon Hapus (Heroicons) -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.11-2.368.11a.75.75 0 00-.73.73V5.8c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-.764a.75.75 0 00-.73-.73c-.788 0-1.573-.033-2.368-.11v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.5.66 1.5 1.5V6h-3V5.5A1.5 1.5 0 0110 4zM8.5 8.25a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5zM11.5 8.25a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0v-5.5z"
                        clip-rule="evenodd"
                      />
                      <path
                        d="M1.956 7.362A.75.75 0 013.23 6.75h10.54a.75.75 0 011.274.612l-1.002 7.502A2.25 2.25 0 0111.796 17H5.204a2.25 2.25 0 01-2.244-2.136L1.956 7.362z"
                      />
                    </svg>
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </template>

          <!-- Empty State (Jika Data Kosong) -->
          <tr v-else>
            <td :colspan="5">
              <div
                class="flex flex-col items-center justify-center p-12 text-center"
              >
                <!-- Ikon Tag (Heroicons) -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-12 h-12 text-gray-400"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.737.563l3.431-1.372c.957-.386 1.591-1.262 1.591-2.257v-4.318c0-.597-.237-1.17-.659-1.591L14.409 3.659A2.25 2.25 0 0012.818 3H9.568z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 6h.008v.008H6V6z"
                  />
                </svg>
                <h3 class="mt-3 font-semibold text-gray-800 text-md">
                  Tidak Ada Kategori
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  Belum ada kategori makanan yang ditambahkan.
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  foodCategories: Array,
});
defineEmits(['edit', 'delete']);
</script>
