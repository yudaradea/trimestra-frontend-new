import { ref, computed } from 'vue';
import api from '@/lib/axios';

export function useAllergies() {
  const allergies = ref([]);
  const selectedAllergies = ref([]);
  const loading = ref(false);

  const noAllergyItem = computed(() =>
    allergies.value.find((a) => a.name === 'Tidak Punya')
  );

  const noAllergyId = computed(() => noAllergyItem.value?.id || null);

  const isNoAllergySelected = computed(() =>
    selectedAllergies.value.includes(noAllergyId.value)
  );

  const fetchAllergies = async () => {
    loading.value = true;
    try {
      const response = await api.get('/allergy');
      allergies.value = response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching allergies:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Return true jika berhasil, false jika perlu toast error
  const handleAllergyChange = (allergyId) => {
    const isCurrentlySelected = selectedAllergies.value.includes(allergyId);

    if (allergyId === noAllergyId.value) {
      // Toggle "Tidak Punya"
      if (isCurrentlySelected) {
        // Unselect "Tidak Punya"
        selectedAllergies.value = selectedAllergies.value.filter(
          (id) => id !== allergyId
        );
      } else {
        // Select "Tidak Punya" dan clear semua yang lain
        selectedAllergies.value = [noAllergyId.value];
      }
      return true;
    } else {
      // User coba pilih alergi lain
      if (isNoAllergySelected.value) {
        // "Tidak Punya" masih terselect, return false untuk toast
        return false;
      }

      // Toggle alergi biasa
      if (isCurrentlySelected) {
        // Unselect alergi ini
        selectedAllergies.value = selectedAllergies.value.filter(
          (id) => id !== allergyId
        );
      } else {
        // Select alergi ini
        selectedAllergies.value.push(allergyId);
      }
      return true;
    }
  };

  // Helper untuk mendapatkan nama alergi berdasarkan ID
  const getAllergyNames = () => {
    return selectedAllergies.value
      .filter((id) => id !== noAllergyId.value) // Exclude "Tidak Punya"
      .map((id) => {
        const allergy = allergies.value.find((a) => a.id === id);
        return allergy?.name;
      })
      .filter(Boolean); // Remove undefined/null
  };

  return {
    allergies,
    selectedAllergies,
    loading,
    noAllergyId,
    isNoAllergySelected,
    fetchAllergies,
    handleAllergyChange,
    getAllergyNames,
  };
}
