import { threeRoot, gameRoot , menuRoot, customizationRoot, visibilityController, tournamentRoot, repeatedComponents } from '../values.js';
import { showMenu } from '../displayController.js';


export function createTournamentWaitingRoom() {
    //console.log("Creating tournament waiting room");

    tournamentRoot.bracket = new THREE.Group();

    createBracketLines();

    createPlayerTexts();

    createTournamentInfoPanels();

    createWaitingMessage();

    createExitButton();

    visibilityController.tournamentGroup.add(tournamentRoot.bracket);
    visibilityController.tournamentGroup.visible = false;

    //console.log("Tournament waiting room created");
}

function createWaitingMessage()
{
    if (gameRoot.waitingText) {
        threeRoot.scene.remove(gameRoot.waitingText);
    }
    const geometry = new THREE.TextGeometry('Waiting for opponents...', {
        font: menuRoot.font,
        size: 0.3,
        height: 0.1,
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

    gameRoot.waitingText.position.set(-2, 2, 0);

    visibilityController.tournamentGroup.add(gameRoot.waitingText);
}


function createBracketLines() {
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const points = [
        // Linea izquierda
        new THREE.Vector3(-6, 1, 0),
        new THREE.Vector3(-6, -1, 0),
        // Conexion izquierda
        new THREE.Vector3(-6, 0, 0),
        new THREE.Vector3(-3, 0, 0),
        // Linea central
        new THREE.Vector3(0, 0.75, 0),
        new THREE.Vector3(0, -0.75, 0),
        // Conexion derecha
        new THREE.Vector3(3, 0, 0),
        new THREE.Vector3(6, 0, 0),
        // Linea derecha
        new THREE.Vector3(6, 1, 0),
        new THREE.Vector3(6, -1, 0)
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const bracketLines = new THREE.LineSegments(geometry, material);
    tournamentRoot.bracket.add(bracketLines);
}


function createPlayerTexts() {
    const playerNames = ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4'];
    const textSize = 0.2;
    const positions = [
        new THREE.Vector3(-4, 1.5, 0),
        new THREE.Vector3(-4, -1.5, 0),
        new THREE.Vector3(4, 1.5, 0), 
        new THREE.Vector3(4, -1.5, 0)  
    ];

    playerNames.forEach((name, index) => {
        const textGeometry = new THREE.TextGeometry(name, {
            font: menuRoot.font,
            size: textSize,
            height: 0.05,
        });
        const textMaterial =  [
            new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }),
            new THREE.MeshPhongMaterial({ color: 0xffffff })
        ];
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textMesh.position.copy(positions[index]);

        // Centrar el texto
        textGeometry.computeBoundingBox();
        const centerOffset = new THREE.Vector3();
        textGeometry.boundingBox.getCenter(centerOffset);
        textMesh.position.sub(centerOffset);

        tournamentRoot.bracket.add(textMesh);
      //  console.log(`Added ${name} at position:`, textMesh.position);
    });
}


export function createTournamentInfoPanels() {
    function createInfoPanel(side) {
        const geometry = new THREE.PlaneGeometry(2, 1);
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture, 
            transparent: true,
            side: THREE.DoubleSide,
            opacity: 1  
        });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.name = `${side}Square`;

        if (side === 'leftTop')
            mesh.position.set(6,1.5,0);
        else if (side === 'rightTop')
            mesh.position.set(-6,1.5,0);
        else if (side === 'leftDown')
            mesh.position.set(6,-1.5,0);
        else if (side === 'rightDown')
            mesh.position.set(-6,-1.5,0);
        else if (side === 'leftWinner')
            mesh.position.set(-1.5,0,0);
        else if (side === 'rightWinner')
            mesh.position.set(1.5,0,0);


        const context = canvas.getContext('2d');
        drawDefaultInfo(context, side);

        texture.needsUpdate = true;

        return { mesh, canvas, texture };
    }
    function drawDefaultInfo(context, side) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.fillStyle = 'black';  
        context.fillRect(10, 10, 108, 108);

        context.font = '20px Arial';
        context.fillStyle = 'white';
        context.fillText(``, 128, 30);

        context.font = '16px Arial';
        context.fillText('', 128, 60);
        context.fillText('Score: 0', 128, 90);

        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.strokeRect(0, 0, context.canvas.width, context.canvas.height);
    }

    const leftPanelTop = createInfoPanel('leftTop');
    const rightPanelTop = createInfoPanel('rightTop');
    const leftPanelDown = createInfoPanel('leftDown');
    const rightPanelDown = createInfoPanel('rightDown');
    const leftWinner = createInfoPanel('leftWinner');
    const rightWinner = createInfoPanel('rightWinner');

    gameRoot.leftPanelTop = leftPanelTop;
    gameRoot.rightPanelTop = rightPanelTop;
    gameRoot.leftPanelDown = leftPanelDown;
    gameRoot.rightPanelDown = rightPanelDown;
    gameRoot.leftWinnerPanel = leftWinner;
    gameRoot.rightWinnerPanel = rightWinner;

    threeRoot.scene.add(leftPanelTop.mesh);
    threeRoot.scene.add(rightPanelTop.mesh);
    threeRoot.scene.add(leftPanelDown.mesh);
    threeRoot.scene.add(rightPanelDown.mesh);
    threeRoot.scene.add(leftWinner.mesh);
    threeRoot.scene.add(rightWinner.mesh);


    leftPanelTop.mesh.visible = false;
    rightPanelTop.mesh.visible = false;
    leftPanelDown.mesh.visible = false;
    rightPanelDown.mesh.visible = false;
    leftWinner.mesh.visible = false;
    rightWinner.mesh.visible = false;
    

    visibilityController.tournamentGroup.add(leftPanelTop.mesh);
    visibilityController.tournamentGroup.add(rightPanelTop.mesh);
    visibilityController.tournamentGroup.add(leftPanelDown.mesh);
    visibilityController.tournamentGroup.add(rightPanelDown.mesh);
    visibilityController.tournamentGroup.add(leftWinner.mesh);
    visibilityController.tournamentGroup.add(rightWinner.mesh);
    //gameRoot.leftDataSquare.visible = false;
    //gameRoot.rightDataSquare.visible = false;
}


