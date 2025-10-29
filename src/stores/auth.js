import { defineStore } from 'pinia';
import api from '@/lib/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    email: '',
    cooldown: 0,
    timer: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    hasProfile: (state) => !!state.user?.profile,
    getUserName: (state) => state.user?.name || state.user?.email || 'User',
  },

  actions: {
    async login(credentials) {
      this.loading = true;

      try {
        const response = await api.post('/login', credentials);

        const { token, data } = response.data;

        this.token = token;
        this.user = data;
        localStorage.setItem('token', token);

        return response.data;
      } catch (error) {
        // Pastikan error di-throw dengan struktur yang benar
        const customError = new Error(
          error.response?.data?.message || 'Login gagal'
        );
        customError.response = error.response;

        throw customError;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      this.loading = true;
      try {
        const response = await api.post('/register', userData);
        const { token, data } = response.data;

        this.token = token;
        this.user = data;
        localStorage.setItem('token', token);

        return response.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await api.post('/logout');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
      }
    },

    async forgotPassword(email) {
      try {
        // Simpan email ke state untuk halaman verifyPin
        this.email = email;

        await api.post('/forgot-password', { email });
        this.startCooldown();
      } catch (error) {
        throw error;
      }
    },

    async sendPin(email) {
      this.email = email;
      await api.post('/forgot-password', { email });
    },

    async resendPin() {
      if (this.cooldown > 0) return;
      await this.sendPin(this.email);
      this.startCooldown();
    },

    startCooldown() {
      this.cooldown = 60;
      const interval = setInterval(() => {
        if (this.cooldown > 0) this.cooldown--;
        else clearInterval(interval);
      }, 1000);
    },

    async verifyPin(pin) {
      return api.post('/verify-pin', { email: this.email, pin });
    },

    async resetPassword({ pin, password, password_confirmation }) {
      return api.post('/reset-password', {
        email: this.email,
        pin,
        password,
        password_confirmation,
      });
    },

    async fetchUser() {
      if (!this.token) return;

      try {
        const response = await api.get('/profile');
        this.user = response.data.data;
      } catch (error) {
        console.error('Fetch user error:', error);
        if (error.response?.status === 404) {
          this.user = { ...this.user, profile: null };
        } else if (error.response?.status === 401) {
          this.logout();
        }
      }
    },

    async changePassword({
      current_password,
      new_password,
      new_password_confirmation,
    }) {
      this.loading = true;
      try {
        const response = await api.post('/change-password', {
          current_password,
          new_password,
          new_password_confirmation,
        });

        // setelah berhasil, langsung logout
        await this.logout();

        return response.data;
      } catch (error) {
        const customError = new Error(
          error.response?.data?.message || 'Gagal mengubah password'
        );
        customError.response = error.response;
        throw customError;
      } finally {
        this.loading = false;
      }
    },
  },
});
