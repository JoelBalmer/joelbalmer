window.addEventListener('DOMContentLoaded', function() {
	var canvas = document.getElementById('renderCanvas');
	var engine = new BABYLON.Engine(canvas, true);
	var scene = createScene(engine, canvas);

	engine.runRenderLoop(function(){
        scene.render();
    });

    window.addEventListener('resize', function(){
        engine.resize();
    });
});

var createScene = function(engine, canvas) {
    // Create the scene space
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(1, 1, 1);

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

    var mat = new BABYLON.StandardMaterial("mat", scene);
	var texture = new BABYLON.Texture("http://www.joelbalmermusic.co.uk/img/items2.png", scene);
	mat.diffuseTexture = texture;

    var columns = 3;
    var rows = 1;
    var faceUV = new Array(6);
    var faceColors = new Array(6);
    for (var i = 0; i < 6; i++) {
        faceUV[i] = new BABYLON.Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
        faceColors[i] = new BABYLON.Color4(1, 1, 1, 1);
    }

    var options = {
    	height: 0.5,
		width: 0.5,
		depth: 0.5,
        faceUV: faceUV
    };

    // This is where you create and manipulate meshes
	var box = BABYLON.MeshBuilder.CreateBox("box", options, scene);	
	box.material = mat;

    return scene;
}