document.addEventListener("DOMContentLoaded", () => {
  const plantacao = document.getElementById("plantacao");
  const menuPlantio = document.getElementById("menuPlantio");
  const cursorPlantio = document.getElementById("cursorPlantio");
  const cursorFoice = document.getElementById("cursorFoice");

  // Criar grade de terras
  for (let i = 0; i < 20; i++) {
    const terra = document.createElement("div");
    terra.classList.add("terra");
    terra.dataset.status = "vazio";

    const imgTerra = document.createElement("img");
    imgTerra.src = "/img/simulador/terra.png";
    imgTerra.classList.add("terra-img");

    terra.appendChild(imgTerra);
    plantacao.appendChild(terra);

    terra.addEventListener("mouseenter", () => {
      if (terra.dataset.status === "vazio") {
        document.body.classList.add("plantio-ativo");
        cursorPlantio.classList.remove("oculto");
      }
    });

    terra.addEventListener("mouseleave", () => {
      document.body.classList.remove("plantio-ativo");
      cursorPlantio.classList.add("oculto");
    });

    terra.addEventListener("click", () => {
      if (terra.dataset.status === "vazio") {
        menuPlantio.classList.remove("oculto");
        menuPlantio.style.top = `${event.clientY}px`;
        menuPlantio.style.left = `${event.clientX}px`;

        menuPlantio.querySelectorAll("button").forEach(btn => {
          btn.onclick = () => {
            plantar(terra, btn.dataset.cultura);
            menuPlantio.classList.add("oculto");
          };
        });
      } else if (terra.dataset.status === "pronto") {
        colher(terra);
      }
    });
  }

  function plantar(terra, cultura) {
    terra.dataset.status = "crescendo";
    const planta = document.createElement("img");
    planta.src = `/img/simulador/${cultura}_1.png`; // broto
    planta.classList.add("planta");
    terra.appendChild(planta);

    let etapa = 1;
    const ciclo = setInterval(() => {
      etapa++;
      planta.src = `/img/simulador/${cultura}_${etapa}.png`;
      if (etapa === 3) { // adulta
        clearInterval(ciclo);
        terra.dataset.status = "pronto";
        cursorFoice.classList.remove("oculto");
      }
    }, 2000);
  }

  function colher(terra) {
    terra.dataset.status = "vazio";
    const planta = terra.querySelector(".planta");
    if (planta) planta.remove();
    cursorFoice.classList.add("oculto");
  }

  // Cursor personalizado segue o mouse
  document.addEventListener("mousemove", e => {
    [cursorPlantio, cursorFoice].forEach(cursor => {
      if (!cursor.classList.contains("oculto")) {
        cursor.style.left = e.pageX + "px";
        cursor.style.top = e.pageY + "px";
      }
    });
  });
});
