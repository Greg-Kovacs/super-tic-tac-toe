import Phaser, { Scale } from "phaser";
import Game from "./scenes/game";

const config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: '#ffffff',
	scale: {
		mode: Phaser.Scale.RESIZE,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

const game = new Phaser.Game(config);
//game.scene.add("game", Game);
//game.scene.start("game", { width: WIDTH, height: HEIGHT });

function preload(){

}

function create() {
    this.graphics = this.add.graphics({ lineStyle: { width: 5, color: 0x000000 } });
    drawGrid.call(this);

    // Redraw grid on resize
    this.scale.on('resize', drawGrid, this);

	addSlotObjects.call(this)
}

function update() {
    // Game logic updates if needed
}

function drawGrid() {
    const width = this.scale.width;
    const height = this.scale.height;
    const graphics = this.graphics;
    const padding = 10; // Adjust the padding as needed for visibility

    graphics.clear();

    // Determine the size of the square grid based on the smaller dimension
    const gridSize = Math.min(width, height) - padding * 2;
    const offsetX = (width - gridSize) / 2; 
    const offsetY = (height - gridSize) / 2;

    // Define grid lines based on ratios
    const oneThird = 1 / 3;
    const twoThirds = 2 / 3;

    // Calculate actual positions
    const x1 = offsetX + gridSize * oneThird;
    const x2 = offsetX + gridSize * twoThirds;
    const y1 = offsetY + gridSize * oneThird;
    const y2 = offsetY + gridSize * twoThirds;

    // Draw the horizontal lines
    graphics.moveTo(offsetX, y1);
    graphics.lineTo(offsetX + gridSize, y1);
    graphics.moveTo(offsetX, y2);
    graphics.lineTo(offsetX + gridSize, y2);

    // Draw the vertical lines
    graphics.moveTo(x1, offsetY);
    graphics.lineTo(x1, offsetY + gridSize);
    graphics.moveTo(x2, offsetY);
    graphics.lineTo(x2, offsetY + gridSize);

	// Draw the border
    graphics.moveTo(offsetX, offsetY); // Top-left corner
    graphics.lineTo(offsetX + gridSize, offsetY); // Top border
    graphics.lineTo(offsetX + gridSize, offsetY + gridSize); // Right border
    graphics.lineTo(offsetX, offsetY + gridSize); // Bottom border
    graphics.lineTo(offsetX, offsetY); // Left border

    graphics.strokePath();
}

function addSlotObjects(){
	const width = this.scale.width;
    const height = this.scale.height;
    const padding = 10; // Adjust the padding as needed for visibility

    // Determine the size of the square grid based on the smaller dimension
    const gridSize = Math.min(width, height) - padding * 2;
    const offsetX = (width - gridSize) / 2; 
    const offsetY = (height - gridSize) / 2;

	// Define grid lines based on ratios
	const oneThird = 1 / 3;
	const twoThirds = 2 / 3;

	// Calculate actual positions
	const x1 = offsetX + gridSize * oneThird;
	const x2 = offsetX + gridSize * twoThirds;
	const y1 = offsetY + gridSize * oneThird;
	const y2 = offsetY + gridSize * twoThirds;

	console.log(offsetX);
	console.log(offsetY);

	this.add.rectangle(
		offsetX + (x1-offsetX)/2,
		offsetY + (y1-offsetY)/2,
		x1-offsetX,
		y1,
		0x99f8ff
	);
}

