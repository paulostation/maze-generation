/*jshint esversion: 6 */
function solve(grid) {
    //convert grid to new format
    grid = convertMaze(grid);

    var solution = astar.search(grid, grid[0][0], grid[grid.length - 1][grid[0].length - 1]);

    renderSolution(solution);
}

function convertMaze(grid) {
    var newMaze = [];
    for (let i = 0; i < grid.length; i++) {
        //create new array with half the size of grid row
        let newMazeRow = new Array(Math.ceil(grid[i].length / 2));
        //init maze row without any walls
        for (let i = 0; i < newMazeRow.length; i++) {
            newMazeRow[i] = {
                rightWall: false,
                downWall: false
            };
        }
        //ask later on stack overflow why this method makes all cells change at once
        // newMazeRow.fill({
        //     downWall: false,
        //     rightWall: false
        // });        
        for (let j = 0; j < grid[0].length; j++) {
            //if there's a wall
            if (grid[i][j] === 1) {
                //if index is even, add a right wall
                if (j % 2 === 0) {
                    newMazeRow[j / 2].rightWall = true;
                }
                //if index is odd, add a down wall
                else {
                    var jIndex = j;

                    if (j > 1) {
                        jIndex = (j - 1) / 2;
                    } else {
                        jIndex = j - 1;
                    }

                    newMazeRow[jIndex].downWall = true;
                }
            }
        }
        newMaze.push(newMazeRow);
    }
    return newMaze;
}