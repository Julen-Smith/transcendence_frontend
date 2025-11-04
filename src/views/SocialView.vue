<template>
  <div class="dashboard-layout" :class="{ 'LightMode': isLightMode }">
    <SideBar/>
    <div class="main-content flex-grow flex flex-col overflow-hidden video-container" >
      <BackgroundVideo  />
    <div class="content-overlay social-view flex flex-col h-full max-h-screen overflow-hidden" :class="{ 'LightMode': isLightMode }">
      <div class="flex flex-col content-overlay social-view container-gradient" >
        <h2 class="Cybertitle">{{ t('message.friends') }}</h2>
        <div class="friends-list">
          <div v-for="friend in friends" :key="friend.id" class="friend-item rounded">
            <span @click="showProfile(friend.id)">{{ friend.username }}</span> 
          </div>
        </div>
      </div>
       
       <!-- Perfil del Usuario -->
    <div class="flex flex-col content-overlay social-view container-gradient shadow-[0_0_20px_rgba(229,27,111,0.8)] profile-container" v-if="selectedUser && isProfileReady">

        <div class="flex justify-end">
          <button class="close-button" @click="clearSelectedUser">
            <i class="lni lni-close text-xl font-bold"></i>
          </button>
        </div>
      
  
        <div class="flex flex-col md:flex-row items-center justify-center w-full">
          <div class="w-full md:w-1/3 mb-4 md:mb-0 flex justify-center">
            <div class="w-32 h-32 md:w-44 md:h-44 overflow-hidden rounded-full">
              <img 
                :src="selectedUserPhotoUrl || defaultPhotoUrl" 
                alt="Avatar" 
                class="w-full h-full object-cover"
              >
            </div>
          </div>

          <div class="w-full md:w-2/3 flex flex-col md:flex-row items-center md:items-start">

            <div class="user-profile flex flex-col space-y-4 md:space-y-6 md:mr-4">
              <h2 class="Cybertext">{{ selectedUser.username }}</h2>
              <p>{{ t('message.email') }}: {{ selectedUser.email }}</p>
              <p>{{ t('message.score') }}: <span class="text-blue-500 font-bold">{{ selectedUser.score }}</span></p>
              
              <!-- Medallas -->
              <div class="flex gap-2 justify-center mt-2">
                <div v-for="(imgSrc, index) in imageUrls" :key="index" class="w-12 h-12 overflow-hidden rounded-full">
                  <img :src="imgSrc" alt="Medalla" class="w-full h-full object-cover" :class="{ 'medal_off': !isMedalActive(index + 1) }">
                </div>
              </div>
            </div>

            <div class="gamehistory-container flex-shrink-0 w-full md:w-1/3 ml-0 md:ml-4 mt-2 md:mt-0">
              <div class="gamehistory">
                <div v-if="gameHistoryError" class="error-message">
                  {{ gameHistoryError }}
                </div>
                <div v-else-if="gameHistory.length === 0">
                  {{ t('message.no_history') }}
                </div>
                <ul v-else>
                  <li v-for="game in gameHistory" :key="game.date_played" class="mb-2">
                    {{ game.opponent }} - {{ game.result }} ({{ game.user_score }}-{{ game.opponent_score }})
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        <div class="button-container flex justify-center mt-1">
          <button class="button" @click="addFriend" v-if="!isFriend">{{ t('message.add_friend') }}</button>
          <button class="button" @click="removeFriend" v-else>{{ t('message.rm_friend') }}</button>
        </div>

    </div>
      
      
      <!-- Buscar -->
      <div class="flex flex-col content-overlay social-view container-gradient" v-if="!selectedUser">
        <h2 class="Cybertitle">{{ t('message.search') }}</h2>
        <div class="search-container mb-4">
          <input 
            v-model="searchQuery" 
            @input="debounceSearch"
            :placeholder="placeholderText"
            class="search-input input"
          />
        </div>
        <div class="content-container">
          <div class="search-results" v-if="searchResults.length > 0">
            <h3 class="Cybertext m-3">{{ t('message.search_res') }}</h3>
            <div class="search-results-scroll">
              <div 
                v-for="user in searchResults" 
                :key="user.id" 
                @click="showProfile(user.id)"
                class="search-result-item"
              >
                {{ user.username }}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import axiosInstance from '@/methods/axiosService';
