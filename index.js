import { printMousePos } from './utils/circle-click.js';

window.addEventListener("DOMContentLoaded", () => {

  // hide overlay if previous visitor
  const overlay = document.getElementById("info-overlay");
  const title = document.getElementById ('title');

  document.cookie.split(";").filter(cookie => {
    if (cookie.includes('overlay')) {
      if (cookie.includes ('overlay=hidden')) {
        overlay.hidden = true;
      } else {
        overlay.hidden = false;
        overlay.addEventListener ('click', removeOverlay);
        overlay.addEventListener ('mouseup', removeOverlay);
        overlay.addEventListener ('pointerup', removeOverlay);
        overlay.addEventListener ('touchend', removeOverlay);
      }
    }

    title.hidden = false;
  });

  // setup the babylon.js scene
  const canvas = document.getElementById("renderCanvas");
  const engine = new BABYLON.Engine(canvas, true);
  const scene = createScene(engine, canvas);

  // setup animation variables
  let cubePosition = 0;
  window.shouldAnimate = 1;

  scene.defaultCursor = "pointer";
  scene.internalMesh = scene.getMeshByName("box");
  scene.registerBeforeRender(() => {
    scene.internalMesh.rotation.y = cubePosition += (shouldAnimate * 0.002);
  });

  engine.runRenderLoop(() => {
    if (scene.isReady()) {
      scene.render();
      engine.hideLoadingUI();
    }
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });

  // detect whether point click or drag has been made
  let deltaX;
  let deltaY;

  const onPointerDown = () => {
    deltaX = scene.pointerX;
    deltaY = scene.pointerY;
  }

  const onPointerUp = () => {
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

var removeOverlay = () => {
  // hide overlay animation
  const overlay = document.getElementById("info-overlay");
  overlay.classList.add("hidden");

  // set overlay cookie
  let date = new Date("December 17, 2028");
  document.cookie = "overlay=hidden; expires=" + date.toUTCString();
};

const clickOutcome = pickResult => {
  if (!pickResult.hit) {
    return;
  }

  // kill animation
  window.shouldAnimate = 0;

  // change colour to red when clicked
  pickResult.pickedMesh.material.emissiveColor = BABYLON.Color3.Red();

  // 16 top cv, 8 left github, 0 right music
  // 12 Right 2 is music, 4 rgiht 3 is my cv, 20 bottom is github
  const indices = pickResult.pickedMesh.getIndices();
  const firstVertex = indices[pickResult.faceId * 3];
  switch (firstVertex) {
    case 16:
      sendGtagEvent("Music", "http://www.joelbalmermusic.co.uk/");
      break;
    case 8:
      sendGtagEvent("Github", "./projects");
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

const sendGtagEvent = (goalName, url) => {
  gtag("event", "Click", {
    event_category: "Cube",
    event_label: goalName,
    value: 1
  });
  document.location.href = url;
};

const createScene = (engine, canvas) => {
  // create the scene space
  let scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(1, 1, 1);

  // add a camera to the scene and attach it to the canvas
  let camera = new BABYLON.ArcRotateCamera(
    "Camera",
    Math.PI / 4,
    Math.PI / 3,
    2,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, true);

  // add lights to the scene
  const light1 = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(1, 1, 0),
    scene
  );
  const light2 = new BABYLON.PointLight(
    "light2",
    new BABYLON.Vector3(0, 1, -1),
    scene
  );

  engine.loadingUIBackgroundColor = "white";
  engine.displayLoadingUI();

  // import texture atlas, sprite sheet
  let mat = new BABYLON.StandardMaterial("mat", scene);
  const texture = new BABYLON.Texture("./res/img/items-4.png", scene);
  mat.diffuseTexture = texture;

  const columns = 4;
  const rows = 1;
  const faceUV = new Array(6);

  for (let i = 0; i < 6; i++) {
    faceUV[i] = new BABYLON.Vector4(
      i / columns,
      0,
      (i + 1) / columns,
      1 / rows
    );
  }

  const options = {
    height: 0.35,
    width: 0.35,
    depth: 0.35,
    faceUV: faceUV,
    updatable: true
  };

  // create the box and assign the material with textures to it
  let box = BABYLON.MeshBuilder.CreateBox("box", options, scene);
  box.material = mat;
  box.isPickable = true;
  box.actionManager = new BABYLON.ActionManager(scene);

  //ON MOUSE ENTER
  box.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOverTrigger,
      (ev) => {
        box.material.emissiveColor = BABYLON.Color3.Red();
      }
    )
  );

  //ON MOUSE EXIT
  box.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOutTrigger,
      (ev) => {
        box.material.emissiveColor = BABYLON.Color3.Black();
      }
    )
  );

  scene.registerAfterRender(() => {
    if (canvas.style.cursor === "pointer") {
      canvas.style.cursor = "grab";
    }
  });

  return scene;
};
