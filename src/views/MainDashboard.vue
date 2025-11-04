<template>
    <div v-if=!isProfileLoaded class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"><LoadingScreen /></div>
    <div class="flex h-screen overflow-hidden" :class="{ 'LightMode': isLightMode }">
        <SideBar/>
        <div class="flex-grow flex flex-col overflow-hidden video-container">
            <BackgroundVideo  />
            <div class="background-container ">
                <div class="content-overlay flex flex-col h-full">
                    <div class="flex-1 grid grid-cols-3 gap-4 p-4 overflow-hidden ">
                        <div class="container-gradient text-white rounded-lg shadow-lg overflow-hidden flex flex-col textwhite" >
                            <div class="p-2 ">
                                <h2 class=" Cybertitle">{{ t('message.top_scorers') }} </h2>
                                <div class="w-full h-px bg-white mb-1"></div>
                            </div>
                            <ul class="flex-1 overflow-y-auto custom-scrollbar p-2">
                                <li v-for="(player, index) in topScores" :key="index" class="py-1">
                                    {{ player.username }} {{ player.score }}
                                </li>
                            </ul>
                        </div>
                        <ProfileCard class="col-span-2" />
                    </div>

                    <div class="flex-1 grid grid-cols-3 gap-4 p-4 overflow-hidden">
                        <div class="container-gradient text-white rounded-lg shadow-lg overflow-hidden flex flex-col textwhite">
                            <div class="p-2">
                                <h2 class=" Cybertitle"> {{ t('message.daily_quote') }}  </h2>
                                <div class="w-full h-px bg-white mb-1"></div>
                            </div>
                            <div class="flex-1 overflow-y-auto custom-scrollbar p-2 flex items-center justify-center">
                                <transition name="fade" mode="out-in">
                                    <p :key="currentQuote" class="text-sm sm:text-base md:text-lg lg:text-xl text-center">
                                        {{ currentQuote }}
                                    </p>
                                </transition>
                            </div>
                        </div>
                        <div class="container-gradient text-white rounded-lg shadow-lg overflow-hidden flex flex-col textwhite">
                            <div class="p-2">
                                <h2 class="Cybertitle">{{ t('message.match_history') }}</h2>
                                <div class="w-full h-px bg-white mb-1"></div>
                            </div>
                            <div class="flex-1 overflow-y-auto custom-scrollbar p-4">
                                <div v-if="gameHistoryError">{{ gameHistoryError }}</div>
                                <div v-else-if="gameHistory.length === 0">{{ t('message.no_history') }}</div>
                                <div v-else>
                                    <!-- Barra de porcentaje de victorias/derrotas -->
                                    <div class="mb-2">
                                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                                            <div class="bg-gradient-to-r from-[#00F2FF] to-[#FF007A] h-2.5 rounded-full" :style="{ width: winPercentage + '%' }"></div>
                                        </div>
                                        <div class="flex justify-between text-sm mt-1">
                                            <span class="block text-center w-full">{{ winPercentage }}% {{ t('message.wins') }}</span>
                                        </div>
                                    </div>

                                    <!-- Lista de partidas  -->
                                    <h3 class="text-m font-semibold mb-2">{{ t('message.recent_matches') }}</h3>
                                    <ul class="space-y-2">
                                        <li v-for="game in gameHistory" :key="game.date_played" 
                                            class="game-history-item p-2 rounded-lg shadow bg-black bg-opacity-50">
                                            <div class="game-info-container">
                                                <div class="player-info ">
                                                    <span class="mini ">{{ name }}</span>
                                                    <span class="mini">vs</span>
                                                    <span class="mini">{{ game.opponent }}</span>
                                                </div>
                                                <div class="player-info">
                                                    <span class="font-bold text-sm " 
                                                        :class="game.result === 'win' ? 'text-blue-500'  : 'text-[#FF007A]' ">
                                                        {{ t(`message.${game.result}`) }}
                                                    </span>
                                                    <span class="font-bold text-gray-400 text-sm">
                                                        {{ game.user_score }} - {{ game.opponent_score }}
                                                    </span>
                                                    <span class="text-xs text-gray-500">{{ formatDate(game.date_played) }}</span>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="container-gradient text-white rounded-lg shadow-lg overflow-hidden flex flex-col textwhite">
                            <div class="p-2">
                                <h2 class=" Cybertitle">{{ t('message.friends') }} </h2>
                                <div class="w-full h-px bg-white mb-1"></div>
                            </div>
                            <div class="flex-1 overflow-y-auto custom-scrollbar p-2">
                                <div v-if="friends.length === 0">{{ t('message.no_friends') }}</div>
                                <ul v-else>
                                    <li v-for="friend in friends" :key="friend.id" class="mb-2 flex items-center">
                                        <span class="inline-block w-2 h-2 rounded-full mr-2" 
                                              :class="friend.is_online ? 'bg-green-500' : 'bg-gray-300'"></span>
                                        {{ friend.username }}
                                        <span class="ml-2 text-xs" :class="friend.is_online ? 'text-green-300' : 'text-gray-300'">
                                            {{ friend.is_online ? t('message.online') : t('message.offline') }}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <NotificationBell/>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import SideBar from '@/components/SideBar';
