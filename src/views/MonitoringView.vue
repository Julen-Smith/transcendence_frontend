<template>
  <div class="flex min-h-screen">
    <SideBar />

    <div class="profile-container w-full flex-grow bg-gray-900 shadow-md p-4 overflow-auto video-container" :class="{ 'LightMode': isLightMode }">
      <BackgroundVideo />
      
      <div class="content-overlay inner-content flex flex-col">
        <!-- Container for system metrics -->
        <div class="container-gradient custom-div flex-grow">
          <div class="metrics-title-container  ">
            <h2 class="cybertitle">{{ t('message.sys_metrics') }}</h2>
            <div class="hover-info">
              <p>user: read_only</p>
              <p>password: read_only</p>
              <p>Dashboard > Trascendence</p>
            </div>
            </div>
          <div class="bg-black bg-opacity-50 w-full h-full rounded-md shadow-[0_0_20px_rgba(229,27,111,0.8)]">
            <iframe :src="metricsUrl" class="w-full h-full border-none" allowfullscreen></iframe>
          </div>
        </div>

        <!-- Container for logs monitoring -->
        <div class="container-gradient custom-div flex-grow">
          <h2 class="cybertitle">{{ t('message.logs_monitor') }}</h2>
          <div class="bg-black bg-opacity-50 w-full h-full rounded-md shadow-[0_0_20px_rgba(229,27,111,0.8)]">
            <iframe :src="logsUrl" class="w-full h-full border-none" allowfullscreen></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import SideBar from '@/components/SideBar';
import BackgroundVideo from '@/components/BackgroundVideo';
import { useI18n } from 'vue-i18n'; 
import {checktoken} from '../methods/api/login';
import { useRouter } from 'vue-router'; 

export default {
  name: 'MonitoringView',
  components: {
    SideBar,
    BackgroundVideo,
  },
  setup() {
    const isLightMode = ref(false);
    const epilepsyMode = ref(false);
    const { t, locale } = useI18n();
    const metricsUrl = ref('https://trascendence.tech:3000/grafana/login');
    const logsUrl = ref('https://trascendence.tech:5601/app/home#/)');
    const router = useRouter(); 

    const loadSettingsFromCache = () => {
      isLightMode.value = localStorage.getItem('Mode') === '1';
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
      checktoken();
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
      isLightMode,
      loadSettingsFromCache,
      t,
      metricsUrl,
      logsUrl
    };
  },
};
</script>

<style scoped>
.cybertitle {
  font-family: 'krona', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  text-align: center;
}

.inner-content {
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-sizing: border-box;
}

.video-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
  z-index: 0;
}

.content-overlay {
  position: relative;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.container-gradient {
  background-color: rgba(7, 24, 43, 0.603);
  background-image: linear-gradient(92deg, #0d001d 0%, #01615494 100%);
  z-index: 1;
}

.custom-div {
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
}
.input-label {
    font-family: Avenir, Helvetica, Arial, sans-serif !important;
    width: 30%;
    display: block;
    color: #ffffff;
    font-size: 1rem;
    text-align: center; 
    margin:1rem;
}

.metrics-title-container {
  position: relative;
  top: 10px;
  left: 10px;
  z-index: 10;
}

.hover-info {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px;
  border-radius: 5px;
  color: white;
  font-size: 0.9rem;
  white-space: nowrap;
}

.metrics-title-container:hover .hover-info {
  display: block;
}

.LightMode .input-label {
    color: #1F2E49;
}

.LightMode .inner-content {
  background-color: rgba(255, 255, 255, 0.9);
}

.LightMode .cybertitle {
  color: #1F2E49;
}

.LightMode .container-gradient {
  background-image: linear-gradient(92deg, #80E0FF 0%, #C585FF 100%);
}

.LightMode .content-overlay {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
