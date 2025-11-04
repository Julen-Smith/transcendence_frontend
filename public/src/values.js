export const gameRoot = {
    leftPaddle: null,
    rightPaddle: null,
    ball: null,
    gameState: 'menu',
    ballSpeed: { x: 0.03, y: 0.03 },
    ballSpeedModification:{ x: 0.1, y: -0.1, z: 0.1 },//,  //Base values :{ x: 0.03, y: -0.03, z: 0.06 } { x: 0.07, y: -0.07, z: 0.06 }
    paddleSpeed: 0.15,
    paddleSpeed: 0.15,
    score: { left: 0, right: 0 },
    scoreTextLeft: null,
    scoreTextRight: null,
    socket: null,
    playerNumber: null,
    waitingText: null,
    isMultiplayer: false,
    isWaiting: false,
    opponentInfo: null,
    lastTime: 0,
    fixedDeltaTime: 1000 / 60,
    accumulator: 0,
    maxScore: 5 ,
    singlePlayerMode:1,
    conectionErrText: null,
    gameOverText: null,
    waitingStars: null,
    localPlayerInfo : null,
    opponentPlayerInfo: null,
    leftDataSquare: null,
    rightDataSquare: null,
    playerId:null,
    enemyId: null,
    player2Id:null,
    enemy2Id:null,
    playerInfo: { id: 1, username: "42 Random", level: 5 , score: 9000  , photo: './../preview.gif' },
    isTournament: null,
    leftPanelTop: null,
    rightPanelTop: null,
    leftPanelDown: null,
    rightPanelDown: null,
    rightWinnerPanel:null,
    leftWinnerPanel:null,
    instructions:null,
    isTournament:null,
    debugMode:null,
    localplayerId:null,
    localplayerSide:null,
    onTournament:null,
    winnerId:null,
    isFinal: null,
    enemy_disconnect: null
};

export const visibilityController = {
    gameGroup : null,
    menuGroup: null,
    multiplayerLayer : null,
    waitingLayer: null,
    tournamentGroup: null,
}

export const menuRoot = {
    menuItems: ['Single Player', 'Multiplayer', 'Instructions', 'Tournaments','Exit'],
    menuMeshes: [],
    selectedItem: -1,
    font: null,
    stars: null,
    menuGroup: null,
    menuLight: null,
    menuAmbient: null,
    startUp : true,
};

export const threeRoot = {
    scene: null,
    camera: null,
    renderer: null,
    raycaster: null,
    mouse: null,
    canvas: null,
};

export const customizationRoot = {
    star_color: 0x195dcd,  //base 0xffffff
    menuFontColor: 0x195dcd,
    waiting_player_tout: 30000 , // base 30000
    conection_error_tout: 3000,
    waiting_tournament_tout: 600000 , // base 30000
    tournament_conection_error_tout: 1000,
};

export const repeatedComponents = {
    exit_button_comp: {text: null , button: null , enabled: false, textWidth: null, textHeight: null},
}


export const tournamentRoot = {
    players : [0,0,0,0] , 
    rooms: [],
    bracket: null,
    playerInfo: { id: 1, username: "42 Random", level: 5 , score: 9000  , photo: '../preview.gif' },
};
