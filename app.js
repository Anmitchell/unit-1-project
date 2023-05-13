/*****************************/
/*------Cached Elements------*/
/*****************************/

/*------Canvas Settings And Background------*/
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const background = new Image()
background.src = "img/space.png"

function renderBackground() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
}

/*------Canvas Settings And Background------*/

const startBtn = document.getElementById('start')
const resetBtn = document.getElementById('reset')
const playAgainBtn = document.getElementById('play-again')

/*------Audio Settings------*/

const playerShootAudio = new Audio('audio/mixkit-sci-fi-battle-laser-shots-2783.wav')
playerShootAudio.playbackRate = 16.0
const invaderDestroyedAudio = new Audio('audio/76H365G-explosion.mp3')
invaderDestroyedAudio.playbackRate = 16.0

/*------Modals------*/
const startGameModal = document.getElementById('start-game')
const gameOverModal = document.getElementById('game-over')
const playerWinsModal = document.getElementById('player-wins')


/*****************************/
/*----------Classes----------*/
/*****************************/

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
    const image = new Image()
    image.src = 'img/25129-4-spaceship-file.png';

    image.onload = () => { //
      const scale = .10 // multiplier for scaling
      this.image = image
      this.width = image.width * scale 
      this.height = image.height * scale

      // Player's starting position
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20
      }
    }
  }
  // render image of player on canvas
  render() {
    ctx.drawImage(
      this.image, 
      this.position.x, 
      this.position.y, 
      this.width, 
      this.height
    )
  }

  update() {
    this.render()
    this.position.x += this.velocity.x
  }
}

/*------Player Projectile------*/

class PlayerProjectile {
  constructor({position, velocity}) {
    this.position = position
    this.velocity = velocity
    this.radius = 3
  }

  render() {
    ctx.beginPath() // starting point of arc
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
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

/*------Invaders And Setting Position on Canvas------*/

class Invader {
  constructor({position}) {
    this.velocity = {
      x: 0,
      y: 0
    }

    const image = new Image()
    image.src = 'img/enemy3.png';

    image.onload = () => { 
      const scale = 1.0 
      this.image = image
      this.width = image.width * scale 
      this.height = image.height * scale

      // First Invader Position
      this.position = {
        x: position.x,
        y: position.y
      }
    }
  }

  render() {
    ctx.drawImage(
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
        this.position.y + this.height >= player.position.y && // Bottom of invader image is greater than top of player image
        this.position.x + this.width >= player.position.x && // right side of invader image is greater than or equal to left side of player
        this.position.x <= player.position.x + player.width // if left side of invader image is less than or equal to right side of player
      )
      {
        gameOver = true // ends game
        gameOverModal.style.display = 'block'
      }
    }
  }
}

/*------Fleet of Invaders------*/

class Fleet {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }
    this.velocity = {
      x: 6,
      y: 0
    }

    this.invaders = []

    const totalColumns = 7
    const totalRows = 4
    const spaceBetweenInvaders = 70 // pixels of space between grids

    this.width = totalColumns * spaceBetweenInvaders
    
    // Total invaders in grid === cols * rows
    for (let col = 0; col < totalColumns; col++) {
      for (let row = 0; row < totalRows; row++) {
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

    // When reaching the left or right end of canvas, stop moving and drop down 70 pixels
    if (this.position.x + this.width >= canvas.width + 70 || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x
      this.velocity.y = 70
    }
  }
}

/*------Invader Projectile------*/

class InvaderProjectile {
  constructor({position, velocity}) {
    this.position = position
    this.velocity = velocity
    this.radius = 3
  }

  render() {
    ctx.beginPath() // starting point of arc
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = 'red'
    ctx.fill()
    ctx.closePath() // ending point of arc
  }