import SideBar from '@/components/SideBar.vue'
import BackgroundVideo from '@/components/BackgroundVideo';
import defaultGif from '../assets/preview.gif';
import { useI18n } from 'vue-i18n'; 
import { useRouter } from 'vue-router'; 

// medallas
const medal1 = require('@/assets/medals/11.png');
const medal2 = require('@/assets/medals/22.png');
const medal3 = require('@/assets/medals/33.png');

export default {
  name: 'SocialView',
  components: {
    SideBar,
    BackgroundVideo,
  },
  
  setup() {
    const searchQuery = ref('');
    const searchResults = ref([]);
    const selectedUser = ref(null);
    const friends = ref([]);
    const isFriend = ref(false);
    let debounceTimer;
    const selectedUserPhotoUrl = ref('');
    const defaultPhotoUrl = defaultGif;
    const isProfileReady = ref(false);
    const gameHistory = ref([]); 
    const imageUrls = ref([medal1, medal2, medal3]);
    const isLightMode = ref(false);
    const epilepsyMode = ref(false);
    const { t, locale } = useI18n();
    const placeholderText = ref(t('message.search_user'));
    const gameHistoryError = ref(null);
    const router = useRouter(); 

    const debounceSearch = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchUsers();
      }, 300);
    };

    const searchUsers = async () => {
      if (searchQuery.value.length < 3) {
        searchResults.value = [];
        return;
      }
      try {
        const response = await axiosInstance.get(`/search_users?query=${searchQuery.value}`);
        searchResults.value = response.data.users;
      } catch (error) {
        console.log('Error searching users:', error);
      }
    };

    const showProfile = async (friendId) => {
      try {
        const response = await axiosInstance.get(`/user_profile/${friendId}`);
        selectedUser.value = response.data;
        checkFriendStatus(friendId);
        if (selectedUser.value && selectedUser.value.avatar) {
          selectedUserPhotoUrl.value = await fetchUserProfilePhoto(friendId);
          gameHistory.value = await getGameHistory(friendId);
        } else {
          selectedUserPhotoUrl.value = defaultPhotoUrl;
        }
        await fetchUserScore(friendId);
      } catch (error) {
        console.log('Error fetching user profile:', error);
        selectedUserPhotoUrl.value = defaultPhotoUrl;
      }
    };

    const fetchUserProfilePhoto = async (friendId) => {
      try {
        const photoResponse = await axiosInstance.get(`get_profile_photo/${friendId}`, {
          responseType: 'arraybuffer'
        });
        const blob = new Blob([photoResponse.data], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        return url;
      } catch (error) {
        console.log('Error fetching profile photo for friendId:', friendId, error);
        return null;
      }
    };

    const getGameHistory = async (friendId) => {
      try {
        const response = await axiosInstance.get(`/get_game_history/${friendId}`);
        if (response.data && Array.isArray(response.data.game_history)) {
          return response.data.game_history;
        } else {
          return [];
        }
      } catch (error) {
        console.log('Error fetching game history:', error);
        return []; // Devuelve un array vacío en caso de error
      }
    };

    const fetchUserScore = async (friendId) => {
      try {
        const response = await axiosInstance.get(`/user_profile/${friendId}`);
        selectedUser.value.score = response.data.score;
      } catch (error) {
        console.log('Error fetching user score:', error);
      }
    };

    const isMedalActive = (medalNumber) => {
      const scoreRequired = medalNumber * 1000;
      return selectedUser.value && selectedUser.value.score >= scoreRequired;
    };

    const checkFriendStatus = (userId) => {
      isFriend.value = friends.value.some(friend => friend.id === userId);
    };

    const getFriends = async () => {
      try {
        const response = await axiosInstance.post('/get_friends');
        friends.value = response.data.friends;
      } catch (error) {
        console.log('Error fetching friends:', error);
        if (error.response) {
          console.log('Error response:', error.response.data);
          console.log('Error status:', error.response.status);
        }
      }
    };

    const addFriend = async () => {
      try {
        const response = await axiosInstance.post('/add_friend_request', { friendId: selectedUser.value.id });
        if (response.data.success) {
          alert(t('message.friend_req_ok'));
        //} else {
        //  alert(t('message.err_friend_req'));
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          alert(t('message.err_req_repeat'));
        } else {
          console.log('Error sending friend request:', error);
          alert(t('message.err_friend_req'));
        }
        
      }
    };

    const removeFriend = async () => {
      try {
        await axiosInstance.post('/remove_friend', { friendId: selectedUser.value.id });
        isFriend.value = false;
        getFriends();
      } catch (error) {
        console.log('Error removing friend:', error);
      }
    };

    const clearSelectedUser = () => {
      selectedUser.value = null;
      selectedUserPhotoUrl.value = '';
      isProfileReady.value = false;
    };

    const preloadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    };

    const loadUserProfile = async (user) => {
      isProfileReady.value = false;
      if (user && user.avatar) {
        await preloadImage(await fetchUserProfilePhoto(user.id));
      } else {
        await preloadImage(defaultPhotoUrl);
      }
      isProfileReady.value = true;
    };

    watch(selectedUser, async (newUser) => {
      if (newUser) {
        await loadUserProfile(newUser);
      }
    });

    const loadSettingsFromCache = () => {
        isLightMode.value  = localStorage.getItem('Mode') === '1';
        epilepsyMode.value = localStorage.getItem('Epilepsy') === '1';
        locale.value = localStorage.getItem('Language')|| 'en';
    };
       const checkTokenPreVideo = () => {
            const token = localStorage.getItem('authToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (!token || !refreshToken) {
                console.log('No hay tokens disponibles, redirigiendo...');
                return 1;
            }else {
                return 0;
            }
    };
    
    onMounted(() => {
      getFriends();
      loadSettingsFromCache();

      const check = checkTokenPreVideo();// Verifica nuevamente si los tokens están presentes
      //console.log("CHECK = ", check)
      if (check === 1)
      {
          router.push('/login'); 
          return;
      }

      const video = document.querySelector('.background-video');
      if (video) {
        if (epilepsyMode.value) {
          video.pause();
        } else {
          video.play();
        }
      }
    });

    return {
      searchQuery,
      searchResults,
      selectedUser,
      friends,
      isFriend,
      debounceSearch,
      showProfile,
      addFriend,
      removeFriend,
      clearSelectedUser,
      selectedUserPhotoUrl,
      defaultPhotoUrl,
      fetchUserProfilePhoto,
      isProfileReady,
      getGameHistory,
      gameHistory,
      imageUrls,
      isMedalActive,
      isLightMode,
      t,
      placeholderText,
      gameHistoryError,
    };
  }
};
</script>

