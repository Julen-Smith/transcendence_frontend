<template>
    <div class="emulated-game-container rounded-lg">
      <iframe
        :src="gameUrl"
        frameborder="0"
        allowfullscreen
        class="game-iframe"
      ></iframe>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EmulatedGameContainer',
    props: {
      gameUrl: {
        type: String,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .emulated-game-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(229, 27, 111, 0.8);
  }
  
  .game-iframe {
    width: 100%;
    height: 100%;
    border: none;
  }


  </style>