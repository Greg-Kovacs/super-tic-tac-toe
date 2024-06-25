import Phaser, { Scale } from 'phaser';
import Game from './scenes/game';

const config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: '#ffffff',
	scale: {
		mode: Phaser.Scale.RESIZE,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	scene: {
		preload: preload,
		create: create,
		update: update,
	},
};

const game = new Phaser.Game(config);
const GRIDLINETHICKNESS = 5;
const CHARLINETHICKNESS = 20;
const point = {
	x: 0,
	y: 0,
};
let sideLength = 0;
const cells = [[], [], []];
const result = [
	['-', '-', '-'],
	['-', '-', '-'],
	['-', '-', '-'],
];
let currentChar = 'x';

function preload() {}

function create() {
	this.graphics = this.add.graphics({
		lineStyle: { width: GRIDLINETHICKNESS, color: 0x000000 },
	});

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			let rectangle = this.add
				.rectangle(0, 0, 0, 0, 0x99f8ff, 0)
				.setInteractive();
			cells[i].push(rectangle);

			rectangle.on('pointerup', () => {
				//console.log('grid:', i, j);
				//console.log('game object:', rectangle);
				//console.log(this);
				placeChar(i, j, this);
			});
		}
	}

	// Redraw grid on resize
	this.scale.on('resize', drawGrid, this);
	this.scale.on('resize', addGridObjects, this);
	this.scale.on('resize', drawGridCharacters, this);
}

function placeChar(i, j, scene) {
	if (result[i][j] === '-') {
		result[i][j] = currentChar;
		console.log(result);
		if (currentChar === 'x') {
			currentChar = 'o';
		} else {
			currentChar = 'x';
		}
		console.log('next: ' + currentChar);
		console.log(scene);
		drawGridCharacters(scene);
	}
}

function update() {
	// Game logic updates if needed
}

function drawGrid() {
	const padding = 10;

	sideLength = Math.min(this.scale.width, this.scale.height) - padding * 2;

	point.x = (this.scale.width - sideLength) / 2;
	point.y = (this.scale.height - sideLength) / 2;

	const graphics = this.graphics;
	graphics.lineStyle(GRIDLINETHICKNESS, 0x000000);
	graphics.clear();

	// Draw the horizontal lines
	graphics.moveTo(point.x, point.y);
	graphics.lineTo(point.x + sideLength, point.y);

	graphics.moveTo(point.x, point.y + sideLength / 3);
	graphics.lineTo(point.x + sideLength, point.y + sideLength / 3);

	graphics.moveTo(point.x, point.y + (sideLength * 2) / 3);
	graphics.lineTo(point.x + sideLength, point.y + (sideLength * 2) / 3);

	graphics.moveTo(point.x, point.y + sideLength);
	graphics.lineTo(point.x + sideLength, point.y + sideLength);

	// Draw the vertical lines
	graphics.moveTo(point.x, point.y);
	graphics.lineTo(point.x, point.y + sideLength);

	graphics.moveTo(point.x + sideLength / 3, point.y);
	graphics.lineTo(point.x + sideLength / 3, point.y + sideLength);

	graphics.moveTo(point.x + (sideLength * 2) / 3, point.y);
	graphics.lineTo(point.x + (sideLength * 2) / 3, point.y + sideLength);

	graphics.moveTo(point.x + sideLength, point.y);
	graphics.lineTo(point.x + sideLength, point.y + sideLength);

	graphics.strokePath();
}

function addGridObjects() {
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			cells[i][j].x = point.x + (i * sideLength) / 3 + GRIDLINETHICKNESS / 2;
			cells[i][j].y = point.y + (j * sideLength) / 3 + GRIDLINETHICKNESS / 2;

			cells[i][j].width = sideLength / 3 - GRIDLINETHICKNESS;
			cells[i][j].height = sideLength / 3 - GRIDLINETHICKNESS;

			cells[i][j].setInteractive();
		}
	}
}

function drawGridCharacters() {
	const graphics = this.graphics;
	if (graphics) {
		graphics.lineStyle(CHARLINETHICKNESS, 0x000000);

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (result[i][j] === 'x') {
					graphics.moveTo(
						point.x +
							sideLength / 6 +
							(i * sideLength) / 3 -
							(sideLength * 0.8) / 6,
						point.y +
							sideLength / 6 +
							(j * sideLength) / 3 -
							(sideLength * 0.8) / 6
					);

					graphics.lineTo(
						point.x +
							sideLength / 6 +
							(i * sideLength) / 3 +
							(sideLength * 0.8) / 6,
						point.y +
							sideLength / 6 +
							(j * sideLength) / 3 +
							(sideLength * 0.8) / 6
					);

					graphics.moveTo(
						point.x +
							sideLength / 6 +
							(i * sideLength) / 3 +
							(sideLength * 0.8) / 6,
						point.y +
							sideLength / 6 +
							(j * sideLength) / 3 -
							(sideLength * 0.8) / 6
					);

					graphics.lineTo(
						point.x +
							sideLength / 6 +
							(i * sideLength) / 3 -
							(sideLength * 0.8) / 6,
						point.y +
							sideLength / 6 +
							(j * sideLength) / 3 +
							(sideLength * 0.8) / 6
					);

					graphics.strokePath();
				} else if (result[i][j] === 'o') {
					graphics.strokeCircle(
						point.x + sideLength / 6 + (i * sideLength) / 3,
						point.y + sideLength / 6 + (j * sideLength) / 3,
						((sideLength / 3 - GRIDLINETHICKNESS - CHARLINETHICKNESS) * 0.9) / 2
					);
				}
			}
		}
	}
}
