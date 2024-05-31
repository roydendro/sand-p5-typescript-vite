import type p5 from "p5";

// Constants.
export const BACKGROUND_COLOR = "black";

/**
 * Main sketch function.
 * @param {p5} p - The p5 instance
 */
export default function sketch(p: p5) {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
    };

    p.draw = () => {
        p.background(BACKGROUND_COLOR);
    };
}
