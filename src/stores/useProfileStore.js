// src/stores/useProfileStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/lib/axios'; // ✅ gunakan axios instance yang sudah kamu buat

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchProfile = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/profile'); // ✅ pakai instance api
      profile.value = response.data.data;
    } catch (err) {
      console.error('Gagal ambil profil:', err);
      error.value = err.response?.data?.message || 'Gagal memuat profil';
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (payload) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/ganti-profile', payload); // ✅ pakai instance api
      profile.value = response.data.data;
      return response.data;
    } catch (err) {
      console.error('Gagal update profil:', err);
      error.value = err.response?.data?.message || 'Gagal memperbarui profil';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
});
