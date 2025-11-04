
import { menuRoot, threeRoot, gameRoot} from './values.js';
import { updateMenuColors, showGameOverMessage, updateMenu} from './menu.js';
import { handleKeyDown, handleKeyUp } from './events.js';
import {  } from './playerInfo.js';
import { showMenu, showTournament } from './displayController.js';
import { recreateScores, updatePlayerInfoDisplay  } from './objectAssembler.js';
import {  refreshTournament } from './tournament/semifinals.js';
import {  sendGameResult } from './backend/game_info.js'
import { sleep } from './utils/time_utils.js';


export function resetBall() {
    gameRoot.ball.position.set(0, 0, 0);
    gameRoot.ballSpeed.x = Math.random() > 0.5 ? gameRoot.ballSpeedModification.x : gameRoot.ballSpeedModification.y;
    gameRoot.ballSpeed.y = (Math.random() - 0.5) * gameRoot.ballSpeedModification.z;
}

export function updateScoreDisplay() {
    if (gameRoot.gameState === 'gameOver') return;
    //console.log("Llego aqui con el player number ",gameRoot.playerNumber);
    if (gameRoot.gameState === 'playing') //gameRoot.gameState = 'playing'
    {
        recreateScores();
      
        if (gameRoot.isMultiplayer && gameRoot.playerNumber !== 1)
        { 
            if (gameRoot.score.left >= gameRoot.maxScore || gameRoot.score.right >= gameRoot.maxScore)
                endGame();
            return; 
        }
            
        if (gameRoot.isMultiplayer) {
            if (gameRoot.playerNumber === 1) {
                gameRoot.score.score = gameRoot.score.left;
                gameRoot.score.score = gameRoot.score.right;
            } else {
                gameRoot.score.score = gameRoot.score.right;
                gameRoot.score.score = gameRoot.score.left;
            }
            //updatePlayerInfoDisplay(gameRoot.score, 'left');
            //updatePlayerInfoDisplay(gameRoot.score, 'right');
        }
        if (gameRoot.isMultiplayer && gameRoot.playerNumber == 1 && gameRoot.socket && gameRoot.socket.readyState === WebSocket.OPEN) {
            gameRoot.socket.send(JSON.stringify({
                type: 'updateScore',
                score: gameRoot.score,
                playerNumber: gameRoot.playerNumber
            }));
        }
        if (gameRoot.score.left >= gameRoot.maxScore || gameRoot.score.right >= gameRoot.maxScore) {
            endGame();
        }
    }
}

