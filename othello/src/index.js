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

class Board extends React.Component {
    renderSquare(i, j) {
        return (
            <Square
                key={`${i}-${j}`}
                value={this.props.squares[i][j]}
                onClick={() => this.props.onClick(i, j)}
            />
        );
    }

    render() {
        const list = [];

        for (const i of [...Array(9).keys()]) {
            for (const j of [...Array(9).keys()]) {
                list.push(<div>{this.renderSquare(i, j)}</div>);
            }
        }

        return (
            <div>
                {list}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: [...Array(9)].map(() => Array(9).fill(null)),
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