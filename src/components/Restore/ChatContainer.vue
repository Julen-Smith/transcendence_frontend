<template>
    <div>
      <NotificationBell/>
      <ChatBox v-if="showChat" @close="closeChat" />
      <button v-if="!showChat" @click="openChat" class="chat-button">Abrir Chat</button>
    </div>
  </template>
  
  <script>
  import ChatBox from './ChatBox.vue';
  import NotificationBell from './NotificationBell.vue';
  
  export default {
    name: 'ChatContainer',
    components: {
      ChatBox,
      NotificationBell
    },
    data() {
      return {
        showChat: false,
      };
    },
    methods: {
      openChat() {
        this.showChat = true;
      },
      closeChat() {
        this.showChat = false;
      },
    },
  };
  </script>
  
  <style scoped>
  .chat-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: #343541;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>