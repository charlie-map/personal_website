function drawGrid() {
  for (let i = 0; i < grid_langton_ant.length; i++) {
    for (let j = 0; j < grid_langton_ant[i].length; j++) {
      if (grid_langton_ant[i][j])
        fill(grid_langton_ant_color[i][j]);
      else
        fill(colors[0][0] - 60, colors[0][1] - 60, colors[0][2] - 60);
      rect(
        i * ($(window).width() / grid_langton_ant.length),
        j * (($(window).height() - 42) / grid_langton_ant[i].length),
        $(window).width() / grid_langton_ant.length,
        ($(window).height() - 42) / grid_langton_ant[i].length
      );
    }
  }
  return;
}

function setup() {
  createCanvas($(window).width(), $(window).height() - 42);
  
  GRID_SIZE_LANGTON_W = floor($(window).width() / 20);
  GRID_SIZE_LANGTON_H = floor(($(window).height() - 42) / 20);

  grid_langton_ant = [];
  grid_langton_ant_color = [];

  for (let i = 0; i < GRID_SIZE_LANGTON_W; i++) {
    grid_langton_ant_color[i] = [];
    grid_langton_ant[i] = [];
    for (let j = 0; j < GRID_SIZE_LANGTON_H; j++) {
      grid_langton_ant[i][j] = 1;
      grid_langton_ant_color[i][j] = [colors[3][0] - 30 + random(-15, 15),
        colors[3][1] - 30 + random(-15, 15),
        colors[3][2] - 30 + random(-15, 15)];
    }
  }
  
  drawGrid();
  direction_langton_ant = floor(random(0, 4));
  x_langton_ant = floor(GRID_SIZE_LANGTON_W / 2);
  y_langton_ant = floor(GRID_SIZE_LANGTON_H / 2);
  
  frameRate(45);
}

function draw() {
  // check color at current square
  grid_langton_ant[x_langton_ant][y_langton_ant] = grid_langton_ant[x_langton_ant][y_langton_ant] == 1 ? 0 : 1;
  direction_langton_ant += grid_langton_ant[x_langton_ant][y_langton_ant] ? 1 : -1;
  direction_langton_ant = direction_langton_ant == 4 ? 0 : direction_langton_ant == -1 ? 3 : direction_langton_ant;
  x_langton_ant += direction_langton_ant % 2 == 0 ? (floor(direction_langton_ant / 2) == 1 ? -1 : 1) : 0;
  y_langton_ant += direction_langton_ant % 2 == 1 ? (floor(direction_langton_ant / 2) == 1 ? -1 : 1) : 0;
    x_langton_ant = x_langton_ant == GRID_SIZE_LANGTON_W ? 0 : x_langton_ant == -1 ? GRID_SIZE_LANGTON_W - 1 : x_langton_ant;
  y_langton_ant = y_langton_ant == GRID_SIZE_LANGTON_H ? 0 : y_langton_ant == -1 ? GRID_SIZE_LANGTON_H - 1 : y_langton_ant;
  drawGrid();
}