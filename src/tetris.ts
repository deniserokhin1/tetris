import { IFigure, NonEmptyArray, FigureKey } from 'model/types'
import {
    PLAYFIELD_ROWS,
    PLAYFIELD_COLUMNS,
    getRandomElement,
    rotateMatrix,
    FIGURES,
} from './utilities'

export class Tetris {
    playfield: Array<(number | string)[]> = []
    tetromino: IFigure = {
        column: 0,
        matrix: [],
        name: '',
        row: 0,
        matrixSize: 0,
    }
    constructor() {
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
        const row = -2

        this.tetromino = {
            name,
            matrix,
            row,
            column,
            matrixSize,
        }
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
        if (!this.canMove()) this.tetromino.column -= 1
    }

    moveFigureLeft() {
        this.tetromino.column -= 1
        if (!this.canMove()) this.tetromino.column += 1
    }

    rotateFigure() {
        const prevMatrix = this.tetromino.matrix
        const rotatedMatrix = rotateMatrix(this.tetromino.matrix)
        this.tetromino.matrix = rotatedMatrix
        if (!this.canMove()) this.tetromino.matrix = prevMatrix
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

                this.playfield[this.tetromino.row + row][this.tetromino.column + column] =
                    this.tetromino.name
            }
        }
        this.generateFigure()
    }

    isTouch(row: number, column: number) {
        return this.playfield[this.tetromino.row + row]?.[this.tetromino.column + column]
    }
}
