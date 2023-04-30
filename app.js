// *****Building out the game grid*****

const grid = document.querySelector('.grid') // select the element that has a class of grid

// Create grid layout
for (let i = 0; i < 380; i++) {
    const gridSquare = document.createElement('div')
    grid.appendChild(gridSquare) 
}

// *****Placing invaders on grid*****

const gridSquares = Array.from(document.querySelectorAll('.grid div')) // select all divs in the grid

// Invaders positions on grid
const invaders = [
    41,43,45,47,49,51,53,
    60,62,64,66,68,70,72,
    79,81,83,85,87,89,91,
    98,100,102,104,106,108,110,
    117,119,121,123,125,127,129
]

// Add invaders to DOM
function draw() {
    for (let i = 0; i < invaders.length; i++) {
        gridSquares[invaders[i]].classList.add('invader') // add invader class to specific divs in grid
    }
}

draw()

// *****Player position on grid*****
playerPosition = 332;

gridSquares[playerPosition].classList.add('player')

