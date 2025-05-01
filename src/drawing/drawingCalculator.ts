import { Point } from '../models/point';

export default class DrawingCalculator {
	getXPoints(middlePoint: Point, height: number, width: number): xPoints {
		return {
			topLeft: { x: middlePoint.x - width / 2, y: middlePoint.y - height / 2 },
			topRight: { x: middlePoint.x + width / 2, y: middlePoint.y - height / 2 },
			bottomLeft: {
				x: middlePoint.x - width / 2,
				y: middlePoint.y + height / 2,
			},
			bottomRight: {
				x: middlePoint.x + width / 2,
				y: middlePoint.y + height / 2,
			},
		};
	}
}

interface xPoints {
	topLeft: Point;
	topRight: Point;
	bottomLeft: Point;
	bottomRight: Point;
}
