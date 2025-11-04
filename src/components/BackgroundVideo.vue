<template>
  <video ref="videoElement" autoplay muted loop playsinline class="background-video">
    <source src="../assets/video/pinkVynil.webm" type="video/webm" />
    Your browser does not support the video tag.
  </video>
</template>

<script>
import { onMounted, ref } from 'vue';

export default {
  name: 'BackgroundVideo',
  setup() {
  
    const isVisible = ref(true); // Indica si la ventana está en primer plano
    const userActive = ref(true); // Indica si el usuario está activo
    const inactivityTimeout = 60000; // 1 minuto de inactividad
    const shouldPlay = ref(false);

    const handlePlayError = (error) => {
      if (error.name === 'AbortError' || error.message.includes('removed from the document')) {
        console.log('Video playback aborted, likely due to navigation');
      } else {
        console.log('Error al intentar reproducir o pausar el video:', error);
      }
    };

    const loadSettingsFromCache = async () => {

    const epilepsyMode = localStorage.getItem('Epilepsy') === '1';
    const video = document.querySelector('.background-video');
      
      if (video) {
        try {
          // Cargar el video antes de cualquier acción
          const playPromise = video.load();
          if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.catch(handlePlayError);
            }  

          if (epilepsyMode) {
            const pausePromise = video.pause();  // Pausar el video si epilepsyMode está activado
            if (pausePromise && typeof pausePromise.catch === 'function') {
              pausePromise.catch(handlePlayError);
            }
            //console.log('Video pausado debido al modo de epilepsia');
          } else {
            const playPromise = video.play();  // Reproducir el video si epilepsyMode no está activado
            if (playPromise && typeof playPromise.catch === 'function') {
              playPromise.catch(handlePlayError);
            }
            //console.log('Video reproducido correctamente');
          }
        } catch (error) {
          handlePlayError(error);
        }
      }
    };

  const handleVisibilityChange = () => {
    const video = document.querySelector('.background-video');
    const epilepsyMode = localStorage.getItem('Epilepsy') === '1';
  if (video) {
    try {
      if (isVisible.value && shouldPlay.value && !epilepsyMode) {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise
            .catch((error) => {
              if (error.message.includes('removed from the document')) {
                console.log('El video ha sido removido del documento:', error);
              } else {
                handlePlayError(error);
              }
            });
        }
      } else {
        const pausePromise = video.pause();
        //console.log('AHORRO: video en pausa')
        if (pausePromise && typeof pausePromise.catch === 'function') {
          pausePromise
            .catch(handlePlayError);
        }
      }
    } catch (error) {
      handlePlayError(error);
    }
  } else {
    console.log('El video no está disponible en el DOM.');
  }
};

const handleUserActivity = () => {
  const video = document.querySelector('.background-video');
  const epilepsyMode = localStorage.getItem('Epilepsy') === '1';
  try {
    userActive.value = true;
    shouldPlay.value = true;
    if (video && !epilepsyMode) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise
          //.then(() => console.log('Actividad del usuario: video en reproducción'))
          .catch((error) => {
            if (error.message.includes('removed from the document')) {
              console.log('El video ha sido removido del documento:', error);
            } else {
              handlePlayError(error);
            }
          });
      }
    }
  } catch (error) {
    handlePlayError(error);
  }
};

    const handleInactivity = () => {
      try {
        shouldPlay.value = userActive.value;
        userActive.value = false;
      } catch (error) {
        handlePlayError(error);
      }
    };

    onMounted(async () => {

      await loadSettingsFromCache();
      

      // Detecta el foco y pérdida de foco de la ventana
      window.addEventListener('focus', () => {
        isVisible.value = true;
        handleVisibilityChange();
      });
      window.addEventListener('blur', () => {
        isVisible.value = false;
        handleVisibilityChange();
      });

      // Detecta la actividad del usuario
      document.addEventListener('mousemove', handleUserActivity);
      document.addEventListener('keydown', handleUserActivity);

      // Manejo de inactividad
      setInterval(handleInactivity, inactivityTimeout);
    });

    return {
      videoElement: ref(null),
    };
  },
};
</script>

<style scoped>
.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 0;
}
</style>
