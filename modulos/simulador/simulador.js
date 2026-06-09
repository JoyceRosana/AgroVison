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
// POSIÇÃO DAS TERRAS
// =======================

const terras = document.querySelectorAll(".plantacao .terra");

const LARGURA_EMENDA = 50;
const ALTURA_EMENDA = 20;
const MAX_COLUNAS = 10;

// =======================
// CULTURAS
// =======================

let culturaSelecionada = null;

const culturas = {
  milho: {
  crescimento: 15000,
  broto: "/img/simulador/milho_broto.png",
  jovem: "/img/simulador/milho_jovem.png",
  pronta: "/img/simulador/milho_adulto.png"
},

  soja: {
    crescimento: 5000,
    broto: "/img/simulador/soja_broto.png",
    pronto: "/img/simulador/soja_pronto.png"
  },

  alface: {
    crescimento: 5000,
    broto: "/img/simulador/alface_broto.png",
    pronto: "/img/simulador/alface_pronto.png"
  },

  cenoura: {
    crescimento: 5000,
    broto: "/img/simulador/cenoura_broto.png",
    pronto: "/img/simulador/cenoura_pronto.png"
  },

  tomate: {
    crescimento: 5000,
    broto: "/img/simulador/tomate_broto.png",
    pronto: "/img/simulador/tomate_pronto.png"
  }
};

// =======================
// MENU E CURSOR
// =======================

const menuPlantio =
document.getElementById("menuPlantio");

const cursorPlantio =
document.getElementById("cursorPlantio");

console.log("Menu:", menuPlantio);
console.log("Cursor:", cursorPlantio);
console.log("Terras:", terras.length);
 
// =======================
// TERRAS
// =======================

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

terra.addEventListener("click", (e) => {


  console.log("CLICK NA TERRA");
console.log("STATUS:", terra.dataset.status);
console.log("CULTURA:", culturaSelecionada);

  const status = terra.dataset.status;
  
  console.log("STATUS:", status);
  console.log("CULTURA:", culturaSelecionada);

  // ABRIR MENU
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

    return;
  }
// ==========================================
// PLANTAR
// ==========================================
if (status === "vazio" && culturaSelecionada) {
const cultura = culturas[culturaSelecionada];
const planta = document.createElement("img");
planta.className = "planta";
planta.src = cultura.broto;

// insere a planta dentro da célula
terra.appendChild(planta);

// centraliza no centro da terra
planta.style.position = "absolute";
planta.style.left = "50%";
planta.style.top = "50%";
planta.style.transform = "translate(-50%, -50%)";

// garante que a planta fique acima da terra
planta.style.zIndex = 10;

terra.dataset.status = "crescendo";
terra.dataset.cultura = culturaSelecionada;
terra.planta = planta;

setTimeout(() => {
  planta.src = cultura.jovem;
}, cultura.crescimento / 2);

setTimeout(() => {
  planta.src = cultura.pronta;
  terra.dataset.status = "pronto";
}, cultura.crescimento);
}
    return;
}
);

  // COLHER
  if (status === "pronto") {

    alert(
      "Você colheu " +
      terra.dataset.cultura
    );

    if (terra.planta) {

      terra.planta.remove();

      terra.planta = null;

    }

    terra.dataset.status =
      "vazio";

    terra.dataset.cultura =
      "";

    return;
  }

}); // fecha addEventListener

// =======================
// ESCOLHER CULTURA
// =======================

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

      if (cursorPlantio) {
        cursorPlantio.classList.remove(
          "oculto"
        );
      }

    }
  );

});

// =======================
// CURSOR
// =======================

document.addEventListener(
"mousemove",
(e) => {

  if (!cursorPlantio) return;

  cursorPlantio.style.left =
    e.clientX + "px";

  cursorPlantio.style.top =
    e.clientY + "px";

});

// =======================
// ESC CANCELA PLANTIO
// =======================

document.addEventListener(
"keydown",
(e) => {

  if (e.key === "Escape") {

    culturaSelecionada = null;

    menuPlantio.classList.add(
      "oculto"
    );

    if (cursorPlantio) {
      cursorPlantio.classList.add(
        "oculto"
      );
    }

  }

});