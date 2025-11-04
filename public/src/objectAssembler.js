
import { threeRoot, gameRoot , menuRoot, customizationRoot, visibilityController, tournamentRoot } from './values.js';
import { onWindowResize, onMouseMove, onClick } from './events.js';
import { createTournamentWaitingRoom } from './tournament/canvasCreation.js'


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

//Aqui los objetos volatiles
export function recreateScores()
{
    if (gameRoot.scoreTextLeft && gameRoot.scoreTextRight) {
        gameRoot.scoreTextLeft.geometry.dispose();
        gameRoot.scoreTextRight.geometry.dispose();

        gameRoot.scoreTextLeft.geometry = new THREE.TextGeometry(gameRoot.score.left.toString(), {
            font: menuRoot.font,
            size: 0.5,
            height: 0.1,
        });
        gameRoot.scoreTextRight.geometry = new THREE.TextGeometry(gameRoot.score.right.toString(), {
            font: menuRoot.font,
            size: 0.5,
            height: 0.1,
        });
    }
}


export function showOpponentLeftMessage() {
    if (gameRoot.waitingText) {
        threeRoot.scene.remove(gameRoot.waitingText);
    }
   
    const geometry = new THREE.TextGeometry('Opponent left the game', {
        font: menuRoot.font,
        size: 0.3,
        height: 0.1,
    });
  
    const material =  [
        new THREE.MeshPhongMaterial({ color: 0xFF0000, flatShading: true }),
        new THREE.MeshPhongMaterial({ color: 0xFF0000 })
    ];

    gameRoot.waitingText = new THREE.Mesh(geometry, material);
  
    gameRoot.waitingText.position.set(-2, 0, 0);
   
    threeRoot.scene.add(gameRoot.waitingText);
}

//Player info
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
        console.log('Error loading player image, using default');
        img.src = '../preview.gif';
        context.fillStyle = 'gray';
        context.fillRect(10, 10, 108, 108);
        drawPlayerInfo();
        if (texture) texture.needsUpdate = true;
    };
    
    img.src = playerInfo.photo || '../preview.gif';

    function drawPlayerInfo() {
        context.font = '20px Arial';
        context.fillStyle = 'white';
        context.fillText(`${playerInfo.username || 'N/A'}`, 128, 30);
        context.font = '16px Arial';
        context.fillText(`Score: ${playerInfo.score || 0}`, 128, 90);
        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.strokeRect(0, 0, context.canvas.width, context.canvas.height);
    }
}

export function updatePlayerInfoDisplay(playerInfo, isLocalPlayer) {
    const playerInfoObject = isLocalPlayer ? gameRoot.localPlayerInfo : gameRoot.opponentPlayerInfo;
    if (playerInfoObject && playerInfoObject.mesh) {
        const context = playerInfoObject.canvas.getContext('2d');
        playerInfoObject.info = playerInfo;
        updateCanvasWithPlayerInfo(context, playerInfo, playerInfoObject.texture);
    } else {
       // console.log(`Player info not found for ${isLocalPlayer ? 'local' : 'opponent'} player`);
    }
}

export function createPlayerInfoDisplay() {
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
        mesh.position.set(side === 'left' ? -4 : 4, 2.5, 0);

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
        context.fillText(`Player ${side}`, 128, 30);

        context.font = '16px Arial';
        context.fillText(': Level--', 128, 60);
        context.fillText('Score: 0', 128, 90);

        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.strokeRect(0, 0, context.canvas.width, context.canvas.height);
    }

    const leftPanel = createInfoPanel('left');
    const rightPanel = createInfoPanel('right');

    gameRoot.leftDataSquare = leftPanel;
    gameRoot.rightDataSquare = rightPanel;

    //updateCanvasWithPlayerInfo(gameRoot.leftDataSquare.canvas.getContext('2d'), gameRoot.localPlayerInfo, gameRoot.leftDataSquare.texture);
    //updateCanvasWithPlayerInfo(gameRoot.rightDataSquare.canvas.getContext('2d'), gameRoot.opponentPlayerInfo, gameRoot.rightDataSquare.texture);
    threeRoot.scene.add(leftPanel.mesh);
    threeRoot.scene.add(rightPanel.mesh);
    leftPanel.mesh.visible = false;
    rightPanel.mesh.visible = false;
    visibilityController.multiplayerLayer.add(leftPanel.mesh);
    visibilityController.multiplayerLayer.add(rightPanel.mesh);

    //gameRoot.leftDataSquare.visible = false;
    //gameRoot.rightDataSquare.visible = false;
}
// Multiplayer




