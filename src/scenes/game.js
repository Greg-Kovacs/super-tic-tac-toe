import Phaser from "phaser";

const WIDTH = 600;
const HEIGHT = 600;

export default class Game extends Phaser.Scene {
	preload() {
		//this.load.image("background", "assets/background2.png");
		//this.load.image("x", "assets/x.png");
		//this.load.image("o", "assets/o.png");
	}

	create() {
		//this.add.image(400, 300, "background");
		this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x99f8ff);

		for (let i = 0; i < 2; i++) {
			this.add.rectangle(WIDTH / 3 + i * 200, HEIGHT / 2, 20, HEIGHT, 0x000000);
		}

		for (let i = 0; i < 2; i++) {
			this.add.rectangle(WIDTH / 2, HEIGHT / 3 + i * 200, WIDTH, 20, 0x000000);
		}

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
	}
}
