class SudokuSolver {

  validate(puzzleString) {

    // check existence and length
    if (!puzzleString || puzzleString.length !== 81) {
      return false;
    }

    // validate characters (1-9 or .)
    const validChars = /^[1-9.]+$/;
    if (!validChars.test(puzzleString)) {
      return false;
    }

    // if valid
    return true;

  } // end validate

  checkRowPlacement(puzzleString, row, column, value) {

    // Convert puzzleString into a 2D array (9x9)
    const grid = [];
    for (let i = 0; i < 9; i++) {
      grid.push(puzzleString.slice(i * 9, i * 9 + 9).split(''));
    }

    // Check if the value already exists in the row
    if (grid[row].includes(value)) {
      return false; // value already in row
    }

    return true; // value can be placed

  } // end checkRowPlacement

  checkColPlacement(puzzleString, row, column, value) {

    // Convert puzzleString into a 2D array (9x9)
    const grid = [];
    for (let i = 0; i < 9; i++) {
      grid.push(puzzleString.slice(i * 9, i * 9 + 9).split(''));
    }

    // Check if the value already exists in the column
    for (let r = 0; r < 9; r++) {
      if (grid[r][column] === value) {
        return false; // value already in column
      }
    }

    return true; // value can be placed    

  } // end checkColPlacement

  checkRegionPlacement(puzzleString, row, column, value) {

    // Convert puzzleString into a 2D array
    const grid = [];
    for (let i = 0; i < 9; i++) {
        grid.push(puzzleString.slice(i * 9, i * 9 + 9).split(''));
    }

    // Determine the starting row and column of the 3x3 region
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;

    // Check all cells in the 3x3 region
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (grid[r][c] === value) {
                return false; // value already exists in this 3x3 region
            }
        }
    }

    return true; // value can be placed

  } // end checkRegionPlacement

  solve(puzzleString) {

    if (!this.validate(puzzleString)) return false;

    // Convert puzzle string to 2D grid
    const grid = [];
    for (let i = 0; i < 9; i++) {
        grid.push(puzzleString.slice(i * 9, i * 9 + 9).split(''));
    }

    // Recursive backtracking function
    const solveGrid = () => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === '.') { // empty cell
                    for (let num = 1; num <= 9; num++) {
                        const value = num.toString();
                        if (
                            this.checkRowPlacement(grid.flat().join(''), row, col, value) &&
                            this.checkColPlacement(grid.flat().join(''), row, col, value) &&
                            this.checkRegionPlacement(grid.flat().join(''), row, col, value)
                        ) {
                            grid[row][col] = value;
                            if (solveGrid()) return true; // recursive call
                            grid[row][col] = '.'; // backtrack
                        }
                    }
                    return false; // no valid number found
                }
            }
        }
        return true; // solved
    };

    const solved = solveGrid();
    if (!solved) return false;

    // Convert grid back to string
    return grid.map(row => row.join('')).join('');
    
  } // end solve

}

module.exports = SudokuSolver;

