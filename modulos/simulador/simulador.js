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


/// =======================
// CULTURAS
// =======================
const culturas = {
  milho: {
    crescimento: 15000,
    broto: "/img/simulador/milho_broto.png",
    jovem: "/img/simulador/milho_jovem.png",
    pronta: "/img/simulador/milho_adulto.png"
  },
  soja: {
    crescimento: 8000,
    broto: "/img/simulador/soja_broto.png",
    jovem: "/img/simulador/soja_jovem.png",
    pronta: "/img/simulador/soja_pronto.png"
  },
  alface: {
    crescimento: 6000,
    broto: "/img/simulador/alface_broto.png",
    jovem: "/img/simulador/alface_jovem.png",
    pronta: "/img/simulador/alface_pronto.png"
  },
  cenoura: {
    crescimento: 7000,
    broto: "/img/simulador/cenoura_broto.png",
    jovem: "/img/simulador/cenoura_jovem.png",
    pronta: "/img/simulador/cenoura_pronto.png"
  },
  tomate: {
    crescimento: 9000,
    broto: "/img/simulador/tomate_broto.png",
    jovem: "/img/simulador/tomate_jovem.png",
    pronta: "/img/simulador/tomate_pronto.png"
  }
};

// =======================
// TERRAS
// =======================
terras.forEach((terra, index) => {
  const col = index % MAX_COLUNAS;
  const lin = Math.floor(index / MAX_COLUNAS);
  const posX = (col * LARGURA_EMENDA) + (lin * -LARGURA_EMENDA);
  const posY = (col * ALTURA_EMENDA) + (lin * ALTURA_EMENDA);

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
 const planta = terra.querySelector(".planta");
 planta.src = cultura.broto;
 planta.classList.remove("oculto");


 terra.dataset.status = "crescendo";
 terra.dataset.cultura = culturaSelecionada;


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
      alert("Você colheu " + terra.dataset.cultura);
      planta.classList.add("oculto");
      planta.src = "";
      terra.dataset.status = "vazio";
      terra.dataset.cultura = "";
      return;
    }
  });


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
