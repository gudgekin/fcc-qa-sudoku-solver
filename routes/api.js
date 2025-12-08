'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const solver = new SudokuSolver();
      const { puzzle, coordinate, value } = req.body;

      // 1. Check required fields
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      // 2. Validate puzzle string characters
      if (/[^1-9.]/.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      // 3. Validate length
      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      // 4. Validate coordinate (A-I + 1-9)
      const coordRegex = /^[A-I][1-9]$/i;
      if (!coordRegex.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      // 5. Validate value (1–9 only)
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      // 6. Convert coordinate to row/column indexes
      const rowLetter = coordinate[0].toUpperCase();
      const row = rowLetter.charCodeAt(0) - 'A'.charCodeAt(0);
      const column = parseInt(coordinate[1]) - 1;

      // 7. If the value already exists in that cell, consider it valid
      const currentValue = puzzle[row * 9 + column];
      if (currentValue === value) {
        return res.json({ valid: true });
      }

      // 8. Check for conflicts
      let conflict = [];

      if (!solver.checkRowPlacement(puzzle, row, column, value)) {
        conflict.push('row');
      }
      if (!solver.checkColPlacement(puzzle, row, column, value)) {
        conflict.push('column');
      }
      if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
        conflict.push('region');
      }

      // 9. If no conflicts, valid
      if (conflict.length === 0) {
        return res.json({ valid: true });
      }

      // 10. Otherwise, invalid with conflict list
      return res.json({ valid: false, conflict });

    }); // end check

    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;

      // 1. Check if puzzle is provided
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const solver = new SudokuSolver();

      // 2. Validate puzzle string
      if (!solver.validate(puzzle)) {
        // Check for invalid characters first
        const invalidChars = /[^1-9.]/.test(puzzle);
        if (invalidChars) {
          return res.json({ error: 'Invalid characters in puzzle' });
        }

        // Check for incorrect length
        if (puzzle.length !== 81) {
          return res.json({ error: 'Expected puzzle to be 81 characters long' });
        }

        // fallback error
        return res.json({ error: 'Invalid puzzle' });
      }

      // 3. Solve the puzzle
      const solution = solver.solve(puzzle);
      if (!solution) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }

      // 4. Return the solution
      return res.json({ solution });

    }); // end solve

};