import BackgroundVideo from '@/components/BackgroundVideo';
import ProfileCard from '@/components/ProfileCard';
import LoadingScreen from '@/components/LoadingScreen';
import { programmingQuotes } from '@/assets/Quotes.js';
import { useRouter } from 'vue-router'; 
import axiosInstance from '@/methods/axiosService';
import NotificationBell from '@/components/NotificationBell';
import { useI18n } from 'vue-i18n'; 

export default {
    name: 'MainDashboard',
    components: {
        SideBar,
        ProfileCard,
        NotificationBell,
        LoadingScreen,
        BackgroundVideo,
    },
    setup() {
        const topScores = ref([]);
        const currentQuote = ref(programmingQuotes[0]);
        const router = useRouter(); 
        const friends = ref([]);
        const gameHistory = ref([]);
        const gameHistoryError = ref(null);
        let socket = null;
        let interval;
        let pingInterval;
        const isLightMode = ref(false);
        const epilepsyMode = ref(false);
        const { t, locale } = useI18n();
        const isProfileLoaded = ref(false);
        const name = ref('');


        const loadUserData = async () => {
            try {
                const response = await axiosInstance.post('https://trascendence.tech:4242/api/user_profile');
                const userData = response.data;
                name.value = userData.username;
                } catch (error) {
                    console.log('Error al cargar los datos del usuario:', error);
                }
        };

        const winPercentage = computed(() => {
            if (gameHistory.value.length === 0) return 0;
            const wins = gameHistory.value.filter(game => game.result === 'win').length;
            return Math.round((wins / gameHistory.value.length) * 100);
        });

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString();
        };

        const fetchProfileData = async () => {
        try {    
        const response = await axiosInstance.post('/user_profile');
        await axiosInstance.get(`get_profile_photo/${response.data.id}`, {
          responseType: 'arraybuffer'
        });
        isProfileLoaded.value = true;
        } catch (error) {
        console.log('Error fetching profile data:', error);
        }
        };


        const getFriends = async () => {
            try {
                const response = await axiosInstance.post('/get_friends', {});
                friends.value = response.data.friends.map(friend => ({
                    ...friend,
                    is_online: false 
                }));
                //console.log('Initial friends list:', friends.value); 
            } catch (error) {
                console.log('Error fetching friends:', error);
            }
        };

        const updateFriendStatus = (userId, isOnline) => {
            const friendIndex = friends.value.findIndex(f => f.id === parseInt(userId));
            if (friendIndex !== -1) {
                friends.value[friendIndex].is_online = isOnline;
                console.log(`Updated friend status: ${userId} is now ${isOnline ? 'online' : 'offline'}`);
            } else {
                //console.log(`Friend with id ${userId} not found`);
            }
        };

        const updateAllFriendsStatus = (onlineUsers) => {
            friends.value.forEach(friend => {
                friend.is_online = onlineUsers.includes(friend.id.toString());
            });
            //console.log('Updated all friends status:', friends.value);
        };

        const startPing = () => {
            pingInterval = setInterval(() => {
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ type: 'ping' }));
                }
            }, 30000); // Envía un ping cada 30 segundos
        };

        const stopPing = () => {
            clearInterval(pingInterval);
        };

        const connectWebSocket = () => {
            const authToken = localStorage.getItem('authToken');
            
            if (!authToken) {
                //console.log('No auth token found. Unable to connect to WebSocket.');
                return;
            }
            
            const wsUrl = `wss://trascendence.tech:4242/ws/presence/?token=${authToken}`;
            //console.log('Connecting to WebSocket:', wsUrl);
            
            socket = new WebSocket(wsUrl);

            socket.onopen = (event) => {
                event;
                //console.log('WebSocket connection opened:', event);
                startPing();
                socket.send(JSON.stringify({ type: 'get_online_users' }));
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                //console.log('Received WebSocket message:', data);
                if (data.type === 'user_presence') {
                    updateFriendStatus(data.user_id, data.online);
                } else if (data.type === 'presence_list') {
                    //console.log('Received presence list:', data.online_users);
                    updateAllFriendsStatus(data.online_users);
                } else if (data.type === 'pong') {
                    console.log('');
                }
            };

            socket.onerror = (error) => {
                console.log('WebSocket error:', error);
            };

            socket.onclose = (event) => {
                event;
                //console.log('WebSocket connection closed:', event);
                stopPing();
            };
        };

        const getGameHistory = async () => {
            try {
                const response = await axiosInstance.get('/get_game_history');
                //console.log("GAMEHISTORY: ", response);
                if (response.data && response.data.game_history) {
                    gameHistory.value = response.data.game_history.map(game => ({
                        ...game,
                        result: game.user_score > game.opponent_score ? 'win' : 'loss'
                    }));
                    //console.log(gameHistory.value);
                } else {
                    gameHistory.value = [];
                    //console.log('No game history data received');
                }
            } catch (error) {
                console.log('Error fetching game history:', error);
                if (error.response && error.response.status === 404) {
                    gameHistoryError.value = t('message.no_history');
                } else if (error.response) {
                    gameHistoryError.value = `Error ${error.response.status}: ${error.response.data.error || 'Unknown error'}`;
                } else if (error.request) {
                    gameHistoryError.value = 'No response received from server';
                } else {
                    gameHistoryError.value = error.message;
                }
            }
        };

        const changeQuote = () => {
            const randomIndex = Math.floor(Math.random() * programmingQuotes.length);
            currentQuote.value = programmingQuotes[randomIndex];
        };

        const fetchTopScores = async () => {
            try {
                const response = await axiosInstance.post('/top_scorers', {});
                topScores.value = response.data.top_scores;
            } catch (error) {
                console.log('Error fetching top scores:', error);
            }
        };

        const loadSettingsFromCache = () => {
        isLightMode.value  = localStorage.getItem('Mode') === '1';
        epilepsyMode.value = localStorage.getItem('Epilepsy') === '1';
        locale.value = localStorage.getItem('Language') || 'en';
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
            interval = setInterval(changeQuote, 6000); 

            fetchTopScores();
            getFriends();
            getGameHistory();
            connectWebSocket();
            loadUserData();


            const urlParams = new URLSearchParams(window.location.search);
            const access = urlParams.get('access');
            const refresh = urlParams.get('refresh');
           // console.log("he conseguido el refresh ", refresh)
            if (access && refresh) {
                localStorage.setItem('authToken', access);
                localStorage.setItem('refreshToken', refresh);
                router.push('/dashboard');
            } else if (localStorage.getItem('authToken')) {
                //console.log("No existen headers pero si cookies con credenciales");
            } else {
                console.log('Missing access or refresh token');
                router.push('/login');
            }


            fetchProfileData();

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

        onUnmounted(() => {
            clearInterval(interval);
            if (socket) {
                socket.close();
            }
            stopPing();
        });

        watch(friends, (newFriends) => {
           newFriends;
        }, { deep: true });


        return {
            currentQuote,
            topScores,
            friends,
            gameHistory,
            gameHistoryError,
            isLightMode,
            t, 
            isProfileLoaded,
            winPercentage,
            formatDate,
            name,
        };
    }
}
</script>

