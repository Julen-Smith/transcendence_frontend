<template>
  <div class="video-container">
    <video autoplay muted loop playsinline class="background-video">
      <source src="../assets/video/Floating.webm" type="video/webm" />
    </video>
    
    <div class="content-overlay d-flex justify-content-center align-items-center" style="height: 100vh;">
      <div class="text-center d-flex flex-column align-items-center">
        <h1 class="title-custom-font display-1 ">Transcendence</h1>
        <div class="d-flex justify-content-center">
          <button class="btn Cybertitle" @click="redirectLogin">{{ t('message.access') }}</button>

          <button class="btn Cybertitle " @click="redirectRegister">{{ t('message.register') }}</button>
          
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { useRouter } from 'vue-router';
import { collectBrowserData, sendDataToServer } from '@/methods/metrics/metricSender.js';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n'; 

export default {
  name: 'LandingPage',
  setup() {
    const router = useRouter();
    const redirectLogin = () => { router.push('/login'); };
    const redirectRegister = () => { router.push('/register'); };
    const { t, locale } = useI18n();
    
    //console.log("LLEGO A LANDING ");

    const loadSettingsFromCache = () => {
        locale.value = localStorage.getItem('Language') || 'en';
    };

    onMounted(async () => {

      try {
        const data = collectBrowserData();
        console.log(data);
        await sendDataToServer(data);
      } catch (error) {
        console.log('Error enviando datos al servidor:', error);
      }
      loadSettingsFromCache();
    });

    return { redirectLogin, redirectRegister, t, loadSettingsFromCache,};
  }
}
</script>


<style scoped>
@font-face {
  font-family: 'Squid';
  src: url('~@/assets/Fonts/Game Of Squids.ttf');
}

@font-face {
  font-family: 'buttonFont';
  src: url('~@/assets/Fonts/buttonfont.otf') format('opentype');
}

@font-face {
  font-family: 'krona';
  src: url('~@/assets/Fonts/KronaOne-Regular.ttf');
}

.title-custom-font {
  cursor: default;
  font-family: 'Squid', sans-serif;
  color: white;
  text-shadow: 0 0 5px #fff;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
  margin-bottom: 12px;
  user-select: none; 
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
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translateX(-50%) translateY(-50%);
  object-fit: cover;
  z-index: 0;
}

.content-overlay {
  position: relative;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);
  user-select: none; /* Previene la selección de texto */
}

.btn {
  z-index: 2;
  transition: all 0.3s ease-in-out;
  margin: 12px;
  width: 150px;
  height: 52px;
  border-radius: 50px;
  background-image: linear-gradient(135deg, #1e033d 0%, #9b2f5c 100%);
  box-shadow: 0 20px 30px -6px rgba(247, 245, 245, 0.5);
  outline: none;
  cursor: pointer;
  border: none;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.767);
  box-shadow: 
    inset 0 0 20px rgba(0, 0, 0, 0.7), 
    0 20px 30px -6px rgba(247, 245, 245, 0.5);
  text-shadow: 
    1px 1px 3px rgba(0, 0, 0, 0.7), 
    -1px -1px 2px rgba(0, 0, 0, 0.7);
}

.btn:hover {
  transform: translateY(3px);
  box-shadow: none;
  color: rgba(250, 250, 250, 0.623);
}

.btn:active {
  opacity: 0.5;
}


body, 
.video-container, 
.content-overlay, 
.text-center {
  user-select: none;
  cursor: default;
}


.btn {
  cursor: pointer;
}

 .Cybertitle {
      font-family:'krona';
      font-size: 1rem;
      margin-bottom: 0.25rem; 
      line-height: 1;
      text-shadow: 0 0 3px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.6), 0 0 15px rgba(255, 255, 255, 0.4);
  }

</style>


  