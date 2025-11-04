import { visibilityController , gameRoot, menuRoot, tournamentRoot, repeatedComponents } from './values.js';
import { startGameAnimation } from './engine.js'
import { waitingConnection} from './multiplayer.js'
import { tournamentConnect } from './tournament/tournamentNetwork.js'
import { sleep } from './utils/time_utils.js'

    
function setGroupVisibility(group, isVisible) {
    if (group) {
        group.traverse((object) => {
            //console.log(`Setting visibility of ${object.name || object.type} to ${isVisible}`);
            object.visible = isVisible;
        });
    } else {
        console.log('El grupo no existe.');
    }
}

function restorePositions()
{
    gameRoot.leftPaddle.position.set(-4.8, 0, 0);
    gameRoot.rightPaddle.position.set(4.8, 0, 0);
}

function unsetReusableComponentsVisibility()
{
    repeatedComponents.exit_button_comp.text.visible = false;
    repeatedComponents.exit_button_comp.button.visible = false;
    repeatedComponents.exit_button_comp.enabled = false;
    repeatedComponents.exit_button_comp.button.position.set(0, -1, 1.25);
    repeatedComponents.exit_button_comp.text.position.set(
        repeatedComponents.exit_button_comp.button.position.x - repeatedComponents.textWidth / 2,
        repeatedComponents.exit_button_comp.button.position.y - repeatedComponents.textHeight / 2,
        repeatedComponents.exit_button_comp.button.position.z + 0.01
    );
    gameRoot.scoreTextLeft.geometry.dispose();
    gameRoot.scoreTextRight.geometry.dispose();
    const newGeometry = new THREE.TextGeometry('0', {
        font: menuRoot.font,
        size: 0.5,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5
    });
    const newGeometry2 = new THREE.TextGeometry('0', {
        font: menuRoot.font,
        size: 0.5,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5
    });
    gameRoot.scoreTextLeft.geometry = newGeometry;
    gameRoot.scoreTextRight.geometry = newGeometry2;

}

export async function showMenu() {
    unsetReusableComponentsVisibility();
    gameRoot.gameState = 'menu';
    if (gameRoot.debugMode)
        console.log("Cargando escena menu");
    setGroupVisibility(visibilityController.menuGroup, true);
    setGroupVisibility(visibilityController.gameGroup, false);
    setGroupVisibility(visibilityController.waitingLayer, false);
    setGroupVisibility(visibilityController.multiplayerLayer, false);
    setGroupVisibility(visibilityController.tournamentGroup, false);
    setGroupVisibility(visibilityController.instructionsGroup, false);

}

export function showInstructions()
{
    gameRoot.gameState = 'instructions';
    if (gameRoot.debugMode)
        console.log("Cargando escena de instrucciones");
    setGroupVisibility(visibilityController.menuGroup, false);
    setGroupVisibility(visibilityController.gameGroup, false);
    setGroupVisibility(visibilityController.waitingLayer, false);
    setGroupVisibility(visibilityController.multiplayerLayer, false);
    setGroupVisibility(visibilityController.tournamentGroup, false);
    setGroupVisibility(visibilityController.instructionsGroup, true);      
    repeatedComponents.exit_button_comp.text.visible = true;
    repeatedComponents.exit_button_comp.button.visible = true;
    repeatedComponents.exit_button_comp.enabled = true;
    repeatedComponents.exit_button_comp.button.position.y -= 1.5;
    repeatedComponents.exit_button_comp.text.position.set(
        repeatedComponents.exit_button_comp.button.position.x - repeatedComponents.textWidth / 2,
        repeatedComponents.exit_button_comp.button.position.y - repeatedComponents.textHeight / 2,
        repeatedComponents.exit_button_comp.button.position.z + 0.01
    );
}

export function startGame() {
    restorePositions();
    unsetReusableComponentsVisibility();

    if (gameRoot.debugMode)
        console.log("Cargando escena de juego individual");
    setGroupVisibility(visibilityController.menuGroup, false);
    setGroupVisibility(visibilityController.gameGroup, true);
    setGroupVisibility(visibilityController.waitingLayer, false);
    setGroupVisibility(visibilityController.multiplayerLayer, false);
    setGroupVisibility(visibilityController.tournamentGroup, false);
    setGroupVisibility(visibilityController.instructionsGroup, false);

    startGameAnimation();
}

export async function showWaitingRoom()
{
    window.parent.postMessage({ Loading: 'Loading Multiplayer after reconnection.' }, '*');
    await sleep(2000);
    window.parent.postMessage({ Cleaning: 'Waiting for sockets to clean.' }, '*');
    await sleep(1000);
    window.parent.postMessage({ Loading: 'Looking for a enemy.' }, '*');
    gameRoot.gameState = 'waiting';
    if (gameRoot.debugMode)
        console.log("Cargando escena de espera multiplayer");
    setGroupVisibility(visibilityController.menuGroup, false);
    setGroupVisibility(visibilityController.gameGroup, false);
    setGroupVisibility(visibilityController.waitingLayer, true);
    setGroupVisibility(visibilityController.multiplayerLayer, false);
    setGroupVisibility(visibilityController.tournamentGroup, false);
    setGroupVisibility(visibilityController.instructionsGroup, false);
    repeatedComponents.exit_button_comp.text.visible = true;
    repeatedComponents.exit_button_comp.button.visible = true;
    repeatedComponents.exit_button_comp.enabled = true;
    waitingConnection();
}


export async function showMultiplayer() {

    restorePositions();
    unsetReusableComponentsVisibility();
    if (gameRoot.debugMode)
        console.log("Cargando escena multiplayer");
    setGroupVisibility(visibilityController.menuGroup, false);
    setGroupVisibility(visibilityController.gameGroup, true);
    setGroupVisibility(visibilityController.waitingLayer, false);
    setGroupVisibility(visibilityController.multiplayerLayer, true);
    setGroupVisibility(visibilityController.tournamentGroup, false);
    setGroupVisibility(visibilityController.instructionsGroup, false);
    //gameRoot.gameState = 'loading';
    gameRoot.isMultiplayer = 1; 
    startGameAnimation();
}


export async function showTournament()
{
    window.parent.postMessage({ Loading: 'Loading Tournament after reconnection.' }, '*');
    await sleep(2000);
    window.parent.postMessage({ Cleaning: 'Waiting for sockets to clean.' }, '*');
    await sleep(1000);
    gameRoot.gameState = 'tournament';
    if (gameRoot.debugMode)
        console.log("Cargando escena torneo");
    gameRoot.isTournament = 1;
    setGroupVisibility(visibilityController.menuGroup, false);
    setGroupVisibility(visibilityController.gameGroup, false);
    setGroupVisibility(visibilityController.waitingLayer, false);
    setGroupVisibility(visibilityController.multiplayerLayer, false);
    setGroupVisibility(visibilityController.tournamentGroup, true);
    setGroupVisibility(visibilityController.instructionsGroup, false);
    repeatedComponents.exit_button_comp.text.visible = true;
    repeatedComponents.exit_button_comp.button.visible = true;
    repeatedComponents.exit_button_comp.enabled = true;
    if(!gameRoot.onTournament)
        tournamentConnect();
}