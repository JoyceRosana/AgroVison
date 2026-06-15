/* ==========================
   BOTÃO ACESSIBILIDADE
========================== */

const btn = document.createElement("button");
btn.id = "btnAcessibilidade";

const icon = document.createElement("img");
icon.src = "/img/simulador/maozinha.png"; // pode trocar por ícone de acessibilidade
btn.appendChild(icon);

document.body.appendChild(btn);

/* ==========================
   PAINEL
========================== */

const painel = document.createElement("div");
painel.id = "painelAcessibilidade";

painel.innerHTML = `
  <button id="zoomMais">Aumentar Zoom</button>
  <button id="zoomMenos">Diminuir Zoom</button>
  <button id="modoClaro">Modo Claro</button>
  <button id="modoEscuro">Modo Escuro</button>
  <button id="modoLeitura">Modo Leitura</button>
`;

document.body.appendChild(painel);

/* ==========================
   ESTADO GLOBAL
========================== */

let zoom = 1;

/* ==========================
   ABRIR / FECHAR PAINEL
========================== */

btn.addEventListener("click", () => {
  painel.style.display =
    painel.style.display === "block" ? "none" : "block";
});

/* ==========================
   ZOOM GLOBAL
========================== */

function aplicarZoom(){
  document.body.classList.remove("zoom-1","zoom-2","zoom-3");

  if(zoom <= 1) document.body.classList.add("zoom-1");
  else if(zoom <= 1.1) document.body.classList.add("zoom-2");
  else document.body.classList.add("zoom-3");
}

document.getElementById("zoomMais").addEventListener("click", () => {
  if(zoom < 1.2){
    zoom += 0.1;
    aplicarZoom();
  }
});

document.getElementById("zoomMenos").addEventListener("click", () => {
  if(zoom > 1){
    zoom -= 0.1;
    aplicarZoom();
  }
});

/* ==========================
   MODOS
========================== */

document.getElementById("modoClaro").addEventListener("click", () => {
  document.body.classList.remove("modo-escuro","modo-leitura");
});

document.getElementById("modoEscuro").addEventListener("click", () => {
  document.body.classList.add("modo-escuro");
  document.body.classList.remove("modo-leitura");
});

document.getElementById("modoLeitura").addEventListener("click", () => {
  document.body.classList.add("modo-leitura");
  document.body.classList.remove("modo-escuro");
});