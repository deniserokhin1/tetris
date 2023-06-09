import { NonEmptyArray, FigureKey, IFiguresSchema } from 'model/types'

export const PLAYFIELD_COLUMNS = 10
export const PLAYFIELD_ROWS = 20

export const FIGURES: IFiguresSchema = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    O: [
        [1, 1],
        [1, 1],
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
}

export function getRandomElement(array: NonEmptyArray<FigureKey>): FigureKey {
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
}

export function convertPositionToIndex(row: number, column: number) {
    return row * PLAYFIELD_COLUMNS + column
}

export function rotateMatrix(matrix: number[][]): number[][] {
    const N = matrix.length
    const rotatedMatrix: number[][] = []

    for (let i = 0; i < N; i++) {
        rotatedMatrix[i] = []
        for (let j = 0; j < N; j++) {
            rotatedMatrix[i][j] = matrix[N - j - 1][i]
        }
    }

    return rotatedMatrix
}
