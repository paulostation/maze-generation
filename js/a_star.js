/*jshint esversion: 6 */

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/ ) {
        var len = this.length;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) {
            from += len;
        }
        for (; from < len; ++from) {
            if (from in this && this[from] === elt) {
                return from;
            }
        }
        return -1;
    };
}

if (!Array.prototype.remove) {
    Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };
}

var astar = {
    init: function(grid) {
        for (var x = 0; x < grid.length; x++) {
            for (var y = 0; y < grid[x].length; y++) {
                grid[x][y].g = 0; //Custo total para chegar ao nó.
                grid[x][y].h = 0; //Tempo estimado para alcançar o final apartir do nó atual.
                grid[x][y].f = 0; //g+f quanto menor o valor de f mais rapido ou eficiente foi a resolução.
                grid[x][y].visited = false;
                grid[x][y].closed = false;
                grid[x][y].debug = "";
                grid[x][y].parent = null;
                grid[x][y].x = x;
                grid[x][y].y = y;
                grid[x][y].pos = { x: x, y: y };
            }
        }
    },
    search: function(grid, start, end, heuristic) {

        astar.init(grid);

        heuristic = heuristic || astar.manhattan;

        var openList = [];
        openList.push(start);

        while (openList.length > 0) {
            var lowInd = 0;
            for (let i = 0; i < openList.length; i++) {
                //gets the cell with lowest f score
                if (openList[i].f < openList[lowInd].f) { lowInd = i; }
            }
            var currentNode = openList[lowInd];

            //if reached the finish
            if (currentNode.x === end.x && currentNode.y === end.y) {
                var curr = currentNode;
                var ret = [];
                while (curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                return ret.reverse();
            }

            openList.remove(lowInd);
            currentNode.closed = true;

            var neighbors = astar.neighbors(grid, currentNode);
            for (let i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];

                if (neighbor.closed) {
                    continue;
                }

                var gScore = currentNode.g + 1; // 1 is the distance from a node to it's neighbor
                var gScoreIsBest = false;

                if (!neighbor.visited) {

                    gScoreIsBest = true;
                    neighbor.h = heuristic(neighbor.pos, end.pos);
                    neighbor.visited = true;
                    openList.push(neighbor);
                } else if (gScore < neighbor.g) {
                    gScoreIsBest = true;
                }

                if (gScoreIsBest) {
                    neighbor.parent = currentNode;
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.debug = "F: " + neighbor.f + "<br />G: " + neighbor.g + "<br />H: " + neighbor.h;
                }
            }
        }

        return [];
    },
    manhattan: function(pos0, pos1) {
        var d1 = Math.abs(pos1.x - pos0.x);
        var d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
    },
    neighbors: function(grid, node) {
        var ret = [];
        var x = node.x;
        var y = node.y;
        // debugger;        
        //if cell above doesn't have a down Wall
        if (grid[x - 1] && !grid[x - 1][y].downWall) {
            ret.push(grid[x - 1][y]);
            // debugger;
        }
        //if current cell doesn't have a down Wall
        if (grid[x + 1] && !grid[x][y].downWall) {
            ret.push(grid[x + 1][y]);
            // debugger;
        }
        //if cell to the left doesn't have a right Wall
        if (grid[x][y - 1] && !grid[x][y - 1].rightWall) {
            ret.push(grid[x][y - 1]);
            // debugger;
        }
        //if current cell doesn't have a right wall
        if (grid[x][y + 1] && !grid[x][y].rightWall) {
            ret.push(grid[x][y + 1]);
            // debugger;
        }
        return ret;
    }
};