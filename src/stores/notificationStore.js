// stores/notificationStore.js
import { defineStore } from 'pinia';
import axios from '@/lib/axios';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    unreadCount: 0,
  }),
  actions: {
    async fetchUnreadCount() {
      try {
        const { data } = await axios.get('/notifications/unread');
        this.unreadCount = data.length;
      } catch (error) {
        console.error('Gagal ambil notifikasi unread:', error);
      }
    },
    decrementUnread() {
      if (this.unreadCount > 0) this.unreadCount--;
    },
    resetUnread() {
      this.unreadCount = 0;
    },
  },
});
