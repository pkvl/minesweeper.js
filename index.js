const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
var grid;
var cols;
var rows;
var w = 100;
var totalBees = 10;

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }

  return arr;
}

function Cell(i, j, w) {
  this.i = i;
  this.j = j;
  this.x = i * w;
  this.y = j * w;
  this.w = w;
  this.neighborCount = 0;

  this.bee = false;
  this.revealed = false;
  // this.show();
}

Cell.prototype.show = function () {
  if (this.revealed) {
    if (this.bee) {
      ctx.beginPath();
      ctx.arc(
        this.x + this.w * 0.5,
        this.y + this.w * 0.5,
        this.w * 0.25,
        0,
        2 * Math.PI
      );
      ctx.stroke();
    } else {
      ctx.fillStyle = "rgb(200 200 200)";
      ctx.fillRect(this.x, this.y, w - 1, w - 1); // fix borders
      if (this.neighborCount > 0) {
        ctx.font = "50px Arial";
        ctx.fillStyle = "purple";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          this.neighborCount,
          this.x + this.w * 0.5,
          this.y + this.w * 0.5
        );
      }
    }
  }
};

Cell.prototype.contains = function (x, y) {
  return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w;
};

Cell.prototype.reveal = function () {
  this.revealed = true;
  this.show();

  if (this.neighborCount === 0) {
    // flood fill
    this.floodFill();
  }
};

Cell.prototype.floodFill = function () {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (
        this.i + i >= 0 &&
        this.i + i < cols &&
        this.j + j >= 0 &&
        this.j + j < rows
      ) {
        let neighbor = grid[this.i + i][this.j + j];
        if (!neighbor.bee && !neighbor.revealed) {
          neighbor.reveal();
        }
      }
    }
  }
};

Cell.prototype.countBees = function () {
  if (this.bee) {
    this.neighborCount = -1;
    return;
  }
  let total = 0;

  // improv: dfs
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (
        this.i + i >= 0 &&
        this.i + i < cols &&
        this.j + j >= 0 &&
        this.j + j < rows
      ) {
        var neighbor = grid[this.i + i][this.j + j];
        if (neighbor.bee) {
          total++;
        }
      }
    }
  }

  this.neighborCount = total;
};

function setup() {
  // createCanvas(200, 200);
  const width = 1000;
  const height = 1000;
  cols = Math.floor(width / w);
  rows = Math.floor(height / w);
  grid = make2DArray(10, 10);

  if (canvas.getContext) {
    var options = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = new Cell(i, j, w);
        ctx.fillStyle = "rgb(0 0 0)";
        // ctx.fillStyle
        ctx.strokeRect(i * w, j * w, w, w);
        options.push([i, j]);
      }
    }

    for (let i = 0; i < totalBees; i++) {
      let index = Math.floor(Math.random() * options.length);
      let choice = options[index];
      grid[choice[0]][choice[1]].bee = true;
      options.splice(index, 1);
    }

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j].countBees();
      }
    }
  }
}

function mousePressed(event) {
  console.log(event.offsetX, event.offsetY);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].contains(event.offsetX, event.offsetY)) {
        grid[i][j].reveal();
        if (grid[i][j].bee) {
          gameOver();
        }
      }
    }
  }
}

function gameOver() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].reveal();
    }
  }

  setTimeout(() => {
    alert("Game Over!");
    window.location.reload();
  }, 0);
}

canvas.addEventListener("click", mousePressed);

setup();
// draw();
