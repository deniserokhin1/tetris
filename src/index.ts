import { convertPositionToIndex, PLAYFIELD_COLUMNS, PLAYFIELD_ROWS } from './utilities'
import './styles/style.scss'
import { Tetris } from './tetris'
import Hammer from 'hammerjs'

const button = document.querySelector('.settings')

button?.addEventListener('mouseup', start)

function start() {
    button?.classList.toggle('hide')

    let timeOutId: NodeJS.Timeout
    let requestId: number
    let hammer: HammerManager

    const board = document.querySelector('.grid')
    board?.classList.add('start')

    const tetris = new Tetris(board as HTMLElement)

    const cells = document.querySelectorAll('.grid>div')

    initKeydown()
    initTouch()
    moveDown()

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
            case ' ':
                dropDown()
            default:
                return
        }
    }

    function initTouch() {
        document.addEventListener('dblclick', (e) => {
            e.preventDefault()
        })

        hammer = new Hammer(document.querySelector('body') as HTMLElement)
        hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL })
        hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL })

        const treshold = 30
        let deltaX = 0
        let deltaY = 0

        hammer.on('panstart', () => {
            deltaX = 0
            deltaY = 0
        })

        hammer.on('panleft', (event) => {
            if (Math.abs(event.deltaX - deltaX) > treshold) {
                moveLeft()
                deltaX = event.deltaX
                deltaY = event.deltaY
            }
        })

        hammer.on('panright', (event) => {
            if (Math.abs(event.deltaX - deltaX) > treshold) {
                moveRight()
                deltaX = event.deltaX
                deltaY = event.deltaY
            }
        })

        hammer.on('pandown', (event) => {
            if (Math.abs(event.deltaY - deltaY) > treshold) {
                moveDown()
                deltaX = event.deltaX
                deltaY = event.deltaY
            }
        })

        hammer.on('swipedown', () => {
            dropDown()
        })

        hammer.on('tap', () => {
            rotateMatrix()
        })
    }

    function draw() {
        cells.forEach((cell) => cell.removeAttribute('class'))
        drawPlayField()
        drawFigure()
        drawGhostFigure()
    }

    function drawPlayField() {
        for (let row = 0; row < PLAYFIELD_ROWS; row++) {
            for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
                if (!tetris.playfield[row][column]) continue
                const name = tetris.playfield[row][column].toString()
                const cellIndex = convertPositionToIndex(row, column)
                cells[cellIndex].classList.add(name)
            }
        }
    }

    function drawFigure() {
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
        stopLoop()
        tetris.isAutoMove && startLoop()

        if (tetris.isGameOver) gameOver()
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

    function startLoop() {
        timeOutId = setTimeout(() => {
            requestId = requestAnimationFrame(moveDown)
        }, 1000)
    }

    function stopLoop() {
        cancelAnimationFrame(requestId)
        clearTimeout(timeOutId)
    }

    function drawGhostFigure() {
        if (!tetris.isPromt) return
        const tetraminoMatrixSize = tetris.tetromino.matrix.length
        for (let row = 0; row < tetraminoMatrixSize; row++) {
            for (let column = 0; column < tetraminoMatrixSize; column++) {
                if (!tetris.tetromino.matrix[row][column]) continue
                if (tetris.tetromino.ghostRow + row < 0) continue

                const cellIndex = convertPositionToIndex(
                    tetris.tetromino.ghostRow + row,
                    tetris.tetromino.ghostColumn + column
                )

                cells[cellIndex].classList.add('ghost')
            }
        }
    }

    function dropDown() {
        tetris.dropFigureDown()
        draw()
        stopLoop()
        tetris.isAutoMove && startLoop()

        if (tetris.isGameOver) gameOver()
    }

    function gameOver() {
        stopLoop()
        document.removeEventListener('keydown', onKeydown)
        hammer.off('panstart panleft panright pandown swipedown tap')
        gameOverAnimation()
    }

    function gameOverAnimation() {
        const cellsArray = Array.from(cells)
        const filledCells = cellsArray.filter((cell) => cell.classList.length > 0)

        clearField(filledCells)
    }

    async function clearField(filledCells: Element[]) {
        await Promise.all(
            filledCells.map((cell, i) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        cell.classList.add('gameover')
                    }, i * 10)
                    setTimeout(() => {
                        cell.removeAttribute('class')
                        resolve(true)
                    }, i * 10 + 500)
                })
            })
        )

        if (board) board.innerHTML = ''
        button?.classList.toggle('hide')
        board?.classList.remove('start')
    }
}
