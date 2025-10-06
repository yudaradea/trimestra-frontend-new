import { ref } from 'vue';
import api from '@/lib/axios';

export function useLocation() {
  const provinces = ref([]);
  const regencies = ref([]);
  const districts = ref([]);
  const villages = ref([]);
  const loading = ref(false);

  const fetchProvinces = async () => {
    loading.value = true;
    try {
      const response = await api.get('/provinces');
      provinces.value = response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const fetchRegencies = async (provinceId) => {
    if (!provinceId) {
      regencies.value = [];
      return;
    }
    loading.value = true;
    try {
      const response = await api.get(`/regencies?province_id=${provinceId}`);
      regencies.value = response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching regencies:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const fetchDistricts = async (regencyId) => {
    if (!regencyId) {
      districts.value = [];
      return;
    }
    loading.value = true;
    try {
      const response = await api.get(`/districts?regency_id=${regencyId}`);
      districts.value = response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const fetchVillages = async (districtId) => {
    if (!districtId) {
      villages.value = [];
      return;
    }
    loading.value = true;
    try {
      const response = await api.get(`/villages?district_id=${districtId}`);
      villages.value = response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching villages:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    provinces,
    regencies,
    districts,
    villages,
    loading,
    fetchProvinces,
    fetchRegencies,
    fetchDistricts,
    fetchVillages,
  };
}
