// =======================
// MOVIMENTAÇÃO DO MAPA
// =======================
const viewport = document.querySelector(".viewport");
let isDown = false;
let startX;
let startY;
let scrollLeft;
let scrollTop;
viewport.addEventListener("mousedown", (e) => {
isDown = true;
startX = e.pageX - viewport.offsetLeft;
startY = e.pageY - viewport.offsetTop;
scrollLeft = viewport.scrollLeft;
scrollTop = viewport.scrollTop;
});


viewport.addEventListener("mouseleave", () => isDown = false);
viewport.addEventListener("mouseup", () => isDown = false);


viewport.addEventListener("mousemove", (e) => {
if (!isDown) return;
e.preventDefault();

const x = e.pageX - viewport.offsetLeft;
const y = e.pageY - viewport.offsetTop;

const walkX = (x - startX) * 1.5;
const walkY = (y - startY) * 1.5;

viewport.scrollLeft = scrollLeft - walkX;
viewport.scrollTop = scrollTop - walkY;
});

// Configuração das terras
const terras = document.querySelectorAll(".plantacao .terra");
const LARGURA_EMENDA = 50, ALTURA_EMENDA = 20, MAX_COLUNAS = 10;

terras.forEach((terra, index) => {
  const col = index % MAX_COLUNAS;
  const lin = Math.floor(index / MAX_COLUNAS);
  terra.style.left = `${(col * LARGURA_EMENDA) + (lin * -LARGURA_EMENDA)}px`;
  terra.style.top = `${(col * ALTURA_EMENDA) + (lin * ALTURA_EMENDA)}px`;
  terra.style.zIndex = col + lin;
});

// Culturas
let culturaSelecionada = null;
const culturas = {
  milho: { crescimento: 15000, broto:"/img/simulador/milho_broto.png", jovem:"/img/simulador/milho_jovem.png", pronta:"/img/simulador/milho_adulto.png" },
  soja: { crescimento: 5000, broto:"/img/simulador/soja_broto.png", jovem:"/img/simulador/soja_jovem.png", pronta:"/img/simulador/soja_pronto.png" },
  alface: { crescimento: 5000, broto:"/img/simulador/alface_broto.png", jovem:"/img/simulador/alface_jovem.png", pronta:"/img/simulador/alface_pronto.png" },
  cenoura: { crescimento: 5000, broto:"/img/simulador/cenoura_broto.png", jovem:"/img/simulador/cenoura_jovem.png", pronta:"/img/simulador/cenoura_pronto.png" },
  tomate: { crescimento: 5000, broto:"/img/simulador/tomate_broto.png", jovem:"/img/simulador/tomate_jovem.png", pronta:"/img/simulador/tomate_pronto.png" }
};

// Menu e cursores
const menuPlantio = document.getElementById("menuPlantio");
const cursorPlantio = document.getElementById("cursorPlantio");
const cursorFoice = document.getElementById("cursorFoice");

// Clique na terra
terras.forEach(terra => {
  terra.addEventListener("click", e => {
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
