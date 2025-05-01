import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
	titleText: Phaser.GameObjects.Text;
	menuItems: Phaser.GameObjects.Text[];
	isPlaySelected: boolean;
	gameModeItems: Phaser.GameObjects.Text[];

	constructor() {
		super({ key: 'MenuScene' });
		console.log('MenuScene running');
	}

	create() {
		this.menuItems = [];
		this.isPlaySelected = false;
		this.gameModeItems = [];

		this.titleText = this.add.text(400, 100, 'Super Tic Tac Toe', {
			fontSize: 48,
			fontFamily: 'Arial',
			color: '#000000',
		});

		for (let i = 0; i < Object.keys(MenuItemTextEnum).length; i++) {
			this.menuItems.push(
				this.add
					.text(0, 0, Object.values(MenuItemTextEnum)[i], {
						fontFamily: 'Arial',
						fontSize: 32,
						color: '#000000',
					})
					.setInteractive()
					.on('pointerover', () => {
						this.menuItems[i].setStyle({ fill: '#f39c12' });
					})
					.on('pointerout', () =>
						this.menuItems[i].setStyle({ fill: '#000000' })
					)
					.on('pointerdown', () =>
						this.menuItemClicked(
							MenuItemTextEnum[Object.keys(MenuItemTextEnum)[i]]
						)
					)
			);
		}

		for (let i = 0; i < Object.keys(GameModesEnum).length; i++) {
			this.gameModeItems.push(
				this.add
					.text(0, 0, '', {
						fontFamily: 'Arial',
						fontSize: 32,
						color: '#000000',
					})
					.setInteractive()
					.on('pointerover', () => {
						this.gameModeItems[i].setStyle({ fill: '#f39c12' });
					})
					.on('pointerout', () =>
						this.gameModeItems[i].setStyle({ fill: '#000000' })
					)
					.on('pointerdown', () =>
						this.gameModeItemClicked(
							GameModesEnum[Object.keys(GameModesEnum)[i]]
						)
					)
			);
		}

		this.drawMenu();

		this.scale.on('resize', this.drawMenu, this);
	}

	drawMenu() {
		const width = this.scale.width;
		const height = this.scale.height;

		this.titleText.setPosition(
			(width - this.titleText.width) / 2,
			height > 100 ? 100 : height
		);

		for (let i = 0; i < this.menuItems.length; i++) {
			if (i === 0) {
				this.menuItems[i].setPosition(
					(width - this.titleText.width) / 2,
					this.titleText.y + 48 + 36
				);
			} else {
				this.menuItems[i].setPosition(
					(width - this.titleText.width) / 2,
					this.menuItems[i - 1].y + 36
				);
			}
		}

		for (let i = 0; i < this.gameModeItems.length; i++) {
			this.gameModeItems[i].setText(
				this.isPlaySelected ? Object.values(GameModesEnum)[i] : ''
			);
			if (i === 0) {
				this.gameModeItems[i].setPosition(
					this.menuItems[i].x + 164,
					this.menuItems[i].y
				);
			} else {
				this.gameModeItems[i].setPosition(
					this.gameModeItems[i - 1].x,
					this.gameModeItems[i - 1].y + 36
				);
			}
		}
	}

	menuItemClicked(menuItem: MenuItemTextEnum) {
		console.log(menuItem);
		switch (menuItem) {
			case MenuItemTextEnum.play:
				this.isPlaySelected = true;
				break;
			case MenuItemTextEnum.rules:
				this.isPlaySelected = false;
				break;
			case MenuItemTextEnum.theme:
				this.isPlaySelected = false;
				break;

			default:
				break;
		}

		this.drawMenu();
	}

	gameModeItemClicked(menuItem: GameModesEnum) {
		console.log(menuItem);
		switch (menuItem) {
			case GameModesEnum.tttPvc:
				this.scene.start('GameScene', { gameMode: GameModesEnum.tttPvc });
				console.log('tttPvc');
				break;
			case GameModesEnum.tttPvp:
				this.scene.start('GameScene', { gameMode: GameModesEnum.tttPvp });
				console.log('tttPvp');
				break;
			case GameModesEnum.stttPvc:
				console.log('stttPvc');
				break;
			case GameModesEnum.stttPvp:
				console.log('stttPvp');
				break;

			default:
				break;
		}
	}
}

enum MenuItemTextEnum {
	play = 'Play',
	rules = 'Rules',
	theme = 'Theme',
}

export enum GameModesEnum {
	tttPvc = 'Tic-Tac-Toe PvC',
	tttPvp = 'Tic-Tac-Toe PvP',
	stttPvc = 'Super Tic-Tac-Toe PvC',
	stttPvp = 'Super Tic-Tac-Toe PvP',
}
