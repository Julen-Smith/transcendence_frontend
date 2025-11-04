import {getAndStorePlayerInfo } from '../multiplayer.js';
import { showMenu, showMultiplayer } from '../displayController.js';
import { threeRoot, gameRoot , menuRoot, customizationRoot, visibilityController, tournamentRoot } from '../values.js';
import { fetchPlayerInfo } from '../playerInfo.js';
import { updateCanvasWithPlayerInfo } from '../objectAssembler.js';


export async function refreshTournament(winner,loser,winner_side)
{
    let loser_info = { id: loser, username: "Eliminated", level: 0 , score: 0  , photo: '../../eliminated.png' };
    tournamentRoot.playerInfo = await fetchPlayerInfo(winner);

    if (gameRoot.localplayerSide === 'left')
    {
        if (winner_side == 'left')
        {
            updateCanvasWithPlayerInfo(gameRoot.leftWinnerPanel.canvas.getContext('2d'), tournamentRoot.playerInfo, gameRoot.leftWinnerPanel.texture);
            updateCanvasWithPlayerInfo(gameRoot.rightPanelDown.canvas.getContext('2d'), loser_info, gameRoot.rightPanelDown.texture);
        }
        else if (winner_side === 'right')
        {  
            updateCanvasWithPlayerInfo(gameRoot.leftWinnerPanel.canvas.getContext('2d'), tournamentRoot.playerInfo, gameRoot.leftWinnerPanel.texture);
            updateCanvasWithPlayerInfo(gameRoot.rightPanelTop.canvas.getContext('2d'), loser_info, gameRoot.rightPanelTop.texture);
        }
    }
    else if (gameRoot.localplayerSide === 'right')
    {
        if (winner_side == 'left')
            {
                
                updateCanvasWithPlayerInfo(gameRoot.rightWinnerPanel.canvas.getContext('2d'), tournamentRoot.playerInfo, gameRoot.rightWinnerPanel.texture);
               // console.log("Es aqui el cambio");
                updateCanvasWithPlayerInfo(gameRoot.leftPanelDown.canvas.getContext('2d'), loser_info, gameRoot.leftPanelDown.texture);
            }
            else if (winner_side =='right')
            {
                updateCanvasWithPlayerInfo(gameRoot.rightWinnerPanel.canvas.getContext('2d'), tournamentRoot.playerInfo, gameRoot.rightWinnerPanel.texture);
                updateCanvasWithPlayerInfo(gameRoot.rightPanelTop.canvas.getContext('2d'), loser_info, gameRoot.rightPanelTop.texture);
            }
    }
   gameRoot.socket.send(JSON.stringify({ type: 'waiting4final', winner: winner}));
}

export function assingControls(playernumber)
{
 //   console.log("-------------------------------ASIGNACION DE CONTROLES--------------------------------------");
    if (playernumber === 1 || playernumber === 3)
    {
        gameRoot.playerNumber = 1;
   //     console.log("Asignando a jugador local los controles como JUGADOR 1");
    }  
    else if (playernumber === 2 || playernumber === 4)
    {
        gameRoot.playerNumber = 2;
     //   console.log("Asignando a jugador local los controles como JUGADOR 2");
    }
}


export function handleSemifinalsStart(message) {

    gameRoot.isMultiplayer = true;
    gameRoot.isTournament = true;
//    console.log("-------------------------------GESTION DE INICIO DE PARTIDOS--------------------------------------");

  //      console.log("----------------------");
   //     console.log("Player 1Id: ",message.player1Id);
    //    console.log("Player 2Id: ",message.player2Id);
     //   console.log("----------------------");

    gameRoot.localplayerId = message.localPlayerId;
    if(message.side == 'left')
    {
     //   console.log("Jugador asignado al lado izquierdo del bracket");
        gameRoot.localplayerSide = 'left';
        gameRoot.playerId = message.player1Id;
        gameRoot.enemyId = message.player2Id;
       // console.log("Jugador ",  gameRoot.playerId, " contra ",gameRoot.enemyId);
        assingControls(message.playerNumber);
        getAndStorePlayerInfo(gameRoot.playerId, gameRoot.enemyId);
        showMultiplayer();
    }
    else if (message.side =='right')
    {
        gameRoot.localplayerSide = 'right';
        gameRoot.player2Id = message.player1Id;
        gameRoot.enemy2Id = message.player2Id;
      //  console.log("Jugadores con ids en el lado derecho:",gameRoot.player2Id,gameRoot.enemy2Id);
        assingControls(message.playerNumber);
        getAndStorePlayerInfo(gameRoot.player2Id, gameRoot.enemy2Id);
        showMultiplayer();
    }
}


