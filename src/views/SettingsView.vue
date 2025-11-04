<template>
  <div class="flex min-h-screen">
    <SideBar />
    <div class="profile-container w-full h-screen shadow-md p-4 overflow-auto video-container" :class="{ 'LightMode': isLightMode }">
      <BackgroundVideo :epilepsyMode="epilepsyMode" :key="epilepsyMode" />
      <div class="content-overlay inner-content">
        <h2 class="Cybertitle">{{ t('message.settings') }}</h2>

        <!--SETTINGS-->
        <div class="settings container-gradient flex flex-col overflow-y-auto pt-8">
          <div class="w-full flex justify-center items-center my-2" v-for="(setting, index) in settings" :key="index">
            <label :for="'set' + index" class="Cybertext text-center">{{ t('message.' + setting.name) }}</label>
            <label :for="'set' + index" class="input-label text-center">{{ t('message.' + setting.label1) }}</label>
            <button :class="['w-16', 'h-8', 'rounded-full', 'focus:outline-none', 'transition', setting.isOn ? 'bg-blue-500' : 'bg-gray-300']"
              @click="toggle(index)">
            <span
              :class="['block', 'w-6', 'h-6', 'bg-white', 'rounded-full', 'shadow-md', 'transform', 'transition-transform', setting.isOn ? 'translate-x-8' : 'translate-x-0']"
            ></span>
            </button>
            <label :for="'set' + index" class="input-label text-center">{{ t('message.' + setting.label2) }}</label>
          </div>
        </div>

         <!--LANGUAGE-->
        <div class="settings container-gradient flex flex-col overflow-y-auto pt-8">
          <h2 class="Cybertitle">{{ t('message.language') }}</h2>
            <div class="w-full flex justify-center items-center my-2">
              <label
                v-for="lang in languages"
                :key="lang.code"
                @click="setLanguage(lang.code)"
                class="input-label "
                :class="['px-4', 'py-2', 'rounded', 'mx-2', 'transition', 'duration-300',
                currentLanguage === lang.code ? 'active-label' : 'inactive-label']"
                >
                {{ lang.name }}
              </label>
          </div>
        </div>

        
        <!--CREDITS AND GDPR -->
        <div class="settings container-gradient overflow-y-auto">
          <div class="footer-text bg-black bg-opacity-50 rounded text-center p-4 my-4">
            <p class="text-sm text-gray-200">
              &copy; {{ t('message.credits1') }}
              <br />
              <br />
              <a href="#" class='text-blue-500' @click.prevent="showTextFile">{{ t('message.credits_legal') }}</a>
              <br />
              {{ t('message.credits2') }}
              <a href="mailto:manage@trascendence.tech" class="text-blue-500 hover:underline">{{ t('message.contact') }}</a>.
              <br />
              {{ t('message.credits3') }}
            </p>
          </div>
          <button @click="delete_acc" class="button">{{ t('message.erase_acc') }}</button>
        </div>

      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="hideModal">&times;</span>
        <pre class="modal-text">{{ modalText }}</pre>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import SideBar from '@/components/SideBar';
import BackgroundVideo from '@/components/BackgroundVideo';
import axiosInstance from '@/methods/axiosService';
import { useRouter } from 'vue-router';
import {checktoken} from '../methods/api/login';

export default {
  name: 'SettingsView',
  components: {
    SideBar,
    BackgroundVideo,
  },
  setup() {
    const router = useRouter();
    const { t, locale } = useI18n();
    const isLightMode = ref(false);
    const epilepsyMode = ref(false);
    const currentLanguage = ref('en');
    const showModal = ref(false);
    const modalText = ref('');
    const GDPRFileUrl = ref('/GDPR_EN.txt');
    const isDeleteConfirmed = ref(false);

    const settings = ref([
  { name: 'mode', label1: 'dark', label2: 'light', isOn: false },
  { name: 'background', label1: 'loop', label2: 'epilepsy', isOn: false },
]);

    const languages = [
      { code: 'es', name: 'Español' },
      { code: 'en', name: 'English' },
      { code: 'eu', name: 'Euskara' },
    ];

    const loadSettingsFromCache = () => {
      const mode = localStorage.getItem('Mode') === '1';
      const epilepsy = localStorage.getItem('Epilepsy') === '1';
      const lang = localStorage.getItem('Language') || 'en';

      settings.value[0].isOn = mode;
      settings.value[1].isOn = epilepsy;
      isLightMode.value = mode;
      epilepsyMode.value = epilepsy;
      
      currentLanguage.value = lang;
      locale.value = lang;
      updateGDPRFileUrl(lang);
    };

    const updateGDPRFileUrl = (lang) => {
      if (lang === 'en') {
        GDPRFileUrl.value = '/GDPR_EN.txt';
      } else if (lang === 'es'){
        GDPRFileUrl.value = '/GDPR_ES.txt';
      } else if (lang === 'eu'){
        GDPRFileUrl.value = '/GDPR_EU.txt';
      }
    };

    const toggle = (index) => {
      settings.value[index].isOn = !settings.value[index].isOn;
      const value = settings.value[index].isOn ? '1' : '0';
      
      switch(index) {
        case 0:
          localStorage.setItem('Mode', value);
          isLightMode.value = settings.value[index].isOn;
          break;
        case 1:
          localStorage.setItem('Epilepsy', value);
          epilepsyMode.value = settings.value[index].isOn;
          break;
      }
      // Forzar recarga de la página
      window.location.reload();
    };

    const setLanguage = (lang) => {
      currentLanguage.value = lang;
      locale.value = lang;
      localStorage.setItem('Language', lang);
      updateGDPRFileUrl(lang);
    };

    const delete_acc = async () => {
      if (!isDeleteConfirmed.value) {
        isDeleteConfirmed.value = confirm(t('message.confirm_delete'));
        if (!isDeleteConfirmed.value) return;
      }
      try {
        const response = await axiosInstance.get('/delete_account');
        if (response.data.success) {
          alert(t('message.delete_ok'));
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('lastUsedToken');
          localStorage.removeItem('profilePhotoData');
          localStorage.removeItem('profilePhotoTimestamp');
          router.push('/');
        } else {
          alert(t('message.err_delete'));
        }
      } catch (error) {
        console.log('Error trying to delete Acc:', error);
        alert(t('message.err_delete'));
      }
    };

    const showTextFile = () => {
      fetch(GDPRFileUrl.value)
        .then(response => response.text())
        .then(text => {
          modalText.value = text;
          showModal.value = true;
        })
        .catch(error => {
          console.log('Error fetching the text file:', error);
          alert('There was an error fetching the file.');
        });
    };

    const hideModal = () => {
      showModal.value = false;
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
    });

    const computedIsLightMode = computed(() => isLightMode.value);
    const computedEpilepsyMode = computed(() => epilepsyMode.value);

    watch(isLightMode, (newValue) => {
      document.body.classList.toggle('LightMode', newValue);
    }, { immediate: true });

    watch(epilepsyMode, (newValue) => {
      newValue;
      //console.log('Epilepsy mode changed:', newValue);
    }, { immediate: true });

    return {
      isLightMode: computedIsLightMode,
      epilepsyMode: computedEpilepsyMode,
      settings,
      languages,
      currentLanguage,
      toggle,
      setLanguage,
      delete_acc,
      t,
      showModal,
      modalText,
      showTextFile,
      hideModal,
    };
  },
};
</script>


