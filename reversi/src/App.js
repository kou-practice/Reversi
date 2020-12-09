import React from 'react';
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

export class Game extends React.Component {
    constructor(props) {
        super(props);
        const squares = [...Array(8)].map(() => Array(8).fill(null));
        squares[3][3] = squares[4][4] = 'white';
        squares[3][4] = squares[4][3] = 'black';
        this.state = {
            squares: squares,
            blackIsNext: true,
            black: 2,
            white: 2,
        };
    }

    handleClick(i, j) {
        if (calcWinner(this.state.black, this.state.white) || this.state.squares[i][j]) {
            return;
        }
        const playerColor = this.state.blackIsNext ? 'black' : 'white';
        const [squares, black, white] = calcMove(this.state.squares, [i, j], playerColor);
        if (black > this.state.black || white > this.state.white) {
            squares[i][j] = playerColor;
            this.setState({
                squares: squares,
                blackIsNext: !this.state.blackIsNext,
                black: black + (this.state.blackIsNext ? 1 : 0),
                white: white + (this.state.blackIsNext ? 0 : 1),
            });
        }
    }

    render () {
        const winner = calcWinner(this.state.black, this.state.white);
        let status;
        if (winner) {
            status = winner;
        } else {
            status = 'Next player: ' + (this.state.blackIsNext ? 'Black' : 'White');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={this.state.squares}
                        onClick={(i, j) => this.handleClick(i, j)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ul>
                        <li>Black : {this.state.black}</li>
                        <li>White : {this.state.white}</li>
                    </ul>
                </div>
            </div>
        );
    }
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