  update() {
    this.render()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

/***********************/
/*------Constants------*/
/***********************/

const player = new Player()
const fleet = new Fleet()
const playerProjectiles = []
const invaderProjectiles = []
let frames = 0
let gameOver = false

const controls = {
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

/*****************************/
/*------Event Listeners------*/
/*****************************/

/*------Player Controls For Moving and Shooting------*/
addEventListener('keydown', ({key}) => { // {key} === event.key
  const spacebar = ' '
  switch (key) {
    case 'ArrowLeft':
      controls.ArrowLeft.pressed = true
      break
    case 'ArrowRight':
      controls.ArrowRight.pressed = true
      break
    case spacebar:
      playerProjectiles.push(
        new PlayerProjectile({
          position: {
            // Player projectile start from the top center of the image
            x: player.position.x + player.width / 2, 
            y: player.position.y
          },
          velocity: {
            x: 0,
            y: -15
          }
        })
      )
      if (!gameOver) {
        playerShootAudio.play()
      }
  }
})

addEventListener('keyup', ({key}) => { // {key} === event.key
  const spacebar = ' '
  switch (key) {
    case 'ArrowLeft':
      controls.ArrowLeft.pressed = false
      break
    case 'ArrowRight':
      controls.ArrowRight.pressed = false
      break
    case spacebar:
      break
  }
})

/*------Event Listeners for Modal Buttons------*/
startBtn.addEventListener('click', startGame)
resetBtn.addEventListener('click', resetGame)
playAgainBtn.addEventListener('click', playAgain)


/***********************/
/*------Functions------*/
/***********************/

function playAgain() {
  window.location.reload()
}

function startGame() {
  startGameModal.style.display = 'none'
  animate()
}

function resetGame() {
  window.location.reload()
}

function animate() {
  requestAnimationFrame(animate) // loop animate function
  renderBackground() // background for canvas
  if (gameOver) return // End Game
  player.update() // update player position
  fleet.update() // update fleet of invaders position 
  frames++ // frames capture

  /*------If Player Destroys all invaders, Player Wins!------*/
  if (fleet.invaders.length === 0) {
    playerWinsModal.style.display = 'block'
    return
  }

  /*------Handling Player Projectiles Traveling Outside Canvas------*/

  playerProjectiles.forEach((projectile, index) => {
    // if the top of the projectile moves past the canvas delete projectile from array
    if (projectile.position.y + projectile.radius <= 0 || projectile.position.y + projectile.radius >= canvas.height) {
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0)
    }
    else {
      projectile.update()
    }
  })

 /*------Handling Invader Projectiles Traveling Outside Canvas and having invaders shoot every 50 frames------*/

  invaderProjectiles.forEach((projectile, index) => {
    // if the top of the projectile moves past the canvas delete projectile from array
    if (projectile.position.y + projectile.radius <= 0 || projectile.position.y + projectile.radius >= canvas.height) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1)
      }, 0)
    }
    else {
      projectile.update()
    }
  })

  if (frames % 50 === 0) {
    const randomInvader = Math.floor(Math.random() * fleet.invaders.length)
    const invader = fleet.invaders[randomInvader]

    invaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: invader.position.x + invader.width / 2,
          y: invader.position.y + invader.height
        },
        velocity: {
          x: 0,
          y: 8
        }
      })
    )
      // Add invader projectile sound here
  }

  /*------Setting Velocity For Invaders And Handling Projectile Collisions with Player------*/

  fleet.invaders.forEach((invader, invIndex) => {
    invader.update({velocity: fleet.velocity})

    invaderProjectiles.forEach((projectile) => {
      if (
        // bottom of projectile is greater than or equal to the top of player and
        // right side of projectile is greater than or equal to player left side and
        // left side of projectile is less than or equal to player right side
        projectile.position.y + projectile.radius >= player.position.y &&
        projectile.position.x + projectile.radius >= player.position.x &&
        projectile.position.x - projectile.radius <= player.position.x + player.width
        ) 
        {
          gameOver = true
          gameOverModal.style.display = 'block'
        }
    })
  
    /*------Handling Projectile Collisions with Invaders------*/

    playerProjectiles.forEach((projectile, projIndex) => {
      if (
        // top of projectile is less than or equal to the bottom of invader and
        // right side of projectile is greater than or equal to invader left hand side and
        // left side of projectile is less than or equal to invader right side
        projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
        projectile.position.x + projectile.radius >= invader.position.x &&
        projectile.position.x - projectile.radius <= invader.position.x + invader.width
        ) 
        {
        setTimeout(() => { // Removes glitching when splicing

          const isInvader = fleet.invaders.find(
            (tempInvader) => tempInvader === invader
          )
          const isProjectile = playerProjectiles.find(
            (tempProjectile) => tempProjectile === projectile
          )
          // remove invaders and projectiles when colliding
          if (isInvader && isProjectile) {
            fleet.invaders.splice(invIndex, 1)
            playerProjectiles.splice(projIndex, 1)
            invaderDestroyedAudio.play()
          }
          // re-adjusting group of invaders when destroying invaders
          if (fleet.invaders.length > 0) {
            const first = fleet.invaders[0]
            const last = fleet.invaders[fleet.invaders.length - 1]
            fleet.width = last.position.x - first.position.x + last.width
            fleet.position.x = first.position.x
          }
        }, 0)
      }
    })
  })

/*------Bound Checking And Moving Player Within Canvas------*/
  const leftEdge = 0;
  const rightEdge = canvas.width
  const velocity = 8

  if(controls.ArrowLeft.pressed && player.position.x > leftEdge) {
    player.velocity.x = velocity * -1 // left speed -
  } 
  else if (controls.ArrowRight.pressed && player.position.x + player.width < rightEdge){
    player.velocity.x = velocity // right speed +
  }
  else {
    player.velocity.x = 0
  }
}