<style scoped>
.background-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.content-overlay {
    position: relative;
    z-index: 1;
    background-color: rgba(7, 24, 43, 0.6);  
}

.container-gradient {
    background-color: rgba(7, 24, 43, 0.603);
    background-image: linear-gradient(92deg, #0d001d 0%, #01615494 100%);
}

.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
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

  .Cybertitle {
      font-family: 'krona';
      font-size: 1.25rem;
      font-weight: 700; 
      margin-bottom: 0.25rem; 
  }

  .textwhite {
    color: white;
}

.shadowed-box {
    box-shadow: 0 0 0 3px rgba(255, 255, 225, 0.8);
}

.content-overlay > .grid > div, 
.content-overlay > .grid > ProfileCard { 
    box-shadow: 0 0 20px rgba(229, 27, 111, 0.5) !important;
}


.LightMode .content-overlay > .grid > div,
.LightMode .content-overlay > .grid > ProfileCard {
    box-shadow: 0 0 30px rgba(255, 255, 225, 0.8) !important ;
}

.LightMode .Cybertitle {
    color: #1F2E49;
}
.LightMode .container-gradient {
    background-image: linear-gradient(92deg, #80E0FF 0%, #C585FF  100%);
}



.LightMode .textwhite {
    color: #4A5568 !important; 
    box-shadow: 0 0 0 20px rgba(255, 255, 225, 0.5);
}


.game-history-item {
    display: flex;
    flex-direction: column;
}

.game-info-container {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
    align-items: center;
}

.player-info {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.game-result {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: flex-end;
}

.mini {
    font-weight: 500;
    color: #D1D5DB;
    font-size: 0.875rem;
}

@media (max-width: 640px) {
    .game-info-container {
        grid-template-columns: 1fr;
    }

    .mini {
        font-size: 0.75rem;
    }
    .player-info {
        flex-direction: column;
        align-items: center;
    }
}

@media (max-width: 480px) {
    .player-info {
        flex-direction: column;
        align-items: center;
    }
}

</style>