import GameScene from './scenes/gameScene';
import MenuScene from './scenes/menuScene';
import NormalGameScene from './scenes/normalGameScene';

const config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: '#ffffff',
	scale: {
		mode: Phaser.Scale.RESIZE,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	scene: [MenuScene, GameScene, NormalGameScene],
};

export default config;
