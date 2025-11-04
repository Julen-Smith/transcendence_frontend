import { threeRoot, menuRoot, gameRoot, customizationRoot, visibilityController } from '../values.js';

export function createWaitingMessage()
{
    if (gameRoot.waitingText) {
        threeRoot.scene.remove(gameRoot.waitingText);
    }
    const geometry = new THREE.TextGeometry('Waiting for opponent...', {
        font: menuRoot.font,
        size: 0.3,
        height: 1.0,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5
    });
    const material =  [
        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }),
        new THREE.MeshPhongMaterial({ color: 0xffffff })
    ];

    gameRoot.waitingText = new THREE.Mesh(geometry, material);  

    gameRoot.waitingText.position.set(-2, 0, 0);

    visibilityController.waitingLayer.add(gameRoot.waitingText);
}