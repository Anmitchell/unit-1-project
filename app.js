/*------Cached Elements------*/
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d') // api object

canvas.width = innerWidth  // window.innerWidth
canvas.height = innerHeight // window.innerHeight

const scoreEl = document.getElementById('score')
const resetBtn = document.getElementById('reset')
const playerShootAudio = new Audio('audio/mixkit-sci-fi-battle-laser-shots-2783.wav')
playerShootAudio.playbackRate = 16.0
const invaderDestroyedAudio = new Audio('audio/76H365G-explosion.mp3')
invaderDestroyedAudio.playbackRate = 16.0

const gameOverModal = document.querySelector('div')

/*------Creating Player and Setting Position------*/
class Player {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }
    
    this.velocity = {
      x: 0,
      y: 0
    }

    // Image for player icon
    const image = new Image() // image object from javascript API
    image.src = 'img/25129-4-spaceship-file.png'; // image used

    // listen for when image has fully loaded in canvas
    // image does not fully load before calling player.draw()
    // onload is needed to ensure that image is loaded before 
    // player.draw() method

    // initially load player in bottom center of screen and 
    // set image width and height to scale of screen size
    // Tells DOM to load image before rest of DOM elements?
    image.onload = () => { //
      const scale = .10 // multiplier for scaling
      this.image = image
      this.width = image.width * scale 
      this.height = image.height * scale
      // Place player in middle of canvas
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20
      }
    }
  }

  // render image of player on canvas
  render() {
    ctx.drawImage( // draws image from instance of image object
      this.image, 
      this.position.x, 
      this.position.y, 
      this.width, 
      this.height
    )
  }

  update() {
    if (this.image) {
      this.render()
      this.position.x += this.velocity.x
    }
  }
}

/*------Creating Player Projectile------*/

class Projectile {
  constructor({position, velocity}) {
    this.position = position
    this.velocity = velocity
    this.radius = 3
  }

  render() {
    ctx.beginPath() // starting point of arc
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2) // Creates a circle using arc method in canvas
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.closePath() // ending point of arc
  }

  update() {
    this.render()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

/*------Creating Invaders And Setting Position------*/

class Invader {
  constructor({position}) {
    this.velocity = {
      x: 0,
      y: 0
    }

    //const invaderImage = document.getElementsByClassName('.space-invader-2')

    // Image for invader icon
    const image = new Image()
    image.src = 'img/space-invaders-color-version-space-invader-dark-blue-icon-png-icon.jpg';

    image.onload = () => { //
      const scale = .10 // multiplier for scaling
      this.image = image
      this.width = image.width * scale 
      this.height = image.height * scale
      // Place Invader towards top of canvas
      this.position = {
        x: position.x,
        y: position.y
      }
    }
  }

  // render image of player on canvas
  render() {
    ctx.drawImage( // draws image from instance of image object
      this.image, 
      this.position.x, 
      this.position.y, 
      this.width, 
      this.height
    )
  }

  update({velocity}) {
    if (this.image) {
      this.render()
      this.position.x += velocity.x
      this.position.y += velocity.y

      if ( 
        (this.position.y + this.height) - 70 >= player.position.y &&
        this.position.x + this.width >= player.position.x &&
        this.position.x <= player.position.x + player.width
      )
      {
       gameOver = true // ends game
       gameOverModal.style.display = 'block'
      }
    }
  }
}

/*------Creating A Grid of Invaders------*/

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y:0
    }
    this.velocity = {
      x: 3,
      y: 0
    }
    this.invaders = [] // storing invaders in grid array

    // Creating rows and columns of invaders
    // Total invaders in grid === cols * rows
    const columns = 7
    const rows = 4
    const spaceBetweenInvaders = 70 // pixels of space between grids

    this.width = columns * spaceBetweenInvaders
    
    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
        this.invaders.push(new Invader({
          position: {
            x: col * spaceBetweenInvaders,
            y: row * spaceBetweenInvaders
          }
        }))
      }
    }
  }

  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    this.velocity.y = 0 // prevents grid from moving vertically on every frame

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x
      this.velocity.y = 70
    }
  }
}

