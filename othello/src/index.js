import React from 'react';
import ReactDom from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            <p className={props.value}></p>
        </button>
    );
}

function Board(props) {
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

class Game extends React.Component {
    constructor(props) {
        super(props);
        const squares = [...Array(8)].map(() => Array(8).fill(null));
        squares[3][3] = squares[4][4] = 'white';
        squares[3][4] = squares[4][3] = 'black';
        this.state = {
            squares: squares,
            blackIsNext: true,
        };
    }

    handleClick(i, j) {
        const squares = this.state.squares.slice();
        if (squares[i][j]) {
            return;
        }
        squares[i][j] = this.state.blackIsNext ? 'black' : 'white';
        this.setState({
            squares: squares,
            blackIsNext: !this.state.blackIsNext,
        })
    }

    render () {
        const status = 'Next player: ' + (this.state.blackIsNext ? 'Black' : 'White');

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
                    <ol></ol>
                </div>
            </div>
        );
    }
}

ReactDom.render (
    <Game />,
    document.getElementById('root')
);
