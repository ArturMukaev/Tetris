const canvas = document.getElementById('game');
const butt = document.getElementById('but');
const context = canvas.getContext('2d');
const sizze = 32;
var masOfFig = [];
var playfield = [];
let score = 0;
for (let row = -2; row < 20; row++) {
    playfield[row] = [];
    for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0;
    }
}

const figures = {
    'A': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    'B': [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
    ],
    'C': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'D': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'E': [
        [1, 1],
        [1, 1],
    ],
    'F': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    'G': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    'H': [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'I': [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
    ]
};

const colors = {
    'A': 'cyan',
    'B': 'yellow',
    'C': 'purple',
    'D': 'green',
    'E': 'red',
    'F': '#00FFFF',
    'G': '#DAA520',
    'H': '#FF6347',
    'I': '#FF00FF'
};

let count = 0;
let figure = getNextFigure();
let rAF = null;
let gameOver = false;


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateFigure() {
    const mas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

    while (mas.length) {
        const rand = getRandomInt(0, mas.length - 1);
        const name = mas.splice(rand, 1)[0];
        masOfFig.push(name);
    }
}

function getNextFigure() {
    if (masOfFig.length === 0) {
        generateFigure();
    }
    const name = masOfFig.pop();
    const matrix = figures[name];

    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    const row = name === 'A' ? -1 : -2;

    return {
        name: name,
        matrix: matrix,
        row: row,
        col: col
    };
}

function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );
    return result;
}

function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] && (
                cellCol + col < 0 ||
                cellCol + col >= playfield[0].length ||
                cellRow + row >= playfield.length ||
                playfield[cellRow + row][cellCol + col])
            ) {
                return false;
            }
        }
    }
    return true;
}

function placeFigure() {
    for (let row = 0; row < figure.matrix.length; row++) {
        for (let col = 0; col < figure.matrix[row].length; col++) {
            if (figure.matrix[row][col]) {

                if (figure.row + row < 0) {
                    return showGameOver();
                }
                playfield[figure.row + row][figure.col + col] = figure.name;

            }
        }
    }

    for (let row = playfield.length - 1; row >= 0;) {

        if (playfield[row].every(cell => !!cell)) {
            score++;
            for (let r = row; r >= 0; r--) {
                for (let c = 0; c < playfield[r].length; c++) {
                    playfield[r][c] = playfield[r - 1][c];
                }
            }
        } else {
            row--;
        }
    }
    figure = getNextFigure();
}


function showGameOver() {
    cancelAnimationFrame(rAF);
    gameOver = true;
    alert("Game Over! Твой результат: " + score);
    butt.style.visibility = 'visible';
    score = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            playfield[row][col] = 0;
        }
    }
}

function playGame() {
    gameOver = false;
    butt.style.visibility = 'hidden';
    rAF = requestAnimationFrame(playGame);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText("Счет: " + score.toString(), canvas.width / 2, 30);
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            if (playfield[row][col]) {
                const name = playfield[row][col];
                context.fillStyle = colors[name];
                context.fillRect(col * sizze, row * sizze, sizze - 1, sizze - 1);
            }
        }
    }

    if (figure) {
        if (score < 5) {
            if (++count > 35) {
                figure.row++;
                count = 0;
                if (!isValidMove(figure.matrix, figure.row, figure.col)) {
                    figure.row--;
                    placeFigure();
                }
            }
        }
        if (score > 4 && score < 10) {
            if (++count > 25) {
                figure.row++;
                count = 0;
                if (!isValidMove(figure.matrix, figure.row, figure.col)) {
                    figure.row--;
                    placeFigure();
                }
            }
        }
        if (score > 9) {
            if (++count > 15) {
                figure.row++;
                count = 0;
                if (!isValidMove(figure.matrix, figure.row, figure.col)) {
                    figure.row--;
                    placeFigure();
                }
            }
        }
        context.fillStyle = colors[figure.name];

        for (let row = 0; row < figure.matrix.length; row++) {
            for (let col = 0; col < figure.matrix[row].length; col++) {
                if (figure.matrix[row][col]) {

                    context.fillRect((figure.col + col) * sizze, (figure.row + row) * sizze, sizze - 1, sizze - 1);
                }
            }
        }
    }
}

document.addEventListener('keydown', function (e) {
    if (gameOver) return;

    if (e.which === 37 || e.which === 39) {
        const col = e.which === 37
            ? figure.col - 1// условие 1
            : figure.col + 1;// условие 2
        if (isValidMove(figure.matrix, figure.row, col)) {
            figure.col = col;
        }
    }

    if (e.which === 38) {
        const matrix = rotate(figure.matrix);
        if (isValidMove(matrix, figure.row, figure.col)) {
            figure.matrix = matrix;
        }
    }

    if (e.which === 40) {
        const row = figure.row + 1;
        if (!isValidMove(figure.matrix, row, figure.col)) {
            figure.row = row - 1;
            placeFigure();
            return;
        }
        figure.row = row;
    }
});


