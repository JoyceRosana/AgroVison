const viewport = document.querySelector(".viewport");
const plantacao = document.getElementById("plantacao");

const menuPlantio = document.getElementById("menuPlantio");
const cursorPlantio = document.getElementById("cursorPlantio");
const cursorFoice = document.getElementById("cursorFoice");
const balaoFoice = document.getElementById("balaoFoice");
const foiceBalao = document.getElementById("foiceBalao");

// 🔥 NOVO BALÃO DE MADEIRA
const balao = document.getElementById("balao");
const balaoConteudo = document.getElementById("balaoConteudo");

let terraSelecionada = null;
let culturaSelecionada = null;
let modoColheita = false;

// 🔥 estado do balão (novo sistema central)
let estadoAtual = null; // "plantar" | "colher"

// scroll drag
let isDown = false;
let startX;
let startY;
let scrollLeft;
let scrollTop;

/* ==============================
   CANCELAR MODOS
============================== */

function cancelarModos(){

    culturaSelecionada = null;
    modoColheita = false;
    estadoAtual = null;
    terraSelecionada = null;

    menuPlantio.classList.add("oculto");
    balaoFoice.classList.add("oculto");

    cursorPlantio.classList.add("oculto");
    cursorFoice.classList.add("oculto");

    document.body.classList.remove("plantio-ativo");
    document.body.classList.remove("colheita-ativa");

    // 🔥 novo balão
    if(balao){
        balao.classList.add("oculto");
    }
}

/* ==============================
   MOVER MAPA
============================== */

viewport.addEventListener("mousedown", e => {

    isDown = true;

    startX = e.pageX - viewport.offsetLeft;
    startY = e.pageY - viewport.offsetTop;

    scrollLeft = viewport.scrollLeft;
    scrollTop = viewport.scrollTop;
});

document.addEventListener("mouseup", () => {
    isDown = false;
});

viewport.addEventListener("mousemove", e => {

    if (!isDown) return;

    e.preventDefault();

    const x = e.pageX - viewport.offsetLeft;
    const y = e.pageY - viewport.offsetTop;

    viewport.scrollLeft = scrollLeft - (x - startX);
    viewport.scrollTop = scrollTop - (y - startY);
});

/* ==============================
   CULTURAS
============================== */
const culturas = {


   milho:{


       crescimento:15000,


       broto:"/img/simulador/milho_broto.png",
       jovem:"/img/simulador/milho_jovem.png",
       pronta:"/img/simulador/milho_adulto.png",


       brotoWidth:"80px",
       brotoHeight:"90px",


       jovemWidth:"120px",
       jovemHeight:"140px",


       adultoWidth:"150px",
       adultoHeight:"180px",


       brotoX:"-12px",
       brotoY:"0px",


       jovemX:"0px",
       jovemY:"0px",


       adultoX:"-10px",
       adultoY:"0px"
   },


   soja:{


       crescimento:10000,


       broto:"/img/simulador/soja_broto.png",
       jovem:"/img/simulador/soja_jovem.png",
       pronta:"/img/simulador/soja_pronto.png",


       brotoWidth:"60px",
       brotoHeight:"60px",


       jovemWidth:"90px",
       jovemHeight:"90px",


       adultoWidth:"110px",
       adultoHeight:"110px",


       brotoX:"0px",
       brotoY:"0px",


       jovemX:"0px",
       jovemY:"0px",


       adultoX:"0px",
       adultoY:"0px"
   },


   alface:{


       crescimento:8000,


       broto:"/img/simulador/alface_broto.png",
       jovem:"/img/simulador/alface_jovem.png",
       pronta:"/img/simulador/alface_pronto.png",


       brotoWidth:"50px",
       brotoHeight:"50px",


       jovemWidth:"70px",
       jovemHeight:"70px",


       adultoWidth:"90px",
       adultoHeight:"90px",


       brotoX:"0px",
       brotoY:"0px",


       jovemX:"0px",
       jovemY:"0px",


       adultoX:"0px",
       adultoY:"0px"
   },


   cenoura:{


       crescimento:9000,


       broto:"/img/simulador/cenoura_broto.png",
       jovem:"/img/simulador/cenoura_jovem.png",
       pronta:"/img/simulador/cenoura_pronto.png",


       brotoWidth:"50px",
       brotoHeight:"60px",


       jovemWidth:"70px",
       jovemHeight:"80px",


       adultoWidth:"90px",
       adultoHeight:"100px",


       brotoX:"0px",
       brotoY:"0px",


       jovemX:"0px",
       jovemY:"0px",


       adultoX:"0px",
       adultoY:"0px"
   },


   tomate:{


       crescimento:12000,


       broto:"/img/simulador/tomate_broto.png",
       jovem:"/img/simulador/tomate_jovem.png",
       pronta:"/img/simulador/tomate_pronto.png",


       brotoWidth:"70px",
       brotoHeight:"80px",


       jovemWidth:"100px",
       jovemHeight:"120px",


       adultoWidth:"130px",
       adultoHeight:"150px",


       brotoX:"0px",
       brotoY:"0px",


       jovemX:"0px",
       jovemY:"0px",


       adultoX:"0px",
       adultoY:"0px"
   }


}

