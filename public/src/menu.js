import { menuRoot, threeRoot, gameRoot, customizationRoot } from './values.js';
import { } from './engine.js';
import { startGame , showWaitingRoom, showTournament, showInstructions} from './displayController.js'
//import { tournamentState } from './tournament.js';

export async function loadTextFromFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.log("Could not load the text file:", error);
        return "Error loading instructions";
    }
}

function displaySceneObjects() {
    const objects = getSceneObjects(threeRoot.scene);
    let i = 0;
    //console.log('Scene Objects:');
    objects.forEach((obj, index) => {
        if (obj.visible)
        {
            i++; 
            //console.log(`${index + 1}. ${obj.name} (${obj.type}):`);
            //console.log(`   Position: (${obj.position.join(', ')})`);
            //console.log(`   Visible: ${obj.visible}`);
            if (obj.geometryType) console.log(`   Geometry: ${obj.geometryType}`);
            if (obj.materialType) console.log(`   Material: ${obj.materialType}`);
            console.log('---');
        }
    });
    //console.log(`Total objects : ${objects.length}`);
    //console.log(`Total objects visible : ${i}`);
}

function getSceneObjects(scene) {
    let objects = [];
    scene.traverse((object) => {
        let info = {
            name: object.name || 'Unnamed object',
            type: object.type,
            position: object.position.toArray().map(n => n.toFixed(2)),
            visible: object.visible
        };
        if (object.geometry) {
            info.geometryType = object.geometry.type;
        }
        if (object.material) {
            info.materialType = Array.isArray(object.material) 
                ? object.material.map(m => m.type).join(', ') 
                : object.material.type;
        }
        objects.push(info);
    });
    return objects;
}

export function selectMenuItem(index) {
    //console.log('Selected:', menuRoot.menuItems[index]);
    //window.parent.postMessage({ type: 'menuSelection', item: menuRoot.menuItems[index] }, '*');
    gameRoot.isMultiplayer = 0;
    switch (index) {
        case 0:
            startGame();
            break;
        case 1: 
            showWaitingRoom();
            break;
        case 2: 
            showInstructions();
            break;
        case 3: 
            showTournament();
            break;
        case 4: 
        window.parent.postMessage({ type: 'exit' }, '*');
            break;
        case 5:
           
           // displaySceneObjects();
           // gameRoot.debugMode = gameRoot.debugMode === 1 ? gameRoot.debugMode = 0 : gameRoot.debugMode = 1;
            break;
        case 6: 
           
        break;
    }
}

export function updateMenuColors() {
    menuRoot.menuMeshes.forEach((mesh, index) => {
        const color = index === menuRoot.selectedItem ? customizationRoot.menuFontColor : 0xffffff; //base 0xff0000
        mesh.material[0].color.setHex(color);
        mesh.material[1].color.setHex(color);
    });
}


export function showGameOverMessage(isWinner) {
    const message = isWinner ? 'Easy Win' : 'Noob';
    const geometry = new THREE.TextGeometry(message, {
        font: menuRoot.font,
        size: 0.5,
        height: 0.1,
    });
    const material =  [
        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }),
        new THREE.MeshPhongMaterial({ color: 0xffffff })
    ];
    const gameOverText = new THREE.Mesh(geometry, material);
    gameOverText.position.set(-2, 0, 0);
    threeRoot.scene.add(gameOverText);

    setTimeout(() => {
        threeRoot.scene.remove(gameOverText);
    }, 1000);

}



export function updateMenu(deltaTime) {
    if (menuRoot.stars) {
      //  menuRoot.stars.rotation.y += 0.0002 * deltaTime / 16.67;
      //  menuRoot.stars.rotation.x += 0.0001 * deltaTime / 16.67;
        const positions = menuRoot.stars.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            if (positions[i + 2] > 0) {
                positions[i + 2] = -2000;
            } else {
                positions[i + 2] += 0.5 * deltaTime / 16.67;
            }
        }
        menuRoot.stars.geometry.attributes.position.needsUpdate = true;
    }

    if (menuRoot.menuGroup) {
        menuRoot.menuGroup.children.forEach((mesh, index) => {
            mesh.rotation.y = Math.sin(Date.now() * 0.001 + index) * 0.1;
        });
    }
}