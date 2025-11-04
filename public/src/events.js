import { threeRoot, menuRoot, gameRoot } from './values.js';
import { checkIntersection } from './engine.js';
import { selectMenuItem } from './menu.js';



export function onWindowResize() {
    threeRoot.camera.aspect = window.innerWidth / window.innerHeight;
    threeRoot.camera.updateProjectionMatrix();
    threeRoot.renderer.setSize(window.innerWidth, window.innerHeight);
}

export function onMouseMove(event) {
    if (gameRoot.gameState != 'menu') return;
        threeRoot.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        threeRoot.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        checkIntersection();
}

export function onClick() {
    if (gameRoot.gameState != 'menu') return;
    if (menuRoot.selectedItem !== -1) {
        selectMenuItem(menuRoot.selectedItem);
    }
}

export function handleKeyDown(event) {
    if (gameRoot.isMultiplayer) {
        
        if (gameRoot.playerNumber === 1) {
            
            switch (event.key) {
                case 'w':
                    gameRoot.leftPaddle.userData.moveUp = true;
                case 'ArrowUp':
                    gameRoot.leftPaddle.userData.moveUp = true;
                    break;
                case 's':
                    gameRoot.leftPaddle.userData.moveDown = true;
                case 'ArrowDown':
                    gameRoot.leftPaddle.userData.moveDown = true;
                    break;
            }
        } else {
            switch (event.key) {
                case 'w':
                    gameRoot.rightPaddle.userData.moveUp = true;
                case 'ArrowUp':
                    gameRoot.rightPaddle.userData.moveUp = true;
                    break;
                case 's':
                    gameRoot.rightPaddle.userData.moveDown = true;
                case 'ArrowDown':
                    gameRoot.rightPaddle.userData.moveDown = true;
                    break;
            }
        }
    } else {
        switch (event.key) {
            case 'ArrowUp':
                gameRoot.rightPaddle.userData.moveUp = true;
                break;
            case 'ArrowDown':
                gameRoot.rightPaddle.userData.moveDown = true;
                break;
            case 'w':
                gameRoot.leftPaddle.userData.moveUp = true;
                break;
            case 's':
                gameRoot.leftPaddle.userData.moveDown = true;
                break;
        }
    }
}

export  function handleKeyUp(event) {
    if (gameRoot.isMultiplayer) {

        if (gameRoot.playerNumber === 1) {
            
            switch (event.key) {
                case 'w':
                    gameRoot.leftPaddle.userData.moveUp = false;
                case 'ArrowUp':
                    gameRoot.leftPaddle.userData.moveUp = false;
                    break;
                case 's':
                    gameRoot.leftPaddle.userData.moveDown = false;
                case 'ArrowDown':
                    gameRoot.leftPaddle.userData.moveDown = false;
                    break;
            }
        } else {
            switch (event.key) {
                case 'w':
                    gameRoot.rightPaddle.userData.moveUp = false;
                case 'ArrowUp':
                    gameRoot.rightPaddle.userData.moveUp = false;
                    break;
                case 's':
                    gameRoot.rightPaddle.userData.moveDown = false;
                case 'ArrowDown':
                    gameRoot.rightPaddle.userData.moveDown = false;
                    break;
            }
        }
    } else {
        switch (event.key) {
            case 'w':
                gameRoot.leftPaddle.userData.moveUp = false;
            case 'ArrowUp':
                gameRoot.rightPaddle.userData.moveUp = false;
                break;
            case 's':
                gameRoot.leftPaddle.userData.moveDown = false;
            case 'ArrowDown':
                gameRoot.rightPaddle.userData.moveDown = false;
                break;
        }
    }
}