<style scoped>
.input {
  width: 100%;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background-color: #091833;
  border-radius: 0.375rem;
  color: #ffffff;
  placeholder-color: #9ca3af;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 0 10px rgba(238, 42, 128, 0.5);
}

.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.social-view {
  max-width: 1200px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  margin: 20px auto;
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}

.content-container {
  display: flex;
  gap: 20px;
}

.search-results, .user-profile, .friends-list {
  flex: 1;
  padding: 20px;
  border-radius: 5px;
}

.search-result-item, .friend-item {
  padding: 10px;
  cursor: pointer;
}

.search-result-item:hover, .friend-item:hover {
  color: rgba(238, 42, 128, 0.5);
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.button {
  flex-shrink: 0;
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  font-family: "krona";
  font-size: 0.80rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 150ms ease-in-out;
  outline: none;
  width: auto;
  max-width: 200px;
}

.button:hover {
  background-color: black;
}

.button:focus {
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

.video-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  cursor: default;
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 0;
}

.content-overlay {
  position: relative;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);
  user-select: none;
}


.container-gradient {
  background-color: rgba(7, 24, 43, 0.603);
  background-image: linear-gradient(92deg, #0d001d 0%, #01615494 100%);
  color: white;
  overflow-y: auto;
  max-height: 80vh;
}

.Cybertitle {
  font-family: 'krona';
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  color: white;
}

.Cybertext {
  font-family: 'krona';
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.8rem;
  color: white;
}

.search-results {
  max-height: 300px;
  overflow: hidden;
}

.search-results-scroll {
  max-height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
}

.search-results-scroll::-webkit-scrollbar {
  width: 6px;
}

.search-results-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.search-results-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

.search-results-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.profile-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-height: 80vh;
  overflow-y: auto;
  padding: 0.5rem;
}

