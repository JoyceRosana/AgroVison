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

// =======================
// DADOS DO JOGO
// =======================

let sementesMilho =
  Number(localStorage.getItem("sementesMilho")) || 50;

let milhoArmazenado =
  Number(localStorage.getItem("milhoArmazenado")) || 0;

// =======================
// SALVAR
// =======================

function salvar() {
  localStorage.setItem(
    "sementesMilho",
    sementesMilho
  );

  localStorage.setItem(
    "milhoArmazenado",
    milhoArmazenado
  );

  atualizarTela();
}

// =======================
// TELA
// =======================

function atualizarTela() {

  const estoque = document.getElementById("estoque-milho");

  if (estoque) {
    estoque.textContent = milhoArmazenado;
  }

}

atualizarTela();

// =======================
// GALPÃO
// =======================

const armazem = document.getElementById("armazem");
const info = document.getElementById("info");

document
  .querySelector(".galpao")
  .addEventListener("click", () => {
    armazem.classList.remove("oculto");
  });

function fechar() {
  armazem.classList.add("oculto");
}

function mostrar(item) {

  if (item === "milho") {

    info.innerHTML = `
      <h2>🌽 Milho</h2>

      <p><b>Milho armazenado:</b>
      ${milhoArmazenado} kg</p>

      <p><b>Sementes:</b>
      ${sementesMilho}</p>

      <p>Plante nas terras para produzir.</p>
    `;

    return;
  }

  const dados = {
    soja: `<h2>🌱 Soja</h2><p>40 kg</p>`,
    feijao: `<h2>🫘 Feijão</h2><p>25 kg</p>`,
    alface: `<h2>🥬 Alface</h2><p>30 unidades</p>`,
    organico: `<h2>🧺 Adubo Orgânico</h2><p>20 sacos</p>`,
    quimico: `<h2>🧪 Adubo Químico</h2><p>15 sacos</p>`
  };

  info.innerHTML = dados[item];
}

// =======================
// POSIÇÃO DAS TERRAS
// =======================

const terras = document.querySelectorAll(".plantacao .terra");

const LARGURA_EMENDA = 51;
const ALTURA_EMENDA = 26;
const MAX_COLUNAS = 10;

terras.forEach((terra, index) => {

  const col = index % MAX_COLUNAS;
  const lin = Math.floor(index / MAX_COLUNAS);

  const posX =
    (col * LARGURA_EMENDA) +
    (lin * -LARGURA_EMENDA);

  const posY =
    (col * ALTURA_EMENDA) +
    (lin * ALTURA_EMENDA);

  terra.style.left = `${posX}px`;
  terra.style.top = `${posY}px`;
  terra.style.zIndex = col + lin;

  terra.addEventListener("click", () => {

    const status =
      terra.getAttribute("data-status");

// =========================
// SISTEMA DE TERRAS
// =========================

const terras = document.querySelectorAll(".plantacao .terra");

// Cultura atualmente selecionada
let culturaSelecionada = null;

// Dados das culturas
const culturas = {
  milho: {
    crescimento: 5000,
    broto: "/img/simulador/milho_broto.png",
    pronto: "/img/simulador/milho_pronto.png"
  },

  soja: {
    crescimento: 8000,
    broto: "/img/simulador/soja_broto.png",
    pronto: "/img/simulador/soja_pronto.png"
  },

  alface: {
    crescimento: 3000,
    broto: "/img/simulador/alface_broto.png",
    pronto: "/img/simulador/alface_pronto.png"
  },

  cenoura: {
    crescimento: 6000,
    broto: "/img/simulador/cenoura_broto.png",
    pronto: "/img/simulador/cenoura_pronto.png"
  },

  tomate: {
    crescimento: 7000,
    broto: "/img/simulador/tomate_broto.png",
    pronto: "/img/simulador/tomate_pronto.png"
  }
};

// =========================
// ALINHAMENTO DAS TERRAS
// =========================

const LARGURA_EMENDA = 51;
const ALTURA_EMENDA = 26;
const MAX_COLUNAS = 10;

terras.forEach((terra, index) => {

  const col = index % MAX_COLUNAS;
  const lin = Math.floor(index / MAX_COLUNAS);

  const posX =
    (col * LARGURA_EMENDA) +
    (lin * -LARGURA_EMENDA);

  const posY =
    (col * ALTURA_EMENDA) +
    (lin * ALTURA_EMENDA);

  terra.style.left = `${posX}px`;
  terra.style.top = `${posY}px`;
  terra.style.zIndex = col + lin;

});

// =========================
// MENU DE PLANTIO
// =========================

const menuPlantio =
document.getElementById("menuPlantio");

const cursorPlantio =
document.getElementById("cursorPlantio");

// =========================
// ABRIR MENU
// =========================

terras.forEach((terra) => {

  terra.addEventListener("click", (e) => {

    const status =
    terra.dataset.status;

    // Colher
    if (status === "pronto") {

      alert(
        "Você colheu " +
        terra.dataset.cultura
      );

      terra.src =
      "/img/simulador/terra.png";

      terra.dataset.status = "vazio";
      terra.dataset.cultura = "";

      return;
    }

    // Plantar
    if (
      status === "vazio" &&
      culturaSelecionada
    ) {

      plantar(terra);

      return;
    }

    // Abrir menu
    if (
      status === "vazio" &&
      !culturaSelecionada
    ) {

      menuPlantio.style.left =
      e.pageX + "px";

      menuPlantio.style.top =
      e.pageY + "px";

      menuPlantio.classList.remove(
        "oculto"
      );
    }

  });

});

// =========================
// ESCOLHER CULTURA
// =========================

document
.querySelectorAll(
"#menuPlantio button"
)
.forEach((botao) => {

  botao.addEventListener(
    "click",
    () => {

      culturaSelecionada =
      botao.dataset.cultura;

      menuPlantio.classList.add(
        "oculto"
      );

      cursorPlantio.classList.remove(
        "oculto"
      );

    }
  );

});

// =========================
// CURSOR
// =========================

document.addEventListener(
"mousemove",
(e) => {

  cursorPlantio.style.left =
  (e.clientX + 10) + "px";

  cursorPlantio.style.top =
  (e.clientY + 10) + "px";

});

// =========================
// PLANTAR
// =========================

function plantar(terra) {

  const cultura =
  culturas[culturaSelecionada];

  terra.src = cultura.broto;

  terra.dataset.status =
  "crescendo";

  terra.dataset.cultura =
  culturaSelecionada;

  setTimeout(() => {

    if (
      terra.dataset.status ===
      "crescendo"
    ) {

      terra.src =
      cultura.pronto;

      terra.dataset.status =
      "pronto";

    }

  }, cultura.crescimento);

}

// =========================
// ESC PARA CANCELAR
// =========================

document.addEventListener(
"keydown",
(e) => {

  if (e.key === "Escape") {

    culturaSelecionada = null;

    menuPlantio.classList.add(
      "oculto"
    );

    cursorPlantio.classList.add(
      "oculto"
    );

  }

});