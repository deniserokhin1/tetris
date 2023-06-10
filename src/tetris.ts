import { IFigure, NonEmptyArray, FigureKey } from 'model/types'
import {
    PLAYFIELD_ROWS,
    PLAYFIELD_COLUMNS,
    getRandomElement,
    rotateMatrix,
    FIGURES,
} from './utilities'

export class Tetris {
    isGameOver: boolean = false
    playfield: Array<(number | string)[]> = []
    tetromino: IFigure = {
        column: 0,
        matrix: [],
        name: '',
        row: 0,
        matrixSize: 0,
        ghostColumn: 0,
        ghostRow: 0,
    }
    isPromt: boolean = false
    isAutoMove: boolean = true
    constructor(board: HTMLElement) {
        for (let index = 0; index < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; index++) {
            board.append(document.createElement('div'))
        }
        this.init()
    }

    init() {
        this.generatePlayfield()
        this.generateFigure()
    }

    generatePlayfield() {
        this.playfield = new Array(PLAYFIELD_ROWS)
            .fill(1)
            .map(() => new Array(PLAYFIELD_COLUMNS).fill(0))
    }

    generateFigure() {
        const keys = Object.keys(FIGURES) as NonEmptyArray<FigureKey>
        const name = getRandomElement(keys)
        const matrix = FIGURES[name]
        const matrixSize = matrix.length

        const column = PLAYFIELD_COLUMNS / 2 - Math.floor(matrix.length / 2)
        const row = -1

        this.tetromino = {
            name,
            matrix,
            row,
            column,
            matrixSize,
            ghostColumn: this.isPromt ? column : -1,
            ghostRow: this.isPromt ? row : -1,
        }

        this.calculateGhostPosition()
    }

    moveFigureDown() {
        this.tetromino.row += 1
        if (!this.canMove()) {
            this.tetromino.row -= 1
            this.landFigure()
        }
    }

    moveFigureRight() {
        this.tetromino.column += 1
        if (!this.canMove()) {
            this.tetromino.column -= 1
        } else {
            this.calculateGhostPosition()
        }
    }

    moveFigureLeft() {
        this.tetromino.column -= 1
        if (!this.canMove()) {
            this.tetromino.column += 1
        } else {
            this.calculateGhostPosition()
        }
    }

    rotateFigure() {
        const prevMatrix = this.tetromino.matrix
        const rotatedMatrix = rotateMatrix(this.tetromino.matrix)
        this.tetromino.matrix = rotatedMatrix
        if (!this.canMove()) {
            this.tetromino.matrix = prevMatrix
        } else {
            this.calculateGhostPosition()
        }
    }

    dropFigureDown() {
        this.tetromino.row = this.tetromino.ghostRow
        this.landFigure()
    }

    canMove() {
        const matrix = this.tetromino.matrix
        for (let row = 0; row < matrix.length; row++) {
            for (let column = 0; column < matrix.length; column++) {
                if (!matrix[row][column]) continue
                if (this.isOutSideOfPlayBoard(row, column)) return false
                if (this.isTouch(row, column)) return false
            }
        }
        return true
    }

    isOutSideOfPlayBoard(row: number, column: number) {
        return (
            this.tetromino.column + column < 0 ||
            this.tetromino.column + column >= PLAYFIELD_COLUMNS ||
            this.tetromino.row + row >= this.playfield.length
        )
    }

    landFigure() {
        for (let row = 0; row < this.tetromino.matrixSize; row++) {
            for (let column = 0; column < this.tetromino.matrixSize; column++) {
                if (!this.tetromino.matrix[row][column]) continue
                if (this.isOutSideOfTopBoard(row)) {
                    this.isGameOver = true
                    return
                }

                this.playfield[this.tetromino.row + row][this.tetromino.column + column] =
                    this.tetromino.name
            }
        }
        this.clearFilledRows()
        this.generateFigure()
    }

    isOutSideOfTopBoard(row: number) {
        return this.tetromino.row + row < 0
    }

    isTouch(row: number, column: number) {
        return this.playfield[this.tetromino.row + row]?.[this.tetromino.column + column]
    }

    clearFilledRows() {
        const filledLines = this.findFilledRows()
        this.removeFilledRows(filledLines)
    }

    findFilledRows() {
        const filledRows = []
        for (let row = 0; row < PLAYFIELD_ROWS; row++) {
            if (this.playfield[row].every((cell) => Boolean(cell))) filledRows.push(row)
        }
        return filledRows
    }

    removeFilledRows(filledRows: number[]) {
        filledRows.forEach((row) => this.dropRowsAbove(row))
    }

    dropRowsAbove(rowToDelete: number) {
        for (let row = rowToDelete; row > 0; row--) {
            this.playfield[row] = this.playfield[row - 1]
        }
        this.playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0)
    }

    calculateGhostPosition() {
        const figureRow = this.tetromino.row
        this.tetromino.row++
        while (this.canMove()) {
            this.tetromino.row++
        }
        this.tetromino.ghostRow = this.tetromino.row - 1
        this.tetromino.ghostColumn = this.tetromino.column
        this.tetromino.row = figureRow
    }
}
