var astar = {
    init: function(grid) {
        for(var x = 0; x < grid.length; x++) {
            for(var y = 0; y < grid[x].length; y++) {
                grid[x][y].f = 0;
                grid[x][y].g = 0;
                grid[x][y].h = 0;
                grid[x][y].visited = false;
                grid[x][y].closed = false;
                grid[x][y].debug = "";
                grid[x][y].parent = null;
            }
        }
    },
    search: function(grid, start, end, heuristic) {
        astar.init(grid);
        heuristic = heuristic || astar.manhattan;

        var openList   = [];
        openList.push(start);

        while(openList.length > 0) {

            var lowInd = 0;
            for(var i=0; i<openList.length; i++) {
                if(openList[i].f < openList[lowInd].f) { lowInd = i; }
            }
            var currentNode = openList[lowInd];

            if(currentNode == end) {
                var curr = currentNode;
                var ret = [];
                while(curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                return ret.reverse();
            }

            openList.remove(lowInd);
            currentNode.closed = true;

            var neighbors = astar.neighbors(grid, currentNode);
            for(var i=0; i<neighbors.length;i++) {
                var neighbor = neighbors[i];

                if(neighbor.closed || neighbor.isWall()) {
                    continue;
                }

                var gScore = currentNode.g + 1; // 1 is the distance from a node to it's neighbor
                var gScoreIsBest = false;

                if(!neighbor.visited) {
                
                    gScoreIsBest = true;
                    neighbor.h = heuristic(neighbor.pos, end.pos);
                    neighbor.visited = true;
                    openList.push(neighbor);
                }
                else if(gScore < neighbor.g) {
                    gScoreIsBest = true;
                }

                if(gScoreIsBest) {
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
        var d1 = Math.abs (pos1.x - pos0.x);
        var d2 = Math.abs (pos1.y - pos0.y);
        return d1 + d2;
    },
    neighbors: function(grid, node) {
        var ret = [];
        var x = node.x;
        var y = node.y;

        if(grid[x-1] && grid[x-1][y]) {
            ret.push(grid[x-1][y]);
        }
        if(grid[x+1] && grid[x+1][y]) {
            ret.push(grid[x+1][y]);
        }
        if(grid[x][y-1] && grid[x][y-1]) {
            ret.push(grid[x][y-1]);
        }
        if(grid[x][y+1] && grid[x][y+1]) {
            ret.push(grid[x][y+1]);
        }
        return ret;
    }
};