class InvaderProjectile {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }
    this.velocity = {
      x: 0,
      y: 0
    }

    this.projectiles = []
  }
}

/*------Constants------*/
const projectiles = []
const player = new Player()
const grid = new Grid()
let gameOver = false
let score = 0

// Used to monitor keys used for player controls and give smoother
// control when moving left to right
const keys = {
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  spacebar: {
    pressed: false
  }
}

/*------Player Controls For Moving and Shooting------*/
addEventListener('keydown', ({key}) => { // {key} === event.key
  const spacebar = ' '
  switch (key) {
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      break
    case spacebar:
      projectiles.push(
        new Projectile({
          position: {
            // Player projectile start from the top center of the image
            x: player.position.x + player.width / 2, 
            y: player.position.y
          },
          velocity: {
            x: 0,
            y: -4
          }
        })
      )
      playerShootAudio.play()
  }
})

addEventListener('keyup', ({key}) => { // {key} === event.key
  const spacebar = ' '
  switch (key) {
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case spacebar:
      break
  }
})

/*------Rendering Player and Projectile on Webpage------*/

// Loop to render player
function animate() {
  requestAnimationFrame(animate) // loop animate function

  if (gameOver) return // Breaks out of animation loop

  // Default Background color for player image
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // render player and position in canvas
  player.update()

  /*------Handling projectile Collistions Outside Canvas------*/

  // render projectile and its position on canvas
  projectiles.forEach((projectile, index) => {
    // if the top of the projectile moves past the canvas delete projectile from array
    if (projectile.position.y + projectile.radius <= 0) {

      // setTimeout used to prevent flashing due to splicing projectiles array
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0)
    }
    else {
      projectile.update() // 
    }
  })

  /*------Rendering Grid Of Invaders------*/
  grid.update()

  grid.invaders.forEach((invader, invIndex) => {
    invader.update({velocity: grid.velocity}) // grid velocity is applied to each invader's velocity

    projectiles.forEach((projectile, projIndex) => {
      if (
        // if top of projectile is less than or equal to the bottom of invader and
        // right side of projectile is greater than or equal to invader left hand side and
        // left side of projectile is less than or equal to invader right side
        projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
        projectile.position.x + projectile.radius >= invader.position.x &&
        projectile.position.x - projectile.radius <= invader.position.x + invader.width
        ) {
          setTimeout(() => { // helps to remove flashing when splicing
            const containsInvader = grid.invaders.find(
              (tempInv) => tempInv === invader
            )
            const containsProjectile = projectiles.find(
              (tempProj) => tempProj === projectile
            )

            // remove invaders and projectiles
            if (containsInvader && containsProjectile) { // checks to see if invaders and projectiles gone used exist at the current index in arrays
              //score += 1000
              //scoreEl.innerHTML = score
              grid.invaders.splice(invIndex, 1)
              projectiles.splice(projIndex, 1)
              invaderDestroyedAudio.play()
            }

            // re-adjusting grid when destroying invaders
            if (grid.invaders.length > 0) {
              const firstInv = grid.invaders[0]
              const lastInv = grid.invaders[grid.invaders.length - 1]
              grid.width = lastInv.position.x - firstInv.position.x + lastInv.width
              grid.position.x = firstInv.position.x
              }
              else {
                grids.splice(gridIndex, 1)
              }
          }, 0)
        }
    })
  })


  // Bound Checking and Moving player within canvas
  const leftEdge = 0; // left edge of canvas
  const rightEdge = canvas.width // right edge of canvas
  const speed = 4

  if(keys.ArrowLeft.pressed && player.position.x > leftEdge) {
    player.velocity.x = speed * -1 // left speed -
  } 
  else if (keys.ArrowRight.pressed && player.position.x + player.width < rightEdge){
    player.velocity.x = speed // right speed +
  }
  else {
    player.velocity.x = 0
  }
}

resetBtn.addEventListener('click', resetGame)

function resetGame() {
  window.location.reload()
}

animate()

