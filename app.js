const COLORS_SPLIT = 4;
const NUM_EMPTY_TUBE = 2;
const colors = [
  { color: "red", count: COLORS_SPLIT },
  { color: "green", count: COLORS_SPLIT },
  { color: "blue", count: COLORS_SPLIT },
  { color: "cyan", count: COLORS_SPLIT },
  { color: "orange", count: COLORS_SPLIT },
];
const CREATE_EMPTY_TUBE = (noOfEmptyTube) => {
  let arr = [];
  for (i = 0; i < noOfEmptyTube; i++) {
    arr.push([""]);
  }
  return arr;
};
const container = [
  ...colors.map((_) => []),
  ...CREATE_EMPTY_TUBE(NUM_EMPTY_TUBE),
];
const playAgain = document.querySelector(".play-btn");

playAgain.addEventListener("click", () => {
  location.reload();
});

function loadInitialTubs() {
  while (colors.length > 0) {
    for (let tube = 0; tube < container.length - NUM_EMPTY_TUBE; tube++) {
      if (container[tube].length < COLORS_SPLIT) {
        const clrIndex = Math.round(Math.random() * (colors.length - 1));

        container[tube].push(colors[clrIndex].color);

        colors[clrIndex].count--;
        if (colors[clrIndex].count === 0) {
          colors.splice(clrIndex, 1);
        }
      }
    }
  }
}

function renderDOM() {
  const main = document.querySelector(".main");

  main.innerHTML = "";
  container.forEach((tube, index) => {
    if (tube.length === 0) tube.push("");
    const div = document.createElement("div");
    div.classList.add("tube");
    div.dataset.id = index;
    const section = document.createElement("section");
    section.classList.add("cap");
    div.append(section);
    tube.forEach((color) => {
      const span = document.createElement("span");
      span.classList.add("color");
      div.append(span);
      if (color) {
        span.style.backgroundColor = color;
      }

      main.append(div);
    });
  });
  const tubes = document.querySelectorAll(".tube");
  tubes.forEach((tube) => tube.addEventListener("click", handleTube));
  const colors = document.querySelectorAll(".color");
  colors.forEach((color) =>
    color.style.setProperty("--color-split", COLORS_SPLIT)
  );
}

function handleTube(e) {
  e.preventDefault();

  const tubes = [...document.querySelectorAll(".tube")];
  const tube = e.target.closest(".tube");
  let firstTubeIndex = null;
  const isActive = tubes.some((tube, i) => {
    if (tube.classList.contains("active")) {
      firstTubeIndex = i;
      return true;
    }
  });
  if (!isActive) {
    tube.classList.add("active");
  } else {
    if (
      container[tube.dataset.id].length === COLORS_SPLIT ||
      (!container[tube.dataset.id][0] && !container[firstTubeIndex][0]) ||
      tube.classList.contains("active")
    ) {
      tubes.forEach((tube) => tube.classList.remove("active"));
      return;
    }

    if (
      container[tube.dataset.id][0] == container[firstTubeIndex][0] ||
      !container[tube.dataset.id][0] ||
      !container[firstTubeIndex][0]
    ) {
      function dropColor() {
        if (container[firstTubeIndex].includes("")) return;
        console.log(container[firstTubeIndex]);
        const color = container[firstTubeIndex].shift();
        if (container[tube.dataset.id][0] === "") {
          container[tube.dataset.id].pop();
        }
        container[tube.dataset.id].unshift(color);

        if (
          color === container[firstTubeIndex][0] &&
          container[tube.dataset.id].length < COLORS_SPLIT
        ) {
          dropColor();
        }
      }

      dropColor();
      renderDOM();
    } else {
      tubes.forEach((tube) => tube.classList.remove("active"));
    }

    checkColors();
  }
}

loadInitialTubs();
renderDOM();
function checkColors() {
  let timer;
  if (timer) {
    clearTimeout(timer);
  }
  const isSort = container.every((tube) =>
    tube.every((colors, _, arr) => {
      if (arr[0] === colors) {
        let emptyTubs = container.reduce((clr, color) => {
          if (color.length === 1 && color.includes("")) {
            clr++;
          }
          return clr;
        }, 0);

        if (emptyTubs === 2) {
          return true;
        }
      }
    })
  );

  timer = setTimeout(() => {
    if (isSort) {
      const overlay = document.querySelector(".overlay");
      overlay.style.display = "flex";
    }
  }, 600);
}
