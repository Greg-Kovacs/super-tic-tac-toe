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
const PADDING = 100;
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
let currentChar = 'o';
let isGameOver = false;
let resultText;
let startButtonText;

const events = new Phaser.Events.EventEmitter();

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
				placeChar(i, j);
			});
		}
	}

	resultText = this.add.text(0, 0, '', {
		fontSize: '32px',
		fill: '#000000',
		fontFamily: 'Arial',
	});

	startButtonText = this.add
		.text(400, 300, 'Start New Game', {
			fontSize: '32px',
			fill: '#ffffff',
			backgroundColor: '#0000ff',
			padding: { x: 10, y: 5 },
			align: 'center',
			fontFamily: 'Arial',
		})
		.setOrigin(0.5)
		.setInteractive();

	startButtonText.on('pointerover', () =>
		startButtonText.setStyle({ fill: '#ff0' })
	);
	startButtonText.on('pointerout', () =>
		startButtonText.setStyle({ fill: '#fff' })
	);
	startButtonText.on('pointerdown', () => startGame());

	// Redraw grid on resize
	this.scale.on('resize', drawGrid, this);
	this.scale.on('resize', addGridObjects, this);
	this.scale.on('resize', drawGridCharacters, this);
	this.scale.on('resize', drawText, this);

	events.on('charPlaced', drawGridCharacters, this);
}

function update() {}

function startGame() {
	console.log('start');
}

function placeChar(i, j) {
	if (currentChar === 'x') {
		currentChar = 'o';
	} else {
		currentChar = 'x';
	}

	if (!isGameOver && result[i][j] === '-') {
		result[i][j] = currentChar;
		checkResult();
	}
	events.emit('charPlaced', result);
}

function checkResult() {
	console.log('checking...');
	console.log(result);
	if (
		(result[0][0] === result[0][1] &&
			result[0][1] === result[0][2] &&
			result[0][0] !== '-') ||
		(result[1][0] === result[1][1] &&
			result[1][1] === result[1][2] &&
			result[1][1] !== '-') ||
		(result[2][0] === result[2][1] &&
			result[2][1] === result[2][2] &&
			result[2][2] !== '-') ||
		(result[0][0] === result[1][0] &&
			result[1][0] === result[2][0] &&
			result[0][0] !== '-') ||
		(result[0][1] === result[1][1] &&
			result[1][1] === result[2][1] &&
			result[1][1] !== '-') ||
		(result[0][2] === result[1][2] &&
			result[1][2] === result[2][2] &&
			result[2][2] !== '-') ||
		(result[0][0] === result[1][1] &&
			result[1][1] === result[2][2] &&
			result[1][1] !== '-') ||
		(result[2][0] === result[1][1] &&
			result[1][1] === result[0][2] &&
			result[1][1] !== '-')
	) {
		console.log(currentChar + ' won');
		isGameOver = true;
		drawText();
	}
}

function drawGrid() {
	sideLength = Math.min(this.scale.width, this.scale.height) - PADDING * 2;

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

function drawText() {
	resultText.setPosition(point.x, point.y - 2 * 32);
	if (isGameOver) {
		resultText.setText(currentChar.toUpperCase() + ' won');
	}
	startButtonText.setPosition(point.x + 500, point.y - 2 * 32);
}
