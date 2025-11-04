import { threeRoot, gameRoot , menuRoot, customizationRoot, visibilityController, tournamentRoot } from '../values.js';
import { fetchPlayerInfo } from '../playerInfo.js';
import { showMenu, showMultiplayer } from '../displayController.js';
import { updateScore,updateOpponentPaddle } from '../multiplayer.js';
import { handleSemifinalsStart , assingControls} from './semifinals.js'
import { updateBallPosition, getAndStorePlayerInfo} from '../multiplayer.js'
import { sleep } from '../utils/time_utils.js'


let connectionTimeout;

function cleanTournamentCanvas()
{
    let uknown = { id: '', username: "", level: 0 , score: 0  , photo: '../../emptyPlayer.png' };
    updateCanvasWithPlayerInfo(gameRoot.leftWinnerPanel.canvas.getContext('2d'), uknown, gameRoot.leftWinnerPanel.texture);
    updateCanvasWithPlayerInfo(gameRoot.rightWinnerPanel.canvas.getContext('2d'), uknown, gameRoot.rightWinnerPanel.texture);
    updateCanvasWithPlayerInfo(gameRoot.leftPanelTop.canvas.getContext('2d'), uknown, gameRoot.leftPanelTop.texture);
    updateCanvasWithPlayerInfo(gameRoot.leftPanelDown.canvas.getContext('2d'), uknown, gameRoot.leftPanelDown.texture);
    updateCanvasWithPlayerInfo(gameRoot.rightPanelTop.canvas.getContext('2d'), uknown, gameRoot.rightPanelTop.texture);
    updateCanvasWithPlayerInfo(gameRoot.rightPanelDown.canvas.getContext('2d'), uknown, gameRoot.rightPanelDown.texture);
}

export function tournamentConnect() {
    

    cleanTournamentCanvas();

    if (gameRoot.socket && gameRoot.socket.readyState !== WebSocket.CLOSED)
        gameRoot.socket.close();
    gameRoot.onTournament = true;
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }
        if (gameRoot.debugMode)
            console.log('Attempting to connect with token:', token);
        const wsUrl = `wss://trascendence.tech/ws/tournament/?token=${encodeURIComponent(token)}`;
        gameRoot.socket = new WebSocket(wsUrl);
        
        startConnectionTimeout(); 

        gameRoot.socket.onopen = function (event) {
            clearTimeout(connectionTimeout);
            if (gameRoot.debugMode)
                console.log('WebSocket connection established');
            //console.log("pido conexion a waiting for players")
            gameRoot.socket.send(JSON.stringify({ type: 'waiting4players' }));
            startConnectionTimeout(); 
        };

        gameRoot.socket.onmessage = function (event) {
            clearTimeout(connectionTimeout);
            handleTournamentWebSocketMessage(JSON.parse(event.data));
            startConnectionTimeout();
        };

        gameRoot.socket.onclose = function (event) {
            gameRoot.onTournament = false;
            clearTimeout(connectionTimeout);
            showMenu();
            if (gameRoot.debugMode)
                console.log('WebSocket connection closed', event);
            clearUserArray();
            if (event.code === 4000) {
                console.log('Error en la conexión del WebSocket');
            } else if (event.code === 4001) {
                console.log('Token inválido');
            }
            handleConnectionFailure('Connection closed');
        };

        gameRoot.socket.onerror = function (error) {
            clearTimeout(connectionTimeout);
            gameRoot.onTournament = false;
            if (gameRoot.debugMode) 
                console.log('WebSocket error:', error);
            if (gameRoot.socket && gameRoot.socket.readyState !== WebSocket.CLOSED) {
                gameRoot.socket.close();
                clearUserArray();
            }
        };

    } catch (error) {
        if (gameRoot.debugMode)
            console.log('Error creating WebSocket:', error);
        gameRoot.onTournament = false;
        handleConnectionFailure('Failed to create WebSocket: ' + error.message);
        clearUserArray();
    }
}

function startConnectionTimeout() {
    clearTimeout(connectionTimeout);
    connectionTimeout = setTimeout(() => {
       
        handleConnectionFailure('Connection timeout');
    }, customizationRoot.waiting_tournament_tout);
}

