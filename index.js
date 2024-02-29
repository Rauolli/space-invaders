const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
  constructor() {
    
    this.velocity = {
        x: 0,
        y: 0
    };

    this.rotation = 0;
    
    const image = new Image();
    image.src = './images/spaceship.png';

    image.onload = () => {
      const scale = 0.15;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height *scale;
      this.position = { 
            x: canvas.width / 2 - this.width / 2, 
            y: canvas.height - this.height - 20
        };
    };
    
  }

  draw() {
    // ctx.fillStyle = 'red';
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    ctx.save();
    ctx.translate(
        this.position.x + this.width / 2, 
        this.position.y + this.height / 2
        );

    ctx.rotate(this.rotation);

    ctx.translate(
        -this.position.x - this.width / 2, 
        -this.position.y - this.height / 2
        );
    ctx.drawImage(
        this.image, 
        this.position.x, 
        this.position.y, 
        this.width, 
        this.height
        );

    ctx.restore();
        
  }

  update() {
    if (this.image){
        this.draw();
        this.position.x += this.velocity.x;
    }
  } 
}

const player = new Player();
const keys = {
    a:{
    pressed: false
    },
    d:{
    pressed: false
    },
    space:{
    pressed: false
    }
};


function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.update();

    if (keys.a.pressed && player.position.x >= 5){
        player.velocity.x = -7;
        player.rotation = -0.15;
    }
    else if (keys.d.pressed && player.position.x + player.width <= canvas.width - 5){
        player.velocity.x = 7;
        player.rotation = 0.15;
    }
    else{
        player.velocity.x = 0;
        player.rotation = 0;
    }
}

animate();

addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'ArrowLeft':
            keys.a.pressed = true;
            break;
        case 'ArrowRight':
            keys.d.pressed = true;
            break;
        case ' ':
            keys.space.pressed = true;
            console.log('space');
            break;
    }
});

addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'ArrowLeft':
            keys.a.pressed = false;
            break;
        case 'ArrowRight':
            keys.d.pressed = false;
            break;
        case ' ':
            keys.space.pressed = false;
            console.log('space');
            break;
    }
});