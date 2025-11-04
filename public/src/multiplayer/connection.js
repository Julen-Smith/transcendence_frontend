import { threeRoot, menuRoot, gameRoot, customizationRoot } from '../values.js';
import { showMenu, showMultiplayer } from '../displayController.js';
import { createWaitingMessage  } from './multiplayerObjects.js';
import { handleWebSocketMessage  } from '../multiplayer.js';

let connectionTimeout;

function startConnectionTimeout() {
    clearTimeout(connectionTimeout);
    createWaitingMessage();
    connectionTimeout = setTimeout(() => {
        handleConnectionFailure('Connection timeout');
    }, customizationRoot.waiting_player_tout);
}

function handleConnectionFailure(reason) {
    //console.log('Connection failed:', reason);
    setTimeout(() => {
        if (gameRoot.socket && gameRoot.socket.readyState === WebSocket.OPEN) {
            gameRoot.socket.close();
        }
        showMenu();
    }, customizationRoot.conection_error_tout);
}

export async function connectWebSocket() {
    if (gameRoot.socket && gameRoot.socket.readyState !== WebSocket.CLOSED)
        gameRoot.socket.close();
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }
        const wsUrl = `wss://trascendence.tech/ws?token=${encodeURIComponent(token)}`;
        gameRoot.socket = new WebSocket(wsUrl);

        gameRoot.socket.onopen = function (event) {
            clearTimeout(connectionTimeout);
            //console.log('WebSocket connection established');
            gameRoot.socket.send(JSON.stringify({ type: 'join' }));
            startConnectionTimeout();
        };

        gameRoot.socket.onmessage = function (event) {
            clearTimeout(connectionTimeout);
            handleWebSocketMessage(JSON.parse(event.data));
        };

        gameRoot.socket.onclose = function (event) {
            showMenu();
           
           // console.log('WebSocket connection closed ');
            handleConnectionFailure('Connection closed');
        };

        gameRoot.socket.onerror = function (error) {
            //console.log('WebSocket error:', error);
            handleConnectionFailure('Connection error');
        };

        startConnectionTimeout();
    } catch (error) {
       // console.log('Error creating WebSocket:', error);
        handleConnectionFailure('Failed to create WebSocket: ' + error.message);
    }
}