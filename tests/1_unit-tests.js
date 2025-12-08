const chai = require('chai');
const assert = chai.assert;

const puzzles = require('../controllers/puzzle-strings.js');
const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', function() {

    setup(() => {
        solver = new Solver();  
    });

    // TEST 1 81 characters
    test('Logic handles a valid puzzle string of 81 characters', () => {
        let puzzle = puzzles.puzzlesAndSolutions[0][0]; // first puzzle string
        const result = solver.validate(puzzle);
        assert.equal(result, true);
    }); // end 1

    // TEST 2 Invalid characters
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
        // make puzzle string invalid
        let invalidPuzzle = puzzles.puzzlesAndSolutions[0][0].split('');
        invalidPuzzle[0] = 'X'; // replace character with invalid
        invalidPuzzle = invalidPuzzle.join('');   
        const result = solver.validate(invalidPuzzle);
        assert.equal(result, false);
    }); // end 2

    // TEST 3 NOT 81 characters
    test('Logic handles a puzzle string that is not 81 characters in length', () => {
        // remove last 5 characters
        let shortPuzzle = puzzles.puzzlesAndSolutions[0][0].slice(0, 76); // only 76 characters
        const result = solver.validate(shortPuzzle);
        assert.equal(result, false); // should return false
    }); // end 3

    // TEST 4 Valid row placement
    test('Logic handles a valid row placement', () => {
        const puzzle = puzzles.puzzlesAndSolutions[0][0];
        const row = 0;     // first row
        const column = 2;  // third column
        const value = '3'; // assume 3 can go here
        const result = solver.checkRowPlacement(puzzle, row, column, value);
        assert.equal(result, true);
    }); // end 4

    // TEST 5 Invalid row placement
    test('Logic handles an invalid row placement', () => {
        const puzzle = puzzles.puzzlesAndSolutions[0][0];
        const row = 0;     // first row
        const column = 2;  // third column
        const value = '5'; // 5 already exists in the first row
        const result = solver.checkRowPlacement(puzzle, row, column, value);
        assert.equal(result, false);
    }); // end 5

    // TEST 6 Valid column placement
    test('Logic handles a valid column placement', () => {
        const puzzle = puzzles.puzzlesAndSolutions[0][0];
        const row = 0;       // first row
        const column = 1;    // second column
        const value = '3';   // assume 3 is valid in this column
        const result = solver.checkColPlacement(puzzle, row, column, value);
        assert.equal(result, true);
    }); // end 6

    // TEST 7 Invalid column placement
    test('Logic handles an invalid column placement', () => {
        const puzzle = puzzles.puzzlesAndSolutions[0][0];
        const row = 0;       // first row
        const column = 1;    // second column
        const value = '6';   // 5 already exists in this column
        const result = solver.checkColPlacement(puzzle, row, column, value);
        assert.equal(result, false);
    });

    // TEST 8 Valid region placement
    test('Logic handles a valid region (3x3 grid) placement', () => {
        const puzzle = puzzles.puzzlesAndSolutions[0][0];
        const row = 0;       // first row
        const column = 1;    // second column
        const value = '3';   // assume 3 can go in this 3x3 box
        const result = solver.checkRegionPlacement(puzzle, row, column, value);
        assert.equal(result, true);
    }); // end 8

    // TEST 9 Invalid region placement
    test('Logic handles an invalid region (3x3 grid) placement', () => {
        const puzzle = puzzles.puzzlesAndSolutions[0][0];
        const row = 0;       // first row
        const column = 1;    // second column
        const value = '5';   // 5 already exists in this 3x3 box
        const result = solver.checkRegionPlacement(puzzle, row, column, value);
        assert.equal(result, false);
    }); // end 9

    // TEST 10 Valid strings pass the solver
    test('Valid puzzle strings pass the solver', () => {
        puzzles.puzzlesAndSolutions.forEach(([puzzle, solution]) => {
            const result = solver.solve(puzzle);
            assert.equal(result, solution); // solved puzzle should match solution
        });
    }); // end 10

    // TEST 11 Invalid strings fail the solver
    test('Invalid puzzle strings fail the solver', () => {
        // Take a valid puzzle and replace one character with an invalid one
        let invalidPuzzle = puzzles.puzzlesAndSolutions[0][0].split('');
        invalidPuzzle[0] = 'X'; // invalid character
        invalidPuzzle = invalidPuzzle.join('');
        const result = solver.solve(invalidPuzzle);
        assert.equal(result, false); // should return false
    }); // end 11

    // TEST 12 Solver returns expected solution 
    test('Solver returns the expected solution for an incomplete puzzle', () => {
        const [puzzle, solution] = puzzles.puzzlesAndSolutions[1]; // pick second puzzle
        const result = solver.solve(puzzle);
        assert.equal(result, solution); // should match known solution
    }); // end 12


});
