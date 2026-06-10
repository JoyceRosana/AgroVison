const viewport = document.querySelector(".viewport");
const plantacao = document.getElementById("plantacao");

const menuPlantio = document.getElementById("menuPlantio");
const cursorPlantio = document.getElementById("cursorPlantio");
const cursorFoice = document.getElementById("cursorFoice");

let culturaSelecionada = null;
let modoColheita = false;

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

    if (!isDown) return;

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
    pronta:"/img/simulador/milho_adulto.png",

    largura:"150px",

    brotoX:"15px",
    jovemX:"0px",
    adultoX:"60px"
},

    soja: {
        crescimento: 10000,
        broto: "/img/simulador/soja_broto.png",
        jovem: "/img/simulador/soja_jovem.png",
        pronta: "/img/simulador/soja_pronto.png",
        largura: "100px"
    },

    alface: {
        crescimento: 8000,
        broto: "/img/simulador/alface_broto.png",
        jovem: "/img/simulador/alface_jovem.png",
        pronta: "/img/simulador/alface_pronto.png",
        largura: "80px"
    },

    cenoura: {
        crescimento: 9000,
        broto: "/img/simulador/cenoura_broto.png",
        jovem: "/img/simulador/cenoura_jovem.png",
        pronta: "/img/simulador/cenoura_pronto.png",
        largura: "90px"
    },

    tomate: {
        crescimento: 12000,
        broto: "/img/simulador/tomate_broto.png",
        jovem: "/img/simulador/tomate_jovem.png",
        pronta: "/img/simulador/tomate_pronto.png",
        largura: "120px"
    }

};

/* ==================================
   CRIAR GRADE
================================== */

const COLUNAS = 10;
const LINHAS = 10;

const LARGURA = 50;
const ALTURA = 20;

for (let lin = 0; lin < LINHAS; lin++) {

    for (let col = 0; col < COLUNAS; col++) {

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
   CURSOR
================================== */

plantacao.addEventListener("mouseenter", () => {

    if (culturaSelecionada) {

        cursorPlantio.classList.remove("oculto");

    }

});

plantacao.addEventListener("mouseleave",()=>{

    cursorPlantio.classList.add("oculto");

    cursorFoice.classList.add("oculto");

    document.body.classList.remove(
        "plantio-ativo"
    );

    document.body.classList.remove(
        "colheita-ativa"
    );

    culturaSelecionada = null;

    modoColheita = false;

});

/* ==================================
   ABRIR MENU
================================== */

plantacao.addEventListener("click", (e) => {

    const terra = e.target.closest(".terra");

    if(!terra) return;

    /*
       TERRA VAZIA
    */

    if(
        terra.dataset.status === "vazio" &&
        !culturaSelecionada &&
        !modoColheita
    ){

        menuPlantio.style.left =
            e.pageX + "px";

        menuPlantio.style.top =
            e.pageY + "px";

        menuPlantio.classList.remove("oculto");

        return;
    }

    /*
       PLANTA PRONTA
    */

    if(
        terra.dataset.status === "pronto" &&
        !culturaSelecionada
    ){

        const resposta =
            confirm("Deseja colher?");

        if(!resposta) return;

        modoColheita = true;

        document.body.classList.add(
            "colheita-ativa"
        );

        cursorFoice.classList.remove("oculto");

        return;
    }

});
/* ==================================
   ESCOLHER CULTURA
================================== */

document
.querySelectorAll("#menuPlantio button")
.forEach(botao => {

    botao.addEventListener("click", () => {

        culturaSelecionada =
            botao.dataset.cultura;

        menuPlantio.classList.add("oculto");

        document.body.classList.add("plantio-ativo");

        cursorPlantio.classList.remove("oculto");

    });

});

/* ==================================
   PLANTAR
================================== */

function plantar(terra) {

    if (terra.dataset.status !== "vazio") return;

    const cultura = culturas[culturaSelecionada];

    const planta = terra.querySelector(".planta");

    planta.src = cultura.broto;
    planta.style.marginLeft = cultura.brotoX;

planta.dataset.cultura = culturaSelecionada;

    planta.style.width = cultura.largura;

    planta.style.left = "50%";
    planta.style.bottom = "20px";

    planta.style.transform =
        "translateX(-50%)";

    planta.classList.remove("oculto");

    terra.dataset.status = "crescendo";

    terra.dataset.cultura =
        culturaSelecionada;

    setTimeout(() => {

planta.src = cultura.jovem;

planta.style.marginLeft = cultura.jovemX;        

planta.classList.add("milho-fixo");

    }, cultura.crescimento / 2);

    setTimeout(() => {

        planta.src = cultura.pronta;

planta.style.marginLeft = cultura.adultoX;

planta.classList.add("milho-fixo");

        terra.dataset.status = "pronto";

    }, cultura.crescimento);

}

/* ==================================
   COLHER
================================== */

function colher(terra) {

    const planta =
        terra.querySelector(".planta");

    planta.classList.add("colhendo");

    setTimeout(() => {

        planta.classList.remove("colhendo");

        planta.classList.add("oculto");

        planta.src = "";

        terra.dataset.status = "vazio";

        terra.dataset.cultura = "";

        terra.dataset.cultura = "";

        cursorFoice.classList.add("oculto");
        document.body.classList.remove("colheita-ativa");

    }, 300);

}

/* ==================================
   PLANTIO E COLHEITA CONTÍNUOS
================================== */

plantacao.addEventListener("mouseover",(e)=>{

    const terra = e.target.closest(".terra");

    if(!terra) return;

    if(
        culturaSelecionada &&
        terra.dataset.status === "vazio"
    ){

        plantar(terra);
    }

    if(
        modoColheita &&
        terra.dataset.status === "pronto"
    ){

        colher(terra);
    }

});

/* ==================================
   CURSORES
================================== */

document.addEventListener("mousemove", e => {

  plantacao.addEventListener("mousemove", (e) => {

    const terra = e.target.closest(".terra");

    if(!terra) return;

    if(
        terra.dataset.status === "pronto" &&
        !cursorFoice.classList.contains("oculto")
    ){

        colher(terra);

    }

});

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
   ESC
================================== */

document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;

    culturaSelecionada = null;
    menuPlantio.classList.add("oculto");
    cursorPlantio.classList.add("oculto");
    cursorFoice.classList.add("oculto");

    document.body.classList.remove("plantio-ativo");
    document.body.classList.remove("colheita-ativa");

});

/* ==================================
   CANCELAR CLICANDO FORA
================================== */

document.addEventListener("click", (e) => {

    const terra = e.target.closest(".terra");

    const menu = e.target.closest("#menuPlantio");

    if (terra || menu) return;

    culturaSelecionada = null;

    menuPlantio.classList.add("oculto");

    cursorPlantio.classList.add("oculto");

    cursorFoice.classList.add("oculto");

    document.body.classList.remove("plantio-ativo");

});