//-----------------------Todo lo que tenga que ver con el juego y la generacion paquí---------------------------
// Las paddles
function createPaddles()
{
    const paddleGeometry = new THREE.BoxGeometry(0.2, 1, 0.1);
    const paddleMaterial = [
        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }),
        new THREE.MeshPhongMaterial({ color: 0xffffff })
    ];
    gameRoot.leftPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    gameRoot.rightPaddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    gameRoot.leftPaddle.name = 'Left Paddle';
    gameRoot.rightPaddle.name = 'Right Paddle';
    gameRoot.leftPaddle.position.set(-4.8, 0, 0);
    gameRoot.rightPaddle.position.set(4.8, 0, 0);

    threeRoot.scene.add(gameRoot.leftPaddle);
    threeRoot.scene.add(gameRoot.rightPaddle);
    visibilityController.gameGroup.add(gameRoot.leftPaddle);
    visibilityController.gameGroup.add(gameRoot.rightPaddle);
    gameRoot.leftPaddle.visible = false;
    gameRoot.rightPaddle.visible = false;
}
//Pelota

function createBall()
{
    const ballGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const ballMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        specular: 0x333333,
        shininess: 100,
        emissive: 0x666666,
        emissiveIntensity: 0.2
    });
    gameRoot.ball = new THREE.Mesh(ballGeometry, ballMaterial);
    gameRoot.ball.name = 'pelota';
    gameRoot.ball.castShadow = true;
    gameRoot.ball.receiveShadow = true;
    const ballGlow = new THREE.PointLight(0xffffff, 1, 0.5);
    ballGlow.name = 'ballGlow';
    gameRoot.ball.add(ballGlow);
    //threeRoot.scene.add(gameRoot.ball);

    visibilityController.gameGroup.add(gameRoot.ball);
    gameRoot.ball.visible = false;
    
    function updateBallRotation() {
        if (gameRoot.ballSpeed) {
            gameRoot.ball.rotation.x += gameRoot.ballSpeed.y * 0.1;
            gameRoot.ball.rotation.y -= gameRoot.ballSpeed.x * 0.1;
        }
        requestAnimationFrame(updateBallRotation);
    }
    updateBallRotation();
}
//El texto de final
function createGameOverMessage()
{
    const isWinner = 1;
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
    gameRoot.gameOverText = new THREE.Mesh(geometry, material);
    gameRoot.gameOverText.position.set(-2, 0, 0);
    gameRoot.gameOverText.name = 'gameOverText';

    //visibilityController.gameGroup.add(gameRoot.gameOverText);
    gameRoot.gameOverText.visible = false;

    //threeRoot.scene.add(gameRoot.gameOverText);
}
// Las puntuaciones
function createScoreTexts()
{
    const scoreGeometry = new THREE.TextGeometry('0', {
        font: menuRoot.font,
        size: 0.5,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5
    });
    const scoreMaterial = [
        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }),
        new THREE.MeshPhongMaterial({ color: 0xffffff })
    ];

    gameRoot.scoreTextLeft = new THREE.Mesh(scoreGeometry, scoreMaterial);
    gameRoot.scoreTextRight = new THREE.Mesh(scoreGeometry.clone(), scoreMaterial);

    gameRoot.scoreTextLeft.position.set(-1, 2.5, 0);
    gameRoot.scoreTextRight.position.set(1, 2.5, 0);

    gameRoot.scoreTextLeft.name = 'scoreTextLeft';
    visibilityController.gameGroup.add(gameRoot.scoreTextLeft);
    gameRoot.scoreTextLeft.visible = false;

    gameRoot.scoreTextRight.name = 'scoreTextRight';
    visibilityController.gameGroup.add(gameRoot.scoreTextRight);
    gameRoot.scoreTextRight.visible = false;

    //threeRoot.scene.add(gameRoot.scoreTextLeft);
    //threeRoot.scene.add(gameRoot.scoreTextRight);
 
}

