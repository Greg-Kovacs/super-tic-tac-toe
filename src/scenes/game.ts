import Phaser, { GameObjects } from "phaser";

export default class Game extends Phaser.Scene {
	WIDTH;
	HEIGHT;

	init(data) {
		console.log(data);

		this.WIDTH = data.width;
		this.HEIGHT = data.height;

		console.log(this.WIDTH);
		console.log(this.HEIGHT);
	}

	preload() {
		//this.load.image("background", "assets/background2.png");
		//this.load.image("x", "assets/x.png");
		//this.load.image("o", "assets/o.png");
	}

	create() {
		//this.add.image(400, 300, "background");
		this.add.rectangle(
			this.WIDTH / 2,
			this.HEIGHT / 2,
			this.WIDTH,
			this.HEIGHT,
			0x99f8ff
		);

		CreateGrid(1, 2, 3);

		this.add.circle(300, 300, 50, 0xff0000);
		this.add.circle(300, 300, 40, 0x99f8ff);
		this.add.circle(300, 500, 40, 0x00ff00);

		/*this.add.image(400, 300, "x");

					this.add.line(0, 0, 100, 100, 200, 200, 0xff0000);
					this.add.rectangle(500, 100, 300, 100, 0xff0000);
					this.add.polygon(
						0,
						0,
						[
							[500, 500],
							[510, 490],
							[610, 590],
							[600, 600],
						],
						0xfcbe03
					);*/

		function CreateGrid(
			middleX: Number,
			middleY: Number,
			distance: Number
		): GameObjects.Shape[] {
			let array: GameObjects.Shape[] = [];

			for (let i = 0; i < 2; i++) {
				const line = this.add.rectangle(
					this.WIDTH / 3 + i * 200,
					this.HEIGHT / 2,
					20,
					this.HEIGHT,
					0x000000
				);
				array.push(line);
			}

			for (let i = 0; i < 2; i++) {
				this.add.rectangle(
					this.WIDTH / 2,
					this.HEIGHT / 3 + i * 200,
					this.WIDTH,
					20,
					0x000000
				);
			}

			return array;
		}
	}
}
