window.addEventListener("DOMContentLoaded", function() {
	// setup the babylon.js scene
	var canvas = document.getElementById("renderCanvas");
	var engine = new BABYLON.Engine(canvas, true);
	var scene = createScene(engine, canvas);

	scene.internalMesh = scene.getMeshByName("box");
	scene.registerBeforeRender(function() {
		scene.internalMesh.rotation.y += 0.005;
	});

	engine.runRenderLoop(function() {
		if (scene.isReady()) {
			scene.render();
		}
	});

	window.addEventListener("resize", function() {
		engine.resize();
	});

	window.addEventListener("click", function() {
		// THIS IS HOW YOU DO IT!
		//https://www.babylonjs-playground.com/#DMLMIP#1

		/*
		var animationBox = new BABYLON.Animation(
			"boxAnimation",
			"rotation.y",
			30,
			BABYLON.Animation.ANIMATIONTYPE_FLOAT,
			BABYLON.Animation.ANIMATION
		);

		var keys = [];
		var value = 0.0;
		for (var i = 0; i < 2000; i++) {
			var currentKey = {};
			currentKey.frame = i;
			currentKey.value = i / 100;
			keys.push(currentKey);
		}

		animationBox.setKeys(keys);
		scene.internalMesh.animations = [];
		scene.internalMesh.animations.push(animationBox);
		scene.beginAnimation(scene.internalMesh, 0, 2000, true);
		*/

		// handle clicks on cube faces
		var pickResult = scene.pick(scene.pointerX, scene.pointerY);
		if (!pickResult.hit) {
			return;
		}

		var indices = pickResult.pickedMesh.getIndices();
		var firstVertex = indices[pickResult.faceId * 3];

		//16 top cv, 8 left github, 0 right music
		//12 Right 2 is music, 4 rgiht 3 is my cv, 20 bottom is github
		switch (firstVertex) {
			case 16:
				sendGtagEvent("CV", "./res/CV.pdf");
				break;
			case 8:
				sendGtagEvent("Github", "https://github.com/joelbalmer");
				break;
			case 0:
				sendGtagEvent("Music", "http://www.joelbalmermusic.co.uk/");
				break;
			case 4:
				sendGtagEvent("CV", "./res/CV.pdf");
				break;
			case 20:
				sendGtagEvent("Github", "https://github.com/joelbalmer");
				break;
			case 12:
				sendGtagEvent("Music", "http://www.joelbalmermusic.co.uk/");
				break;
			default:
				console.log("faceId didn't match");
				break;
		}
	});
});

var sendGtagEvent = function(goalName, url) {
	gtag("event", "Click", {
		event_category: "Cube",
		event_label: goalName,
		value: 1
	});
	window.open(url);
};

var createScene = function(engine, canvas) {
	// create the scene space
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color3(1, 1, 1);

	// add a camera to the scene and attach it to the canvas
	var camera = new BABYLON.ArcRotateCamera(
		"Camera",
		Math.PI / 4,
		Math.PI / 3,
		2,
		BABYLON.Vector3.Zero(),
		scene
	);
	camera.attachControl(canvas, true);

	// add lights to the scene
	var light1 = new BABYLON.HemisphericLight(
		"light1",
		new BABYLON.Vector3(1, 1, 0),
		scene
	);
	var light2 = new BABYLON.PointLight(
		"light2",
		new BABYLON.Vector3(0, 1, -1),
		scene
	);

	// import texture atlas, sprite sheet
	var mat = new BABYLON.StandardMaterial("mat", scene);
	var texture = new BABYLON.Texture("./img/items.png", scene);
	mat.diffuseTexture = texture;

	var columns = 3;
	var rows = 1;
	var faceUV = new Array(6);
	var faceColors = new Array(6);

	for (var i = 0; i < 6; i++) {
		faceUV[i] = new BABYLON.Vector4(
			i / columns,
			0,
			(i + 1) / columns,
			1 / rows
		);
	}

	var options = {
		height: 0.25,
		width: 0.25,
		depth: 0.25,
		faceUV: faceUV,
		updatable: true
	};

	// create the box and assign the material with textures to it
	var box = BABYLON.MeshBuilder.CreateBox("box", options, scene);
	box.material = mat;

	return scene;
};
