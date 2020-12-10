import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from "react-dom/test-utils";

import { Square, calcNextPlayer } from './App';

let container = null;
beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it("renders black or white", () => {
    act(() => {
        render(<Square />, container);
    });
    expect(container.getElementsByTagName('p')[0].className).toBe("");
});

it("1st player continue", () => {
    const mockCalcMove = jest.fn(() => [, 10, 10]);
    const squares = [...Array(8)].map(() => Array(8).fill(null));
    squares[3][3] = squares[4][4] = 'black';
    const result = calcNextPlayer(mockCalcMove, squares, true, 10, 10);

    expect(result).toBe(true);
    expect(mockCalcMove.mock.calls.length).toBe(2);
    expect(mockCalcMove.mock.calls[0][1]).toEqual(expect.arrayContaining([3, 3]));
    expect([3, 3]).toEqual(expect.arrayContaining(mockCalcMove.mock.calls[0][1]));
});


it("2nd player continue", () => {
    const mockCalcMove = jest.fn(()=> [, 10, 10]);
    const squares = [...Array(8)].map(() => Array(8).fill(null));
    squares[3][3] = squares[4][4] = 'white';
    const result = calcNextPlayer(mockCalcMove, squares, false, 10, 10);

    expect(result).toBe(false);
    expect(mockCalcMove.mock.calls.length).toBe(2);
    expect(mockCalcMove.mock.calls[1][1]).toEqual(expect.arrayContaining([4, 4]));
    expect([4, 4]).toEqual(expect.arrayContaining(mockCalcMove.mock.calls[1][1]));
    
});