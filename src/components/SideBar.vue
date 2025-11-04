<template>

        <aside id="sidebar" :class="{ 'LightMode': isLightMode }">
            <div class="d-flex" :class="{ 'LightMode': isLightMode }">
                <button class="toggle-btn" type="button">
                    <a  href="https://trascendence.tech/dashboard" >
                        <i class="lni lni-grid-alt"></i>
                    </a>
                    <router-link to="/dashboard"></router-link>
                </button>
                <div class="sidebar-logo">
                    <router-link to="/dashboard"></router-link>
                </div>
            </div>
            <ul class="sidebar-nav" :class="{ 'LightMode': isLightMode }">
                <li class="sidebar-item">
                        <router-link to="/dashboard" class="sidebar-link">
                        <i class="lni lni-layout"></i>
                        </router-link>
                </li>
                <li class="sidebar-item">
                    <router-link to="/profile" class="sidebar-link">
                        <i class="lni lni-user"></i>
                    </router-link>
                </li>
                <li class="sidebar-item">
                    <router-link to="/games" class="sidebar-link">
                        <i class="lni lni-game"></i>
                        <span>Games</span>
                    </router-link>
                </li>
                <li class="sidebar-item">
                    <router-link to="/social" class="sidebar-link">
                        <i class="lni lni-network"></i>
                        <span>Proyect</span>
                    </router-link>
                </li>
                <li class="sidebar-item">
                    <router-link to="/settings" class="sidebar-link">
                        <i class="lni lni-cog"></i>
                        <span>Settings</span>
                    </router-link>
                </li>
                <li class="sidebar-item">
                    <router-link to="/monitoring" class="sidebar-link">
                        <i class="lni lni-graph"></i>
                        <span>Settings</span>
                    </router-link>
                </li>
            </ul>
            <div class="sidebar-footer" :class="{ 'LightMode': isLightMode }">
                <router-link @click="handleLogout" to="/" class="sidebar-link">
                    <i class="lni lni-exit"></i>
                    <span>Cerrar Sesión</span>
                </router-link>
            </div>
        </aside>
</template>
      
<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'SideBar',
  setup() {
    const isLightMode = ref(false)

    onMounted(() => {
      isLightMode.value = localStorage.getItem('Mode') === '1'
    })

    return {
      isLightMode
    }
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('lastUsedToken');
      localStorage.removeItem('profilePhotoData');
      localStorage.removeItem('profilePhotoTimestamp');
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');



::after,
::before {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

a {
    text-decoration: none;
}

li {
    list-style: none;
}

h1 {
    font-weight: 600;
    font-size: 1.5rem;
}

body {
    font-family: 'Poppins', sans-serif;
}


.main {
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
    transition: all 0.35s ease-in-out;
    background-color: #091833;
}

#sidebar {
    width: 70px;
    min-width: 70px;
    z-index: 1000;
    transition: all .25s ease-in-out;
    background-color: #091833;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    box-shadow: 10px 0 10px rgba(229, 27, 111, 0.3);
    
}


.toggle-btn {
    background-color: transparent;
    cursor: pointer;
    border: 0;
    padding: 1rem 1.5rem;
}

.toggle-btn i {
    font-size: 1.5rem;
    color: #FFF;
}

.sidebar-logo {
    margin: auto 0;
}

.sidebar-logo a {
    color: #FFF;
    font-size: 1.15rem;
    font-weight: 600;
}

#sidebar:not(.expand) .sidebar-logo,
#sidebar:not(.expand) a.sidebar-link span {
    display: none;
}

.sidebar-nav {
    padding: 2rem 0;
    flex: 1 1 auto;
}

a.sidebar-link {
    padding: .625rem 1.625rem;
    color: #FFF;
    display: block;
    font-size: 0.9rem;
    white-space: nowrap;
    border-left: 3px solid transparent;
}

.sidebar-link i {
    font-size: 1.1rem;
    margin-right: .75rem;
}

a.sidebar-link:hover {
    background-color: rgba(255, 255, 255, .075);
    border-left: 3px solid #3b7ddd;
}

.sidebar-item {
    position: relative;
}

.LightMode {
 background-color: rgba(192, 240, 255, 1);
  color: black;
  box-shadow: 10px 0 10px rgba(229, 27, 111, 0.3);
    
}

.LightMode .sidebar-link,
.LightMode .toggle-btn i {
  color: #091833;
}

.LightMode a.sidebar-link:hover {
  background-color: rgba(0, 0, 0, .075);
  border-left: 3px solid #3b7ddd;
}

.LightMode .main .sidebar{
    background-color: rgba(255, 255, 255, 0.8) ;

}

</style>
      
      