/* ==============================
   BALÃO (NOVO SISTEMA CENTRAL)
============================== */

function abrirBalao(terra, x, y){

    terraSelecionada = terra;

    const status = terra.dataset.status;

    balao.style.left = x + "px";
    balao.style.top = (y - 80) + "px";

    if(status === "vazio"){
        estadoAtual = "plantar";
        balaoConteudo.innerHTML = "🌱 Plantar";
    }

    if(status === "pronto"){
        estadoAtual = "colher";
        balaoConteudo.innerHTML = "🪓 Colher";
    }

    balao.classList.remove("oculto");
}

/* ==============================
   CLIQUE NA PLANTAÇÃO
============================== */

plantacao.addEventListener("click",(e)=>{

    const terra = e.target.closest(".terra");
    if(!terra) return;

    const rect = terra.getBoundingClientRect();

    abrirBalao(terra, rect.left, rect.top);
});

/* ==============================
   AÇÃO DO BALÃO
============================== */

balao.addEventListener("click",()=>{

    if(!terraSelecionada) return;

    // PLANTAR
    if(estadoAtual === "plantar"){

        culturaSelecionada = "milho"; // mantém teu sistema

        modoColheita = false;

        cursorPlantio.classList.remove("oculto");
        cursorFoice.classList.add("oculto");

        plantar(terraSelecionada);
    }

    // COLHER
    if(estadoAtual === "colher"){

        modoColheita = true;

        cursorFoice.classList.remove("oculto");
        cursorPlantio.classList.add("oculto");

        colher(terraSelecionada);
    }

    balao.classList.add("oculto");
});

/* ==============================
   PLANTAR
============================== */

function plantar(terra){

    if(terra.dataset.status !== "vazio") return;

    const cultura = culturas[culturaSelecionada];

    const planta = terra.querySelector(".planta");

    planta.src = cultura.broto;
    planta.style.width = cultura.brotoWidth;
    planta.style.height = cultura.brotoHeight;
    planta.classList.remove("oculto");

    terra.dataset.status = "crescendo";

    setTimeout(()=>{
        planta.src = cultura.jovem;
    }, cultura.crescimento / 2);

    setTimeout(()=>{
        planta.src = cultura.pronta;
        terra.dataset.status = "pronto";
    }, cultura.crescimento);
}

/* ==============================
   COLHER
============================== */

function colher(terra){

    const planta = terra.querySelector(".planta");

    planta.style.transition = "0.3s";
    planta.style.transform = "translateX(-50%) scale(0)";
    planta.style.opacity = "0";

    setTimeout(()=>{

        planta.classList.add("oculto");
        planta.style.transform = "translateX(-50%) scale(1)";
        planta.style.opacity = "1";

        terra.dataset.status = "vazio";

    },300);
}

/* ==============================
   CURSOR
============================== */

document.addEventListener("mousemove",(e)=>{

    cursorPlantio.style.left = e.clientX + "px";
    cursorPlantio.style.top = e.clientY + "px";

    cursorFoice.style.left = e.clientX + "px";
    cursorFoice.style.top = e.clientY + "px";
});

/* ==============================
   CANCELAR CLIQUE FORA
============================== */

document.addEventListener("click",(e)=>{

    if(e.target.closest(".terra") || e.target.closest("#balao")) return;

    cancelarModos();
});

/* ==============================
   ESC
============================== */

document.addEventListener("keydown",(e)=>{
    if(e.key === "Escape"){
        cancelarModos();
    }
});

/* ==============================
   SAIR DA ÁREA
============================== */

plantacao.addEventListener("mouseleave",()=>{
    cancelarModos();
});