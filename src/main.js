import Phaser from "phaser";
import Game from "./scenes/game";

const WIDTH = 600;
const HEIGHT = 600;

const config = {
	type: Phaser.AUTO,
	width: WIDTH,
	height: HEIGHT,
};

const game = new Phaser.Game(config);
game.scene.add("game", Game);
game.scene.start("game", { width: WIDTH, height: HEIGHT });
