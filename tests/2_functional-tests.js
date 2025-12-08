const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

// Import puzzles
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    test('POST /api/solve with valid puzzle string', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: puzzlesAndSolutions[0][0] })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
                done();
            });
    });

    test('POST /api/solve with missing puzzle string', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field missing');
                done();
            });
    });

    test('POST /api/solve with invalid characters', (done) => {
        let invalidPuzzle = puzzlesAndSolutions[0][0].split('');
        invalidPuzzle[0] = 'X'; // invalid character
        invalidPuzzle = invalidPuzzle.join('');

        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: invalidPuzzle })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            });
    });

    test('POST /api/solve with incorrect length', (done) => {
        let shortPuzzle = puzzlesAndSolutions[0][0].slice(0, 77); // too short

        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: shortPuzzle })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
    });

    test('POST /api/solve with unsolvable puzzle', (done) => {
        // Make an unsolvable puzzle by placing two identical numbers in first row
        let unsolvablePuzzle = puzzlesAndSolutions[0][0].split('');
        unsolvablePuzzle[0] = '1';
        unsolvablePuzzle[1] = '1';
        unsolvablePuzzle = unsolvablePuzzle.join('');

        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: unsolvablePuzzle })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Puzzle cannot be solved');
                done();
            });
    });

    test('Check a puzzle placement with all fields', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: puzzlesAndSolutions[0][0],
                coordinate: 'A2',
                value: '3'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isTrue(res.body.valid);
                done();
            });
    });

    test('Check a puzzle placement with single placement conflict', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: puzzlesAndSolutions[0][0],
                coordinate: 'A2',
                value: '1' // conflicts with row
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isFalse(res.body.valid);
                assert.include(res.body.conflict, 'row');
                done();
            });
    });

    test('Check a puzzle placement with multiple placement conflicts', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: puzzlesAndSolutions[0][0],
                coordinate: 'A2',
                value: '2' // conflicts with row and column
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isFalse(res.body.valid);
                assert.includeMembers(res.body.conflict, ['row', 'column']);
                done();
            });
    });

    test('Check a puzzle placement with all placement conflicts', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: puzzlesAndSolutions[0][0],
                coordinate: 'A2',
                value: '5'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isFalse(res.body.valid);
                assert.includeMembers(res.body.conflict, ['row', 'region']);
                done();
            });
    });

    test('Check a puzzle placement with missing required fields', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: puzzlesAndSolutions[0][0], value: '3' }) // missing coordinate
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
    });

    test('Check a puzzle placement with invalid characters', (done) => {
        let invalidPuzzle = puzzlesAndSolutions[0][0].split('');
        invalidPuzzle[0] = 'X';
        invalidPuzzle = invalidPuzzle.join('');

        chai.request(server)
            .post('/api/check')
            .send({ puzzle: invalidPuzzle, coordinate: 'A2', value: '3' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            });
    });

    test('Check a puzzle placement with incorrect length', (done) => {
        let shortPuzzle = puzzlesAndSolutions[0][0].slice(0, 77); // too short

        chai.request(server)
            .post('/api/check')
            .send({ puzzle: shortPuzzle, coordinate: 'A2', value: '3' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
    });

    test('Check a puzzle placement with invalid placement coordinate', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'Z9', value: '3' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid coordinate');
                done();
            });
    });

    test('Check a puzzle placement with invalid placement value', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({ puzzle: puzzlesAndSolutions[0][0], coordinate: 'A2', value: '0' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid value');
                done();
            });
    });


});
