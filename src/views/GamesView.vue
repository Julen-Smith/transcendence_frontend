<template>
  <div class="flex min-h-screen" :class="{ 'LightMode': isLightMode }">
    <SideBar />
    <div class="main-content flex-grow overflow-hidden video-container">
      <BackgroundVideo  />
      <transition name="fade">
        <div v-if="!showGame" class="w-full h-screen bg-gray-900 shadow-md p-4 overflow-auto">
          <div class="inner-content w-full h-full bg-white rounded-lg p-4">
            <div class="grid-container">
              <div v-for="(game, index) in games" :key="index" 
                   class="box rounded-lg" 
                   :class="[game.bgColor, index === 0 ? 'full-width' : '']" 
                   @click="startGame(game)">
                <img :src="game.image" class="game-image" :alt="game.name" />
              </div>
            </div>
          </div>
        </div>
        <div v-else class="w-full h-screen bg-gray-900 shadow-md p-4 overflow-auto ">
          <div class="game-content w-full h-full rounded-lg p-4 relative">
            <component :is="currentGame.component" v-if="currentGame.component === 'PongContainer'" @exit="closeGame"/>
            <EmulatedGameContainer v-else :gameUrl="currentGame.url" />
            <button @click="closeGame" class="absolute top-1 left-2 px-3 py-2 bg-blue-500 text-white rounded mb-4">
              Atrás
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import SideBar from '@/components/SideBar.vue';
import BackgroundVideo from '@/components/BackgroundVideo';
import PongContainer from '@/components/PongContainer.vue';
import {checktoken} from '../methods/api/login';
import EmulatedGameContainer from '@/components/EmulatedGameContainer.vue';
import { useRouter } from 'vue-router'; 

export default {
  name: 'GamesView',
  components: {
    SideBar,
    PongContainer,
    EmulatedGameContainer,
    BackgroundVideo,
  },
  setup() {
    const isLightMode = ref(false);
    const epilepsyMode = ref(false);
    const router = useRouter(); 


    const loadSettingsFromCache = () => {
        isLightMode.value  = localStorage.getItem('Mode') === '1';
        epilepsyMode.value = localStorage.getItem('Epilepsy') === '1';
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

    };
  },
  data() {
    return {
      showGame: false,
      currentGame: null,
      games: [
        { name: 'Pong', image: require('@/assets/images/pong.jpg'), bgColor: 'bg-blue-200', component: 'PongContainer' },
        { name: 'Gameboy', image: require('@/assets/images/onepiece.png'), bgColor: 'bg-black-500', url: 'https://trascendence.tech/gba/player/#onepiece' },
        { name: 'Pokemon Fire Red', image: require('@/assets/images/pokemonred.png'), bgColor: 'bg-red-200', url: 'https://trascendence.tech/gba/player/#pokemonred'},
        { name: 'Game 4', image: require('@/assets/images/fireemblem.png'), bgColor: 'bg-yellow-200', url: 'https://trascendence.tech/gba/player/#fire_emblem'},
        { name: 'Game 5', image: require('@/assets/images/goldensun.png'), bgColor: 'bg-purple-200', url: 'https://trascendence.tech/gba/player/#goldensun' },
        { name: 'Game 6', image: require('@/assets/images/pokemonemerald.png'), bgColor: 'bg-pink-200', url: 'https://trascendence.tech/gba/player/#pokemonemerald' },
        { name: 'Game 7', image: require('@/assets/images/metalslug.png'), bgColor: 'bg-indigo-200', url: 'https://trascendence.tech/gba/player/#metalslug' },
        { name: 'Game 8', image: require('@/assets/images/sonic.png'), bgColor: 'bg-teal-200', url: 'https://trascendence.tech/gba/player/#sonic_advance' },
        { name: 'Game 9', image: require('@/assets/images/supermario.png'), bgColor: 'bg-orange-200', url: 'https://trascendence.tech/gba/player/#supermarioadvance' },
      ]
    }
  },
  methods: {
    startGame(game) {
      this.currentGame = game;
      this.showGame = true;
    },
    closeGame() {
      this.showGame = false;
      this.currentGame = null;
    }
  }
}
</script>

<style scoped>

.inner-content {
  height: calc(100vh - 2rem); 
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  gap: 1rem;
  height: 100%;
}

.box {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 
        0 0 20px rgba(229, 27, 111, 0.8); /* -40px -40px 60px rgba(27, 229, 186, 0.3); /* Resplandor azul difuso hacia arriba y a la izquierda */
}


.game-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; 
  object-position: center;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 1fr;
  gap: 1rem;
  height: 100%;
}

.box {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(229, 27, 111, 0.8);
}

.full-width {
  grid-column: 1 / -1; 
}

/*------------------ VIDEO CSS ---------------------------*/

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
    user-select: none; 
  }

/*------------------ MODO CLARO ---------------------------*/

.LightMode .box {
  box-shadow: 
    0 0 60px rgba(255, 255, 255, 0.8), 
    0 0 20px rgba(229, 27, 111, 1);
}

/*------------------ MEDIA QUERIES ---------------------------*/

@media (max-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
  .full-width {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
    .full-width {
    grid-column: 1;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.game-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.container-game {


}



</style>