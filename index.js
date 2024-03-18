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

class Invader {
    constructor({position}) {
      
      this.velocity = {
          x: 0,
          y: 0
      };
      
      const image = new Image();
      image.src = './images/invader.png';
  
      image.onload = () => {
        const scale = 1;
        this.image = image;
        this.width = image.width * scale;
        this.height = image.height *scale;
        this.position = { 
              x: position.x, 
              y: position.y
          };
      };
      
    }
  
    draw() {
      // ctx.fillStyle = 'red';
      // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  
          ctx.drawImage(
          this.image, 
          this.position.x, 
          this.position.y, 
          this.width, 
          this.height
          );         
    }
  
    update({velocity}) {
      if (this.image){
          this.draw();
          this.position.x += velocity.x;
          this.position.y += velocity.y;
         
      }
    } 
  }

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        };

        this.velocity = {
            x: 3,
            y: 0
        };

        this.invaders = [];
        const columns = Math.floor(Math.random() * 10 + 5);
        const rows = Math.floor(Math.random() * 5 + 2);
        
        this.width = columns * 30; 
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(new Invader({
                    position: {
                        x: x * 30,
                        y: y * 30
                    }
                }));
            }
        }
    }
    
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.velocity.y = 0;

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0){
            this.velocity.x = -this.velocity.x;
            this.velocity.y = 30;
        }
    }
}

class Projectile {
  constructor({position, velocity}) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 4;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

const player = new Player();
const projectiles = [];
const grids = [];

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

let frames = 0;
let randomInterval = Math.floor((Math.random() * 500) + 500);

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    projectiles.forEach((projectile, index) => {
        if(projectile.position.y + projectile.radius <= 0){
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        }else{
            projectile.update();
        }
    });

    grids.forEach((grid, gridIndex) => {
        grid.update();
        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity});

            projectiles.forEach((projectile, j) => {
                if(projectile.position.y - projectile.radius <= invader.position.y + invader.height && 
                    projectile.position.x + projectile.radius >= invader.position.x &&
                    projectile.position.x - projectile.radius <= invader.position.x  + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y){
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find((inv) => inv === invader);
                        const projectileFound = projectiles.find((proj) => proj === projectile);

                        // remove invader and project    le
                        if(invaderFound && projectileFound){
                            grid.invaders.splice(i, 1);
                            projectiles.splice(j, 1);

                            if(grid.invaders.length > 0){
                                const firstInvader = grid.invaders[0];
                                const lastInvader = grid.invaders[grid.invaders.length - 1];
                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                                grid.position.x = firstInvader.position.x;
                            }else{
                                grid.splice(gridIndex, 1);
                            }
                        }
            
                    }, 0);
                }
                
            });
        });
    });

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

    // creating new grid
    if(frames % randomInterval === 0){
        grids.push(new Grid());
        randomInterval = Math.floor((Math.random() * 500) + 500);
        frames = 0;
    }

    frames++;
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
            projectiles.push(new Projectile({position: {x: player.position.x + player.width/2 + 1, y: player.position.y - 10}, velocity: {x: 0, y: -5}}));
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