function handleConnectionFailure(reason) {
    if (gameRoot.debugMode)
        console.log(`Connection failed: ${reason}`);
    setTimeout(() => {
        showMenu();
        clearUserArray();
        if (gameRoot.socket && gameRoot.socket.readyState === WebSocket.OPEN) {
            gameRoot.socket.send(JSON.stringify({ type: 'leave_tournament' }));
            gameRoot.socket.close();
        }
    }, customizationRoot.tournament_conection_error_tout);
}


export function user_disconnect(message)
{
    let playerInfo = { id: 0, username: " ", level: 42 , score: 42  , photo: '../../emptyPlayer.png' }
    for(let i = 0; i < tournamentRoot.players.length; i++)
    {
        if (tournamentRoot.players[i] == message.user_id)
        {
            tournamentRoot.players[i] = 0;
            if (i == 0)
                updateCanvasWithPlayerInfo(gameRoot.rightPanelTop.canvas.getContext('2d'), playerInfo, gameRoot.rightPanelTop.texture);
            if (i == 1)
                updateCanvasWithPlayerInfo(gameRoot.rightPanelDown.canvas.getContext('2d'), playerInfo, gameRoot.rightPanelDown.texture);
            if(i == 2)
                updateCanvasWithPlayerInfo(gameRoot.leftPanelTop.canvas.getContext('2d'), playerInfo, gameRoot.leftPanelTop.texture);
            if (i == 3)
                updateCanvasWithPlayerInfo(gameRoot.leftPanelDown.canvas.getContext('2d'), playerInfo, gameRoot.leftPanelDown.texture);    
        }
    }

}

export function reset_canvas()
{
    let playerInfo = { id: 0, username: " ", level: 42 , score: 42  , photo: '../../emptyPlayer.png' }

    updateCanvasWithPlayerInfo(gameRoot.rightPanelTop.canvas.getContext('2d'), playerInfo, gameRoot.rightPanelTop.texture);
    updateCanvasWithPlayerInfo(gameRoot.rightPanelDown.canvas.getContext('2d'), playerInfo, gameRoot.rightPanelDown.texture);
    updateCanvasWithPlayerInfo(gameRoot.leftPanelTop.canvas.getContext('2d'), playerInfo, gameRoot.leftPanelTop.texture);
    updateCanvasWithPlayerInfo(gameRoot.leftPanelDown.canvas.getContext('2d'), playerInfo, gameRoot.leftPanelDown.texture);

}


export function updateCanvasWithPlayerInfo(context, playerInfo, texture) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    const img = new Image();
    img.onload = function() {
        context.drawImage(img, 10, 10, 108, 108);
        drawPlayerInfo();
        if (texture) texture.needsUpdate = true;
    };
    img.onerror = function() {
        if (gameRoot.debugMode)
            console.log('Error loading player image, using default');
        img.src = playerInfo.photo || '../preview.gif';
        context.fillStyle = 'gray';
        context.fillRect(10, 10, 108, 108);
        drawPlayerInfo();
        if (texture) texture.needsUpdate = true;
    };
    
    img.src = playerInfo.photo || './../../preview.gif';

    function drawPlayerInfo() {
        context.font = '20px Arial';
        context.fillStyle = 'white';
        context.fillText(`${playerInfo.username || ' '}`, 128, 30);

        context.font = '16px Arial';
        context.fillText(`Score: ${playerInfo.score || 0}`, 128, 90);

        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.strokeRect(0, 0, context.canvas.width, context.canvas.height);
    }
}

export async function check_existence(new_player)
{
    for (let i = 0; i < tournamentRoot.players.length; i++)
    {
        for (let u = 0; u < tournamentRoot.players.length; u++) 
        {   
            if (tournamentRoot.players[i] === tournamentRoot.players[u] && i != u && tournamentRoot.players[i] != null && tournamentRoot.players[u] != null) 
            {
                tournamentRoot.players[u] = 0;
                //console.log("🐷",new_player);
                return 1;
            }   
        }   
    }     
    return 0;
}


