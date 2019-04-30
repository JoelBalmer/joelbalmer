window.addEventListener("DOMContentLoaded", function() {
  // hide overlay if previous visitor
  var overlay = document.getElementById("info-overlay");
  document.cookie.split(";").filter(cookie => {
    if (cookie.includes("overlay=hidden")) {
      overlay.hidden = true;
    } else {
      overlay.addEventListener("click", removeOverlay);
      overlay.addEventListener("mouseup", removeOverlay);
      overlay.addEventListener("pointerup", removeOverlay);
      overlay.addEventListener("touchend", removeOverlay);
    }
  });

  // setup the babylon.js scene
  var canvas = document.getElementById("renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);
  var scene = createScene(engine, canvas);

  // setup animation variables
  var cubePosition = 0;
  window.shouldAnimate = 1;


  scene.defaultCursor = "pointer";
  scene.internalMesh = scene.getMeshByName("box");
  scene.registerBeforeRender(function() {
    scene.internalMesh.rotation.y = cubePosition += (shouldAnimate * 0.002);
  });

  engine.runRenderLoop(function() {
    if (scene.isReady()) {
      scene.render();
      engine.hideLoadingUI();
    }
  });

  window.addEventListener("resize", function() {
    engine.resize();
  });

  // detect whether point click or drag has been made
  var deltaX
  var deltaY;

  function onPointerDown() {
    deltaX = scene.pointerX;
    deltaY = scene.pointerY;
  }

  function onPointerUp() {
    if (
      Math.abs(scene.pointerX - deltaX) < 2 ||
      Math.abs(scene.pointerY - deltaY) < 2
    ) {
      clickOutcome(scene.pick(scene.pointerX, scene.pointerY));
    }
  }

  // Add click listeners
  window.addEventListener("mousedown", onPointerDown);
  window.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("touchstart", onPointerDown);
  window.addEventListener("mouseup", onPointerUp);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("touchend", onPointerUp);

  window.addEventListener("click", printMousePos);
});

var removeOverlay = function() {
  // hide overlay animation
  var overlay = document.getElementById("info-overlay");
  overlay.classList.add("hidden");

  // set overlay cookie
  let date = new Date("December 17, 2028");
  document.cookie = "overlay=hidden; expires=" + date.toUTCString();
};

function printMousePos(event) {
  let circle = document.getElementById("circle-click");
  circle.style.left = event.clientX - 10 + "px";
  circle.style.top = event.clientY - 10 + "px";
  
  // Continue fade animation
  circle.classList.add("fade-in-out");
  circle.addEventListener("animationend", function () {
    circle.classList.remove("fade-in-out");
  });
  circle.addEventListener("webkitAnimationEnd", function(){
    circle.classList.remove("fade-in-out");
  });

}

var clickOutcome = function(pickResult) {
  if (!pickResult.hit) {
    return;
  }

  // kill animation
  window.shouldAnimate = 0;

  // change colour to red when clicked
  pickResult.pickedMesh.material.emissiveColor = BABYLON.Color3.Red();

  // 16 top cv, 8 left github, 0 right music
  // 12 Right 2 is music, 4 rgiht 3 is my cv, 20 bottom is github
  var indices = pickResult.pickedMesh.getIndices();
  var firstVertex = indices[pickResult.faceId * 3];
  switch (firstVertex) {
    case 16:
      sendGtagEvent("Music", "http://www.joelbalmermusic.co.uk/");
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
      sendGtagEvent("CV", "./res/CV.pdf");
      break;
    case 12:
      sendGtagEvent("Garden", "https://www.instagram.com/allotmental_health/");
      break;
    default:
      break;
  }
};

var sendGtagEvent = function(goalName, url) {
  gtag("event", "Click", {
    event_category: "Cube",
    event_label: goalName,
    value: 1
  });
  document.location.href = url;
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

  engine.loadingUIBackgroundColor = "white";
  engine.displayLoadingUI();

  // import texture atlas, sprite sheet
  var mat = new BABYLON.StandardMaterial("mat", scene);
  //var texture = new BABYLON.Texture("./img/items.png", scene);
  var texture = new BABYLON.Texture("./img/items-4.png", scene);
  mat.diffuseTexture = texture;

  var columns = 4;
  var rows = 1;
  var faceUV = new Array(6);

  for (var i = 0; i < 6; i++) {
    faceUV[i] = new BABYLON.Vector4(
      i / columns,
      0,
      (i + 1) / columns,
      1 / rows
    );
  }

  var options = {
    height: 0.35,
    width: 0.35,
    depth: 0.35,
    faceUV: faceUV,
    updatable: true
  };

  // create the box and assign the material with textures to it
  var box = BABYLON.MeshBuilder.CreateBox("box", options, scene);
  box.material = mat;
  box.isPickable = true;
  box.actionManager = new BABYLON.ActionManager(scene);

  //ON MOUSE ENTER
  box.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOverTrigger,
      function(ev) {
        box.material.emissiveColor = BABYLON.Color3.Red();
      }
    )
  );

  //ON MOUSE EXIT
  box.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOutTrigger,
      function(ev) {
        box.material.emissiveColor = BABYLON.Color3.Black();
      }
    )
  );

  scene.registerAfterRender(function() {
    if (canvas.style.cursor === "pointer") {
      canvas.style.cursor = "grab";
    }
  });

  return scene;
};
