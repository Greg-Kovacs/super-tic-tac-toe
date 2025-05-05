import { Point } from '../models/point';

const CHARACTERPADDINGPERCENT = 0.4;
const CHARACTERPADDING = 30;
export interface gridPoints {
	cellStartingPoints: [Point[], Point[], Point[]];
	cellSideLength: number;
	borderCorners: {
		topLeft: Point;
		topRight: Point;
		bottomLeft: Point;
		bottomRight: Point;
	};
	gridLines: { startPoint: Point; endPoint: Point }[];
}

export interface xPoints {
	topLeft: Point;
	topRight: Point;
	bottomLeft: Point;
	bottomRight: Point;
}

export interface oPoint {
	center: Point;
	radius: number;
}

export function getGridPoints(
	middlePoint: Point,
	sideLength: number,
	lineThickness: number
): gridPoints {
	const cellSideLength = (sideLength - 3 * lineThickness) / 3;
	const gridTopLeft = {
		x: middlePoint.x - sideLength / 2,
		y: middlePoint.y - sideLength / 2,
	};
	const widthThird = sideLength / 3;
	const heightThird = sideLength / 3;

	return {
		cellStartingPoints: [
			[
				{
					x: gridTopLeft.x + lineThickness / 2,
					y: gridTopLeft.y + lineThickness / 2,
				},
				{
					x: gridTopLeft.x + cellSideLength + 1.5 * lineThickness,
					y: gridTopLeft.y + lineThickness / 2,
				},
				{
					x: gridTopLeft.x + 2 * cellSideLength + 2.5 * lineThickness,
					y: gridTopLeft.y + lineThickness / 2,
				},
			],
			[
				{
					x: gridTopLeft.x + lineThickness / 2,
					y: gridTopLeft.y + cellSideLength + 1.5 * lineThickness,
				},
				{
					x: gridTopLeft.x + cellSideLength + 1.5 * lineThickness,
					y: gridTopLeft.y + cellSideLength + 1.5 * lineThickness,
				},
				{
					x: gridTopLeft.x + 2 * cellSideLength + 2.5 * lineThickness,
					y: gridTopLeft.y + cellSideLength + 1.5 * lineThickness,
				},
			],
			[
				{
					x: gridTopLeft.x + lineThickness / 2,
					y: gridTopLeft.y + 2 * cellSideLength + 2.5 * lineThickness,
				},
				{
					x: gridTopLeft.x + cellSideLength + 1.5 * lineThickness,
					y: gridTopLeft.y + 2 * cellSideLength + 2.5 * lineThickness,
				},
				{
					x: gridTopLeft.x + 2 * cellSideLength + 2.5 * lineThickness,
					y: gridTopLeft.y + 2 * cellSideLength + 2.5 * lineThickness,
				},
			],
		],
		cellSideLength,
		borderCorners: {
			topLeft: gridTopLeft,
			topRight: {
				x: gridTopLeft.x + sideLength,
				y: gridTopLeft.y,
			},
			bottomLeft: {
				x: gridTopLeft.x,
				y: gridTopLeft.y + sideLength,
			},
			bottomRight: {
				x: gridTopLeft.x + sideLength,
				y: gridTopLeft.y + sideLength,
			},
		},
		gridLines: [
			{
				startPoint: {
					x: gridTopLeft.x + widthThird,
					y: gridTopLeft.y,
				},
				endPoint: {
					x: gridTopLeft.x + widthThird,
					y: gridTopLeft.y + sideLength,
				},
			},
			{
				startPoint: {
					x: gridTopLeft.x + widthThird * 2,
					y: gridTopLeft.y,
				},
				endPoint: {
					x: gridTopLeft.x + widthThird * 2,
					y: gridTopLeft.y + sideLength,
				},
			},
			{
				startPoint: {
					x: gridTopLeft.x,
					y: gridTopLeft.y + heightThird,
				},
				endPoint: {
					x: gridTopLeft.x + sideLength,
					y: gridTopLeft.y + heightThird,
				},
			},
			{
				startPoint: {
					x: gridTopLeft.x,
					y: gridTopLeft.y + heightThird * 2,
				},
				endPoint: {
					x: gridTopLeft.x + sideLength,
					y: gridTopLeft.y + heightThird * 2,
				},
			},
		],
	};
}

export function getXPoints(startingPoint: Point, sideLength: number): xPoints {
	const centerPoint: Point = {
		x: startingPoint.x + sideLength / 2,
		y: startingPoint.y + sideLength / 2,
	};

	const legLength = sideLength * CHARACTERPADDINGPERCENT;

	return {
		topLeft: {
			x: centerPoint.x - legLength,
			y: centerPoint.y - legLength,
		},
		topRight: {
			x: centerPoint.x + legLength,
			y: centerPoint.y - legLength,
		},
		bottomLeft: {
			x: centerPoint.x - legLength,
			y: centerPoint.y + legLength,
		},
		bottomRight: {
			x: centerPoint.x + legLength,
			y: centerPoint.y + legLength,
		},
	};
}

export function getOPoint(startingPoint: Point, sideLength: number): oPoint {
	return {
		center: {
			x: startingPoint.x + sideLength / 2,
			y: startingPoint.y + sideLength / 2,
		},
		radius: sideLength / 2 - CHARACTERPADDING,
	};
}