export async function draw_new_player_data(new_player, tile_position)
{
    if (new_player)
    {
        if (await check_existence(new_player))
            return ; 
        tournamentRoot.playerInfo = await fetchPlayerInfo(new_player);
        if (tile_position == 0 &&  tournamentRoot.players[0] != 0)
            updateCanvasWithPlayerInfo(gameRoot.rightPanelTop.canvas.getContext('2d'), tournamentRoot.playerInfo, gameRoot.rightPanelTop.texture);
        if (tile_position == 1 &&  tournamentRoot.players[1] != 0)
            updateCanvasWithPlayerInfo(gameRoot.rightPanelDown.canvas.getContext('2d'), tournamentRoot.playerInfo, gameRoot.rightPanelDown.texture);
        if (tile_position == 2 &&  tournamentRoot.players[2] != 0)
            updateCanvasWithPlayerInfo(gameRoot.leftPanelTop.canvas.getContext('2d'), tournamentRoot.playerInfo, gameRoot.leftPanelTop.texture);
        if (tile_position == 3 &&  tournamentRoot.players[3] != 0)
            updateCanvasWithPlayerInfo(gameRoot.leftPanelDown.canvas.getContext('2d'), tournamentRoot.playerInfo, gameRoot.leftPanelDown.texture);
    }
}
              
export function clearUserArray()
{
    tournamentRoot.players[0] = 0;
    tournamentRoot.players[1] = 0;
    tournamentRoot.players[2] = 0;
    tournamentRoot.players[3] = 0;
    reset_canvas();
}

export async function check_length()
{
    let total = 1;
    for (let i = 0; i < tournamentRoot.players.length; i++)
    {
            if (tournamentRoot.players[i] != null && tournamentRoot.players[i] != 0)
                    total++;
    }
    return total;
}

export function handleFinalsStart(localplayer,user1,user2,playernumber) {

    gameRoot.isMultiplayer = true;
    gameRoot.isTournament = true;
    
    gameRoot.localplayerId = localplayer;
    
    gameRoot.playerId  =  user1;
    gameRoot.enemyId =  user2;
    console.log("Jugador ",  gameRoot.playerId, " contra ",gameRoot.enemyId);
    assingControls(playernumber);
    getAndStorePlayerInfo(gameRoot.playerId, gameRoot.enemyId);
    showMultiplayer();
}

export async function handleTournamentWebSocketMessage(message) {
    
    //console.log(message.type);
    switch (message.type) {  
        case 'new_player':
            if (await check_length() == 4)
                gameRoot.socket.send(JSON.stringify({ type: 'semifinals' }));
            tournamentRoot.players[0] = message.player1;
            tournamentRoot.players[1] = message.player2;
            tournamentRoot.players[2] = message.player3;
            tournamentRoot.players[3] = message.player4;
            for (let i = 0; i < tournamentRoot.players.length; i++)
                draw_new_player_data(tournamentRoot.players[i],i)
            break;
        case 'user_disconnect':
                user_disconnect(message);    
            break;
            case 'semifinaldata':  //Borrar grupo de semifinales al terminar
                handleSemifinalsStart(message);
            break;
        case 'waitingtillfinish':
            console.log("El usuario no puede entrar al torneo hasta que termine el que estaba o ya esta dentro del torneo.");
            //gameRoot.socket.send(JSON.stringify({ type: 'leave_tournament' }));
            showMenu();
            break;
        case 'updateScore':
            if (message.playerNumber !== gameRoot.playerNumber) {
                updateScore(message.score);
            }
            break;
        case 'updateBall':
            updateBallPosition(message);
            break;
        case 'updateOpponent':
            updateOpponentPaddle(message.position);
            break;
        case 'finaldata':
            //console.log(message);
            let to_fetch = message.localPlayerId != message.player1Id ? message.player1Id : message.player2Id;
            //console.log(to_fetch);
            let rival = await fetchPlayerInfo(to_fetch);
           // console.log(rival);
            updateCanvasWithPlayerInfo(gameRoot.leftWinnerPanel.canvas.getContext('2d'), rival, gameRoot.leftWinnerPanel.texture);
           // console.log("Esperando 5 segundos");
            await sleep(11000);
           // console.log("GO");
            handleFinalsStart(message.localPlayerId,message.player1Id,message.player2Id,message.playerNumber);
            break;
        default:
            console.log('Unhandled message type:', message.type);
            }        
}
