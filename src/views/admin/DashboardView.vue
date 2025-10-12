<template>
  <Layout title="Dashboard">
    <div v-if="loading" class="flex items-center justify-center min-h-[70vh]">
      <div class="text-4xl animate-spin">⏳</div>
    </div>
    <div v-else>
      <div class="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Pengguna"
          :value="userCount"
          icon="ri-user-line"
        />
        <StatCard
          title="Total Makanan"
          :value="totalFood"
          icon="ri-restaurant-line"
        />
        <StatCard
          title="Total Latihan"
          :value="totalExercise"
          icon="ri-run-line"
        />
      </div>

      <div class="p-4 bg-white rounded shadow">
        <h2 class="mb-4 text-lg font-semibold">Pengguna Terbaru</h2>
        <UserTable :users="recentUsers" />
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/lib/axios';
import StatCard from '@/components/admin/StatCard.vue';
import UserTable from '@/components/admin/UserTable.vue';
import Layout from '@/components/admin/Layout.vue';

const userCount = ref(0);
const totalFood = ref(0);
const totalExercise = ref(0);
const notifCount = ref(0);
const recentUsers = ref([]);
const loading = ref(true);

const fetchUsers = async () => {
  try {
    const response = await axios.get('/user?limit=10');
    recentUsers.value = response.data.data;
    userCount.value = response.data.data.length;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const fetchFood = async () => {
  try {
    const response = await axios.get('/food');
    totalFood.value = response.data.data.length;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const fetchExercise = async () => {
  try {
    const response = await axios.get('/exercise');
    totalExercise.value = response.data.data.length;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([fetchUsers(), fetchFood(), fetchExercise()]);
  } finally {
    loading.value = false;
  }
});
</script>
