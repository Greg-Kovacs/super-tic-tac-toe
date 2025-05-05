import Phaser, { GameObjects } from 'phaser';
import { GameModesEnum } from './menuScene';
import { Point } from '../models/point';
import Grid, { Character } from '../models/grid';
import {
	getGridPoints,
	getOPoint,
	getXPoints,
	gridPoints,
} from '../drawing/drawingCalculator';
import { Difficulty, getNormalNextStep } from '../ai/ai';

const GRIDLINETHICKNESS = 5;
const CHARLINETHICKNESS = 20;
const PADDING = 100;

export default class NormalGameScene extends Phaser.Scene {
	private graphics: Phaser.GameObjects.Graphics;
	private gridMiddlePoint: Point = { x: 0, y: 0 };
	private gridSideLength: number = 0;
	private grid: Grid;
	private currentChar: Character;
	private cells: [
		GameObjects.Rectangle[],
		GameObjects.Rectangle[],
		GameObjects.Rectangle[]
	];
	private resultText: GameObjects.Text;
	private menuButtonText: GameObjects.Text;
	private restartButtonText: GameObjects.Text;
	private isGameStarted = false;
	private isGameOver = false;
	private isPvp = false;

	init(data) {
		console.log(data);
	}

	constructor() {
		super({ key: 'NormalGameScene' });
		console.log('tttpvp ctor');
	}

	create() {
		this.events.on('shutdown', this.shutdown, this);
		this.scale.on('resize', this.drawGame, this);
		this.events.on('charPlaced', this.drawGame, this);

		this.graphics = this.add.graphics({
			lineStyle: { width: GRIDLINETHICKNESS, color: 0x000000 },
		});
		this.graphics.clear();
		this.cells = [[], [], []];
		this.grid = new Grid();

		this.menuButtonText = this.add
			.text(0, 0, 'Menu', {
				fontSize: '24px',
				color: '#000000',
				backgroundColor: '#ffffff',
				align: 'center',
				fontFamily: 'Arial',
			})
			.setInteractive()
			.on('pointerover', () => {
				this.menuButtonText.setStyle({ fill: '#f39c12' });
			})
			.on('pointerout', () => this.menuButtonText.setStyle({ fill: '#000000' }))
			.on('pointerdown', () => {
				this.scene.start('MenuScene');
			});

		this.restartButtonText = this.add
			.text(0, 24, 'Restart', {
				fontSize: '24px',
				color: '#000000',
				backgroundColor: '#ffffff',
				align: 'center',
				fontFamily: 'Arial',
			})
			.setInteractive()
			.on('pointerover', () => {
				this.restartButtonText.setStyle({ fill: '#f39c12' });
			})
			.on('pointerout', () =>
				this.restartButtonText.setStyle({ fill: '#000000' })
			)
			.on('pointerdown', () => {
				this.scene.restart();
			});

		this.resultText = this.add.text(this.scale.width / 2, 10, ' ', {
			fontSize: '24px',
			color: '#000000',
			backgroundColor: '#ffffff',
			align: 'center',
			fontFamily: 'Arial',
		});

		this.currentChar = Character.x;

		this.createClickableCells();
		this.drawGame();
		this.time.delayedCall(500, () => {
			this.isGameOver = false;
			this.isGameStarted = true;
		});
	}

	shutdown() {
		this.events.off('shutdown', this.shutdown);
		this.events.off('charPlaced', this.drawGame);
		this.scale.off('resize', this.drawGame);
	}

	drawGame() {
		const midPoint: Point = {
			x: this.scale.width / 2,
			y: this.scale.height / 2,
		};
		const sideLength =
			(this.scale.height > this.scale.width
				? this.scale.width
				: this.scale.height) - PADDING;

		const gridPoints = getGridPoints(midPoint, sideLength, GRIDLINETHICKNESS);
		this.graphics.clear();
		this.drawGrid(this.graphics, this.scale, gridPoints);
		this.drawGridCharacters(this.graphics, gridPoints);
		this.resizeClickableCells(gridPoints);
		this.drawTextFields(gridPoints);
	}