export  function   startGameAnimation() {
    gameRoot.gameState = 'loading';
    resetBall();
    gameRoot.score = { left: 0, right: 0 };
    updateScoreDisplay();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

export function checkIntersection() {
    if (gameRoot.gameState === 'menu')
    {
        threeRoot.raycaster.setFromCamera(threeRoot.mouse, threeRoot.camera);
        const intersects = threeRoot.raycaster.intersectObjects(menuRoot.menuMeshes);
        if (intersects.length > 0) {
            const newSelectedItem = menuRoot.menuMeshes.indexOf(intersects[0].object);
            if (newSelectedItem !== menuRoot.selectedItem) {
                menuRoot.selectedItem = newSelectedItem;
                updateMenuColors();
            }
        } else if (menuRoot.selectedItem !== -1) {
            menuRoot.selectedItem = -1;
            updateMenuColors();
        }
    }
}




export function updatePaddlePositions(deltaTime) {
    const normalizedDeltaTime = deltaTime / 16.67; 



    if (gameRoot.leftPaddle.userData.moveUp && gameRoot.leftPaddle.position.y < 2.5) {
        gameRoot.leftPaddle.position.y += gameRoot.paddleSpeed * normalizedDeltaTime;
    }
    if (gameRoot.leftPaddle.userData.moveDown && gameRoot.leftPaddle.position.y > -2.5) {
        gameRoot.leftPaddle.position.y -= gameRoot.paddleSpeed * normalizedDeltaTime;
    }

    if (gameRoot.rightPaddle.userData.moveUp && gameRoot.rightPaddle.position.y < 2.5) {
        gameRoot.rightPaddle.position.y += gameRoot.paddleSpeed * normalizedDeltaTime;
    }
    if (gameRoot.rightPaddle.userData.moveDown && gameRoot.rightPaddle.position.y > -2.5) {
        gameRoot.rightPaddle.position.y -= gameRoot.paddleSpeed * normalizedDeltaTime;
    }

    if ((gameRoot.leftPaddle.userData.moveUp || gameRoot.leftPaddle.userData.moveDown) && gameRoot.isMultiplayer && gameRoot.socket && gameRoot.socket.readyState === WebSocket.OPEN) {
        gameRoot.socket.send(JSON.stringify({
            type: 'updatePaddle',
            position: gameRoot.leftPaddle.position.y
        }));
    }

    //Jugador 2

    if ((gameRoot.rightPaddle.userData.moveUp || gameRoot.rightPaddle.userData.moveDown) &&
         gameRoot.isMultiplayer && gameRoot.socket && gameRoot.socket.readyState === WebSocket.OPEN) {
        gameRoot.socket.send(JSON.stringify({
            type: 'updatePaddle',
            position: gameRoot.rightPaddle.position.y
        }));
    }
}



export function updateBallPosition(deltaTime) {
    const normalizedDeltaTime = deltaTime / 16.67; 

    if (gameRoot.isMultiplayer && gameRoot.playerNumber !== 1) {
        return;
    }

    gameRoot.ball.position.x += gameRoot.ballSpeed.x * normalizedDeltaTime;
    gameRoot.ball.position.y += gameRoot.ballSpeed.y * normalizedDeltaTime;


    if (gameRoot.ball.position.y > 3 || gameRoot.ball.position.y < -3) {
        gameRoot.ballSpeed.y = -gameRoot.ballSpeed.y;
    }

    if (gameRoot.ball.position.x < -4.6 && gameRoot.ball.position.y < gameRoot.leftPaddle.position.y + 0.5 && gameRoot.ball.position.y > gameRoot.leftPaddle.position.y - 0.5) {
        gameRoot.ballSpeed.x = -gameRoot.ballSpeed.x * 1.05;
    }
    if (gameRoot.ball.position.x > 4.6 && gameRoot.ball.position.y < gameRoot.rightPaddle.position.y + 0.5 && gameRoot.ball.position.y > gameRoot.rightPaddle.position.y - 0.5) {
        gameRoot.ballSpeed.x = -gameRoot.ballSpeed.x * 1.05;
    }

    if (gameRoot.ball.position.x < -5) {
        gameRoot.score.right++;
        updateScoreDisplay();
        resetBall();
    } else if (gameRoot.ball.position.x > 5) {
        gameRoot.score.left++;
        updateScoreDisplay();
        resetBall();
    }

    if (gameRoot.isMultiplayer && gameRoot.socket && gameRoot.socket.readyState === WebSocket.OPEN) {
        gameRoot.socket.send(JSON.stringify({
            type: 'updateBall',
            position: { x: gameRoot.ball.position.x, y: gameRoot.ball.position.y },
            speed: gameRoot.ballSpeed
        }));
    }
}


async function  endGame() {
    let winner;
    let loser;
    let winner_score;
    let loser_score;
    //console.log("-------------------------------ENDGAME--------------------------------------");
    let winner_side;
    gameRoot.gameState = 'endGame';
    if (gameRoot.isMultiplayer == true)
    { 
        //console.log("Comprobacion de estadisticas");
        //console.log("paco score.left",gameRoot.score.left);
       // console.log("paco score.right",gameRoot.score.right);
        //console.log(gameRoot.playerId);
        //console.log(gameRoot.playerNumber)


        if (gameRoot.playerNumber === 1)
        {
        
            if (gameRoot.score.left > gameRoot.score.right)
            { 
                winner = gameRoot.playerId  == null ? gameRoot.player2Id : gameRoot.playerId;
                winner_score = gameRoot.score.left;
                loser_score = gameRoot.score.right;
                loser = gameRoot.enemyId == null ? gameRoot.enemy2Id : gameRoot.enemyId;
                winner_side = 'left';
            }
            else
            {
                winner = gameRoot.enemyId == null ? gameRoot.enemy2Id : gameRoot.enemyId;
                winner_score = gameRoot.score.right;
                loser_score = gameRoot.score.left;
                loser = gameRoot.playerId == null ? gameRoot.player2Id : gameRoot.playerId;
                winner_side = 'right'; 
            }
            //console.log("paco Enviando datos como ganador ",winner);
            //console.log("paco Enviando datos como loser ",loser);
            //console.log("paco Enviando datos como winner_score ",winner_score);
            //console.log("paco Enviando datos como loser_score ",loser_score);
            await sendGameResult(winner,loser,winner_score,loser_score); // <-<
            await sleep(4000);
        }else
        {
            //Es el jugador DOS  o el CUATRO
            if (gameRoot.score.left > gameRoot.score.right)
                { 
                    winner = gameRoot.playerId  == null ? gameRoot.player2Id : gameRoot.playerId;
                    winner_score = gameRoot.score.left;
                    loser_score = gameRoot.score.right;
                    loser = gameRoot.enemyId == null ? gameRoot.enemy2Id : gameRoot.enemyId;
                    winner_side = 'right'; 
                }
                else
                {
                    winner = gameRoot.enemyId == null ? gameRoot.enemy2Id : gameRoot.enemyId;
                    winner_score = gameRoot.score.right;
                    loser_score = gameRoot.score.left;
                    loser = gameRoot.playerId == null ? gameRoot.player2Id : gameRoot.playerId;
                    winner_side = 'left'; 
                }
            //window.parent.postMessage({ type: 'reload' }, '*');
        }
        if  (gameRoot.isTournament === false)
        {
            window.parent.postMessage({ type: 'reload' }, '*');
            gameRoot.socket.close();
        }
        if (gameRoot.isFinal)
            {
                //gameRoot.socket.send(JSON.stringify({
                //    type: 'imTheWinner'
                //}));
                //gameRoot.isFinal = false;
                //showMenu();
                await sleep(5000);
                //console.log("FINAL -- El usuario local es ",gameRoot.localplayerId," y se desconecta y el ganador ha sido ", winner);
                window.parent.postMessage({ type: 'reload' }, '*');
                return; 
            }
        if (gameRoot.isTournament == true && winner != gameRoot.localplayerId)
        {
            ////console.log("SEMI -- El usuario :",gameRoot.localplayerId," pierde y se desconecta y el ganador ha sido ", winner);
            showMenu();
            gameRoot.socket.send(JSON.stringify({ type: 'leave_tournament' }));
            gameRoot.socket.close();
            window.parent.postMessage({ type: 'reload' }, '*');
        }
        else if (gameRoot.isTournament == true && winner === gameRoot.localplayerId)
        {
            //console.log("SEMI -- El usuario :",gameRoot.localplayerId," gana y pasa a la final y el ganador ha sido ", winner);
            showTournament();
            //gameRoot.socket.send(JSON.stringify({ type: 'waiting4final', winner: winner}));
            refreshTournament(winner,loser,winner_side);
            gameRoot.isFinal = true;
        }
    } else {
        showMenu();
    }
    //Logica para implementar el 
    /*
    if (gameRoot.isTournament === true)
    {
        gameRoot.socket.send(JSON.stringify({ type: 'waiting4Final' }));
    }
*/
}

export function animate(currentTime) {
    requestAnimationFrame(animate);

    const deltaTime = currentTime - gameRoot.lastTime;
    gameRoot.lastTime = currentTime;

    gameRoot.accumulator += deltaTime;

    while (gameRoot.accumulator >= gameRoot.fixedDeltaTime) {
        updateGame(gameRoot.fixedDeltaTime);
        gameRoot.accumulator -= gameRoot.fixedDeltaTime;
    }

    if (gameRoot.ball) {
        gameRoot.ball.position.y += Math.sin(currentTime * 0.005) * 0.001;
    }

    threeRoot.renderer.render(threeRoot.scene, threeRoot.camera);
}

function animate_stars(deltaTime)
{
    if (menuRoot.waitingStars) {
          const positions = menuRoot.waitingStars.geometry.attributes.position.array;
          for (let i = 0; i < positions.length; i += 3) {
              if (positions[i + 2] > 0) {
                  positions[i + 2] = -2000;
              } else {
                  positions[i + 2] += 50.5 * deltaTime / 16.67;
              }
          }
          menuRoot.waitingStars.geometry.attributes.position.needsUpdate = true;
      }
    }


    let loadingStartTime = null;

    export function updateGame(deltaTime) {
        if (gameRoot.gameState === 'loading') {
            if (loadingStartTime === null) {
                loadingStartTime = Date.now();
            }
            const elapsedTime = Date.now() - loadingStartTime;
            if (elapsedTime >= 2000) {
                gameRoot.gameState = 'playing';
                loadingStartTime = null;
            }
        }
        if (gameRoot.gameState === 'menu') {
            updateMenu(deltaTime);
        } else if (gameRoot.gameState === 'playing') {
            if (gameRoot.enemy_disconnect)
            {
               window.parent.postMessage({ type: 'reload' }, '*');
                if (gameRoot.socket && gameRoot.socket.readyState !== WebSocket.CLOSED)
                    gameRoot.socket.close();
            }    
            updatePaddlePositions(deltaTime);
            updateBallPosition(deltaTime);
        } else if (gameRoot.gameState ===  'waiting')
        {
            animate_stars(deltaTime);
        }
        if (gameRoot.gameState === 'endGame')
        {
            resetBall();
            if (loadingStartTime === null) {
                loadingStartTime = Date.now();
            }
            const elapsedTime = Date.now() - loadingStartTime;
            if (elapsedTime >= 6000) 
                loadingStartTime = null;
        }
            
    }  


