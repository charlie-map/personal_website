function setup() {
  createCanvas($(window).width(), $(window).height() - 42);

  array = [];
  buffer = [];

  for (let x = 0; x < $(window).width() / 20; x++) {
    array[x] = [];
    buffer[x] = [];
    for (let y = 0; y < ($(window).height() - 42) / 20; y++) {
      //set each one randomly to true or false:
      array[x][y] = new Grid(floor(random(2)), 20 * x, 20 * y);
      buffer[x][y] = new Grid(0, 20 * x, 20 * y);
    }
  }
}

function draw() {
  background(220);
  for (let x = 0; x < $(window).width() / 20; x++) {
    for (let y = 0; y < ($(window).height() - 42) / 20; y++) {
      array[x][y].display();
    }
  }
  checkRules();
}

function checkRules() {
  for (let x = 0; x < $(window).width() / 20; x++) {
    for (let y = 0; y < ($(window).height() - 42) / 20; y++) {
      //now look at each neighbor
      let aliveNeighbor = 0;
      for (let checkX = -1; checkX < 2; checkX++) {
        for (let checkY = -1; checkY < 2; checkY++) {
          if (x + checkX >= 0 && x + checkX < (width / 20) && y + checkY >= 0 && y + checkY < (height / 20) && (checkX != 0 || checkY != 0)) {
            let buffX = x + checkX;
            let buffY = y + checkY;
            aliveNeighbor += (array[buffX][buffY].living);
          }
        }
      }
      //check if the cell should stay alive, become dead, or be birthed
      if (array[x][y].living == 1) {
        if (aliveNeighbor < 2 || aliveNeighbor > 3) {
          buffer[x][y].lived = buffer[x][y].living;
          buffer[x][y].living = 0;
        }
      } else {
        if (aliveNeighbor == 3) {
          buffer[x][y].lived = buffer[x][y].living;
          buffer[x][y].living = 1;
        }
      }
    }
  }
  array = buffer;
}

function Grid(alive, posX, posY) {
  this.lived = 0;
  this.living = alive;
  this.x = posX;
  this.y = posY;
  this.red = colors[3][0] - 30 + random(posX * -0.04, posX * 0.04);
  this.green = colors[3][1] - 30 + random(posX * -0.04, posX * 0.04);
  this.blue = colors[3][2] - 30 + random(posX * -0.04, posX * 0.04);
  //if living equals true, then color in the block white
  //other it's dead

  this.display = function() {
    if (this.living == 1) {
      //show as white

      fill(this.red, this.green, this.blue);
      rect(this.x, this.y, width / 20, height / 20);
    } else if (this.living == 0) {
      //show as black
      fill(colors[0][0] - 60, colors[0][1] - 60, colors[0][2] - 60);
      rect(this.x, this.y, width / 20, height / 20);
    }
  }
}