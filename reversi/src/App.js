import React, { useState } from 'react';
import './index.css';

export function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            <p className={props.value}></p>
        </button>
    );
}

export function Board(props) {
    const squares = props.squares;
    const Items = squares.map((row, rowIndex) =>
        <div className="board-row" key={rowIndex}>{row.map((item, index) => 
            <Square
                key={index}
                value={item}
                onClick={() => props.onClick(rowIndex, index)}
            />
        )}</div>
    );
    return (
        <div>
            {Items}
        </div>
    );
}

export function Game() {
    const initSquares = [...Array(8)].map(() => Array(8).fill(null));
    initSquares[3][3] = initSquares[4][4] = 'white';
    initSquares[3][4] = initSquares[4][3] = 'black';
    const [squares, setSquares] = useState(initSquares);
    const [blackIsNext, setBlackIsNext] = useState(true);
    const [black, setBlack] = useState(2);
    const [white, setWhite] = useState(2);

    function handleClick(i, j) {
        if (calcWinner(black, white) || squares[i][j]) {
            return;
        }
        const playerColor = blackIsNext ? 'black' : 'white';
        const [newSquares, newBlack, newWhite] = calcMove(squares, [i, j], playerColor);
        if (newBlack > black || newWhite > white) {
            newSquares[i][j] = playerColor;
            setSquares(newSquares);
            setBlackIsNext(calcNextPlayer(calcMove, newSquares, blackIsNext, newBlack, newWhite));
            setBlack(newBlack + (blackIsNext ? 1: 0));
            setWhite(newWhite + (!blackIsNext ? 1: 0));
        }
    }

    const winner = calcWinner(black, white);
    let status;
    if (winner) {
        status = winner;
    } else {
        status = 'Next player: ' + (blackIsNext ? 'Black' : 'White');
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={squares}
                    onClick={(i, j) => handleClick(i, j)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ul>
                    <li>Black : {black}</li>
                    <li>White : {white}</li>
                </ul>
            </div>
        </div>
    );
}

export function calcMove(squares, pos, color) {
    const squaresCopy = squares.map((row) => row.slice());
    const [x, y] =  pos;
    const tmp = [];
    const checkLines = [
        [...Array(x).keys()].map((val) => [x - val - 1, y]),
        [...Array(Math.min(x, 7 - y)).keys()].map((val) => [x - val - 1, y + val + 1]),
        [...Array(7 - y).keys()].map((val) => [x, y + val + 1]),
        [...Array(7 - Math.max(x, y)).keys()].map((val) => [x + val + 1, y + val + 1]),
        [...Array(7 - x).keys()].map((val) => [x + val + 1, y]),
        [...Array(Math.min(7 - x, y)).keys()].map((val) => [x + val + 1, y - val - 1]),
        [...Array(y).keys()].map((val) => [x, y - val - 1]),
        [...Array(Math.min(x, y)).keys()].map((val) => [x - val - 1, y - val - 1]), 
    ];
    for (const line of checkLines) {
        for (const [i, j] of line) {
            if (squares[i][j] === null) {
                break;
            } else if (squares[i][j] === color) {
                tmp.forEach((val) => {
                    const [di, dj] = val;
                    squaresCopy[di][dj] = color;
                });
                break;
            } else {
                tmp.push([i, j]);
            }
        }
        tmp.length = 0;
    }
    const black = squaresCopy.map((row) => row.filter((val) => val === 'black').length).reduce((sum, elem) => sum + elem);
    const white = squaresCopy.map((row) => row.filter((val) => val === 'white').length).reduce((sum, elem) => sum + elem);
    return [squaresCopy, black, white];
}

export function calcWinner(black, white) {
    if (black === 0 || white === 0) {
        return black ? 'First is Winner' : 'Second is Winner';
    } else if (black + white < 64) {
        return null;
    } else if (black === white) {
        return 'Draw'
    } else {
        return black > white ? 'First is Winner' : 'Second is Whinner';
    }
}

export function calcNextPlayer(calcMove, squares, blackIsNext, black, white) {
    const color = blackIsNext ? 'black' : 'white';
    const squaresCopy = squares.map((row) => row.slice());
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (squares[i][j] === null) {
                continue
            };
            const [, newBlack, newWhite] = calcMove(squaresCopy, [i, j], color);
            if (newBlack > black || newWhite > white) {
                return !blackIsNext;
            }
        }
    }
    return blackIsNext;
}
