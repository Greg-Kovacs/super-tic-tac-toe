export default class Grid {
	grid: [Character[], Character[], Character[]];
	isFinished: boolean;
	winner: Character;

	/**
	 *
	 */
	constructor() {
		this.grid = [
			[Character.empty, Character.empty, Character.empty],
			[Character.empty, Character.empty, Character.empty],
			[Character.empty, Character.empty, Character.empty],
		];
		this.isFinished = false;
		this.winner = Character.empty;
	}

	/**
	 *
	 * @param char Character to place.
	 * @param row Which row to place the Character.
	 * @param cell Which cell to place the Character.
	 * @returns A Result wether the game is ended or not.
	 * @throws Errors if the cell is occupied or the coordinates are not the right value.
	 */
	placeCharacter(char: Character, row: number, cell: number): Result {
		if (0 <= row && row <= 2 && 0 <= cell && cell <= 2) {
			if (this.grid[row][cell] === Character.empty) {
				this.grid[row][cell] = char;
				return this.checkResult(this.grid);
			} else {
				throw new Error('Cell occupied');
			}
		} else {
			throw new Error(
				`Invalid row or cell value. Value should be between 0 and 2. Row: ${row}. Cell: ${cell}`
			);
		}
	}

	/**
	 *
	 * @returns True if there is any empty space left in the grid.
	 */
	isThereEmptyCell(): boolean {
		let result = false;
		this.grid.forEach((row) =>
			row.forEach((cell) => {
				if (cell === Character.empty) {
					result = true;
				}
			})
		);
		return result;
	}

	/**
	 *
	 * @param grid Grid that will be checked.
	 * @returns True if the game ended and the winner character. If it's a draw the winner will be any empty Character.
	 */
	checkResult(grid: [Character[], Character[], Character[]]): Result {
		for (let i = 0; i < grid[0].length; i++) {
			//rows
			if (
				grid[i][0] === grid[i][1] &&
				grid[i][1] === grid[i][2] &&
				grid[i][0] !== Character.empty
			) {
				return { isEnded: true, winningCharacter: grid[i][0] };
			}
			//columns
			if (
				grid[0][i] === grid[1][i] &&
				grid[1][i] === grid[2][i] &&
				grid[0][i] !== Character.empty
			) {
				return { isEnded: true, winningCharacter: grid[0][i] };
			}
		}

		if (
			//top left to bottom right
			(grid[0][0] === grid[1][1] &&
				grid[1][1] === grid[2][2] &&
				grid[1][1] !== Character.empty) ||
			//bottom left to top right
			(grid[2][0] === grid[1][1] &&
				grid[1][1] === grid[0][2] &&
				grid[1][1] !== Character.empty)
		) {
			return { isEnded: true, winningCharacter: grid[1][1] };
		}

		for (let i = 0; i < grid[0].length; i++) {
			for (let j = 0; j < grid[0].length; j++) {
				if (grid[i][j] === Character.empty) {
					return { isEnded: false, winningCharacter: Character.empty };
				}
			}
		}

		return { isEnded: true, winningCharacter: Character.empty };
	}
}

interface Result {
	isEnded: boolean;
	winningCharacter: Character;
}

export enum Character {
	empty = '-',
	x = 'x',
	o = 'o',
}
