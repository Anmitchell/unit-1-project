const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d') // api object

canvas.width = innerWidth  // window.innerWidth
canvas.height = innerHeight // window.innerHeight

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

/*------Creating Projectile------*/

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

/*------Player Controls For Moving and Shooting------*/
const projectiles = []

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

/*------Event Listeners------*/

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
            x: player.position.x + player.width / 2,
            y: player.position.y
          },
          velocity: {
            x: 0,
            y: -4
          }
        })
      )
      //console.log(projectiles)
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
      //console.log('space')
      break
  }
})

/*------Rendering Player and Projectile on Webpage------*/
const player = new Player()

// Loop to render player
function animate() {
  requestAnimationFrame(animate) // loop animate function

  // Default Background color for player image
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // render player and position in canvas
  player.update()

  // render projectile and its position on canvas
  projectiles.forEach((projectile, index) => {
    // if bottom of projectile is less than or equal to top of screen
    // remove projectile out of array at the top of screen
    if (projectile.position.y + projectile.radius <= 0) {
      // used to prevent flashing due to splicing projectiles array
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0)
    }
    else {
      projectile.update()
    }
  })

  // Bound Checking and Moving player
  const leftEdge = 0;
  const rightEdge = canvas.width
  const speed = 4

  if(keys.ArrowLeft.pressed && player.position.x > leftEdge) {
    player.velocity.x = speed * -1 // left speed -
    // rotate player here
  } 
  else if (keys.ArrowRight.pressed && player.position.x + player.width < rightEdge){
    player.velocity.x = speed // right speed +
    // rotate player here
  }
  else {
    player.velocity.x = 0
  }
}

animate()

/*
  Notes:
  * Find a way to optimise and clean code a bit better
  * How can I get image to load with DOM content in a cleaner way?
  * How to use CSS animation to rotate player to seemingly tilt when shooting
  * How to remove image and place a CSS styled element with animations in its place
  * How to set up invaders to bounce diagnolly across screen
  * How to add a boss battle
  * How to set up barriers to take cover from
  * How to add power ups and different gun shooting mechanics
  * How to add a melee feature
  * How to add sound effects and music
  * How to make player move in all 4 directions
  * Change player projectile from a circle to a line instead
*/
