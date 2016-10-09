/*jshint esversion: 6 */
const N = 1;
const S = 2;
const W = 4;
const E = 8;
//maze dimensions
var width = 5;
var height = 5;

var bitmap = [];
for (var x = 0; x < width; x++) {
  bitmap[x] = [];
  for (var y = 0; y < height; y++) {
    //mark cells as unvisited using -1
    bitmap[x][y] = -1;
  }
}

function getNeighbors(x, y) {
  let neighbors = [],
    obj;
  //check left neighbor
  if ((x - 1) >= 0 && bitmap[x - 1][y] < 0) {
    let obj = {
      x: (x - 1),
      y: y
    };
    neighbors.push(obj);
  }
  //check up neighbor
  if (x >= 0 && bitmap[x][y - 1] < 0) {
    let obj = {
      x: x,
      y: (y - 1)
    };
    neighbors.push(obj);
  }
  //check right neighbor
  if ((x + 1) < width && bitmap[x + 1][y] < 0) {
    let obj = {
      x: (x + 1),
      y: y
    };
    neighbors.push(obj);
  }
  //check down neighbor
  if ((y + 1) < height && bitmap[x][y + 1] < 0) {
    let obj = {
      x: x,
      y: (y + 1)
    };
    neighbors.push(obj);
  }
  return neighbors;
}

function getOppositeDirection(direction) {
  switch (direction) {
    case N:
      return S;
    case S:
      return N;
    case E:
      return W;
    case W:
      return E;
    default:
      console.log("Not a valid direction");
  }
}

function carvePassages(x, y, direction) {
  let count = 4,
    nextCellDirection;

  //mark cell
  let neighbors = getNeighbors(x, y);
  //visit cell
  bitmap[x][y] = getOppositeDirection(direction);
  while (neighbors.length > 0) {
    //get random index for next cell to visit
    randomIndex = Math.floor(Math.random() * neighbors.length % neighbors.length);
    nextIndex = neighbors[randomIndex];
    //remove object from neighborhood array
    neighbors.splice(randomIndex, 1);
    //get direction based on next cell
    if (nextIndex.x < x) nextCellDirection = N;
    else if (nextIndex.x > x) nextCellDirection = S;
    else if (nextIndex.y < y) nextCellDirection = W;
    else if (nextIndex.y > y) nextCellDirection = E;
    //in the first iteration, direction isn't defined yet, so we use the nextDirection value
    if (undefined === direction) {
      bitmap[x][y] = nextCellDirection;
    }
    //recursively carve passages
    carvePassages(nextIndex.x, nextIndex.y, nextCellDirection);
  }
  //used to know when the maze is done
  return true;
}

window.onload = function() {
  //start from a random point
  var x = Math.floor(Math.random() * width % width);
  var y = Math.floor(Math.random() * height % height);

  if (carvePassages(x, y)) initialize(bitmap);
};