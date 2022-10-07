let COLORS_SPLIT = 4;
  const NUM_EMPTY_TUBE = 2;
  let initialColor = [
    { color: "red", count: COLORS_SPLIT },
    { color: "green", count: COLORS_SPLIT },
    { color: "blue", count: COLORS_SPLIT },
    { color: "cyan", count: COLORS_SPLIT },
    { color: "orange", count: COLORS_SPLIT },
    
  ];
  const level = document.querySelector('#level')
  level.addEventListener('change', updateLevel)

  function updateLevel(){
    
    
     const additionalColors = [{ color: "yellow", count: COLORS_SPLIT }, { color: "lime", count: COLORS_SPLIT }, { color: "purple", count: COLORS_SPLIT }]
     if(level.value === "1"){
        return loadGame(COLORS_SPLIT, NUM_EMPTY_TUBE, JSON.parse(JSON.stringify(initialColor)))
     }else if(level.value === "2"){
      
      return loadGame(COLORS_SPLIT, NUM_EMPTY_TUBE, [...JSON.parse(JSON.stringify(initialColor)), additionalColors[0]])
     }else{
      
      return loadGame(COLORS_SPLIT, NUM_EMPTY_TUBE, [...JSON.parse(JSON.stringify(initialColor)), ...JSON.parse(JSON.stringify(additionalColors))])
     }
     
  }



function loadGame(colorSplit, noOfEmptyTube, colorsArr) {
  let colors = [...JSON.parse(JSON.stringify(colorsArr))];
  
  console.log(JSON.parse(JSON.stringify(colors)))
  let container
  const restart = document.querySelector('.restart')
  restart.addEventListener('click', restartGame);
  

  function restartGame() {
    restart.removeEventListener('click', restartGame);
    if (window.sessionStorage.getItem('container')) {
      container = JSON.parse(window.sessionStorage.getItem('container'))
      loadInitialTubs()
      renderDOM()
    }
    restart.addEventListener('click', restartGame);
  }

  function tubeInitSetup () {
    
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

    
    window.sessionStorage.setItem("container", JSON.stringify(container))

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

}

try{

  updateLevel()
}catch(e){
  alert(e)
}






