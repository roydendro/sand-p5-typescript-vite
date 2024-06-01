# P5.js falling sand experience

## Introduction

This is a falling sand experience, built with p5.js and TypeScript.

The project is built with Vite and deployed to GitHub Pages using GitHub Actions.

Enabled linting using ESLint and formatting using Prettier.

Visit the project at https://sand.roydendro.com

Was inspired by the codingtrain code challenge.

## Getting Started

To get started with development, you need to run the following commands.

```
nvm use
npm i
npm run dev
```

## Notes and caveats

-   Sand falls with a constant speed, some sort of accelaration due to simulated gravity would be nice
-   On resizing the window, the whole canvas resets due to the grid being recalculated based on size and resolution, maybe it would be nice to preserve (part) of the grid.
-   On mobile devices the performance isn't so great, maybe setting a pixel-density or lower resolution would be nice.
-   Only rerendering the cells that have actually been changed might also help performance