.user-profile {
  width: 100%;
  max-width: 400px;
}

.gamehistory {
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  padding: 0.5rem;
  border-radius: 0.375rem;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  background-color: rgba(0, 0, 0, 0.5);
}

.gamehistory ul {
  padding: 0;
  margin: 0;
  list-style-type: none;
}

.gamehistory li {
  margin-bottom: 0.5rem;
}

.medal_off {
  filter: grayscale(100%);
  opacity: 0.5;
}

 /* Estilos para modo claro */
.LightMode .inner-content {
    background-color: rgba(255, 255, 255, 0.9);
}

.LightMode .settings {
    background-color: rgba(240, 240, 240, 0.8);
    background-image: linear-gradient(92deg, #f0f0f0 0%, #e0e0e0 100%);
}

.LightMode .Cybertitle, 
.LightMode .Cybertext, 
.LightMode .input-label {
    color: #1F2E49;
}
.LightMode .container-gradient {
    background-image: linear-gradient(92deg, #80E0FF 0%, #C585FF  100%);
}

.LightMode .content-overlay {
  background-color: rgba(255, 255, 255, 0.5) !important;
}

.LightMode .footer-text {
    background-color: rgba(255, 255, 255, 0.8);
}

.LightMode .footer-text p {
    color: #091833;
}

.LightMode .button {
    background-color: #2563eb;
    color: white;
}

.LightMode .button:hover {
    background-color: #1d4ed8;
}

.LightMode .input{
  background-color: white;
  color:#1F2E49;
}


/* Media queries */

@media (min-width: 768px) {
  .profile-container {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .social-view {
    padding: 5px;
    margin: 5px auto;
  }

  .container-gradient {
    max-height: 70vh;
  }

  .button {
    font-size: 0.7rem;
    padding: 0.4rem 0.8rem;
  }

  .Cybertitle {
    font-size: 1rem;
  }

  .Cybertext {
    font-size: 0.9rem;
  }

  .profile-container {
    padding: 1rem;
  }
  .user-profile {
    max-width: 100%;
  }

  .gamehistory {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 10px;
  }

  .social-view {
    margin: 5px auto;
  }

  .container-gradient {
    max-height: 60vh;
  }

  .button {
    font-size: 0.6rem;
    padding: 0.3rem 0.6rem;
  }

  .profile-container {
    max-height: 80vh;
    overflow-y: auto;
    padding: 1rem;
  }

  .profile-container .w-32,
  .profile-container .h-32,
  .profile-container .md\:w-44,
  .profile-container .md\:h-44 {
    width: 80px;
    height: 80px;
  }

  .profile-container .flex.flex-col.md\:flex-row {
    flex-direction: column;
  }

  .profile-container .w-full.md\:w-1\/3,
  .profile-container .w-full.md\:w-2\/3 {
    width: 100%;
  }

  .profile-container .items-center.md\:items-start {
    align-items: center;
  }

  .profile-container .text-center.md\:text-left {
    text-align: center;
  }
    .user-profile h2 {
    font-size: 1rem;
  }

  .user-profile p {
    font-size: 0.9rem;
  }
}
</style>