/*----- cached Elements -----*/

const grid = document.querySelector('.grid') // select the element that has a class of grid

// Grid layout
for (let i = 0; i < 380; i++) {
    const divEl = document.createElement('div')
    grid.appendChild(divEl) 
}

/*----- Invaders -----*/

const gridElements = Array.from(document.querySelectorAll('.grid div'))

// Invaders positions on grid
const invaders = [
    41,43,45,47,49,51,53,
    60,62,64,66,68,70,72,
    79,81,83,85,87,89,91,
    98,100,102,104,106,108,110,
    117,119,121,123,125,127,129
]

// Placing invaders in grid
function renderInvaders() {
    for (let i = 0; i < invaders.length; i++) {
        gridElements[invaders[i]].classList.add('invader') // add invader class to specific divs in grid
    }
}

// needed for invader movement
function remove () {
    for (let i = 0; i < invaders.length; i++) {
        gridElements[i].classList.remove('invader')
    }
}

// Invader Movement

function invaderMovement() {
    const leftEdge = invaders[39] % width === 0
    const rightEdge = invaders[invaders.length - 1] % width === width -1
    remove()
  
    if (rightEdge && goingRight) {
      for (let i = 0; i < invaders.length; i++) {
        invaders[i] += width + 1
        direction = -1
        goingRight = false
      }
    }
  
    if(leftEdge && !goingRight) {
      for (let i = 0; i < invaders.length; i++) {
        invaders[i] += width - 1
        direction = 1
        goingRight = true
      }
    }
  
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += direction
    }
}

renderInvaders() // Display invaders
let movementSpeed = setInterval(invaderMovement, 500)

/*----- Player position on grid -----*/


playerPosition = 332; // player starting position
const gridWidth = 19; // used to bound check the player on the left and right edges of the grid

gridElements[playerPosition].classList.add('player')


/*----- Controls for player -----*/

function movePlayer(event) {
    const leftEdge = 0;
    const rightEdge = gridWidth - 1;
    gridElements[playerPosition].classList.remove('player')
    if (event.key === 'ArrowLeft') {
        if (playerPosition % gridWidth !== leftEdge) playerPosition -= 1
    }
    if (event.key === 'ArrowRight') {
        if (playerPosition % gridWidth < rightEdge ) playerPosition += 1
    }
    gridElements[playerPosition].classList.add('player')
}

/*----- Event Listeners -----*/

// Event for player moving left and right
document.addEventListener('keydown',movePlayer)

// Event for player shooting

