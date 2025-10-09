<template>
  <div class="overflow-x-auto">
    <table class="min-w-full text-sm text-left border rounded">
      <thead class="text-gray-600 bg-gray-50">
        <tr>
          <th class="px-4 py-2">Nama</th>
          <th class="px-4 py-2">Email</th>
          <th class="px-4 py-2">Tanggal Daftar</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          class="border-t hover:bg-gray-50"
        >
          <td class="px-4 py-2 font-medium text-gray-800">{{ user.name }}</td>
          <td class="px-4 py-2">{{ user.email }}</td>
          <td class="px-4 py-2">{{ formatDate(user.created_at) }}</td>
        </tr>
      </tbody>
    </table>
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
