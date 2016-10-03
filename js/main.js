/*jshint esversion: 6 */

var width = 6;
var height = 10;
var row = new Array(width);
var maze = new Array(height).fill(new Array(width));
var i = 0;
var lastClosedCell = true;

function initRow(array) {
    let i;
    for (i = 0; i < array.length; i++) {
        if (!array[i]) {
            console.log("index is null, creating set...");
            var obj = {};
            makeSet(obj);
            array[i] = obj;
        } else {
          console.log("Already has a set, leaving...");
        }
    }
}

function createRightWalls(array) {
    let i, r;
    for (i = 0; i < array.length - 1; i++) {
        console.log("i = " + i);
        //prevent loops
        if (find(array[i]) === find(array[i + 1])) {
            array[i].rightWall = true;
            console.log("Same set, created a rightWall.");
            continue;
        }
        r = Math.random() * 100;
        if (r < 25) {
            array[i].rightWall = true;
            console.log("Less than 50, created a rightWall");
            continue;
        } else {
            union(array[i], array[i + 1]);
            console.log("More than 50, didn't create a rightWall");
        }
    }
}

function createDownWalls(array) {
    let i;
    for (i = 0; i < array.length; i++) {
        //Only member of the set
        if (array[i].parent === array[i]) {
            array[i].downWall = false;
            console.log("Only member of the set, didn't create a downWall");
            continue;
        }
        if (lastClosedCell && array[i].rightWall) {
            console.log("Last cell in set, created a downWall");
            array[i].downWall = true;
            lastClosedCell = false;
        } else {
            array[i].downWall = true;
            console.log("Else, created a downWall");
        }
    }
}

function createNewRow(array) {
    let i;
    console.log(array.length);
    for (i = 0; i < array.length; i++) {
        console.log("i = " + i);
        //remove all right walls
        array[i].rightWall = false;
        // console.log(array[i].downWall);
        if (array[i].downWall === false) {
            array[i] = null;
            console.log("Has down wall, nullifying");
        }
    }
    for (i < 0; i < array.length; i++) {
        array[i].downWall = false;
    }
    console.log(array);
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
    let i, j, buffer = "";

    for (i = 0; i < maze.length; i++) {
        // for (i = 0; i < maze.length; i++) {
        // for (j = 0; j < maze[i].length; j++) {
        //     buffer += "_";
        // }
        // console.log(buffer);
        buffer += "|";

        for (j = 0; j < maze[i].length; j++) {
            buffer += " ";
            if (maze[i][j].downWall) {
                buffer += "_";
            }
            if (maze[i][j].rightWall) {
                buffer += "|";
            }
            buffer += "|";
        }
        buffer += "\n";
        
    }
    console.log(buffer);
}

function completeMaze(array) {
    let i;
    for (i = 0; i < array.length - 1; i++) {
        array[i].downWall = true;
        if (find(array[i]) !== find(array[i + 1])) {
            array[i].rightWall = false;
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

while (i < height) {
    initRow(row);
    //complete maze and finish
    if (i == height - 1) {
      console.log("Last row, i = " + i);
        completeMaze(row);
        maze[i] = array_copy(row);
        break;
    }
    createRightWalls(row);
    createDownWalls(row);
    maze[i] = array_copy(row);
    createNewRow(row);
    i++;
    sleep(150000);
}

printMaze(maze);