<template>
  <div class="notification-wrapper">
    <button @click="toggleNotifications" class="notification-bell" :class="{ 'has-notifications': unreadCount > 0 }">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      <span v-if="unreadCount" class="unread-count">{{ unreadCount }}</span>
    </button>
    <transition name="fade">
      <div v-if="showNotifications" class="notification-box">
        <h3 class="notification-title">{{ t('message.notifications') }}</h3>
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>{{ t('message.load_noti') }}</p>
        </div>
        <ul v-else-if="notifications.length" class="notification-list">
          <li v-for="notification in notifications" :key="notification.id" class="notification-item">
            <p class="notification-message">{{ getNotificationMessage(notification) }}</p>
            <div class="notification-actions">
              <button @click="acceptFriendRequest(notification)" class="btn btn-accept">{{ t('message.acc_noti') }}</button>
              <button @click="rejectFriendRequest(notification)" class="btn btn-reject">{{ t('message.rej_noti') }}</button>
            </div>
          </li>
        </ul>
        <p v-else class="no-notifications">{{ t('message.no_noti') }}</p>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axiosInstance from '@/methods/axiosService';
import { useI18n } from 'vue-i18n'; 

export default {
  setup() {
    const showNotifications = ref(false);
    const notifications = ref([]);
    const unreadCount = ref(0);
    const loading = ref(false);
    const { t, locale } = useI18n();

    const loadSettingsFromCache = () => {
        if (localStorage.getItem('Language') === '1') {
          locale.value = 'en'; // LANGUAGE EN
        } else {
          locale.value = 'es'; // LANGUAGE ES
        }
    };

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      if (showNotifications.value) {
        fetchNotifications();
      }
    };

    const getNotificationMessage = (notification) => {
      return `${notification.sender_username} te ha enviado una solicitud de amistad.`;
    };

    const fetchNotifications = async () => {
      loading.value = true;
      try {
        //console.log('Fetching notifications...');
        const response = await axiosInstance.get('/get_notifications');
        //console.log('Raw response:', response);

        if (response.data && response.data.success && Array.isArray(response.data.pending_requests)) {
          //console.log('Notifications received:', response.data.pending_requests);
          notifications.value = response.data.pending_requests;
          unreadCount.value = notifications.value.length;
        } else {
          //console.log('Unexpected response format:', response.data);
          notifications.value = [];
          unreadCount.value = 0;
        }
      } catch (error) {
        console.log('Error fetching notifications:', error);
        if (error.response) {
          console.log('Error response:', error.response.data);
          console.log('Error status:', error.response.status);
        }
        notifications.value = [];
        unreadCount.value = 0;
      } finally {
        loading.value = false;
        //console.log('Final notifications state:', notifications.value);
        //console.log('Final unreadCount state:', unreadCount.value);
      }
    };

    const acceptFriendRequest = async (notification) => {
      try {
        //console.log('Accepting friend request for:', notification);
        const friendId = notification.sender_id;
        //console.log('Friend ID:', friendId);

        if (!friendId) {
          //console.log('Friend ID is missing from the notification');
          return;
        }

        const url = '/add_friend';
        //console.log(`Sending request to ${url}`);

        const response = await axiosInstance.post(url, {
          friendId: friendId
        });
        
       // console.log('Response from add_friend:', response);

        if (response.data && response.data.success) {
         // console.log('Friend request accepted successfully');
          await removeFriendRequest(notification);
        } else {
          console.log('Unexpected response when accepting friend request:', response.data);
        }
      } catch (error) {
        //console.log('Error accepting friend request:', error);
        if (error.response) {
          console.log('Error response:', error.response.data);
          console.log('Error status:', error.response.status);
        }
      }
    };

    const rejectFriendRequest = async (notification) => {
      try {
        await deleteFriendRequest(notification);
        await removeFriendRequest(notification);
      } catch (error) {
        console.log('Error rejecting friend request:', error);
      }
    };

    const removeFriendRequest = async (notification) => {
      notifications.value = notifications.value.filter(n => n.id !== notification.id);
      unreadCount.value = notifications.value.length;
      if (notifications.value.length === 0) {
        showNotifications.value = false;
      }
    };

    const deleteFriendRequest = async (notification) => {
      try {
        await axiosInstance.post('/delete_friend_request', {
          friendId: notification.sender_id
        });
        console.log('Friend request deleted successfully');
      } catch (error) {
        console.log('Error deleting friend request:', error);
      }
    };

    onMounted(() => {
      fetchNotifications();
      loadSettingsFromCache();
    });

    return {
      showNotifications,
      notifications,
      unreadCount,
      loading,
      toggleNotifications,
      getNotificationMessage,
      acceptFriendRequest,
      rejectFriendRequest,
      t,
    };
  }
}
</script>

<style scoped>
.notification-wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.notification-bell {
  background: white;
  border: none;
  box-shadow: 0 0 20px rgba(229, 27, 111, 2);
  cursor: pointer;
  position: relative;
  padding: 10px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.notification-bell:hover {
  background-color: black;
  color:white;
}

.notification-bell.has-notifications svg {
  color: #3498db;
}

.unread-count {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
}

.notification-box {
  position: absolute;
  bottom: 50px;
  right: 0;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.5) ;
  color:white;
  border-radius: 8px;
  padding: 16px;
   box-shadow: 0 0 20px rgba(229, 27, 111, 2);
}

.notification-title {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.notification-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.notification-item {
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-message {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #34495e;
}

.notification-actions {
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-accept {
  background-color: #2ecc71;
  color: white;
  margin-right: 8px;
}

.btn-accept:hover {
  background-color: #27ae60;
}

.btn-reject {
  background-color: #e74c3c;
  color: white;
}

.btn-reject:hover {
  background-color: #c0392b;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.no-notifications {
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>