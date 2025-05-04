import GameScene from './scenes/gameScene';
import MenuScene from './scenes/menuScene';
import tttGameScene from './scenes/tttGameScene';

const config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: '#ffffff',
	scale: {
		mode: Phaser.Scale.RESIZE,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	scene: [MenuScene, GameScene, tttGameScene],
};

export default config;