	createClickableCells() {
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				let rectangle = this.add
					.rectangle(0, 0, 0, 0, 0x99f8ff, 0)
					.setInteractive();
				this.cells[i].push(rectangle);

				rectangle.on('pointerup', () => {
					this.placeChar(i, j);
				});
			}
		}
	}

	placeChar(row: number, cell: number) {
		if (this.isGameStarted && !this.isGameOver) {
			try {
				const { isEnded, winningCharacter } = this.grid.placeCharacter(
					this.currentChar,
					row,
					cell
				);

				this.events.emit('charPlaced');
				this.isGameOver = isEnded;
				if (this.isGameOver) {
					this.resultText.setText(
						`Winner: ${winningCharacter.toString().toUpperCase()}`
					);
				}

				this.currentChar =
					this.currentChar === Character.x ? Character.o : Character.x;

				getNormalNextStep(this.grid.grid, this.currentChar, Difficulty.easy);
			} catch (error) {}
		}
	}

	drawTextFields(gridPoints: gridPoints) {
		this.resultText.setPosition(
			gridPoints.borderCorners.topLeft.x +
				gridPoints.cellSideLength * 1.5 -
				this.resultText.text.length,
			10
		);
	}

	resizeClickableCells(gridPoints: gridPoints) {
		for (let i = 0; i < this.cells.length; i++) {
			for (let j = 0; j < this.cells[i].length; j++) {
				this.cells[i][j].x = gridPoints.cellStartingPoints[i][j].x;
				this.cells[i][j].y = gridPoints.cellStartingPoints[i][j].y;

				this.cells[i][j].width = gridPoints.cellSideLength;
				this.cells[i][j].height = gridPoints.cellSideLength;

				this.cells[i][j].setInteractive();
			}
		}
	}

	drawGridCharacters(graphics: GameObjects.Graphics, gridPoints: gridPoints) {
		graphics.lineStyle(CHARLINETHICKNESS, 0x000000);

		for (let i = 0; i < this.grid.grid.length; i++) {
			for (let j = 0; j < this.grid.grid[i].length; j++) {
				if (this.grid.grid[i][j] === Character.x) {
					const xPoints = getXPoints(
						gridPoints.cellStartingPoints[i][j],
						gridPoints.cellSideLength
					);
					graphics.moveTo(xPoints.topLeft.x, xPoints.topLeft.y);
					graphics.lineTo(xPoints.bottomRight.x, xPoints.bottomRight.y);
					graphics.moveTo(xPoints.topRight.x, xPoints.topRight.y);
					graphics.lineTo(xPoints.bottomLeft.x, xPoints.bottomLeft.y);
					graphics.strokePath();
				} else if (this.grid.grid[i][j] === Character.o) {
					const oPoint = getOPoint(
						gridPoints.cellStartingPoints[i][j],
						gridPoints.cellSideLength
					);
					graphics.strokeCircle(
						oPoint.center.x,
						oPoint.center.y,
						oPoint.radius
					);
				}
			}
		}
	}

	drawGrid(
		graphics: GameObjects.Graphics,
		scale: Phaser.Scale.ScaleManager,
		gridPoints: gridPoints
	) {
		graphics.lineStyle(GRIDLINETHICKNESS, 0x000000);
		graphics.clear();

		//outer border
		graphics.moveTo(
			gridPoints.borderCorners.topLeft.x,
			gridPoints.borderCorners.topLeft.y
		);
		graphics.lineTo(
			gridPoints.borderCorners.topRight.x,
			gridPoints.borderCorners.topRight.y
		);
		graphics.lineTo(
			gridPoints.borderCorners.bottomRight.x,
			gridPoints.borderCorners.bottomRight.y
		);
		graphics.lineTo(
			gridPoints.borderCorners.bottomLeft.x,
			gridPoints.borderCorners.bottomLeft.y
		);
		graphics.lineTo(
			gridPoints.borderCorners.topLeft.x,
			gridPoints.borderCorners.topLeft.y
		);

		gridPoints.gridLines.forEach((line) => {
			graphics.moveTo(line.startPoint.x, line.startPoint.y);
			graphics.lineTo(line.endPoint.x, line.endPoint.y);
		});

		graphics.strokePath();
	}
}
