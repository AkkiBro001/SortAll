let COLORS_SPLIT = 4;
const NUM_EMPTY_TUBE = 2;
const NUMBERS_OF_UNDO = 4;
let initialColor = [
  { color: "red", count: COLORS_SPLIT },
  { color: "green", count: COLORS_SPLIT },
  { color: "blue", count: COLORS_SPLIT },
  { color: "cyan", count: COLORS_SPLIT },
  { color: "orange", count: COLORS_SPLIT },

];
const level = document.querySelector('#level')
level.addEventListener('change', updateLevel)

function updateLevel() {


  const additionalColors = [{ color: "yellow", count: COLORS_SPLIT }, { color: "lime", count: COLORS_SPLIT }, { color: "purple", count: COLORS_SPLIT }]
  if (level.value === "1") {
    return loadGame(COLORS_SPLIT, NUM_EMPTY_TUBE, JSON.parse(JSON.stringify(initialColor)), NUMBERS_OF_UNDO)
  } else if (level.value === "2") {

    return loadGame(COLORS_SPLIT, NUM_EMPTY_TUBE, [...JSON.parse(JSON.stringify(initialColor)), additionalColors[0]], NUMBERS_OF_UNDO)
  } else {

    return loadGame(COLORS_SPLIT, NUM_EMPTY_TUBE, [...JSON.parse(JSON.stringify(initialColor)), ...JSON.parse(JSON.stringify(additionalColors))], NUMBERS_OF_UNDO)
  }

}



function loadGame(colorSplit, noOfEmptyTube, colorsArr, numbersOfUndo) {
  let defaultContainer = "";
  let undoArr = [];
  let colors = [...JSON.parse(JSON.stringify(colorsArr))];
  const lable = document.querySelector("#lable")
  const undo = document.querySelector('#undo')
  let container
  const restart = document.querySelector('#restart')
  restart.addEventListener('click', restartGame);

  function resetUndo() {
    //Reset Undo
    numbersOfUndo = NUMBERS_OF_UNDO;
    lable.style.textContent = 0;
    lable.style.display = "none"
    undo.classList.add('disable')
    undoArr = [];

  }


  function restartGame() {
    restart.removeEventListener('click', restartGame);
    if (defaultContainer) {
      container = JSON.parse(defaultContainer)
      loadInitialTubs()
      renderDOM()
    }
    resetUndo()

    restart.addEventListener('click', restartGame);
  }



  function tubeInitSetup() {

    const CREATE_EMPTY_TUBE = (noOfEmptyTube) => {
      let arr = [];
      for (i = 0; i < noOfEmptyTube; i++) {
        arr.push([""]);
      }
      return arr;
    };


    container = [
      ...colors.map((_) => []),
      ...CREATE_EMPTY_TUBE(noOfEmptyTube),
    ];

  }


  const playAgain = document.querySelector(".play-btn");

  playAgain.addEventListener("click", () => {
    const overlay = document.querySelector(".overlay");
    overlay.style.display = "none";
    updateLevel()
  });



  function loadInitialTubs() {


    while (colors.length > 0) {

      for (let tube = 0; tube < container.length - noOfEmptyTube; tube++) {

        if (container[tube].length < colorSplit) {
          const clrIndex = Math.round(Math.random() * (colors.length - 1));

          container[tube].push(colors[clrIndex].color);

          colors[clrIndex].count--;
          if (colors[clrIndex].count <= 0) {
            colors.splice(clrIndex, 1);
          }

        }



      }


    }


    defaultContainer = JSON.stringify(container);

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
      color.style.setProperty("--color-split", colorSplit)
    );
  }

  function setUndo() {


    if (undoArr.length < numbersOfUndo) {

      undoArr.push(JSON.parse(JSON.stringify(container)))
    } else if (undoArr.length === numbersOfUndo) {

      undoArr.shift()
      undoArr.push(JSON.parse(JSON.stringify(container)));
    }

    if (undoArr.length === numbersOfUndo) {
      
      lable.style.display = "flex";
      lable.textContent = numbersOfUndo - 1
      undo.classList.remove('disable')
    }
  }

  undo.addEventListener('click', handleUndo)
  function handleUndo() {
    
    if (undoArr.length === 0 || undoArr.length === 1 || lable.style.display === "none") return;
    undo.classList.remove('disable')
    undoArr.pop()
    container = JSON.parse(JSON.stringify(undoArr[undoArr.length - 1]));
    renderDOM()
    lable.textContent = undoArr.length - 1;
    numbersOfUndo--;
    
    
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
        container[tube.dataset.id].length === colorSplit ||
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
          const color = container[firstTubeIndex].shift();
          if (container[tube.dataset.id][0] === "") {
            container[tube.dataset.id].pop();
          }
          container[tube.dataset.id].unshift(color);

          if (
            color === container[firstTubeIndex][0] &&
            container[tube.dataset.id].length < colorSplit
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



  function checkColors() {
    setUndo()
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

  tubeInitSetup()
  loadInitialTubs()
  renderDOM()
  resetUndo()


  //console.log(JSON.stringify(undoArr).replace(/(]],)/g, ']]\n\n\n'), undoArr.length)
}







try {

  updateLevel()
} catch (e) {
  alert("Browser not support.\nPlease update your browser.")
}






