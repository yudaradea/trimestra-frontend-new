<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
    <div class="rounded-lg overflow-x-">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="text-gray-600 bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              Nama
            </th>
            <th
              scope="col"
              class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              Email
            </th>
            <th
              scope="col"
              class="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              Tanggal Daftar
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-t hover:bg-gray-50"
          >
            <td
              class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap"
            >
              {{ user.name }}
            </td>
            <td
              class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap"
            >
              {{ user.email }}
            </td>
            <td
              class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap"
            >
              {{ formatDate(user.created_at) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({ users: Array });
function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
</script>
