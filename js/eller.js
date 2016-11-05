/*jshint esversion: 6 */
var bias = 50;
var width = 14;
var heigth = 14;
var maze = [];

eller();

function Cell(a, b) {
    this.right = false;
    this.down = true;
    this.x = a;
    this.y = b;
    this.set = null;
    this.uuid = guid();
}


function makeSet(row) {
    for (let index = 0; index < row.length; index++) {
        cell = row[index];
        //if cell doesn't have a set, create a new one
        if (!cell.set) {
            let list = [];
            list.push(cell);
            cell.set = list;
            row[index] = cell;
        }
    }
    return row;
}

function makeRightWalls(row) {

    let r;

    for (let i = 1; i < row.length; i++) {
        //if cell is in the same set, create a right wall between them        
        if (isContainsInList(row[i - 1].set, row[i])) {
            row[i - 1].right = true;
            continue;
        }

        r = Math.random() * 100;
        //create down wall based on bias
        if (r < bias) {
            row[i - 1].right = true;
        } else {
            row = merge(row, i);
        }
    }

    return row;
}

function merge(row, i) {

    var currentList = row[i - 1].set;

    var nextList = row[i].set;

    for (let j = 0; j < nextList.length; j++) {

        currentList.push(nextList[j]);

        nextList[j].set = currentList;

    }

    return row;

}

function isContainsInList(set, cell) {

    for (let i = 0; i < set.length; i++) {

        if (cell.uuid === set[i].uuid) {
            return true;
        }
    }
    return false;
}

//return false if there is a down passage
function isNotDone(set) {

    let rslt = true;

    for (let i = 0; i < set.length; i++) {
        rslt = rslt && set[i].down;
    }
    return rslt;
}

function makeDown(row) {
    let r;
    //make all down walls
    for (let i = 0; i < row.length; i++) {
        row[i].down = true;
    }

    for (let i = 0; i < row.length; i++) {
        //while there aren't down passages, make one of them a down passage
        while (isNotDone(row[i].set)) {
            do {

                var a = row[i].set.length;

                randomIndex = Math.floor(Math.random() * a % a);

                row[i].set[randomIndex].down = false;

                r = Math.random() * 100;

            } while (r < 50);
        }
    }
    return row;
}

function end(row) {
    for (let i = 1; i < row.length; i++) {
        //current cell and cell to the left are from different sets, merge them
        if (findPos(row[i - 1].set, row[i]) == -1) {
            row[i - 1].right = false;
            row = merge(row, i);
        }
    }
    return row;
}

function findPos(set, x) {

    var tmpArray = set;

    for (let i = 0; i < tmpArray.length; i++)

        if (tmpArray[i] == x)

            return i;

    return -1;

}



function genNextRow(previousRow) {

    for (let i = 0; i < previousRow.length; i++) {

        previousRow[i].right = false;

        previousRow[i].x++;

        if (previousRow[i].down) {

            previousRow[i].set.splice(findPos(previousRow[i].set, previousRow[i]), 1);

            previousRow[i].set = null;

            previousRow[i].down = false;

        }

    }

    return previousRow;

}



function printMaze(row, rowPos) {

    for (let i = 0; i < row.length; i++) {
        //set 1 to even indexes, if there is a right wall
        if (row[i].right)

            maze[rowPos][2 * i] = 1;
        //set 1 to odd indexes, if there is a down wall
        if (row[i].down)

            maze[rowPos][2 * i + 1] = 1;
    }

}

//used to generate an unique ID for each cell
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

//when window is ready, render it
window.onload = function() {
    initialize(maze);
    solve(maze);
};

function eller() {

    var cur = [];

    for (let i = 0; i < width; i++) {

        cur.push(new Cell(0, i));

    }

    for (let i = 0; i < heigth; i++) {

        maze[i] = [];

        for (let j = 0; j < 2 * width; j++) {

            maze[i][j] = 0;
        }
    }


    for (let i = 0; i < heigth; i++) {

        cur = makeSet(cur);

        cur = makeRightWalls(cur);

        cur = makeDown(cur);

        if (i == heigth - 1)

            cur = end(cur);

        printMaze(cur, i);

        if (i != heigth - 1)

            cur = genNextRow(cur);

    }

}