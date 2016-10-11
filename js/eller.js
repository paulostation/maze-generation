/*jshint esversion: 6 */

var width = 3;
var height = 3;
// var row = new Array(width);
var maze = new Array(height).fill(new Array(height));
var i = 0;
var lastClosedCell = true;
var buffer = "";
const bias = 50;

const N = -2;
const S = -3;
const W = -4;
const E = -5;

var bitmap = [];



// for (i = 0; i < height; i++) {

// }


function initRow(array) {
    let i;
    for (i = 0; i < width; i++) {
        //create a new set on every index
        if (!array[i])
            array[i] = {
                value: 1,
                rightWall: false,
                downWall: false
            };
    }
    // console.log("Init row result");
    // console.log(array);
}

//Working 100%
function createRightWalls(array) {
    console.log("---- Create right walls method ---");
    let i, r;
    //for every cell, except the last
    for (i = 0; i < array.length - 1; i++) {
        //if right cell is of the same set, create a right wall to prevent loops
        if (array[i + 1].value != 1) {
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
            array[i + 1].value = array[i].value + 1;
            console.log("More than 50, didn't create a rightWall on array [" + i + "].");
        }
    }
    console.log(JSON.stringify(array));
}

function createDownWalls(array) {
    console.log("---- Create down walls method ---");
    let i, r;
    //flag used to know if there's any down passage in the same set
    let setHasDownPassage = false;

    for (i = 0; i < array.length; i++) {
        //reset flag when entering new set
        if (array[i].value == 1) {
            setHasDownPassage = false;
        }
        console.log("Has down passage: " + setHasDownPassage);
        //if only cell of the set, create down passage
        if (i !== array.length - 1) {
            if (array[i].value == 1 && array[i + 1].value == 1) {
                console.log("Only set of the cell, create down passage at " + i);
                continue;
            }
        } else if (array[i].value == 1) {
            console.log("Only set of the cell, create down passage at " + i);
            continue;
        }
        //if cell is the only cell of the set without down passage, create one

        if (i !== array.length - 1) {
            if (array[i + 1].value == 1 && !setHasDownPassage) {
                console.log("cell is the only cell of the set without down passage, create one");
                continue;
            }
        } else if (!setHasDownPassage) {
            console.log("cell is the only cell of the set without down passage, create one");
            continue;
        }
        r = Math.random() * 100;
        //create down wall and set flag
        if (r < bias) {
            console.log("Didn't create a downWall at " + i);
            setHasDownPassage = true;
        } else {
            array[i].downWall = true;
            console.log("Else, created a downWall at " + i);

        }
    }
    console.log(JSON.stringify(array));
}

function createNewRow(array) {
    var newRow = [];
    console.log("---- Create new row method ---");
    let i;
    for (i = 0; i < array.length; i++) {

        if (array[i].downWall) {
            var obj = {
                value: 1,
                rightWall: false,
                downWall: false
            };
            newRow.push(obj);
        } else {
            newRow.push(array[i]);
            console.log("index " + i + " doesn't have down wall, K'");
        }
    }
    console.log(JSON.stringify(newRow));
    array = null;
    return newRow;
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

function outputRow(row) {
    let i, j;
    for (i = 0; i < row.length - 1; i++) {
        //if right cell is from different set, create passage to the right
        if (row[i].value != row[i + 1].value) {
            row[i].rightWall = false;
        }
    }
    console.log("ooutput row result");
    console.log(JSON.stringify(row));
    return row;
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
        if (array[i + 1] == 1) {
            console.log("Members of a different set, removing rightWall");

            console.log("Union the sets to which the current cell and cell to the right are members.");
            array[i + 1] = array[i] + 1;
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

function eller() {
    i = 0;
    var row = [];
    initRow(row);
    createRightWalls(row);
    createDownWalls(row);
    bitmap.push(row);    
    console.log("Bitmap " + i);
    console.log(JSON.stringify(bitmap[i]));
    row = createNewRow(row);
    i++;
    createRightWalls(row);
    createDownWalls(row);
    bitmap.push(row);
    console.log("Bitmap " + i);
    console.log(JSON.stringify(bitmap[i]));
    row = createNewRow(row);
    i++;

            completeMaze(row);
            bitmap.push(row);

            console.log("Bitmap " + i);
    console.log(JSON.stringify(bitmap[i]));
    // while (i < height) {

    //     //complete maze and finish
    //     if (i == (height - 1)) {
    //         completeMaze(row);
    //         bitmap.push(row);
    //         break;
    //     }
    //     createRightWalls(row);
    //     createDownWalls(row);        
    //     bitmap.push(row);
    //     console.log("Bitmap " + i);
    //     console.log(JSON.stringify(bitmap[i]));
    //     row = createNewRow(row);
    //     i++;

return true;
}

window.onload = function() {
    //start from a random point
    var x = Math.floor(Math.random() * width % width);
    var y = Math.floor(Math.random() * height % height);

    if (eller()) {
        console.log("Final result");
        console.log(JSON.stringify(bitmap[0]));
        console.log(JSON.stringify(bitmap[1]));
        console.log(JSON.stringify(bitmap[2]));
        initialize(bitmap);
    }
};