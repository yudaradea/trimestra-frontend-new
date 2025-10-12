<template>
  <div class="overflow-x-auto">
    <table class="min-w-full text-sm border rounded">
      <thead class="text-gray-600 bg-gray-50">
        <tr>
          <th class="px-4 py-2">Foto</th>
          <th class="px-4 py-2">Nama</th>
          <th class="px-4 py-2">Email</th>
          <th
            class="px-4 py-2 cursor-pointer select-none"
            @click="$emit('sort', 'location')"
          >
            Lokasi
            <span v-if="sortBy === 'location'">
              <span v-if="sortDirection === 'asc'">▲</span>
              <span v-else>▼</span>
            </span>
          </th>
          <th class="px-4 py-2">BMI</th>
          <th class="px-4 py-2">Tanggal Daftar</th>
          <th class="px-4 py-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <!-- data ada -->
        <tr
          v-for="user in users"
          :key="user.id"
          class="border-t hover:bg-gray-50"
        >
          <td class="px-4 py-2">
            <img
              :src="user.profile?.foto_profile"
              alt="foto"
              class="object-cover w-10 h-10 rounded-full"
            />
          </td>
          <td class="px-4 py-2 font-medium">{{ user.name }}</td>
          <td class="px-4 py-2">{{ user.email }}</td>
          <td class="px-4 py-2">{{ user.profile?.location?.province_name }}</td>
          <td class="px-4 py-2">
            {{ user.profile?.calculated_bmi?.bmi }}
            ({{ user.profile?.calculated_bmi?.bmi_category }})
          </td>
          <td class="px-4 py-2">
            {{ new Date(user.created_at).toLocaleDateString('id-ID') }}
          </td>
          <td class="flex gap-2 px-4 py-2">
            <button
              @click="$emit('edit', user)"
              class="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              @click="$emit('delete', user)"
              class="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </td>
        </tr>

        <!-- data kosong -->
        <tr v-if="users.length === 0">
          <td colspan="7" class="px-4 py-4 italic text-center text-gray-500">
            Tidak ada data
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  users: Array,
  sortBy: String,
  sortDirection: String,
});
defineEmits(['sort', 'edit', 'delete']);
</script>
