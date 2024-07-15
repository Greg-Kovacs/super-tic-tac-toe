import Phaser, { GameObjects } from 'phaser';

export default class MenuScene extends Phaser.Scene {
	titleText: Phaser.GameObjects.Text;
	menuItems: Phaser.GameObjects.Text[] = [];
	constructor() {
		super({ key: 'MenuScene' });
	}
	create() {
		this.titleText = this.add.text(400, 100, 'Super Tic Tac Toe', {
			fontSize: 48,
			fontFamily: 'Arial',
			color: '#000000',
		});

		for (let i = 0; i < 3; i++) {
			this.menuItems.push(
				this.add
					.text(0, 0, Object.values(MenuItemText)[i], {
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
						this.menuItemClicked(MenuItemText[Object.keys(MenuItemText)[i]])
					)
			);
		}

		this.scale.on('resize', this.redrawMenu, this);
	}
	redrawMenu() {
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
	}

	menuItemClicked(menuItem: MenuItemText) {
		console.log(menuItem);
	}
}

enum MenuItemText {
	play = 'Play',
	rules = 'Rules',
	theme = 'Theme',
}
