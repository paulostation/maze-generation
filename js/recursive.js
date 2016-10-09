/*jshint esversion: 6 */
const N = 1;
const S = 2;
const W = 4;
const E = 8;

var width = 5;
var height = 5;

var bitmap = [];
for (var x = 0; x < width; x++) {
  bitmap[x] = [];
  for (var y = 0; y < height; y++) {
    bitmap[x][y] = -1;
  }
}

function getNeighbours(x, y) {
  let neighbours = [],
    obj;
  //check left neighbour
  if ((x - 1) >= 0 && bitmap[x - 1][y] < 0) {
    let obj = {
      x: (x - 1),
      y: y
    };
    neighbours.push(obj);
  }
  //check up neighbour
  if (x >= 0 && bitmap[x][y - 1] < 0) {
    let obj = {
      x: x,
      y: (y - 1)
    };
    neighbours.push(obj);
  }
  //check right neighbour
  if ((x + 1) < width && bitmap[x + 1][y] < 0) {
    let obj = {
      x: (x + 1),
      y: y
    };
    neighbours.push(obj);
  }
  //check down neighbour
  if ((y + 1) < height && bitmap[x][y + 1] < 0) {
    let obj = {
      x: x,
      y: (y + 1)
    };
    neighbours.push(obj);
  }
  return neighbours;
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
  let neighbours = getNeighbours(x, y);
  //visit cell
  bitmap[x][y] = getOppositeDirection(direction);
  while (neighbours.length > 0) {
    //get random index for next cell to visit
    randomIndex = Math.floor(Math.random() * neighbours.length % neighbours.length);
    nextIndex = neighbours[randomIndex];
    //remove object from neighbourhood array
    neighbours.splice(randomIndex, 1);
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
  return true;
}

//----Constructors----//
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
  camera_view_angle,
  aspect,
  near,
  far
);

window.onload = function() {

  var x = Math.floor(Math.random() * width % width);
  var y = Math.floor(Math.random() * height % height);

  if (carvePassages(x, y)) initialize(bitmap);
};