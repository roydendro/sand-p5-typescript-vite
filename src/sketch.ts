import type p5 from "p5";

// Constants.
export const BACKGROUND_COLOR = "black";
export const RESOLUTION = 120;
export const SPAWN_RADIUS = 6;

// Variables
let grid: number[][];
let color = 1;
let gridWidth: number;
let gridHeight: number;
let cellSize: number;

/**
 * Main sketch function.
 * @param {p5} p - The p5 instance
 */
export default function sketch(p: p5) {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.colorMode("hsl");
        p.noStroke();

        cellSize = Math.floor(
            Math.min(p.width / RESOLUTION, p.height / RESOLUTION),
        );

        gridWidth = Math.floor(p.width / cellSize);
        gridHeight = Math.floor(p.height / cellSize);

        // Create empty grid.
        grid = createGrid(gridWidth, gridHeight);
    };

    p.draw = () => {
        p.background(BACKGROUND_COLOR);

        // Draw the grid.
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] > 0) {
                    p.fill(grid[i][j], 100, 50);
                    p.rect(i * cellSize, j * cellSize, cellSize, cellSize);
                }
            }
        }

        /**
         * Creating a copy of the grid is necessary, otherwise you
         * potentially end up with checking the same cell multiple times due
         * to it having shifted one of the cells below it.
         */
        const nextGrid = createGrid(gridWidth, gridHeight);

        for (let i = 0; i < grid.length; i++) {
            for (let j = grid[i].length - 1; j >= 0; j--) {
                if (grid[i][j] > 0) {
                    const move = Math.round(p.random(-4, 4));

                    // Fall down vertically, check if there is a cell above it.
                    // OR: fall fown diagonally to the left.
                    // OR: fall down diagonally to the right.
                    // OR: stay as you are
                    if (
                        cellExists(grid, i, j + 1) &&
                        nextGrid[i][j + 1] === 0
                    ) {
                        // Down
                        nextGrid[i][j + 1] = grid[i][j];
                    } else if (
                        move === -1 &&
                        cellExists(grid, i - 1, j + 1) &&
                        grid[i - 1][j + 1] === 0
                    ) {
                        // Diagonal left
                        nextGrid[i - 1][j + 1] = grid[i][j];
                    } else if (
                        move === 1 &&
                        cellExists(grid, i + 1, j + 1) &&
                        grid[i + 1][j + 1] === 0
                    ) {
                        // Diagonal right
                        nextGrid[i + 1][j + 1] = grid[i][j];
                    } else {
                        nextGrid[i][j] = grid[i][j];
                    }
                }
            }
        }
        grid = nextGrid;
    };
    p.mouseClicked = () => mouseDown(p);
    p.mouseDragged = () => mouseDown(p);
}

const createGrid = (width: number, height: number) => {
    const newGrid: number[][] = [];
    for (let i = 0; i < width; i++) {
        newGrid[i] = new Array(height).fill(0);
    }
    return newGrid;
};

const cellExists = (grid: number[][], x: number, y: number) => {
    return x >= 0 && x < grid.length && y >= 0 && y < grid[x].length;
};

const mouseDown = (p: p5) => {
    // Find out what cell the mouse has clicked on.
    const x = Math.floor(p.mouseX / cellSize);
    const y = Math.floor(p.mouseY / cellSize);

    for (let i = -SPAWN_RADIUS; i <= SPAWN_RADIUS; i++) {
        for (let j = -SPAWN_RADIUS; j <= SPAWN_RADIUS; j++) {
            const newX = x + i;
            const newY = y + j;
            if (
                // Sort of create a circle/diamond shape around the clicked grid item
                Math.abs(i) + Math.abs(j) <= SPAWN_RADIUS * 1.5 &&
                cellExists(grid, newX, newY) &&
                grid[newX][newY] === 0
            ) {
                grid[newX][newY] = p.random([1, 0, 0]) ? color : 0;
            }
        }

        //Shift the color but stay within the red-yellow range
        color = (color + 0.04) % 66;
    }
};
