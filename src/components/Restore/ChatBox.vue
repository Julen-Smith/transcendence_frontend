<template>
  <div class="container" :class="{ minimized: isMinimized }">
    <div class="nav-bar">
      <a>Chat</a>
      <div class="min" @click="toggleMinimize">
        <div class="minimize" :class="{ 'minimize-icon': isMinimized }"></div>
      </div>
      <div class="close" @click="closeChat">
        <div class="line one"></div>
        <div class="line two"></div>
      </div>
    </div>
    <div v-if="!isMinimized" class="chat-content">
      <div class="friends-list">
        <div v-for="friend in friends" :key="friend.id" 
             @click="selectFriend(friend)"
             class="friend-item" 
             :class="{ 'selected': selectedFriend && selectedFriend.id === friend.id }">
          <div class="friend-avatar">
            <img :src="friend.avatar" alt="avatar" class="avatar-img">
            <div class="friend-status" :class="{ 'online': friend.isOnline }"></div>
          </div>
          <div class="friend-name">{{ friend.username }}</div>
        </div>
      </div>
      <div class="chat-area">
        <div v-if="selectedFriend" class="selected-friend-header">
          Chatting with {{ selectedFriend.username }}
        </div>
        <div v-if="selectedFriend" class="messages-area">
          <div v-for="(message, index) in messages" :key="index" 
               class="message" 
               :class="{ 'sent': message.sent, 'received': !message.sent }">
            {{ message.text }}
          </div>
        </div>
        <div v-else class="no-friend-selected">
          Select a friend to start chatting
        </div>
        <div v-if="selectedFriend" class="sender-area">
          <div class="input-place">
            <input placeholder="Send a message." class="send-input" type="text" 
                   v-model="message" @keyup.enter="sendMessage">
            <div class="send" @click="sendMessage">
              <svg class="send-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><g><path fill="#6B6C7B" d="M481.508,210.336L68.414,38.926c-17.403-7.222-37.064-4.045-51.309,8.287C2.86,59.547-3.098,78.551,1.558,96.808 L38.327,241h180.026c8.284,0,15.001,6.716,15.001,15.001c0,8.284-6.716,15.001-15.001,15.001H38.327L1.558,415.193 c-4.656,18.258,1.301,37.262,15.547,49.595c14.274,12.357,33.937,15.495,51.31,8.287l413.094-171.409 C500.317,293.862,512,276.364,512,256.001C512,235.638,500.317,218.139,481.508,210.336z"></path></g></g></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '../methods/axiosService';

