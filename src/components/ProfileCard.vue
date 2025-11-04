<template>
  <div class="profile-style text-white p-4 sm:p-6 rounded-lg shadow-lg flex flex-col sm:flex-row items-center overflow-auto max-h-screen" :class="{ 'LightMode': isLightMode }">
    <div class="w-36 h-36 mb-4 sm:mb-0 sm:mr-4 overflow-hidden rounded-full flex-shrink-0" >
      <img 
        :src="profilePhotoUrl" 
        @error="useDefaultPhoto" 
        alt="Foto de perfil" 
        class="w-full h-full object-cover"
      >
    </div>
    <div class="text-center sm:text-left mb-4 sm:mb-0 texty">
      <h2 class="text-xl font-bold mb-2 sm:m-4">{{ username }}</h2>
      <p class="mb-1 text p-2">{{ email }}</p>
      <p>{{ t('message.score') }}: <span class="text-blue-500 font-bold p-2">{{ userScore }}</span></p> 
    </div>
    <div class="flex gap-2 justify-center sm:ml-auto p-4 sm:p-0 mt-2 sm:mt-0 w-full sm:w-auto">
      <div v-for="(imgSrc, index) in imageUrls" :key="index" class="w-20 sm:w-36 h-20 sm:h-36 overflow-hidden rounded-full">
        <img  :src="imgSrc"  alt="Medalla"  class="w-full h-full object-cover"  :title="getTooltipText(index)" :class="{ 'medal_off': !isMedalActive(index + 1) }" > 
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import axiosInstance from '../methods/axiosService';
import defaultGif from '../assets/preview.gif';
import { useI18n } from 'vue-i18n'; 
// medallas
const medal1 = require('@/assets/medals/11.png');
const medal2 = require('@/assets/medals/22.png');
const medal3 = require('@/assets/medals/33.png');

export default {
  name: 'ProfileCard',
  setup() {
    const username = ref('');
    const email = ref('');
    const bio = ref('');
    const profilePhotoUrl = ref('');
    const defaultPhotoUrl = defaultGif;
    const imageUrls = ref([medal1, medal2, medal3]);
    const medals = ref([]);
    const userScore = ref(0);
    const { t, locale } = useI18n();
    const isLightMode = ref(false);

    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.post('/user_profile');
        username.value = response.data.username;
        email.value = response.data.email;
        bio.value = response.data.bio;
        await fetchProfilePhoto(response.data.id);
        await fetchUserScore(response.data.id);
      } catch (error) {
        console.log('Error fetching user profile:', error);
        useDefaultPhoto();
      }
    };

    const fetchUserScore = async (userId) => {
      try {
        const response = await axiosInstance.get(`/user_profile/${userId}`);
        userScore.value = response.data.score;
      } catch (error) {
        console.log('Error fetching user score:', error);
      }
    };

    const fetchProfilePhoto = async (userId) => {
      const cachedPhotoData = localStorage.getItem('profilePhotoData');
      const cachedTimestamp = localStorage.getItem('profilePhotoTimestamp');
      const currentTime = new Date().getTime();

      if (cachedPhotoData && cachedTimestamp && (currentTime - parseInt(cachedTimestamp) < 3600000)) {
        profilePhotoUrl.value = cachedPhotoData;
        return;
      }

      try {
        const photoResponse = await axiosInstance.get(`/get_profile_photo/${userId}`, {
          responseType: 'arraybuffer'
        });
        const base64 = btoa(
          new Uint8Array(photoResponse.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        const url = `data:${photoResponse.headers['content-type']};base64,${base64}`;
        profilePhotoUrl.value = url;
        localStorage.setItem('profilePhotoData', url);
        localStorage.setItem('profilePhotoTimestamp', currentTime.toString());
      } catch (error) {
        console.log('Error fetching profile photo:', error);
        useDefaultPhoto();
      }
    };

    const useDefaultPhoto = () => {
      profilePhotoUrl.value = defaultPhotoUrl;
    };

    const isMedalActive = (medalNumber) => {
      const scoreRequired = medalNumber * 1000;
      return userScore.value >= scoreRequired;
    };

    const getTooltipText = (index) => {
      const text1 = t('message.title1');
      const text2 = (index + 1) * 1000;
      const text3 = t('message.title2');
      return `${text1}${text2}${text3}`;
    };
    const loadSettingsFromCache = () => {
        isLightMode.value  = localStorage.getItem('Mode') === '1';
        if (localStorage.getItem('Language') === '1') {
          locale.value = 'en'; // LANGUAGE EN
        } else {
          locale.value = 'es'; // LANGUAGE ES
        }
    };
  
    onMounted(fetchUserProfile, loadSettingsFromCache(),);

    watch(() => localStorage.getItem('authToken'), fetchUserProfile);

    return { 
      username, 
      email, 
      bio, 
      profilePhotoUrl, 
      useDefaultPhoto, 
      imageUrls, 
      userScore, 
      medals, 
      isMedalActive,
      getTooltipText, 
      t,
      isLightMode,
    };
  }
};
</script>

<style scoped>
.profile-style {
  background-image: linear-gradient(92deg, rgba(30, 3, 61, 0.7) 0%, rgba(155, 47, 92, 0.7) 100%);
}
.text{
  word-break: break-word;
}

.medal_off {
  filter: grayscale(100%);
  opacity: 0.5;
}


.LightMode .profile-style {
    background-image: linear-gradient(92deg, #80E0FF 0%, #C585FF  100%);
    box-shadow: 0 0 0 20px rgba(255, 255, 225, 0.5);
    
}

.LightMode .texty{
  color: #4A5568 !important ;
}

</style>