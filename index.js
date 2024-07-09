const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const w = 100;
const totalBees = 10;

let grid;
let cols;
let rows;
let currentFlags = 0;

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }

  return arr;
}

function Cell(i, j, w) {
  this.i = i;
  ``;
  this.j = j;
  this.x = i * w;
  this.y = j * w;
  this.w = w;
  this.neighborCount = 0;

  this.bee = false;
  this.revealed = false;
  this.flagged = false;
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
  if (!this.flagged) {
    this.revealed = true;
    this.show();

    if (this.neighborCount === 0) {
      // flood fill
      this.floodFill();
    }
  } else {
    console.log("cant reveal, cell is flagged");
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
        let neighbor = grid[this.i + i][this.j + j];
        if (neighbor.bee) {
          total++;
        }
      }
    }
  }

  this.neighborCount = total;
};

Cell.prototype.toggleFlag = function () {
  if (!this.flagged) {
    if (currentFlags >= totalBees || this.revealed) {
      console.log(
        "Maximum number of flags reached or this cell is already revealed"
      );
      return;
    }
    // Draw the flag
    ctx.beginPath();
    ctx.moveTo(this.x + 40, this.y + 20);
    ctx.lineTo(this.x + 40, this.y + 80);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.x + 40, this.y + 20);
    ctx.lineTo(this.x + 70, this.y + 35);
    ctx.lineTo(this.x + 40, this.y + 50);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();

    currentFlags++;
    this.flagged = true;
  } else {
    // Remove the flag
    ctx.clearRect(this.x + 38, this.y + 18, 34, 64);
    currentFlags--;
    this.flagged = false;
  }
};

function setup() {
  // createCanvas(200, 200);
  const width = 1000;
  const height = 1000;
  cols = Math.floor(width / w);
  rows = Math.floor(height / w);
  grid = make2DArray(10, 10);

  if (canvas.getContext) {
    let options = [];
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
  // console.log(event.offsetX, event.offsetY);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].contains(event.offsetX, event.offsetY)) {
        if (!grid[i][j].flagged) {
          grid[i][j].reveal();
          if (grid[i][j].bee) {
            gameOver();
          }
        }
      }
    }
  }
}

function rightMouseButtonPressed(event) {
  event.preventDefault();
  // console.log(event.offsetX, event.offsetY);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].contains(event.offsetX, event.offsetY)) {
        grid[i][j].toggleFlag();
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
canvas.addEventListener("contextmenu", rightMouseButtonPressed);

setup();
// draw();
