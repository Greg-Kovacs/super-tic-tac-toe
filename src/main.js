import Phaser, { Scale } from 'phaser';
import Menu from './scenes/menuScene.ts';
import Game from './scenes/gameScene.ts';

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
let isGameOver = true;
let resultText;
let pvpButtonText;
let pvcButtonText;
let isPvp = true;

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

	pvpButtonText = this.add
		.text(0, 0, '', {
			fontSize: '32px',
			fill: '#000000',
			backgroundColor: '#000000',
			align: 'center',
			fontFamily: 'Arial',
		})
		.setInteractive();

	pvpButtonText.on('pointerdown', () => startGame(true));

	pvcButtonText = this.add
		.text(0, 0, '', {
			fontSize: '32px',
			fill: '#000000',
			backgroundColor: '#000000',
			align: 'center',
			fontFamily: 'Arial',
		})
		.setInteractive();

	pvcButtonText.on('pointerdown', () => startGame(false));

	// redraw game on changes
	this.scale.on('resize', drawGame, this);
	events.on('charPlaced', drawGame, this);
}

function update() {}

function startGame(isPvp_) {
	isPvp = isPvp_;

	result[0] = ['-', '-', '-'];
	result[1] = ['-', '-', '-'];
	result[2] = ['-', '-', '-'];

	isGameOver = false;

	pvpButtonText.setText('');
	pvpButtonText.setPadding({ x: 0 });
	pvcButtonText.setText('');
	pvcButtonText.setPadding({ x: 0 });

	currentChar = 'o';

	events.emit('charPlaced', result);
}

function placeChar(i, j) {
	if (isPvp) {
		if (currentChar === 'x') {
			currentChar = 'o';
		} else {
			currentChar = 'x';
		}

		if (!isGameOver && result[i][j] === '-') {
			result[i][j] = currentChar;
			checkResult();
		}
	} else {
		if (currentChar === 'o') {
			currentChar = 'x';
		}

		if (!isGameOver && result[i][j] === '-') {
			result[i][j] = currentChar;
			checkResult();
		}

		if (!isGameOver) {
			currentChar = 'o';

			let i_ = Math.floor(Math.random() * 3);
			let j_ = Math.floor(Math.random() * 3);

			while (result[i_][j_] !== '-') {
				i_ = Math.floor(Math.random() * 3);
				j_ = Math.floor(Math.random() * 3);
			}

			result[i_][j_] = currentChar;
			checkResult();
		}
	}

	events.emit('charPlaced', result);
}

function drawGame() {
	const graphics = this.graphics;
	const scale = this.scale;
	graphics.clear();

	drawGrid(graphics, scale);
	addGridObjects();
	drawGridCharacters(graphics);
	drawText();
}

function checkResult() {
	//console.log('checking...');
	//console.log(result);
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

function drawGrid(graphics, scale) {
	sideLength = Math.min(scale.width, scale.height) - PADDING * 2;

	point.x = (scale.width - sideLength) / 2;
	point.y = (scale.height - sideLength) / 2;

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

function drawGridCharacters(graphics) {
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
	if (isGameOver) {
		pvpButtonText.setText('Player vs Player');
		pvpButtonText.setBackgroundColor('#0000ff');
		pvpButtonText.setFill('#ffffff');
		pvpButtonText.setPadding({ x: 10 });

		pvcButtonText.setText('Player vs Computer');
		pvcButtonText.setBackgroundColor('#ff0000');
		pvcButtonText.setFill('#ffffff');
		pvcButtonText.setPadding({ x: 10 });
	}

	pvpButtonText.setPosition(point.x, point.y - 2 * 32);
	pvcButtonText.setPosition(
		point.x + pvpButtonText.width + GRIDLINETHICKNESS,
		point.y - 2 * 32
	);
}
