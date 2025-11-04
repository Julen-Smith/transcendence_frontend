import { init_listeners, init_three_components, init_game_components, init_menu_components, init_tournament_components } from './objectAssembler.js';
import { menuRoot, gameRoot } from './values.js';
import { animate } from './engine.js';

const THREE = window.THREE;

function loadFont() {
    return new Promise((resolve, reject) => {
        const loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/droid/droid_sans_regular.typeface.json', 
            (font) => {
                menuRoot.font = font;
                resolve(font);
            },
            undefined,
            (error) => {
                console.log('Error loading font:', error);
                reject(error);
            }
        );
    });
}

window.addEventListener('load', () => {
    init();
});

async function init()
{
    try
    {
        await loadFont();
        init_three_components();
        init_menu_components();
        init_game_components();
        init_listeners();
        init_tournament_components();
        
        gameRoot.gameState = 'menu';
        
        requestAnimationFrame(animate);
    }
    catch (error)
    {
        console.log("Failed to initialize game:", error);
    }
}