<style scoped>
.inner-content {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: white;
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    max-width: 1200px;
    max-height: 90vh;
    margin: auto;
    overflow: hidden;
}

.settings {
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 20px 0;
    box-sizing: border-box;
    box-shadow: 0 0 20px rgba(229, 27, 111, 0.8);
    padding: 20px;
    max-width: 100%;
    max-height: calc(100% - 40px);
    overflow-y: auto;
}

.setting-block {
    min-height: 60px; 
    margin-bottom: 10px; 
    display: flex;
    justify-content: center; 
    align-items: center;
    width: 100%;
}


.video-container {
    position: absolute;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    cursor: default;
    max-height: 100vh;
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
    user-select: none;
    height: 100%;
    width: 100%;
}

.container-gradient {
    background-color: rgba(7, 24, 43, 0.603);
    background-image: linear-gradient(92deg, #0d001d 0%, #01615494 100%);
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;
    height: 100%;
    width: 100%;
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
    margin: 20px;
}

.button:hover {
    background-color: black;
}

.button:focus {
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

.Cybertitle {
    font-family: 'krona', sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: white;
    margin-bottom: 1rem;
    text-align: center;
}

.Cybertext {
    font-family: 'krona';
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    margin-right: 0.5rem;
    color: white;
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

.active-label {
  color: #3b82f6;
  cursor: pointer;
  font-weight: bold;
  font-family: "krona";
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 150ms ease-in-out;
}

.inactive-label {
  color: #ffffff;
  cursor: pointer;
  font-family: "krona";
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 150ms ease-in-out;
}

 /* Estilos para modo claro */

.LightMode .active-label {
  color: #3b82f6 !important;
  font-weight: bold !important;
}

.LightMode .inactive-label {
  color: #1f2e49 !important;
}

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
    background-color: rgba(255, 255, 255, 0.5);
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


/*Estilos aviso legal */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8); /* Fondo semitransparente */
  z-index: 1000;
  padding:40px;
}

.modal-content {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 8px;
  max-width: 80%; /* Máximo ancho del modal */
  max-height: 80%; /* Máximo alto del modal */
  overflow-y: auto; /* Permite el desplazamiento vertical */
  position: relative; /* Permite posicionar el botón de cierre */
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #000; /* Color del botón de cierre */
  background: transparent; /* Fondo transparente */
  border: none; /* Sin borde */
  z-index: 1001; /* Asegura que el botón esté encima del contenido del modal */
  color:black;
}

.modal-text-container {
  max-width: 600px; /* Ancho fijo del contenedor de texto */
  margin: 20 auto; /* Centra el contenedor de texto horizontalmente */
  padding: 40px; /* Relleno dentro del contenedor de texto */
  box-sizing: border-box; /* Incluye el padding en el ancho total */
}

.modal-text {
  color: black;
  font-family:'Arial';
  white-space: pre-wrap; /* Mantiene los saltos de línea y espacios del texto */
  word-wrap: break-word; /* Rompe palabras largas */
  text-align: justify; /* Justifica el texto */
}





@media (max-width: 768px) {
    .settings {
        padding: 10px;
        margin: 10px 0;
        overflow-y: auto; /*  scroll vertical */
    }

    .input-label, .Cybertitle {
        font-size: 0.9rem;
        width: auto;
    }

    .setting-block {
        flex-direction: row;
        min-height: auto;
    }
    .inner-content {
        max-height: calc(100vh - 40px); 
    }

}
</style>
