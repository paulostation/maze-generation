/*jshint esversion: 6 */

var width = 10;
var height = 7;
// var row = new Array(width);
var maze = new Array(height).fill(new Array(height));
var i = 0;
var lastClosedCell = true;
var buffer = "";
const bias = 50;

var map = new Array(height).fill(new Array(width));

for (var i = 0; i < width; i++) {
    buffer += " _";
}
buffer += "\n";

for (var i = 0; i < height; i++) {
    maze[i] = new Array(width);
}


function initRow(array) {
    let i;
    for (i = 0; i < width; i++) {
        if (!array[i]) {
            console.log("index " + i + " is null, creating set...");
            var obj = {};
            makeSet(obj);
            array[i] = obj;
        } else {
            console.log("Already has a set, leaving...");
        }
    }
}

//Working 100%
function createRightWalls(array) {
    let i, r;

    for (i = 0; i < array.length - 1; i++) {
        //prevent loops
        if (find(array[i]) === find(array[i + 1])) {
            array[i].rightWall = true;
            console.log("Same set, created a rightWall on array [" + i + "].");
            continue;
        }
        r = Math.random() * 100;
        if (r < bias) {
            array[i].rightWall = true;
            console.log("Less than 50, created a rightWall on array [" + i + "].");
            continue;
        } else {
            union(array[i], array[i + 1]);
            array[i].rightWall = false;
            console.log("More than 50, didn't create a rightWall on array [" + i + "].");
        }
    }
}

function createDownWalls(array) {
    let i, r;

    for (i = 0; i < array.length - 1; i++) {
        //If only member of the set do not create a down wall
        if (find(array[i]).rank === 0) {
            console.log("Only member of the set, didn't create a downWall at");
            array[i].downWall = false;
            // debugger;
            continue;
        }
        if (find(array[i]).hasDownPassage && (find(array[i]) !== find(array[i + 1]))) {
            console.log("Last closed cell in set, didn't create a downWall");
            array[i].downWall = false;
            // debugger;
            continue;
        }
        r = Math.random() * 100;
        if (r < bias) {
            array[i].downWall = false;
            console.log("Didn't create a downWall");
        } else {
            array[i].downWall = true;
            find(array[i]).hasDownPassage = true;
            console.log("Else, created a downWall");
        }
        // debugger;
    }
}

function createNewRow(array) {
    let i;
    for (i = 0; i < array.length; i++) {
        // console.log("i = " + i);
        //remove all right walls
        array[i].rightWall = false;
        // console.log(array[i].downWall);
        if (array[i].downWall === true) {
            array[i] = null;
            console.log("index " + i + " has down wall, nullifying");
        }
    }
    for (i < 0; i < array.length; i++) {
        array[i].downWall = false;
    }
    return array;
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function printMaze(maze) {
    let i, j;
    console.log(maze);
    for (i = 0; i < height; i++) {
        buffer += "|";
        for (j = 0; j < width; j++) {
            if (maze[i][j] === 0) {
                buffer += "  ";
            } else if (maze[i][j] === 1) {
                buffer += "_ ";
            } else {
                buffer += " |";
            }
        }
        buffer += "\n";
    }
    console.log(buffer);
}

function printRow(row, index) {
    let i, j;
    
    map[index] = [];
    for (i = 0; i < row.length; i++) {
        if (!row[i].downWall && !row[i].rightWall) {
            map[index].push(0);
        } else if (row[i].downWall && !row[i].rightWall) {
            map[index].push(1);
        } else if (!row[i].downWall && row[i].rightWall) {
            map[index].push(2);
        }
    }
}

// If you decide to complete the maze
// Add a bottom wall to every cell
// Moving from left to right:
// If the current cell and the cell to the right are members of a different set:
// Remove the right wall
// Union the sets to which the current cell and cell to the right are members.
// Output the final row

function completeMaze(array) {
    let i;
    for (i = 0; i < array.length - 1; i++) {
        console.log("Last row, adding a down Wall");
        array[i].downWall = true;
        if (i == (array.length - 1)) {
            console.log("Last cell, nothing else to do");
            return;
        }
        if (find(array[i]) !== find(array[i + 1])) {
            console.log("Members of a different set, removing rightWall");
            array[i].rightWall = false;
            console.log("Union the sets to which the current cell and cell to the right are members.");
            union(array[i], array[i + 1]);
        }
    }
}

function array_copy(array) {
    let new_array = new Array(array.length);
    let i;
    for (i = 0; i < array.length; i++) {
        new_array[i] = array[i];
    }
    return new_array;
}

i = 0;
var row = [];
while (i < height) {
    initRow(row);
    //complete maze and finish
    if (i == (height - 1)) {
        completeMaze(row);
        printRow(row);
        break;
    }
    createRightWalls(row);
    createDownWalls(row);
    printRow(row, i);    
    createNewRow(row);
    i++;
}

printMaze(map);