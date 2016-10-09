

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

    //sphere specifications
    var radius = 50,
        segments = 32,
        rings = 32;

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

    var geometry, material;
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
        var geometry;
        var material;
        var cube_geometry;
        geometry = new THREE.PlaneGeometry(width, height);

        material = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide
        });

        var piso = new THREE.Mesh(geometry, material);
        piso.rotation.x = Math.PI / 2;
        piso.position.y -= 0.5;
        piso.position.x += width / 2;
        piso.position.x -= 0.5;
        piso.position.z += height / 2;
        scene.add(piso);

        var wallWidth = 1;
        var wallHeight = 1;
        var wallDepth = 0.1;

        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {

                geometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallDepth);

                material = new THREE.MeshLambertMaterial({
                    color: 0xff0000,
                    side: THREE.DoubleSide
                });



                var cerca_vertical = new THREE.Mesh(geometry, material);
                color = (Math.random() * 100000000) % 16777215;
                material = new THREE.MeshLambertMaterial({
                    color: 0x0000ff,
                    side: THREE.DoubleSide
                });
                var cerca_horizontal = new THREE.Mesh(geometry, material);

                var color = (Math.random() * 100000000) % 16777215;
                material = new THREE.MeshLambertMaterial({
                    color: color,
                    side: THREE.DoubleSide
                });
                var muro_horizontal = new THREE.Mesh(geometry, material);

                color = (Math.random() * 100000000) % 16777215;
                material = new THREE.MeshLambertMaterial({
                    color: color,
                    side: THREE.DoubleSide
                });
                var muro_vertical = new THREE.Mesh(geometry, material);

                cerca_horizontal.position.x = (wallWidth * j);
                cerca_horizontal.position.z = (wallWidth * i);

                cerca_vertical.rotation.y = Math.PI / 2;
                cerca_vertical.position.z = (wallWidth * i) + (wallHeight / 2);
                cerca_vertical.position.x = (wallWidth * j) - (wallHeight / 2);

                muro_horizontal.position.x = wallWidth * j;
                muro_horizontal.position.z = wallWidth * i + wallWidth;

                muro_vertical.position.x = wallWidth * i;
                muro_vertical.position.z = wallWidth * j;
                muro_vertical.rotation.y = Math.PI / 2;

                muro_vertical.position.z = (wallWidth * i) + (wallHeight / 2);
                muro_vertical.position.x = (wallWidth * j) + (wallHeight / 2);

                console.log("i: " + i + " j: " + j + " value: " + bitmap[i][j]);
                if (bitmap[i][j] === 0) {
                    console.log("rendering nofen");
                } else if (bitmap[i][j] == 1 && i != (height - 1)) {
                    scene.add(muro_horizontal);
                    console.log("rendering downWall");
                } else if (bitmap[i][j] == 2) {
                    scene.add(muro_vertical);
                    console.log("rendering rightWall");
                } else if (i != (height - 1)) {
                    scene.add(muro_vertical);
                    scene.add(muro_horizontal);
                    console.log("rendering both walls");
                } else {
                    console.log("buguei");
                }

                if (i === 0) {
                    scene.add(cerca_horizontal);
                } else if (i == (height - 1)) {
                    cerca_horizontal.position.z += wallWidth;
                    scene.add(cerca_horizontal);
                }

                if (j === 0) {
                    scene.add(cerca_vertical);
                } else if (j == (width - 1)) {
                    cerca_vertical.position.x += wallWidth;
                    scene.add(cerca_vertical);
                }
            }
        }

        var light = new THREE.AmbientLight(0xA0A0A0); // soft white light
        scene.add(light);

        //Sets up the renderer to the same size as a DOM element
        //and attaches it to that element
        renderer.setSize(viewportWidth, viewportHeight);
        viewport = document.getElementById('viewport');
        viewport.appendChild(renderer.domElement);

        camera.rotation.x -= Math.PI / 2;
        camera.position.set(height / 2, 15, width / 2);

        //attaches fly controls to the camera
        controls = new THREE.FlyControls(camera);
        //camera control properties
        controls.movementSpeed = 0.5;
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