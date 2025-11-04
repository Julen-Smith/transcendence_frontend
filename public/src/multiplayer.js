import { threeRoot, menuRoot, gameRoot, customizationRoot } from './values.js';
import { updateScoreDisplay } from './engine.js';
import { fetchPlayerInfo } from './playerInfo.js';
import { showOpponentLeftMessage, updateCanvasWithPlayerInfo, updatePlayerInfoDisplay } from './objectAssembler.js';
import { showMenu, showMultiplayer } from './displayController.js';
import { connectWebSocket } from './multiplayer/connection.js';
import { createWaitingMessage } from './multiplayer/multiplayerObjects.js'


  
export function waitingConnection() {
    //console.log('Llamada a connectWebSocket');
    connectWebSocket();
}


export function handleWebSocketMessage(message) {
    switch (message.type) {
        case 'waitingForOpponent':
            createWaitingMessage();
            break;
        case 'gameStart':
            handleGameStart(message);
            break;
        case 'updateOpponent':
            updateOpponentPaddle(message.position);
            break;
        case 'updateBall':
            updateBallPosition(message);
            break;
        case 'updateScore':
            if (message.playerNumber !== gameRoot.playerNumber) {
                updateScore(message.score);
            }
            break;
        case 'opponentDisconnected':
            gameRoot.enemy_disconnect = true;
            handleOpponentLeft();
            break;
        default:
            console.log('Unhandled message type:', message.type);
    }
}

function handleGameStart(message) {
    gameRoot.gameState = 'loading';
    gameRoot.isMultiplayer = true;
    gameRoot.isTournament = false;
    gameRoot.playerNumber = message.playerNumber;
    
    gameRoot.playerId = message.playerNumber === 1 ? message.player1Id : message.player2Id;
    gameRoot.enemyId = message.playerNumber === 1 ? message.player2Id : message.player1Id;
    showMultiplayer();
    getAndStorePlayerInfo(message.player1Id, message.player2Id);
}

export async function getAndStorePlayerInfo(player1Id, player2Id) {

    try {
        gameRoot.localPlayerInfo = await fetchPlayerInfo(player1Id);
        //console.log("LOG -- Voy a cargar en el lado izquierdo a ",gameRoot.localPlayerInfo.id);
        updateCanvasWithPlayerInfo(gameRoot.leftDataSquare.canvas.getContext('2d'), gameRoot.localPlayerInfo, gameRoot.leftDataSquare.texture);
        gameRoot.opponentPlayerInfo = await fetchPlayerInfo(player2Id);
        //console.log("LOG -- Voy a cargar en el lado derecho a ",gameRoot.opponentPlayerInfo.id);
        updateCanvasWithPlayerInfo(gameRoot.rightDataSquare.canvas.getContext('2d'), gameRoot.opponentPlayerInfo, gameRoot.rightDataSquare.texture);   
    } catch (error) {
        console.log("Error getting player info:", error);
        showErrorMessage("Failed to load player information. The game will continue, but player details may be missing.");
    }   
}

export function updateOpponentPaddle(position) {
    let opponentPaddle = gameRoot.playerNumber === 1 ? gameRoot.rightPaddle : gameRoot.leftPaddle;
    opponentPaddle.position.y = position;
}

export function updateBallPosition(message) {
    
    if (gameRoot.playerNumber === 2) {
        gameRoot.ball.position.x = message.position.x;
        gameRoot.ball.position.y = message.position.y;
        gameRoot.ballSpeed = message.speed;
    }
}

export function handleOpponentLeft() {
    gameRoot.socket.close();
    showOpponentLeftMessage();    
    setTimeout(() => {
        if (gameRoot.waitingText) {
            threeRoot.scene.remove(gameRoot.waitingText);
        }
        setTimeout(() => {
            showMenu();
        }, 500);
    }, 1500);
}

export function updateScore(newScore) {
    if (newScore.left !== gameRoot.score.left || newScore.right !== gameRoot.score.right) {
        gameRoot.score = newScore;
        updateScoreDisplay();
        updatePlayerInfoDisplay(gameRoot.playerInfo, 'left');
        updatePlayerInfoDisplay(gameRoot.opponentInfo, 'right');
    }
}

export function exitMultiplayerGame() {
    if (gameRoot.isMultiplayer) {
        if (gameRoot.socket && gameRoot.socket.readyState === WebSocket.OPEN) {
            gameRoot.socket.send(JSON.stringify({ type: 'playerLeft' }));
            gameRoot.socket.close();
        }
        showMenu();
    }
}