//-----------------------Todo lo que tenga que ver con el menu pa quí---------------------------
//Campo de estrellas
function createStarField() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];


    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = -Math.random() * 2000;
        vertices.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
        color: customizationRoot.star_color,
        size: 4,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
    });

    menuRoot.stars = new THREE.Points(geometry, material);
    menuRoot.stars.name = 'stars';

    menuRoot.waitingStars = menuRoot.stars.clone();
    visibilityController.menuGroup.add(menuRoot.stars);
    visibilityController.waitingLayer.add(menuRoot.waitingStars);  //No deja tener dos padres el hdp
}

function createMenu()
{
    menuRoot.menuGroup = new THREE.Group();
    menuRoot.menuItems.forEach((item, index) => {
        const geometry = new THREE.TextGeometry(item, {
            font: menuRoot.font,
            size: 0.5,
            height: 1.0,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelSegments: 5
        });
        geometry.computeBoundingBox();
        const materials = [
            new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }),
            new THREE.MeshPhongMaterial({ color: 0xffffff })
        ];
        const mesh = new THREE.Mesh(geometry, materials);

        mesh.position.x = -mesh.geometry.boundingBox.max.x / 2;
        mesh.position.y = -index * 0.8;
        mesh.name = 'Menu Item';
        menuRoot.menuGroup.add(mesh);
        menuRoot.menuMeshes.push(mesh);
    });

    const menuHeight = (menuRoot.menuItems.length - 1) * 0.8;
    menuRoot.menuGroup.position.y = menuHeight / 2;
    visibilityController.menuGroup.add(menuRoot.menuGroup);
    //threeRoot.scene.add(menuRoot.menuGroup);
    if (menuRoot.startUp === true)
        {
            
            //console.log("Luces generales inicializadas.");
            menuRoot.menuLight = new THREE.PointLight(0xffffff, 1, 100);
            menuRoot.menuLight.position.set(0, 0, 10);
            menuRoot.menuLight.name = 'menuLight'
            threeRoot.scene.add(menuRoot.menuLight);
            menuRoot.menuAmbient = new THREE.AmbientLight(0x404040);
            menuRoot.menuAmbient.name = 'menuAmbient';
            threeRoot.scene.add(menuRoot.menuAmbient);
            menuRoot.startUp = false;
        }
}


