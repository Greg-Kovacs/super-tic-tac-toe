import Phaser, { GameObjects } from 'phaser';
import { GameModesEnum } from './menuScene';

const GRIDLINETHICKNESS = 5;
const CHARLINETHICKNESS = 20;
const PADDING = 100;

interface GameSceneProps {
	gameMode: GameModesEnum;
}

export default class GameScene extends Phaser.Scene {
	private gameMode: GameModesEnum;
	private graphics: Phaser.GameObjects.Graphics;
	private startingPoint: { x: number; y: number };
	private sideLength: number;
	private cells: [
		GameObjects.Rectangle[],
		GameObjects.Rectangle[],
		GameObjects.Rectangle[]
	];
	private currentChar: string;
	private grid: [string[], string[], string[]];
	private isGameOver: boolean;
	private resultText: GameObjects.Text;
	private pvpButtonText: GameObjects.Text;
	private pvcButtonText: GameObjects.Text;
	private menuButtonText: GameObjects.Text;
	private isPvp: boolean;
	private isDestroyed: boolean;
	events = new Phaser.Events.EventEmitter();

	init(data: GameSceneProps) {
		console.log(data);
		this.gameMode = data.gameMode;
	}

	constructor() {
		super({ key: 'GameScene' });
		console.log('GameScene running');
	}

