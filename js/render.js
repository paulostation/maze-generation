/*jshint esversion: 6 */
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

//----Variables----//
//DOM element to attach the renderer to
var viewport;

//built-in three.js controls will be attached to this
var controls;

//viewport size
var viewportWidth = 1024;
var viewportHeight = 768;

//camera attributes
var camera_view_angle = 45,
    aspect = viewportWidth / viewportHeight,
    near = 0.1, //near clip-plane
    far = 10000; //far clip-plane

//a cross-browser method for efficient animation, more info at:
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();



//----Initialization----//
function initialize(bitmap) {

    var i, j;
    var geometry;
    var material;
    var cubeGeometry;
    var color;
    var width = bitmap[0].length / 2;
    var height = bitmap.length;

    geometry = new THREE.PlaneGeometry(width, height);

    material = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        side: THREE.DoubleSide
    });

    var floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = Math.PI / 2;
    floor.position.y -= 0.5;
    floor.position.x += width / 2;
    floor.position.x -= 0.5;
    floor.position.z += height / 2;
    scene.add(floor);

    var wallWidth = 1;
    var wallHeight = 1;
    var wallDepth = 0.1;


    for (i = 0; i < height; i++) {
        for (j = 0; j < width * 2; j++) {

            if (bitmap[i][j] !== 1) continue;

            color = (Math.random() * 100000000) % 16777215;
            geometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallDepth);
            material = new THREE.MeshLambertMaterial({
                color: color,
                side: THREE.DoubleSide
            });

            var muro_horizontal = new THREE.Mesh(geometry, material);

            muro_horizontal.position.x = wallWidth * (j / 2) - wallWidth / 2;
            muro_horizontal.position.z = wallWidth * i + wallWidth;

            color = (Math.random() * 100000000) % 16777215;
            geometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallDepth);
            material = new THREE.MeshLambertMaterial({
                color: color,
                side: THREE.DoubleSide
            });

            var muro_vertical = new THREE.Mesh(geometry, material);

            muro_vertical.rotation.y = Math.PI / 2;

            muro_vertical.position.z = (wallWidth * i) + (wallHeight / 2);
            muro_vertical.position.x = (wallWidth * j / 2) + (wallHeight / 2);

            //if it's an even index, add right wall
            if (j % 2 === 0) {
                scene.add(muro_vertical);
            }
            //if it's odd, add down wall 
            else {
                scene.add(muro_horizontal);
            }
        }
    }

    //make 
    for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {

            geometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallDepth);

            material = new THREE.MeshLambertMaterial({
                color: 0xff0000,
                side: THREE.DoubleSide
            });

            var verticalWall = new THREE.Mesh(geometry, material);

            material = new THREE.MeshLambertMaterial({
                color: 0x0000ff,
                side: THREE.DoubleSide
            });

            var horizontalWall = new THREE.Mesh(geometry, material);

            horizontalWall.position.x = (wallWidth * j);
            horizontalWall.position.z = (wallWidth * i);

            verticalWall.rotation.y = Math.PI / 2;
            verticalWall.position.z = (wallWidth * i) + (wallHeight / 2);
            verticalWall.position.x = (wallWidth * j) - (wallHeight / 2);


            //add horizontal fence on first row
            if (i === 0) {
                scene.add(horizontalWall);
                //and last row
            } else if (i == (height - 1)) {
                horizontalWall.position.z += wallWidth;
                scene.add(horizontalWall);
            }

            //add vertical fence on first column
            if (j === 0) {
                //if it is 0,0 don't create a wall, it's the maze entrance
                if (i === 0) {
                    continue;
                }
                scene.add(verticalWall);
                //and last column
            } else if (j == (width - 1)) {
                //if it is 0,0 don't create a wall, it's the maze entrance
                if (i === height - 1) {
                    continue;
                }
                verticalWall.position.x += wallWidth;
                scene.add(verticalWall);
            }
        }
    }

    var light = new THREE.AmbientLight(0xA0A0A0); // soft white light
    // var light = new THREE.AmbientLight(0xFFFFFF); // soft white light
    scene.add(light);

    //Sets up the renderer to the same size as a DOM element
    //and attaches it to that element
    renderer.setSize(viewportWidth, viewportHeight);
    viewport = document.getElementById('viewport');
    viewport.appendChild(renderer.domElement);

    camera.rotation.x -= Math.PI / 2;
    camera.position.set(height / 2, 20, width / 2);

    //attaches fly controls to the camera
    controls = new THREE.FlyControls(camera);
    //camera control properties
    controls.movementSpeed = 0.1;
    controls.domElement = viewport;
    controls.rollSpeed = 0.01;
    controls.autoForward = false;
    controls.dragToLook = true;



    // call update
    update();
}
//----Update----//
function update() {
    //requests the browser to call update at it's own pace
    requestAnimFrame(update);

    //update controls
    controls.update(1);
    document.getElementById('viewport');
    document.getElementById("camera_stuff").innerHTML = "position=" +
        camera.position.x + "," +
        camera.position.y + "," +
        camera.position.z + "<br>" +
        "rotation=" +
        camera.rotation.x + "," +
        camera.rotation.y + "," +
        camera.rotation.z + "\n";

    //call draw
    draw();
}
//----Draw----//
function draw() {
    renderer.render(scene, camera);
}

function renderSolution(solution) {
    var wallWidth = 0.1;
    var wallHeight = 0.1;
    var wallDepth = 1;

    var color = 0x00ff00;
    var geometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallDepth);
    var material = new THREE.MeshLambertMaterial({
        color: color,
        side: THREE.DoubleSide
    });

    var first = new THREE.Mesh(geometry, material);
    //if path is going downward
    if (solution[0].x > 0) {
        first.position.z += 1;
    } else {
        first.rotation.y = Math.PI / 2;
        first.position.z += 0.5;
        first.position.x += 0.5;
    }

    scene.add(first);

    for (let i = 0; i < solution.length; i++) {

        if (i == solution.length - 1) {
            wallDepth = 0.5;
        }

        color = 0x00ff00;
        geometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallDepth);
        material = new THREE.MeshLambertMaterial({
            color: color,
            side: THREE.DoubleSide
        });

        var path = new THREE.Mesh(geometry, material);



        path.position.x = solution[i].pos.y;
        path.position.z = solution[i].pos.x;
        path.position.z += 0.5;

        if (solution[i + 1] && solution[i + 1].y > solution[i].y) {
            path.rotation.y += Math.PI / 2;
            path.position.x += 0.5;
        }
        //if path is going upward
        if (solution[i + 1] && solution[i + 1].x < solution[i].x) {
            // path.rotation.y += Math.PI / 2;
            path.position.z -= 0.5;
        }
        //if path is going downward
        if (solution[i + 1] && solution[i + 1].x > solution[i].x) {
            // path.rotation.y += Math.PI / 2;
            path.position.z += 0.5;
        }
        //if path is going to the left
        if (solution[i + 1] && solution[i + 1].y < solution[i].y) {
            path.rotation.y += Math.PI / 2;
            path.position.x -= 0.5;
        }
        if (i == solution.length - 1) {
            path.rotation.y += Math.PI / 2;
            path.position.x += 0.25;
        }
        scene.add(path);
    }
}