function createExitButton() {
    const buttonWidth = 1;
    const buttonHeight = 0.5;
    const buttonGeometry = new THREE.PlaneGeometry(buttonWidth, buttonHeight);
    const buttonMaterial = new THREE.MeshBasicMaterial({ color: 0x111212 });
    const buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);

    //Posicion original boton
    buttonMesh.position.set(0, -1, 1.25);

    const textGeometry = new THREE.TextGeometry('Menu', {
        font: menuRoot.font,
        size: 0.2,
        height: 0.09,
    });
    const textMaterial =  [
        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }),
        new THREE.MeshPhongMaterial({ color: 0xffffff })
    ];
    
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    textGeometry.computeBoundingBox();
    repeatedComponents.textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    repeatedComponents.textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
    textMesh.position.set(
        buttonMesh.position.x - repeatedComponents.textWidth / 2,
        buttonMesh.position.y - repeatedComponents.textHeight / 2,
        buttonMesh.position.z + 0.01
    );
    repeatedComponents.exit_button_comp.text = textMesh;
    repeatedComponents.exit_button_comp.button = buttonMesh;

    threeRoot.scene.add(repeatedComponents.exit_button_comp.text);
    threeRoot.scene.add(repeatedComponents.exit_button_comp.button);
    repeatedComponents.exit_button_comp.text.visible = false;
    repeatedComponents.exit_button_comp.button.visible = false;
    repeatedComponents.exit_button_comp.enabled = false;

    //tournamentRoot.bracket.add(buttonMesh);
    //tournamentRoot.bracket.add(textMesh);
    //tournamentRoot.bracket.exitButton = buttonMesh;
    //tournamentRoot.bracket.exitButtonText = textMesh;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onButtonClick(event) {
        if (repeatedComponents.exit_button_comp.enabled)
        {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
            raycaster.setFromCamera(mouse, threeRoot.camera);
            const intersects = raycaster.intersectObject(buttonMesh);
    
            if (intersects.length > 0) {
                window.parent.postMessage({ type: 'reload' }, '*');
                exitTournament();
            }
        }
    }
    window.addEventListener('click', onButtonClick);

    return { buttonMesh, textMesh, onButtonClick };
}



function exitTournament() {
    if (gameRoot.socket && gameRoot.socket.readyState === WebSocket.OPEN) {
        gameRoot.socket.send(JSON.stringify({
            type: 'leave_tournament',
        }));
        gameRoot.socket.close();
    }
    showMenu();
}