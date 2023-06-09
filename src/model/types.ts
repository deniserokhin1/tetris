export interface IFigure {
    name: string
    matrix: Array<number[]>
    row: number
    column: number
    matrixSize: number
}

export interface IFiguresSchema {
    I: Array<number[]>
    J: Array<number[]>
    L: Array<number[]>
    O: Array<number[]>
    S: Array<number[]>
    Z: Array<number[]>
    T: Array<number[]>
}

export type FigureKey = keyof IFiguresSchema
export type NonEmptyArray<T> = [T, ...T[]]