import { Character } from '../models/grid';

export enum Difficulty {
	random = 0,
	easy = 1,
	medium = 2,
	hard = 3,
}

export function getNormalNextStep(
	grid: [Character[], Character[], Character[]],
	characterToUse: Character,
	difficulty: Difficulty
): { row: number; cell: number } {
	let row = 0;
	let cell = 0;

	if (difficulty === Difficulty.random) {
		row = Math.floor(Math.random() * 3);
		cell = Math.floor(Math.random() * 3);

		while (grid[row][cell] !== Character.empty) {
			row = Math.floor(Math.random() * 3);
			cell = Math.floor(Math.random() * 3);
		}
	} else if (difficulty === Difficulty.easy) {
		return getNormalEasyNextStep(grid, characterToUse);
	}

	return { row, cell };
}

function getNormalEasyNextStep(
	grid: [Character[], Character[], Character[]],
	characterToUse: Character
): { row: number; cell: number } {
	let row = 0;
	let cell = 0;

	const weightedGrid = grid.map((row) => {
		return row.map((cell) => {
			if (cell === characterToUse) {
				return 1;
			} else if (cell === Character.empty) {
				return 0;
			} else {
				return -1;
			}
		});
	});

	console.log(weightedGrid);

	return { row, cell };
}
