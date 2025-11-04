<template>
  <div class="video-container">
    <video autoplay muted loop playsinline class="background-video">
      <source :src="astro" type="video/webm" />
    </video>
    <div class="content-overlay" v-if="!showOTPVerification">
      
      <div class="login-container ">
        <div class="login-form container-gradient">
          <h2 class="Cybertitle">{{ t('message.login') }}</h2>
          <form @submit.prevent="handleLogin">
            <div class="form-group ">
              <label for="username">{{ t('message.username') }}:</label>
              <input class="input" type="text" id="username" v-model="credentials.username" autocomplete="username">
              <p v-if="usernameError" class="error-message">{{ usernameError }}</p>
            </div>
            <div class="form-group flex flex-col">
              <label for="password">{{ t('message.password') }}:</label>
              <input class="input" type="password" id="password" v-model="credentials.password" autocomplete="current-password">
              <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
            </div>

            <div class="form-group flex flex-col">
            <button class="button" type="submit" :disabled="!isFormValid">{{ t('message.login') }}</button>
            </div>
          </form>

          <div class="form-group flex flex-col">
            <button class="button" @click="redirectToIntra">{{ t('message.log_intra') }}</button>
          </div>
          <div class="form-group flex flex-col ">
            <GoogleLogin class="button" :buttonText="googleButtonText"></GoogleLogin>
          </div>        
        </div>
      </div>
    </div>
  </div>

  <PopUpError v-if="popupTriggers.responseTrigger" :error-message="errorMessage" @close="popupTriggers.responseTrigger = false"></PopUpError>
  
  <OTPVerification 
    v-if="showOTPVerification" 
    :email="credentials.email"
    :username="credentials.username"
    :password="credentials.password"
    @otp-verified="handleOTPVerified"
  ></OTPVerification>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import GoogleLogin from '@/components/GoogleLogin.vue';
import OTPVerification from '@/components/OtpVerification.vue';
import PopUpError from '@/components/PopUpError.vue';
import { login, handleIntraRedirect } from '@/methods/api/login.js';
import { useI18n } from 'vue-i18n'; 

import astro from '@/assets/video/Astro.webm'

export default {
  name: 'LoginView',
  components: { GoogleLogin, OTPVerification, PopUpError },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const errorMessage = ref('');
    const popupTriggers = ref({
      responseTrigger: false,
      timmedTrigger: false
    });
    const credentials = ref({
      username: '',
      password: ''
    });
    const showOTPVerification = ref(false);
    const usernameError = ref('');
    const passwordError = ref('');
    const isLoading = ref(true);
    const { t, locale } = useI18n();
    const googleButtonText = ref('');
    

    onMounted(() => {
      setTimeout(() => {
        isLoading.value = false;
      }, 1000);
      captureErrorFromURL();
      loadSettingsFromCache();
      googleButtonText.value = t('message.log_google');
    });

    const loadSettingsFromCache = () => {
        locale.value = localStorage.getItem('Language') ||'en';
    };
    const validateUsername = (username) => {
      if (!username) {
        usernameError.value = t('message.username_req');
        return false;
      }
      usernameError.value = '';
      return true;
    };

    const validatePassword = (password) => {
      if (!password) {
        passwordError.value = t('message.pass_req');
        return false;
      }
      passwordError.value = '';
      return true;
    };

    const isFormValid = computed(() => {
      return validateUsername(credentials.value.username) &&
             validatePassword(credentials.value.password);
    });

    const handleLogin = async () => {
      try {
        const { success, error, status, data } = await login(credentials.value);
        if (!success) {
          if (status === 428) {
            showOTPVerification.value = true;
          } else {
            errorMessage.value = error;
            popupTriggers.value.responseTrigger = true;
          }
        } else {
          if (data && data.access) {
            localStorage.setItem('authToken', data.access);
          }
          router.push('/dashboard');
        }
      } catch (error) {
        console.log('Error during login:', error);
        errorMessage.value =  t('message.err_login') ;
        popupTriggers.value.responseTrigger = true;
      }
    };

    const handleOTPVerified = (result) => {
      console.log("OTP verificado con éxito", result);
      showOTPVerification.value = false;
      router.push('/dashboard');
    };

    const redirectToIntra = () => {
      handleIntraRedirect();
    };

    const captureErrorFromURL = () => {
      const fullPath = route.fullPath;
      const errorMatch = fullPath.match(/[&?]error=([^&]+)/);
      if (errorMatch) {
        const error = decodeURIComponent(errorMatch[1]);
        if (error === 'usedotherauthentication') {
          errorMessage.value = t('message.err_method');
        } else {
          errorMessage.value = t('message.err_login');
        }
        popupTriggers.value.responseTrigger = true;
        const cleanPath = fullPath.replace(/[&?]error=[^&]+/, '');
        router.replace({ path: cleanPath });
      }
    };

    return {
      astro,
      errorMessage,
      popupTriggers,
      credentials,
      isFormValid,
      showOTPVerification,
      redirectToIntra,
      handleLogin,
      handleOTPVerified,
      validatePassword,
      validateUsername,
      usernameError,
      passwordError,
      isLoading,
      t,
      googleButtonText,
    };
  }
};
</script>

