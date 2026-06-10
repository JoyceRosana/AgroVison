const viewport = document.querySelector(".viewport");
let isDown = false, startX, startY, scrollLeft, scrollTop;

// =======================
// MOVIMENTAÇÃO DO MAPA
// =======================
viewport.addEventListener("mousedown", e => {
  isDown = true;
  startX = e.pageX - viewport.offsetLeft;
  startY = e.pageY - viewport.offsetTop;
  scrollLeft = viewport.scrollLeft;
  scrollTop = viewport.scrollTop;
});
viewport.addEventListener("mouseleave", () => isDown = false);
viewport.addEventListener("mouseup", () => isDown = false);
viewport.addEventListener("mousemove", e => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - viewport.offsetLeft;
  const y = e.pageY - viewport.offsetTop;
  viewport.scrollLeft = scrollLeft - (x - startX) * 1.5;
  viewport.scrollTop = scrollTop - (y - startY) * 1.5;
});

// =======================
// CRIAÇÃO DAS TERRAS (10x10)
// =======================
const plantacao = document.getElementById("plantacao");
const LARGURA_EMENDA = 50, ALTURA_EMENDA = 20, MAX_COLUNAS = 10, MAX_LINHAS = 10;

for (let lin = 0; lin < MAX_LINHAS; lin++) {
  for (let col = 0; col < MAX_COLUNAS; col++) {
    const terra = document.createElement("div");
    terra.classList.add("terra");
    terra.dataset.status = "vazio";

    const ref = document.createElement("div");
    ref.classList.add("terra-ref");

    const imgTerra = document.createElement("img");
    imgTerra.src = "/img/simulador/terra.png";
    imgTerra.classList.add("terra-img");

    const planta = document.createElement("img");
    planta.classList.add("planta", "oculto");

    terra.appendChild(ref);
    terra.appendChild(imgTerra);
    terra.appendChild(planta);

    const posX = (col * LARGURA_EMENDA) + (lin * -LARGURA_EMENDA);
    const posY = (col * ALTURA_EMENDA) + (lin * ALTURA_EMENDA);
    terra.style.left = `${posX}px`;
    terra.style.top = `${posY}px`;
    terra.style.zIndex = col + lin;

    plantacao.appendChild(terra);
  }
}

// =======================
// CULTURAS
// =======================
let culturaSelecionada = null;
const culturas = {
  milho: { crescimento: 15000, broto:"/img/simulador/milho_broto.png", jovem:"/img/simulador/milho_jovem.png", pronta:"/img/simulador/milho_adulto.png" },
  soja: { crescimento: 5000, broto:"/img/simulador/soja_broto.png", jovem:"/img/simulador/soja_jovem.png", pronta:"/img/simulador/soja_pronto.png" },
  alface: { crescimento: 5000, broto:"/img/simulador/alface_broto.png", jovem:"/img/simulador/alface_jovem.png", pronta:"/img/simulador/alface_pronto.png" },
  cenoura: { crescimento: 5000, broto:"/img/simulador/cenoura_broto.png", jovem:"/img/simulador/cenoura_jovem.png", pronta:"/img/simulador/cenoura_pronto.png" },
  tomate: { crescimento: 5000, broto:"/img/simulador/tomate_broto.png", jovem:"/img/simulador/tomate_jovem.png", pronta:"/img/simulador/tomate_pronto.png" }
};

// =======================
// MENU E CURSORES
// =======================
const menuPlantio = document.getElementById("menuPlantio");
const cursorPlantio = document.getElementById("cursorPlantio");
const cursorFoice = document.getElementById("cursorFoice");

// =======================
// CLIQUE NA TERRA
// =======================
plantacao.addEventListener("click", e => {
  const terra = e.target.closest(".terra");
  if (!terra) return;
  const status = terra.dataset.status;

  // Abrir menu
  if (status === "vazio" && !culturaSelecionada) {
    menuPlantio.style.left = e.pageX + "px";
    menuPlantio.style.top = e.pageY + "px";
    menuPlantio.classList.remove("oculto");
    return;
  }

  // Plantar
  if (status === "vazio" && culturaSelecionada) {
    const cultura = culturas[culturaSelecionada];
    const planta = terra.querySelector(".planta");
    planta.src = cultura.broto;
    planta.classList.remove("oculto");
    terra.dataset.status = "crescendo";
    terra.dataset.cultura = culturaSelecionada;

    setTimeout(() => planta.src = cultura.jovem, cultura.crescimento / 2);
    setTimeout(() => {
      planta.src = cultura.pronta;
      terra.dataset.status = "pronto";
      cursorFoice.classList.remove("oculto"); // ativa foice quando há planta pronta
    }, cultura.crescimento);

    culturaSelecionada = null;
    cursorPlantio.classList.add("oculto");
    return;
  }

  // Colher
  if (status === "pronto") {
    const planta = terra.querySelector(".planta");
    planta.classList.add("oculto");
    planta.src = "";
    terra.dataset.status = "vazio";
    terra.dataset.cultura = "";
    cursorFoice.classList.add("oculto");
  }
});

// =======================
// ESCOLHER CULTURA
// =======================
document.querySelectorAll("#menuPlantio button").forEach(botao => {
  botao.addEventListener("click", () => {
    culturaSelecionada = botao.dataset.cultura;
    menuPlantio.classList.add("oculto");
    cursorPlantio.classList.remove("oculto");
  });
});

// =======================
// CURSORES SEGUEM MOUSE
// =======================
document.addEventListener("mousemove", e => {
  if (!cursorPlantio.classList.contains("oculto")) {
    cursorPlantio.style.left = e.clientX + "px";
    cursorPlantio.style.top = e.clientY + "px";
  }
  if (!cursorFoice.classList.contains("oculto")) {
    cursorFoice.style.left = e.clientX + "px";
    cursorFoice.style.top = e.clientY + "px";
  }
});

// =======================
// ESC CANCELA PLANTIO/COLHEITA
// =======================
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    culturaSelecionada = null;
    menuPlantio.classList.add("oculto");
    cursorPlantio.classList.add("oculto");
    cursorFoice.classList.add("oculto");
  }
});

