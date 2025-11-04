<template>
    <div class="not-found">
    <video autoplay muted loop playsinline class="background-video">
      <source src="../assets/video/Floating.webm" type="video/webm" />
    </video>
      <h1 class="Cybertitle">404</h1>
      <p class="Cybertext">Oops! La página que buscas no existe.</p>
      <img :src="notFoundImage" alt="404 Not Found" class="not-found-image"/>
      <div class="button">
      <router-link to="/dashboard" class="Return" >Volver a la página principal</router-link>
      </div>
    </div>
  </template>
  
  <script>
  import notFoundImage from '@/assets/404notfound.png'; 
  
  export default {
    name: "NotFound",
    data() {
      return {
        notFoundImage
      };
    }
  };
  </script>
  
  <style scoped>
.not-found {
  position: relative;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: transparent; 
  overflow: hidden;
  z-index: 0;
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
  z-index: -1;
  background-color: transparent;
}

.Cybertitle {
      font-family: 'Squid', sans-serif;
      color:white;
      font-size: 100px;
      margin-top: 3rem; 
      text-shadow: 
    10px 10px 20px black, 
    0 0 40px rgba(229, 27, 111, 1.25);
  }

.Cybertext {
  font-family: 'krona';
  font-size: 1rem;
  font-weight: 300;
  margin-bottom: 0.8rem;
  color: white;
  text-shadow:  20px black,
}
.Return {
  font-family: 'krona';
  font-size: 1rem;
  font-weight: 300;
  margin-bottom: 0.8rem;
  color: white;
  text-shadow: 10px 10px 20px black,
}

  .Return:hover {
    color: #3b82f6;
  }

  .button{
  background-color: rgba(0, 0, 0, 0.8);
  background-image: linear-gradient(92deg, #0d001d 0%, #01615494 60%);
  padding: 1rem 2rem; 
  border-radius: 15px; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  width: fit-content; 
  margin:0 auto ; 
  position: absolute; 
  bottom: 10%; 
  left: 50%; 
  transform: translateX(-50%); 
  text-align: center; 
  box-shadow: 
  10px 10px 20px black, 0 0 30px rgba(229, 27, 111, 1.25);
}
  
 .not-found-image {
  position: absolute; /* Posiciona la imagen sobre el botón */
  bottom: calc(10% + 5rem); /* Ajusta el valor para que esté encima del botón */
  left: 50%; 
  transform: translateX(-50%); 
  max-width: 10%; 
  height: auto; 
  z-index: 1; 
}
  </style>
  