function makeSet(x) {
    x.rank = 0;
    //used to know whether the cell is the only without down passage
    x.hasDownPassage = false;
    x.rightWall = true;
    x.downWall = true;
    x.parent = x;    
}

function find(x) {    
    if (x.parent != x)
        x.parent = find(x.parent);
     return x.parent;
}

function union(x, y) {
    var xRoot = find(x);
    var yRoot = find(y);
    if (xRoot == yRoot) return;
    // x and y are not already in same set. Merge them.
    if (xRoot.rank < yRoot.rank)
        xRoot.parent = yRoot;
    else if (xRoot.rank > yRoot.rank)
        yRoot.parent = xRoot;
    else {
        yRoot.parent = xRoot;
        xRoot.rank = xRoot.rank + 1;
    }
}