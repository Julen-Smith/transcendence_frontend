<template>
  <div ref="emulatorContainer"></div>
</template>

<script>
import { onMounted, ref } from 'vue';

export default {
  name: 'GBAEmulator',
  setup() {
    const emulatorContainer = ref(null);

    onMounted(() => {
      loadEmulatorHTML();
    });

    function loadEmulatorHTML() {
      fetch('@/assets/gba/index.html')
        .then(response => response.text())
        .then(html => {
          emulatorContainer.value.innerHTML = html;
          executeScripts(emulatorContainer.value);
        })
        .catch(error => console.log('Error loading emulator HTML:', error));
    }

    function executeScripts(container) {
      const scripts = container.getElementsByTagName('script');
      for (let script of scripts) {
        const newScript = document.createElement('script');
        newScript.text = script.text;
        script.parentNode.replaceChild(newScript, script);
      }
    }

    return { emulatorContainer };
  }
}
</script>

<style scoped>
/* Estilos específicos del emulador si son necesarios */
</style>