import { convertPositionToIndex, PLAYFIELD_COLUMNS, PLAYFIELD_ROWS } from './utilities'
import './styles/style.scss'
import { Tetris } from './tetris'

const tetris = new Tetris()
const cells = document.querySelectorAll('.grid>div')

initKeydown()
draw()

function initKeydown() {
    document.addEventListener('keydown', onKeydown)
}

function onKeydown(e: KeyboardEvent) {
    switch (e.key) {
        case 'ArrowUp':
            rotateMatrix()
            break
        case 'ArrowDown':
            moveDown()
            break
        case 'ArrowLeft':
            moveLeft()
            break
        case 'ArrowRight':
            moveRight()
            break
        default:
            return
    }
}

function draw() {
    cells.forEach((cell) => cell.removeAttribute('class'))
    drawPlayField()
    drawTetramino()
}

function drawPlayField() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if(!tetris.playfield[row][column]) continue
            const name = tetris.playfield[row][column].toString()
            const cellIndex = convertPositionToIndex(row, column)
            cells[cellIndex].classList.add(name)
        }
    }
}

function drawTetramino() {
    const name = tetris.tetromino.name
    const tetraminoMatrixSize = tetris.tetromino.matrix.length

    for (let row = 0; row < tetraminoMatrixSize; row++) {
        for (let column = 0; column < tetraminoMatrixSize; column++) {
            if (!tetris.tetromino.matrix[row][column]) continue
            if (tetris.tetromino.row + row < 0) continue

            const cellIndex = convertPositionToIndex(
                tetris.tetromino.row + row,
                tetris.tetromino.column + column
            )

            cells[cellIndex].classList.add(name)
        }
    }
}

function moveDown() {
    tetris.moveFigureDown()
    draw()
}

function moveRight() {
    tetris.moveFigureRight()
    draw()
}

function moveLeft() {
    tetris.moveFigureLeft()
    draw()
}

function rotateMatrix() {
    tetris.rotateFigure()
    draw()
}
