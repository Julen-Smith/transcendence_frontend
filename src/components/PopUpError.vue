<template>
  <div v-if="isVisible" :class="{'opacity-0': !visible, 'transition-opacity duration-500': true}" class="fixed z-50" style="right: 10px; bottom: 10px;">
    <div class="bg-black text-purple-500 p-4 rounded">
      <p>{{ errorMessage }}</p>
      <button @click="close" class="text-white">Cerrar</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    errorMessage: String
  },
  data() {
    return {
      isVisible: true,
      visible: true
    };
  },
  methods: {
    close() {
      this.visible = false;
      setTimeout(() => {
        this.isVisible = false;
        this.$emit('close');
      }, 500);
    }
  },
  mounted() {
    setTimeout(() => {
      this.close();
    }, 2000);
  }
}
</script>

<style scoped>
.popup-inner {
  background: black;
  color: rgb(179, 0, 202);
  padding: 10px;
  border-radius: 5px;
}
</style>