export default {
  name: 'ChatBox',
  data() {
    return {
      isMinimized: true,
      message: '',
      friends: [],
      selectedFriend: null,
      messages: {},
      socket: null,
      avatars: [
        'https://i.pravatar.cc/150?img=1',
        'https://i.pravatar.cc/150?img=2',
        'https://i.pravatar.cc/150?img=3',
        'https://i.pravatar.cc/150?img=4',
        'https://i.pravatar.cc/150?img=5',
        'https://i.pravatar.cc/150?img=6',
        'https://i.pravatar.cc/150?img=7',
      ],
      unreadMessages: {},
    };
  },
  mounted() {
    this.initializeWebSocket();
    this.fetchFriends();
  },
  methods: {
    initializeWebSocket() {
      
      const userId = 239; // Asegúrate de obtener el ID del usuario actual de forma dinámica
      this.socket = new WebSocket(`wss://trascendence.tech:4242/ws/chat/${userId}/`);

      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.fetchAllMessages();
  
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'friendStatusChange') {
          const friend = this.friends.find(f => f.id === data.friendId);
          if (friend) {
            friend.isOnline = data.isOnline;
          }
        } else if (data.type === 'receiveMessage') {
          this.handleIncomingMessage(data);
        }
      };

      this.socket.onerror = (error) => {
        console.log('WebSocket error:', error);
      };

      this.socket.onclose = (event) => {
        //console.log('WebSocket connection closed:', event);
        setTimeout(() => this.initializeWebSocket(), 5000); // Intenta reconectar después de 5 segundos
      };
    },
    async fetchFriends() {
      try {
        const response = await axiosInstance.post('https://trascendence.tech:4242/api/get_friends');
        const friendsData = response.data.friends;
        this.friends = friendsData.map((friend, index) => ({
          id: friend.id,
          username: friend.username,
          isOnline: false,
          avatar: this.avatars[index % this.avatars.length]
        }));
        this.friends.forEach(friend => {
          if (!this.messages[friend.id]) {
            this.messages[friend.id] = [];
          }
          if (!this.unreadMessages[friend.id]) {
            this.unreadMessages[friend.id] = 0;
          }
        });
      } catch (error) {
        console.log('Error fetching friends:', error);
      }
    },
    async fetchAllMessages() {
      try {
        const response = await axiosInstance.get('https://trascendence.tech:4242/api/health'/*'https://trascendence.tech:4242/api/get_all_messages'*/);
        this.messages = response.data.messages;
      } catch (error) {
        console.log('Error fetching messages:', error);
      }
    },
    handleIncomingMessage(data) {
      if (!this.messages[data.senderId]) {
        this.messages[data.senderId] = [];
      }
      this.messages[data.senderId].push({
        text: data.message,
        sent: false,
        timestamp: new Date(),
      });
      if (this.selectedFriend && data.senderId === this.selectedFriend.id) {
        this.unreadMessages[data.senderId] = 0;
      } else {
        this.unreadMessages[data.senderId] = (this.unreadMessages[data.senderId] || 0) + 1;
      }
      this.showNotification(data);
    },
    showNotification(data) {
      if (Notification.permission === "granted" && (!this.selectedFriend || data.senderId !== this.selectedFriend.id)) {
        const friend = this.friends.find(f => f.id === data.senderId);
        new Notification(`Nuevo mensaje de ${friend.username}`, {
          body: data.message,
          icon: friend.avatar
        });
      }
    },
    sendMessage() {
      if (this.message.trim() && this.selectedFriend && this.socket.readyState === WebSocket.OPEN) {
        const messageData = {
          type: 'sendMessage',
          recipientId: this.selectedFriend.id,
          message: this.message,
        };
        this.socket.send(JSON.stringify(messageData));

        if (!this.messages[this.selectedFriend.id]) {
          this.messages[this.selectedFriend.id] = [];
        }
        this.messages[this.selectedFriend.id].push({
          text: this.message,
          sent: true,
          timestamp: new Date(),
        });

        this.message = '';
      }
    },
    selectFriend(friend) {
      this.selectedFriend = friend;
      this.unreadMessages[friend.id] = 0; // Marcar mensajes como leídos
    },
    toggleMinimize() {
      this.isMinimized = !this.isMinimized;
      if (!this.isMinimized) {
        Notification.requestPermission();
      }
    },
    closeChat() {
      this.$emit('close');
    },
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.close();
    }
  },
};
</script>

<style scoped>
.container {
  width: 400px;
  height: 500px;
  background-color: #343541;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  color: white;
  position: fixed;
  bottom: 20px;
  right: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

.container.minimized {
  height: 40px;
  width: 250px;
}

.nav-bar {
  width: 100%;
  height: 40px;
  background-color: #40414F;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px 8px 0 0;
  padding: 0 10px;
}

.nav-bar a {
  color: #fff;
  font-weight: bold;
}

.close, .min {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.line {
  position: absolute;
  width: 15px;
  height: 2px;
  background-color: #fff;
}

.line.one {
  transform: rotate(45deg)
}

.line.two {
  transform: rotate(135deg)
}

.minimize {
  width: 15px;
  height: 2px;
  background-color: #fff;
}

.chat-content {
  display: flex;
  height: calc(100% - 40px);
}

.friends-list {
  width: 120px;
  background-color: #2E2F3A;
  overflow-y: auto;
  padding: 10px;
}

.friend-item {
  padding: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 5px;
  margin-bottom: 10px;
}

.friend-item:hover, .friend-item.selected {
  background-color: #40414F;
}

.friend-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.friend-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #6B6C7B;
  border: 2px solid #2E2F3A;
}

.friend-status.online {
  background-color: #4CAF50;
}

.friend-name {
  font-size: 12px;
  text-align: center;
  word-break: break-word;
}

.chat-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #343541;
}

.selected-friend-header {
  padding: 10px;
  background-color: #40414F;
  font-weight: bold;
}

.messages-area {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.no-friend-selected {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #6B6C7B;
}

.message {
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 18px;
  max-width: 80%;
  word-wrap: break-word;
}

.message.sent {
  background-color: #4CAF50;
  align-self: flex-end;
}

.message.received {
  background-color: #40414F;
  align-self: flex-start;
}

.sender-area {
  padding: 10px;
}

.input-place {
  display: flex;
  align-items: center;
  background-color: #40414F;
  border-radius: 20px;
  padding: 5px 10px;
}

.send-input {
  flex-grow: 1;
  border: none;
  background: none;
  color: white;
  outline: none;
  padding: 5px;
}

.send-input::placeholder {
  color: #6B6C7B;
}

.send {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.send-icon {
  width: 20px;
  height: 20px;
}
</style>