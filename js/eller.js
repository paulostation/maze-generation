/*jshint esversion: 6 */

var width = 3;
var height = 3;
// var row = new Array(width);
var maze = new Array(height).fill(new Array(height));
var i = 0;
var lastClosedCell = true;
var buffer = "";
const bias = 50;

var bitmap = new Array(height).fill(new Array(width));

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
        //if row is null, create a new empty set
        if (!array[i]) {
            var obj = {};
            makeSet(obj);
            array[i] = obj;
        }
    }
}

//Working 100%
function createRightWalls(array) {
    console.log("---- Create right walls method ---");
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


/**
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
function checkDownPassages(cell, downPassages) {
    // if (downPasasges.length == )
        let count = 0;
    for (let i = 0; i < downPassages.length; i++) {
        //if any of the downPassages is of the same set as the cell, return true
        if (find(cell) === find(downPassages[i])) {
            console.log("cells are from the same set");
            return false;
        } else {
            console.log("cells are from different sets");
        }
    }
    return true;
}


function createDownWalls(array) {
    console.log("---- Create down walls method ---");
    let i, r, frontier = false;
    let downPassages = [];
    for (i = 0; i < array.length; i++) {
        console.log("Down passages length: " + downPassages.length);
        //If only member of the set do not create a down wall
        if (find(array[i]).rank === 0) {
            console.log("Only member of the set, didn't create a downWall at " + i);
            array[i].downWall = false;
            downPassages.push(array[i]);
            continue;
        }

        if (checkDownPassages(array[i], downPassages)) {
            console.log("Last closed cell in set, didn't create a downWall at " + i);
            array[i].downWall = false;
            find(array[i]).downPassages++;
            frontier = false;
            downPassages.push(array[i]);
            continue;
        }
        r = Math.random() * 100;
        if (r < bias) {
            array[i].downWall = false;
            find(array[i]).downPassages++;
            downPassages.push(array[i]);
            console.log("Didn't create a downWall at " + i);
        } else {
            array[i].downWall = true;
            console.log("Else, created a downWall at " + i);
        }

        // debugger;
    }

    for (i = 0; i < array.length; i++) {
        find(array[i]).downPassages = 0;
    }
}

function createNewRow(array) {
    console.log("---- Create new row method ---");
    let i;
    for (i = 0; i < array.length; i++) {
        // console.log("i = " + i);
        //remove all right walls
        array[i].rightWall = false;
        // console.log(array[i].downWall);
        if (array[i].downWall === true) {
            array[i] = null;
            console.log("index " + i + " has down wall, nullifying");
        } else {
            console.log("index " + i + " doesn't have down wall, K'");
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
    console.log("Printing row " + index);
    bitmap[index] = [];
    for (i = 0; i < row.length; i++) {
        if (!row[i].downWall && !row[i].rightWall) {
            console.log("No walls on " + i);
            bitmap[index].push(0);
        } else if (row[i].downWall && !row[i].rightWall) {
            console.log("Only down wall on " + i);
            bitmap[index].push(1);
        } else if (!row[i].downWall && row[i].rightWall) {
            console.log("Only right wall on " + i);
            bitmap[index].push(2);
        } else if (row[i].downWall && row[i].rightWall) {
            console.log("Both walls on " + i);
            bitmap[index].push(3);
        } else {
            console.log("buguei");
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
        // console.log("Last row, adding a down Wall");
        // array[i].downWall = true;
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
        printRow(row, i);
        break;
    }
    createRightWalls(row);
    createDownWalls(row);
    printRow(row, i);
    createNewRow(row);
    i++;
}
