const constants = {
  green: "green",
  blue: "blue",
  red: "red",
  leftHand: "left-hand",
  rightHand: "right-hand",
  startigScene: "starting-screen",
  gun1Model: "#sifi-gun-2",
  gun2Model: "#sifi-gun-1",
  fireBall: "#fire-ball",
  fireSound: "#fire-sound",
  gameMusic: "#game-music",
  gameOverSound: "#game-over-sound",
  alien: "#alien",
  gun1: "gun-1",
  gun2: "gun-2",
  gun1Marker: "gun-1-marker",
  gun2Marker: "gun-2-marker",
  selectedGunDetails: "gun-selection-text",
  gameMode: "game-mode",
  currentScoreText: "display-current-score",
};

const gun1Marker = document.getElementById(constants.gun1Marker);
const gun2MArker = document.getElementById(constants.gun2Marker);
const selectedGunDetails = document.getElementById(
  constants.selectedGunDetails
);
const startigScene = document.getElementById(constants.startigScene);
const gameMode = document.getElementById(constants.gameMode);
const leftHand = document.getElementById(constants.leftHand);
const rightHand = document.getElementById(constants.rightHand);
const updateCurrentScore = document.getElementById(constants.currentScoreText);
let selectedGun;
let score = 0;
let totalGameTime = 60;
let timer = totalGameTime;
let numberOfCubes = 3;
let timerInterval;
let fireBallInitialPosition;
let fireBallFinalPosition;

function getRandomWholeNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateTimer() {
  timer = totalGameTime;
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer--;
  }, 1000);
}
function stopTimer() {
  clearInterval(timerInterval);
}

function selectRandomColor() {
  let colors = [constants.green, constants.blue, constants.red];
  let randomIndex = Math.floor(Math.random() * colors.length);
  let randomColor = colors[randomIndex];

  return randomColor;
}

function reset() {
  const cubes = document.querySelectorAll(".cube");
  const guns = document.querySelectorAll(`.${selectedGun}`);
  for (let i = 0; i < cubes.length; i++) {
    cubes[i].remove();
  }
  for (let i = 0; i < guns.length; i++) {
    guns[i].remove();
  }
  startigScene.setAttribute("visible", "true");
  gameMode.setAttribute("visible", false);
  timer = totalGameTime;
  score = 0;
  numberOfCubes = 3;
}

function generateNewPosition() {
  let position = new THREE.Vector3(
    getRandomWholeNumber(-15, 15),
    getRandomWholeNumber(5, 20),
    getRandomWholeNumber(-15, 15)
  );
  return position;
}

function generateCubes(cubeCount) {
  for (let i = 0; i < cubeCount; i++) {
    let cube = document.createElement("a-entity");

    cube.setAttribute("sound", "src", constants.fireSound);
    cube.setAttribute("score-counter", "");
    cube.setAttribute("class", "collide cube");
    cube.setAttribute("geometry", "primitive", "box");
    cube.setAttribute("material", "color", selectRandomColor());
    cube.setAttribute("position", generateNewPosition());
    cube.setAttribute("animation", "property", "rotation");
    cube.setAttribute("animation", "to", "360 360 360");
    cube.setAttribute("animation", "dur", "7000");
    cube.setAttribute("animation", "dir", "alternate");
    cube.setAttribute("animation", "loop", "true");

    gameMode.appendChild(cube);
  }
}

function createSelectedGun() {
  const leftGun = document.createElement("a-entity");

  leftGun.setAttribute("class", selectedGun);
  if (selectedGun === constants.gun1) {
    leftGun.setAttribute("gltf-model", constants.gun1Model);
    leftGun.setAttribute("scale", ".09 .09 .09");
    leftGun.setAttribute("rotation", "0 90 0");
  } else if (selectedGun === constants.gun2) {
    leftGun.setAttribute("gltf-model", constants.gun2Model);
    leftGun.setAttribute("scale", "0.6 0.6 0.6");
  }

  leftHand.appendChild(leftGun);

  const rightGun = document.createElement("a-entity");

  rightGun.setAttribute("class", selectedGun);
  if (selectedGun === constants.gun1) {
    rightGun.setAttribute("gltf-model", constants.gun1Model);
    rightGun.setAttribute("scale", ".09 .09 .09");
    rightGun.setAttribute("rotation", "0 90 0");
  } else if (selectedGun === constants.gun2) {
    rightGun.setAttribute("gltf-model", constants.gun2Model);
    rightGun.setAttribute("scale", "0.6 0.6 0.6");
  }

  rightHand.appendChild(rightGun);
}

AFRAME.registerComponent("change-game-time", {
  tick: function () {
    let el = this.el;
    el.setAttribute("value", `Game Time: ${totalGameTime}`);
  },
});

AFRAME.registerComponent("increase-game-time", {
  init: function () {
    let el = this.el;

    el.addEventListener("click", () => {
      totalGameTime++;
      updateTimer();
    });
  },
});

AFRAME.registerComponent("decrease-game-time", {
  init: function () {
    let el = this.el;

    el.addEventListener("click", () => {
      totalGameTime--;
      updateTimer();
    });
  },
});

AFRAME.registerComponent("gun-selection", {
  init: function () {
    let el = this.el;
    el.addEventListener("click", () => {
      selectedGun = el.getAttribute("id");
      if (selectedGun === "gun-1") {
        gun1Marker.setAttribute("visible", true);
        gun2MArker.setAttribute("visible", false);
        selectedGunDetails.setAttribute("value", "Super Pistol is Selected");
        selectedGunDetails.setAttribute("color", "#D1FFBD");
      } else if (selectedGun === "gun-2") {
        gun2MArker.setAttribute("visible", true);
        gun1Marker.setAttribute("visible", false);
        selectedGunDetails.setAttribute("value", "Ray Gun is Selected");
        selectedGunDetails.setAttribute("color", "#D1FFBD");
      }
    });
  },
});

AFRAME.registerComponent("timer", {
  tick: function () {
    let el = this.el;
    let gameOverSound = document.querySelector(constants.gameOverSound);
    el.setAttribute("text", "value", `TIMER: ${timer}`);
    if (timer === 0) {
      gameOverSound.play();
      updateCurrentScore.setAttribute("value", `Score: ${score}`);
      reset();
    }
  },
});

AFRAME.registerComponent("start-game", {
  init: function () {
    let el = this.el;
    el.addEventListener("click", () => {
      if (selectedGun) {
        startigScene.setAttribute("visible", "false");
        gameMode.setAttribute("visible", "true");
        createSelectedGun();
        generateCubes(numberOfCubes);
        startTimer();
      }
    });
  },
  tick: function () {
    if (timer <= 0) {
      stopTimer();
    }
  },
});

AFRAME.registerComponent("current-score", {
  tick: function () {
    let el = this.el;
    el.setAttribute("text", "value", `Score: ${score}`);
  },
});

AFRAME.registerComponent("score-counter", {
  init: function () {
    let el = this.el;
    let fireSound = document.querySelector(constants.fireSound);
    el.addEventListener("click", () => {
      fireSound.play();
      const material = el.getAttribute("material");
      if (material.color === "red") {
        score += 2;
      } else if (material.color === "blue") {
        score += 1;
      } else if (material.color === "green") {
        score += 3;
      }
      if (score % 10 === 0) {
        generateCubes(numberOfCubes);
      }
      el.setAttribute("position", generateNewPosition());
    });
  },
});
