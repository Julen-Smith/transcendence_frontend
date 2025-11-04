<template>
  <div class="pong-wrapper">
    <h2></h2>
    <iframe 
      ref="gameFrame" 
      src="/game.html" 
      class="pong-container rounded-lg"
      @load="setupMessageListener"
    ></iframe>
    <p class="input-label m-4">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'PongContainer',
  data() {
    return {
      message: 'Cargando juego...'
    }
  },
  methods: {
    setupMessageListener() {
      //console.log('Iframe loaded, setting up message listener');
      window.addEventListener('message', this.handleGameMessage);
    },
    handleGameMessage(event) {
      //console.log('Message received from game:', event.data);
      if (event.data.type === 'gameInitialized') {
        this.message = 'Juego inicializado';
      } else if (event.data.type === 'reload') {
        const currentSrc = this.$refs.gameFrame.src.split('?')[0];
        this.$refs.gameFrame.src = `${currentSrc}?reload=${new Date().getTime()}`;
        this.message = 'Recargando juego...';
      } else if (event.data.type === 'exit') {
        
        //console.log("Hola");
        window.location.reload();
      } else {
        this.message = 'Mensaje recibido: ' + JSON.stringify(event.data);
      }
    }
  },
  beforeUnmount() {
    window.removeEventListener('message', this.handleGameMessage);
  }
}
</script>

<style scoped>
.pong-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.pong-container {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 80vh;
  box-shadow: 0 0 20px rgba(229, 27, 111, 0.8);
}
.input-label {
    width: 100%;
    display: block;
    color: #ffffff;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
}
</style>