<style scoped>

.video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

.content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.login-form {
  width: 30%;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem; 
  color:white;
  align-items: center; /* Centra horizontalmente */
  justify-content: center; 
}


.input {
  width: 100%; /* w-full */
  padding-left: 0.75rem; /* px-3 */
  padding-right: 0.75rem; /* px-3 */
  padding-top: 0.5rem; /* py-2 */
  padding-bottom: 0.5rem; /* py-2 */
  background-color: #091833; /* bg-gray-700 */
  box-shadow: 0 0 10px rgba(238, 42, 128, 0.5); /* Glow rosa menos intenso */
  border-radius: 0.375rem; /* rounded-md */
  color: #ffffff; /* text-white */
  placeholder-color: #9ca3af; /* placeholder-gray-400 */
  outline: none; /* focus:outline-none */
  transition: border-color 0.2s ease, box-shadow 0.2s ease; /* Para una transición suave al hacer focus */
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

.form-group {
  margin-bottom: 15px;
  align-items: center;
  justify-content: center;
  
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"], input[type="password"] {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;

}

button {
  background-color: #3b82f6;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin: auto;
  display: block;
  font-family:'krona';
}

button:hover {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: default;
}

button:disabled:hover {
  background-color: #cccccc;
}

.error-message {
  color: rgb(160, 160, 160);
  font-size: 12px;
}

.container-gradient {
    background-color: rgba(7, 24, 43, 0.603);
    background-image: linear-gradient(92deg, #0d001d 0%, #01615494 60%);
}

.button {
    flex-shrink: 0;
    background-color: #3b82f6; /* Equivalente a bg-blue-500 */
    color: white; /* Texto blanco */
    border-radius: 4px;
    font-weight: bold; /* Texto en negrita */
    font-family:"krona";
    font-size:0.80rem;
    padding: 0.5rem 1rem; /* Equivalente a py-2 px-4 */
    transition: background-color 150ms ease-in-out; /* Equivalente a transition duration-150 ease-in-out */
    outline: none; /* Equivalente a focus:outline-none */
    margin: 12px;
}

.button:hover {
    background-color: black; /* Cambia el fondo al pasar el cursor, equivalente a hover:bg-black */
}

.button:focus {
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5); /* Equivalente a focus:shadow-outline */
}

 .Cybertitle {
      font-family: 'krona';
      font-size: 1.25rem;
      font-weight: 700; 
      margin-bottom: 0.25rem;
      color: white;
      margin-bottom: 20px;
  }

@media (max-width: 640px) {
  .login-form {
    width: 90%;
    padding: 15px;
    max-height: 80vh; /* Limita la altura máxima al 80% del viewport height */
    overflow-y: auto; /* Añade scroll vertical si el contenido excede la altura máxima */
  }

  .container-gradient {
    max-height: 80vh; /* Asegura que el contenedor gradiente también respete la altura máxima */
    overflow-y: auto; /* Añade scroll vertical si el contenido excede la altura máxima */
  }

  .button {
    font-size: 0.7rem;
    padding: 0.4rem 0.8rem;
    margin: 8px 0;
  }

  .form-group {
    margin-bottom: 10px;
  }

  .Cybertitle {
    font-size: 1rem;
    margin-bottom: 15px;
  }

  /* Estilos específicos para el botón de Google */
  :deep(.gsi-material-button) {
    height: auto;
    min-height: 36px;
    padding: 8px;
    font-size: 0.7rem;
    white-space: normal;
  }

  :deep(.gsi-material-button .gsi-material-button-contents) {
    font-size: 0.7rem;
    white-space: normal;
  }

  :deep(.gsi-material-button .gsi-material-button-icon) {
    margin-right: 6px;
    height: 18px;
    min-width: 18px;
  }

  /* Asegura que el contenido del formulario no se desborde */
  .login-form > * {
    max-width: 100%;
  }
}

</style>