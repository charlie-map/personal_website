function setup() {
  createCanvas($(window).width() - 2, $(window).height() - 42);

  PIXEL_SIZE = 20;

  $(".p5-buttons.old-project-web").remove();
  array_see_image_button = createButton('see image');
  array_see_image_button.position(10, 60);
  array_see_image_button.addClass('old-project-web');
  array_see_image_button.addClass('p5-buttons');
  $(".p5-buttons.old-project-web").attr('id', 'arr-see-img');
  $('#arr-see-img').click(function() {
    unsort_image = true;
  });

  array_new_image_button = createButton('new image');
  array_new_image_button.position(120, 60);
  array_new_image_button.addClass('old-project-web');
  array_new_image_button.addClass('p5-buttons');
  array_new_image_button.addClass('see-img');
  $(".p5-buttons.old-project-web.see-img").attr('id', 'arr-reset-img');
  $('#arr-reset-img').click(run_loading);

  unsortImageArray = [];
  sortImageArray = [];
  storing_image_array_values = [];

  max_image_complete = 0;

  completed_image = true;
  unsort_image = false;

  function run_loading() {
    completed_image = false;
    unsort_image = false;

    loadImage(`https://picsum.photos/${Math.floor($(window).width()) + Math.floor(random(-2, 2))}/${Math.floor($(window).height() - 42)}`, function(image) {
      img = image;

      img.loadPixels();
      for (let x = 0; x < Math.floor($(window).width() / PIXEL_SIZE); x++) {
        unsortImageArray[x] = [];
        sortImageArray[x] = [];
        storing_image_array_values[x] = [];

        for (let y = 0; y < Math.floor(($(window).height() - 42) / PIXEL_SIZE); y++) {
          let pixel_array_pos = (y * Math.floor($(window).width() / PIXEL_SIZE) + x) * 4;
          unsortImageArray[x][y] = new SortArray(color(img.pixels[pixel_array_pos], img.pixels[pixel_array_pos + 1], img.pixels[pixel_array_pos + 2]), x * PIXEL_SIZE, y * PIXEL_SIZE);
          sortImageArray[x][y] = new SortArray(color(img.pixels[pixel_array_pos], img.pixels[pixel_array_pos + 1], img.pixels[pixel_array_pos + 2]), x * PIXEL_SIZE, y * PIXEL_SIZE);
          storing_image_array_values[x][y] = 0;

          max_image_complete++;
        }
      }

      for (let x = 0; x < Math.floor($(window).width() / PIXEL_SIZE); x++) {
        quicksort(sortImageArray[x], 0, sortImageArray[x].length - 1);
      }

    });
  }
  run_loading();
}

function quicksort(array, low, high) {
  if (low < high) {
    let pivot = partition(array, low, high);
    quicksort(array, pivot + 1, high);
    quicksort(array, low, pivot - 1);
  }
  return;
}

function partition(array, low, pivot) {
  let lowest = low - 1;
  let buffer_value;

  for (let j = low; j < pivot; j++) {
    if (brightness(array[j].colors) > brightness(array[pivot].colors)) {
      // switch positions

      lowest++;
      buffer_value = array[lowest].colors;
      array[lowest].colors = array[j].colors;
      array[j].colors = buffer_value;
    }
  }

  lowest++;
  buffer_value = array[lowest].colors;
  array[lowest].colors = array[pivot].colors;
  array[pivot].colors = buffer_value;
  return lowest;
}

function new_random_value() {
  let random_x, random_y;
  do {
    random_x = Math.floor(Math.random() * Math.floor($(window).width() / PIXEL_SIZE));
    random_y = Math.floor(Math.random() * Math.floor(($(window).height() - 42) / PIXEL_SIZE));
  } while (storing_image_array_values[random_x][random_y]);

  storing_image_array_values[random_x][random_y] = 1;
  return;
}

function draw() {
  console.log(completed_image, unsortImageArray.length);
  //if (completed_image) noLoop();
  if (unsortImageArray.length && unsortImageArray[0].length) {
    if (unsort_image) {
      console.log("unsoreting image", max_image_complete, check_image_completion);
      if (max_image_complete - check_image_completion > 20) {
        // check to make sure there's still values that need to be checked off
        for (let i = 0; i < 20; i++)
          new_random_value();
      } else {
        console.log("else");

        completed_image = true;
      }
    }

    check_image_completion = 0;

    for (let x = 0; x < Math.floor($(window).width() / PIXEL_SIZE); x++) {
      for (let y = 0; y < Math.floor(($(window).height() - 42) / PIXEL_SIZE); y++) {
        if (completed_image || storing_image_array_values[x][y]) {
          console.log("unsort display?");
          unsortImageArray[x][y].display();
          check_image_completion++;
        } else
          sortImageArray[x][y].display();
      }
    }
  }
}

function SortArray(colors, x, y) {
  this.colors = colors;
  this.x = x;
  this.y = y;

  this.display = function() {
    fill(this.colors);
    rect(this.x, this.y, PIXEL_SIZE, PIXEL_SIZE);
  }
}