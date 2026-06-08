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

    // ===================
    // PLANTAR
    // ===================

    if (status === "vazio") {

      if (sementesMilho <= 0) {

        alert(
          "Você não possui sementes suficientes."
        );

        return;
      }

      sementesMilho--;

      terra.src =
        "/img/simulador/milho_broto.png";

      terra.setAttribute(
        "data-status",
        "crescendo"
      );

      salvar();

      // Crescimento automático

      setTimeout(() => {

        terra.src =
          "/img/simulador/milho_pronto.png";

        terra.setAttribute(
          "data-status",
          "pronto"
        );

      }, 5000);

      return;
    }

    // ===================
    // COLHER
    // ===================

    if (status === "pronto") {

      milhoArmazenado += 5;

      terra.src =
        "/img/simulador/terra.png";

      terra.setAttribute(
        "data-status",
        "vazio"
      );

      salvar();

      alert(
        "Colheita realizada! +5 kg de milho."
      );
    }

  });

});

salvar();