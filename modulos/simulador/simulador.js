const viewport = document.querySelector(".viewport");
const plantacao = document.getElementById("plantacao");

const menuPlantio = document.getElementById("menuPlantio");

const cursorPlantio = document.getElementById("cursorPlantio");

const cursorFoice = document.getElementById("cursorFoice");

let culturaSelecionada = null;

let isDown = false;

let startX;
let startY;
let scrollLeft;
let scrollTop;

/* ==================================
   MOVER MAPA
================================== */

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

    if(!isDown) return;

    e.preventDefault();

    const x = e.pageX - viewport.offsetLeft;

    const y = e.pageY - viewport.offsetTop;

    viewport.scrollLeft =
        scrollLeft - (x - startX);

    viewport.scrollTop =
        scrollTop - (y - startY);

});

/* ==================================
   CULTURAS
================================== */

const culturas = {

    milho:{
        crescimento:15000,
        broto:"/img/simulador/milho_broto.png",
        jovem:"/img/simulador/milho_jovem.png",
        pronta:"/img/simulador/milho_adulto.png"
    },

    soja:{
        crescimento:10000,
        broto:"/img/simulador/soja_broto.png",
        jovem:"/img/simulador/soja_jovem.png",
        pronta:"/img/simulador/soja_pronto.png"
    },

    alface:{
        crescimento:8000,
        broto:"/img/simulador/alface_broto.png",
        jovem:"/img/simulador/alface_jovem.png",
        pronta:"/img/simulador/alface_pronto.png"
    },

    cenoura:{
        crescimento:9000,
        broto:"/img/simulador/cenoura_broto.png",
        jovem:"/img/simulador/cenoura_jovem.png",
        pronta:"/img/simulador/cenoura_pronto.png"
    },

    tomate:{
        crescimento:12000,
        broto:"/img/simulador/tomate_broto.png",
        jovem:"/img/simulador/tomate_jovem.png",
        pronta:"/img/simulador/tomate_pronto.png"
    }
};

/* ==================================
   CRIAR GRADE
================================== */

const COLUNAS = 10;
const LINHAS = 10;

const LARGURA = 50;
const ALTURA = 20;

for(let lin=0; lin<LINHAS; lin++){

    for(let col=0; col<COLUNAS; col++){

        const terra = document.createElement("div");

        terra.className = "terra";

        terra.dataset.status = "vazio";

        const imgTerra = document.createElement("img");

        imgTerra.src = "/img/simulador/terra.png";

        imgTerra.className = "terra-img";

        const planta = document.createElement("img");

        planta.className = "planta oculto";

        terra.appendChild(imgTerra);

        terra.appendChild(planta);

        const posX =
            (col * LARGURA) +
            (lin * -LARGURA);

        const posY =
            (col * ALTURA) +
            (lin * ALTURA);

        terra.style.left = posX + "px";

        terra.style.top = posY + "px";

        plantacao.appendChild(terra);
    }
}

/* ==================================
   CURSOR MÃO APENAS NA ÁREA
================================== */

plantacao.addEventListener("mouseenter", () => {

    if(culturaSelecionada){

        cursorPlantio.classList.remove("oculto");

    }

});

plantacao.addEventListener("mouseleave", () => {

    cursorPlantio.classList.add("oculto");

});

/* ==================================
   MENU DE CULTURA
================================== */

plantacao.addEventListener("click", e => {

    const terra = e.target.closest(".terra");

    if(!terra) return;

    const status = terra.dataset.status;

    if(status === "vazio" && !culturaSelecionada){

        menuPlantio.style.left =
            e.pageX + "px";

        menuPlantio.style.top =
            e.pageY + "px";

        menuPlantio.classList.remove("oculto");

        return;
    }

    if(status === "vazio" && culturaSelecionada){

        plantar(terra);

        return;
    }

    if(status === "pronto"){

        colher(terra);
    }

});

document
.querySelectorAll("#menuPlantio button")
.forEach(botao => {

    botao.addEventListener("click", () => {

        culturaSelecionada =
            botao.dataset.cultura;

        menuPlantio.classList.add("oculto");

        cursorPlantio.classList.remove("oculto");

    });

});

/* ==================================
   PLANTAR
================================== */

function plantar(terra){

    const cultura =
        culturas[culturaSelecionada];

    const planta =
        terra.querySelector(".planta");

    planta.src = cultura.broto;

    planta.classList.remove("oculto");

    terra.dataset.status = "crescendo";

    setTimeout(() => {

        planta.src = cultura.jovem;

    }, cultura.crescimento / 2);

    setTimeout(() => {

        planta.src = cultura.pronta;

        terra.dataset.status = "pronto";

    }, cultura.crescimento);

    culturaSelecionada = null;

    cursorPlantio.classList.add("oculto");
}

/* ==================================
   COLHER
================================== */

function colher(terra){

    const planta =
        terra.querySelector(".planta");

    planta.classList.add("oculto");

    planta.src = "";

    terra.dataset.status = "vazio";
}

/* ==================================
   CURSORES
================================== */

document.addEventListener("mousemove", e => {

    cursorPlantio.style.left =
        e.clientX + "px";

    cursorPlantio.style.top =
        e.clientY + "px";

    cursorFoice.style.left =
        e.clientX + "px";

    cursorFoice.style.top =
        e.clientY + "px";

});

/* ==================================
   FOICE
================================== */

plantacao.addEventListener("mouseover", e => {

    const terra = e.target.closest(".terra");

    if(!terra) return;

    if(terra.dataset.status === "pronto"){

        cursorFoice.classList.remove("oculto");

    }

});

plantacao.addEventListener("mouseout", () => {

    cursorFoice.classList.add("oculto");

});

/* ==================================
   ESC
================================== */

document.addEventListener("keydown", e => {

    if(e.key === "Escape"){

        culturaSelecionada = null;

        menuPlantio.classList.add("oculto");

        cursorPlantio.classList.add("oculto");

    }

});