export async function createInstructions() {

    let lang = localStorage.getItem('Language') || 'en';
    let instructions = '../instructions_EN.txt';
    if (lang === 'en') {
        instructions = '../instructions_EN.txt';
      } else if (lang === 'es'){
        instructions = '../instructions_ES.txt';
      } else if (lang === 'eu'){
        instructions = '../instructions_EU.txt';
      }

    const instructionsText = await loadTextFromFile(instructions);

    // Dividir el texto en líneas
    const lines = instructionsText.split('\n');
    const group = new THREE.Group();
    const lineHeight = 0.4; // Ajusta según sea necesario
    let yOffset = 0;

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    lines.forEach((line, index) => {
        const geometry = new THREE.TextGeometry(line, {
            font: menuRoot.font,
            size: 0.3,
            height: 0, // Sin profundidad para texto plano
            curveSegments: 4 // Reducido para optimización
        });

    const textMesh = new THREE.Mesh(geometry, textMaterial);


    // Centrar cada línea individualmente
    geometry.computeBoundingBox();
    const lineWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
    textMesh.position.x = -lineWidth / 2;
    textMesh.position.y = -yOffset;

    group.add(textMesh);

    yOffset += lineHeight;
    });

     // Añadir botón de cierre (X)
     const closeButtonGeometry = new THREE.TextGeometry('X', {
        font: menuRoot.font,
        size: 0.5,
        height: 0,
        color: 0xffffff,
    });
    const closeButtonMesh = new THREE.Mesh(closeButtonGeometry, textMaterial);
    closeButtonMesh.position.set(group.position.x + 5, group.position.y + 3, 0); // Ajusta estas coordenadas según necesites
    group.add(closeButtonMesh);

    // Centrar el grupo completo
    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    group.position.sub(center);

    gameRoot.instructions = group;

    const aspect = window.innerWidth / window.innerHeight;
    const frustumHeight = 2 * Math.tan((threeRoot.camera.fov * Math.PI) / 360) * Math.abs(threeRoot.camera.position.z);
    const frustumWidth = frustumHeight * aspect;

    // Ajustar la posición para centrar en el frame 
    gameRoot.instructions.position.x = 0;  
    gameRoot.instructions.position.y = frustumHeight / 2; // Mover hacia arriba
    gameRoot.instructions.position.z = -threeRoot.camera.position.z + 3;


    gameRoot.instructions.visible = false;
    visibilityController.instructionsGroup.add(gameRoot.instructions);
}

//--------------Componentes basicos de three la escena, camara, canvas donde pintas, raton etc...
export function init_three_components()
{
    threeRoot.scene = new THREE.Scene();
    threeRoot.scene.name = 'Scene';
    threeRoot.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    threeRoot.camera.position.z = 6;
    threeRoot.camera.name = 'camera';

    threeRoot.canvas = document.getElementById('gameCanvas');
    threeRoot.renderer = new THREE.WebGLRenderer({  canvas:  threeRoot.canvas, antialias: true });
    threeRoot.renderer.setSize(window.innerWidth, window.innerHeight);
    threeRoot.renderer.setClearColor(0x000000);
    threeRoot.raycaster = new THREE.Raycaster();
    threeRoot.mouse = new THREE.Vector2();

    createGroups();
}

// ASSEMBLERS

export function createGroups() {

    visibilityController.gameGroup = new THREE.Group();
    visibilityController.gameGroup.name = "gameGroup";
    
    visibilityController.menuGroup = new THREE.Group();
    visibilityController.menuGroup.name = "menuGroup";

    visibilityController.multiplayerLayer = new THREE.Group();
    visibilityController.multiplayerLayer.name = "multiplayerLayer";

    visibilityController.waitingLayer = new THREE.Group();
    visibilityController.waitingLayer.name = "waitingLayer";

    visibilityController.tournamentGroup = new THREE.Group();
    visibilityController.tournamentGroup.name = "tournamentGroup";

    visibilityController.instructionsGroup = new THREE.Group();
    visibilityController.instructionsGroup.name = "instructionsGroup";

    threeRoot.scene.add(visibilityController.gameGroup, visibilityController.menuGroup,
        visibilityController.waitingLayer, visibilityController.multiplayerLayer, visibilityController.tournamentGroup, visibilityController.instructionsGroup);
}

//--------------Listeners---------------------------------------------------
export function init_listeners()
{
    window.addEventListener('resize', onWindowResize, false);
    threeRoot.canvas.addEventListener('mousemove', onMouseMove, false);
    threeRoot.canvas.addEventListener('click', onClick, false);
    window.parent.postMessage({ type: 'gameInitialized' }, '*');
}


export function init_game_components()
{
    createPaddles();
    createBall();
    createScoreTexts();
    createGameOverMessage();
    createPlayerInfoDisplay();
    createInstructions();
}


export function init_tournament_components()
{
    createTournamentWaitingRoom();
}

export function init_menu_components()
{
    createStarField();
    createMenu();
}