	create() {
		this.startingPoint = {
			x: 0,
			y: 0,
		};
		this.sideLength = 0;
		this.cells = [[], [], []];
		this.currentChar = 'o';
		this.grid = [
			['-', '-', '-'],
			['-', '-', '-'],
			['-', '-', '-'],
		];
		this.isGameOver = true;
		this.isPvp = true;
		this.isDestroyed = false;

		this.graphics = this.add.graphics({
			lineStyle: { width: GRIDLINETHICKNESS, color: 0x000000 },
		});

		// add the gameObjects that detect the clicking
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

		/*this.pvpButtonText = this.add
			.text(0, 0, '', {
				fontSize: '32px',
				color: '#000000',
				backgroundColor: '#000000',
				align: 'center',
				fontFamily: 'Arial',
			})
			.setInteractive()
			.on('pointerdown', () => this.startGame(true));

		this.pvcButtonText = this.add
			.text(0, 0, '', {
				fontSize: '32px',
				color: '#000000',
				backgroundColor: '#000000',
				align: 'center',
				fontFamily: 'Arial',
			})
			.setInteractive()
			.on('pointerdown', () => this.startGame(false));*/

		this.resultText = this.add.text(0, 0, '', {
			fontSize: '32px',
			color: '#000000',
			backgroundColor: '#ffffff',
			align: 'center',
			fontFamily: 'Arial',
		});

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
				this.isDestroyed = true;
				this.scene.start('MenuScene');
			});

		this.drawGame();

		// redraw game on changes
		this.scale.on('resize', this.drawGame, this);
		this.events.on('charPlaced', this.drawGame, this);

		this.time.delayedCall(500, () => {
			this.startGame(this.gameMode === GameModesEnum.tttPvp ? true : false);
		});
	}

	/**
	 *
	 * @param isPvp_ true starts the game in pvp mode
	 */
	startGame(isPvp_: boolean) {
		console.log(isPvp_);

		this.isPvp = isPvp_;

		this.grid[0] = ['-', '-', '-'];
		this.grid[1] = ['-', '-', '-'];
		this.grid[2] = ['-', '-', '-'];

		this.isGameOver = false;

		/*this.pvpButtonText.setText('');
		this.pvpButtonText.setPadding({ x: 0 });
		this.pvcButtonText.setText('');
		this.pvcButtonText.setPadding({ x: 0 });*/
		this.resultText.setText('');

		this.currentChar = 'o';

		this.events.emit('charPlaced', this.grid);
	}

	placeChar(i, j) {
		if (this.isPvp) {
			if (this.currentChar === 'x') {
				this.currentChar = 'o';
			} else {
				this.currentChar = 'x';
			}

			if (!this.isGameOver && this.grid[i][j] === '-') {
				this.grid[i][j] = this.currentChar;
				this.checkResult();
			}
		} else {
			if (this.currentChar === 'o') {
				this.currentChar = 'x';
			}

			//check results
			if (!this.isGameOver && this.grid[i][j] === '-') {
				this.grid[i][j] = this.currentChar;
				this.checkResult();
			}

			// if not game over then computer places a character
			if (!this.isGameOver) {
				this.currentChar = 'o';

				if (this.isThereEmptyCell()) {
					let i_ = Math.floor(Math.random() * 3);
					let j_ = Math.floor(Math.random() * 3);

					while (this.grid[i_][j_] !== '-') {
						i_ = Math.floor(Math.random() * 3);
						j_ = Math.floor(Math.random() * 3);
					}

					this.grid[i_][j_] = this.currentChar;
				}
				this.checkResult();
			}
		}

		this.events.emit('charPlaced', this.grid);
	}

	isThereEmptyCell(): boolean {
		let result = false;

		this.grid.forEach((rows) =>
			rows.forEach((cell) => {
				if (cell === '-') {
					console.log(cell);

					result = true;
				}
			})
		);
		return result;
	}

	drawGame() {
		const graphics = this.graphics;
		const scale = this.scale;
		graphics.clear();

		if (!this.isDestroyed) {
			this.drawGrid(graphics, scale);
			this.resizeRepositionCells();
			this.drawGridCharacters(graphics);
			this.drawText();
		}
	}

	checkResult() {
		if (
			(this.grid[0][0] === this.grid[0][1] &&
				this.grid[0][1] === this.grid[0][2] &&
				this.grid[0][0] !== '-') ||
			(this.grid[1][0] === this.grid[1][1] &&
				this.grid[1][1] === this.grid[1][2] &&
				this.grid[1][1] !== '-') ||
			(this.grid[2][0] === this.grid[2][1] &&
				this.grid[2][1] === this.grid[2][2] &&
				this.grid[2][2] !== '-') ||
			(this.grid[0][0] === this.grid[1][0] &&
				this.grid[1][0] === this.grid[2][0] &&
				this.grid[0][0] !== '-') ||
			(this.grid[0][1] === this.grid[1][1] &&
				this.grid[1][1] === this.grid[2][1] &&
				this.grid[1][1] !== '-') ||
			(this.grid[0][2] === this.grid[1][2] &&
				this.grid[1][2] === this.grid[2][2] &&
				this.grid[2][2] !== '-') ||
			(this.grid[0][0] === this.grid[1][1] &&
				this.grid[1][1] === this.grid[2][2] &&
				this.grid[1][1] !== '-') ||
			(this.grid[2][0] === this.grid[1][1] &&
				this.grid[1][1] === this.grid[0][2] &&
				this.grid[1][1] !== '-')
		) {
			this.resultText.setText(`Winner: ${this.currentChar.toUpperCase()}`);
			this.isGameOver = true;
			this.drawText();
		}

		if (!this.isThereEmptyCell()) {
			this.resultText.setText(`Draw`);
			this.isGameOver = true;
			this.drawText();
		}
	}

	drawGrid(graphics, scale) {
		this.sideLength = Math.min(scale.width, scale.height) - PADDING * 2;

		this.startingPoint.x = (scale.width - this.sideLength) / 2;
		this.startingPoint.y = (scale.height - this.sideLength) / 2;

		graphics.lineStyle(GRIDLINETHICKNESS, 0x000000);
		graphics.clear();

		// Draw the horizontal lines
		graphics.moveTo(this.startingPoint.x, this.startingPoint.y);
		graphics.lineTo(
			this.startingPoint.x + this.sideLength,
			this.startingPoint.y
		);

		graphics.moveTo(
			this.startingPoint.x,
			this.startingPoint.y + this.sideLength / 3
		);
		graphics.lineTo(
			this.startingPoint.x + this.sideLength,
			this.startingPoint.y + this.sideLength / 3
		);

		graphics.moveTo(
			this.startingPoint.x,
			this.startingPoint.y + (this.sideLength * 2) / 3
		);
		graphics.lineTo(
			this.startingPoint.x + this.sideLength,
			this.startingPoint.y + (this.sideLength * 2) / 3
		);

		graphics.moveTo(
			this.startingPoint.x,
			this.startingPoint.y + this.sideLength
		);
		graphics.lineTo(
			this.startingPoint.x + this.sideLength,
			this.startingPoint.y + this.sideLength
		);

		// Draw the vertical lines
		graphics.moveTo(this.startingPoint.x, this.startingPoint.y);
		graphics.lineTo(
			this.startingPoint.x,
			this.startingPoint.y + this.sideLength
		);

		graphics.moveTo(
			this.startingPoint.x + this.sideLength / 3,
			this.startingPoint.y
		);
		graphics.lineTo(
			this.startingPoint.x + this.sideLength / 3,
			this.startingPoint.y + this.sideLength
		);

		graphics.moveTo(
			this.startingPoint.x + (this.sideLength * 2) / 3,
			this.startingPoint.y
		);
		graphics.lineTo(
			this.startingPoint.x + (this.sideLength * 2) / 3,
			this.startingPoint.y + this.sideLength
		);

		graphics.moveTo(
			this.startingPoint.x + this.sideLength,
			this.startingPoint.y
		);
		graphics.lineTo(
			this.startingPoint.x + this.sideLength,
			this.startingPoint.y + this.sideLength
		);

		graphics.strokePath();
	}

	resizeRepositionCells() {
		if (this.cells) {
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (this.cells[i][j]) {
						this.cells[i][j].x =
							this.startingPoint.x +
							(i * this.sideLength) / 3 +
							GRIDLINETHICKNESS / 2;
						this.cells[i][j].y =
							this.startingPoint.y +
							(j * this.sideLength) / 3 +
							GRIDLINETHICKNESS / 2;

						this.cells[i][j].width = this.sideLength / 3 - GRIDLINETHICKNESS;
						this.cells[i][j].height = this.sideLength / 3 - GRIDLINETHICKNESS;

						this.cells[i][j].setInteractive();
					}
				}
			}
		}
	}

	drawGridCharacters(graphics) {
		if (graphics) {
			graphics.lineStyle(CHARLINETHICKNESS, 0x000000);

			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (this.grid[i][j] === 'x') {
						graphics.moveTo(
							this.startingPoint.x +
								this.sideLength / 6 +
								(i * this.sideLength) / 3 -
								(this.sideLength * 0.8) / 6,
							this.startingPoint.y +
								this.sideLength / 6 +
								(j * this.sideLength) / 3 -
								(this.sideLength * 0.8) / 6
						);

						graphics.lineTo(
							this.startingPoint.x +
								this.sideLength / 6 +
								(i * this.sideLength) / 3 +
								(this.sideLength * 0.8) / 6,
							this.startingPoint.y +
								this.sideLength / 6 +
								(j * this.sideLength) / 3 +
								(this.sideLength * 0.8) / 6
						);

						graphics.moveTo(
							this.startingPoint.x +
								this.sideLength / 6 +
								(i * this.sideLength) / 3 +
								(this.sideLength * 0.8) / 6,
							this.startingPoint.y +
								this.sideLength / 6 +
								(j * this.sideLength) / 3 -
								(this.sideLength * 0.8) / 6
						);

						graphics.lineTo(
							this.startingPoint.x +
								this.sideLength / 6 +
								(i * this.sideLength) / 3 -
								(this.sideLength * 0.8) / 6,
							this.startingPoint.y +
								this.sideLength / 6 +
								(j * this.sideLength) / 3 +
								(this.sideLength * 0.8) / 6
						);

						graphics.strokePath();
					} else if (this.grid[i][j] === 'o') {
						graphics.strokeCircle(
							this.startingPoint.x +
								this.sideLength / 6 +
								(i * this.sideLength) / 3,
							this.startingPoint.y +
								this.sideLength / 6 +
								(j * this.sideLength) / 3,
							((this.sideLength / 3 - GRIDLINETHICKNESS - CHARLINETHICKNESS) *
								0.9) /
								2
						);
					}
				}
			}
		}
	}

	drawText() {
		if (this.isGameOver) {
			this.pvpButtonText.setText('Player vs Player');
			this.pvpButtonText.setBackgroundColor('#0000ff');
			this.pvpButtonText.setFill('#ffffff');
			this.pvpButtonText.setPadding({ x: 10 });

			this.pvcButtonText.setText('Player vs Computer');
			this.pvcButtonText.setBackgroundColor('#ff0000');
			this.pvcButtonText.setFill('#ffffff');
			this.pvcButtonText.setPadding({ x: 10 });
		}

		this.pvpButtonText.setPosition(
			this.startingPoint.x,
			this.startingPoint.y - 2 * 32
		);

		this.resultText.setPosition(
			this.startingPoint.x + this.pvpButtonText.width + GRIDLINETHICKNESS,
			this.startingPoint.y - 2 * 32
		);

		this.pvcButtonText.setPosition(
			this.startingPoint.x +
				this.pvpButtonText.width +
				this.resultText.width +
				2 * GRIDLINETHICKNESS,
			this.startingPoint.y - 2 * 32
		);
	}
}
