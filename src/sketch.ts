import type p5 from "p5";

// Constants
export const BACKGROUND_COLOR = "black";
export const RESOLUTION = 240;
export const SPAWN_RADIUS = 7;

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

        setupGrid(p);
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);

        setupGrid(p);
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

/**
 * Sets up the grid properties based on window size and resolution.
 *
 * @param p - The p5 instance.
 *
 * @returns {void}
 */
const setupGrid = (p: p5): void => {
    // Calculate grid properties based on windowsize and RESOLUTION
    cellSize = Math.floor(
        Math.min(p.width / RESOLUTION, p.height / RESOLUTION),
    );
    gridWidth = Math.floor(p.width / cellSize);
    gridHeight = Math.floor(p.height / cellSize);

    // Create empty grid.
    grid = createGrid(gridWidth, gridHeight);
};

/**
 * Creates a 2D grid of specified width and height, filled with zeros.
 *
 * @param width - The width of the grid.
 * @param height - The height of the grid.
 *
 * @returns {number[][]} - A 2D grid of specified width and height, filled with zeros.
 */
const createGrid = (width: number, height: number): number[][] => {
    const newGrid: number[][] = [];
    for (let i = 0; i < width; i++) {
        newGrid[i] = new Array(height).fill(0);
    }
    return newGrid;
};

/**
 * Checks if a cell exists within the grid.
 *
 * @param grid - The 2D grid to check.
 * @param x - The x-coordinate of the cell.
 * @param y - The y-coordinate of the cell.
 *
 * @returns {boolean} - True if the cell exists within the grid, false otherwise.
 */
const cellExists = (grid: number[][], x: number, y: number): boolean => {
    return x >= 0 && x < grid.length && y >= 0 && y < grid[x].length;
};

/**
 * Handles mouse down and drag events.
 * Places cells in the grid based on the mouse position and the defined spawn radius.
 * Shifts the color of the cells within the red-yellow range.
 *
 * @param p - The p5 instance.
 *
 * @returns {void}
 */
const mouseDown = (p: p5): void => {
    // Find out what cell the mouse has clicked/dragged on.
    const clickedX = Math.floor(p.mouseX / cellSize);
    const clickedY = Math.floor(p.mouseY / cellSize);

    for (let i = -SPAWN_RADIUS; i <= SPAWN_RADIUS; i++) {
        for (let j = -SPAWN_RADIUS; j <= SPAWN_RADIUS; j++) {
            // Make sure the cell is within the bounds of the grid.
            const x = Math.min(gridWidth - 1, Math.max(0, clickedX + i));
            const y = Math.min(gridHeight - 1, Math.max(0, clickedY + j));

            // Calculate the distance between the point clicked and the cell
            // Eucledian distance calculation
            const distance = Math.sqrt(
                (x - clickedX) ** 2 + (y - clickedY) ** 2,
            );

            // If the distance is smaller than the radius, set the cell to the color. If it doenst have one already.
            if (distance <= SPAWN_RADIUS && grid[x][y] === 0) {
                grid[x][y] = p.random([1, 0, 0, 0, 0]) ? color : 0;
            }
        }

        // Shift the color but stay within the red-yellow range
        color = (color + 0.04) % 66;
    }
};
