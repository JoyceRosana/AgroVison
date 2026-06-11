const viewport = document.querySelector(".viewport");
const plantacao = document.getElementById("plantacao");


const menuPlantio = document.getElementById("menuPlantio");
const cursorPlantio = document.getElementById("cursorPlantio");
const cursorFoice = document.getElementById("cursorFoice");
const balaoFoice =
document.getElementById("balaoFoice");


const foiceBalao =
document.getElementById("foiceBalao");


let terraSelecionada = null;
let culturaSelecionada = null;
let modoColheita = false;


let isDown = false;
let startX;
let startY;
let scrollLeft;
let scrollTop;


function cancelarModos(){


   culturaSelecionada = null;


   modoColheita = false;


   menuPlantio.classList.add("oculto");


   balaoFoice.classList.add("oculto");


   cursorPlantio.classList.add("oculto");


   cursorFoice.classList.add("oculto");


   document.body.classList.remove(
       "plantio-ativo"
   );


   document.body.classList.remove(
       "colheita-ativa"
   );


}


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


   plantacao.addEventListener("click",(e)=>{


   const terra =
       e.target.closest(".terra");


   if(!terra) return;


   if(
       terra.dataset.status === "vazio" &&
       !culturaSelecionada &&
       !modoColheita
   ){


       terraSelecionada = terra;


       menuPlantio.style.left =
           e.clientX + "px";


       menuPlantio.style.top =
           e.clientY + "px";


       menuPlantio.classList.remove(
           "oculto"
       );


       return;
   }


   if(
       terra.dataset.status === "pronto" &&
       !modoColheita
   ){


       const rect =
           terra.getBoundingClientRect();


       balaoFoice.style.left =
           rect.left + "px";


       balaoFoice.style.top =
           (rect.top - 90) + "px";


       balaoFoice.classList.remove(
           "oculto"
       );
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


       modoColheita = false;


       menuPlantio.classList.add("oculto");


       cursorFoice.classList.add("oculto");


       document.body.classList.remove(
           "colheita-ativa"
       );


       document.body.classList.add(
           "plantio-ativo"
       );


       cursorPlantio.classList.remove("oculto");


   });


});


/* ==================================
  PEGAR FOICE
================================== */


foiceBalao.addEventListener("click",()=>{


   balaoFoice.classList.add("oculto");


   modoColheita = true;


   culturaSelecionada = null;


   cursorPlantio.classList.add("oculto");


   document.body.classList.remove(
       "plantio-ativo"
   );


   cursorFoice.classList.remove("oculto");


   document.body.classList.add(
       "colheita-ativa"
   );


});


/* ==================================
  PLANTAR
================================== */


function plantar(terra){


   if(terra.dataset.status !== "vazio") return;


   const cultura =
       culturas[culturaSelecionada];


   const planta =
       terra.querySelector(".planta");


   planta.src = cultura.broto;


   planta.style.width =
       cultura.brotoWidth;


   planta.style.height =
       cultura.brotoHeight;


   planta.style.marginLeft =
       cultura.brotoX;


   planta.style.marginBottom =
       cultura.brotoY;


   planta.style.left = "50%";


   planta.style.bottom = "20px";


   planta.style.transform =
       "translateX(-50%)";


   planta.classList.remove("oculto");


   terra.dataset.status =
       "crescendo";


   terra.dataset.cultura =
       culturaSelecionada;


   setTimeout(()=>{


       planta.src =
           cultura.jovem;


       planta.style.width =
           cultura.jovemWidth;


       planta.style.height =
           cultura.jovemHeight;


       planta.style.marginLeft =
           cultura.jovemX;


       planta.style.marginBottom =
           cultura.jovemY;


   }, cultura.crescimento / 2);


   setTimeout(()=>{


       planta.src =
           cultura.pronta;


       planta.style.width =
           cultura.adultoWidth;


       planta.style.height =
           cultura.adultoHeight;


       planta.style.marginLeft =
           cultura.adultoX;


       planta.style.marginBottom =
           cultura.adultoY;


       terra.dataset.status =
           "pronto";


   }, cultura.crescimento);


}


/* ==================================
  COLHER
================================== */


function colher(terra){


   const planta =
       terra.querySelector(".planta");


   planta.classList.add("colhendo");


   setTimeout(()=>{


       planta.classList.remove("colhendo");


       planta.classList.add("oculto");


       planta.src = "";


       terra.dataset.status = "vazio";


       terra.dataset.cultura = "";


       modoColheita = false;


       cursorFoice.classList.add("oculto");


       document.body.classList.remove(
           "colheita-ativa"
       );


   },300);


}


/* ==================================
  PLANTIO E COLHEITA
================================== */


plantacao.addEventListener("mouseover",(e)=>{


   const terra =
       e.target.closest(".terra");


   if(!terra) return;


   /*
      PLANTAR
   */


   if(
       culturaSelecionada &&
       terra.dataset.status === "vazio"
   ){


       plantar(terra);


       return;
   }


   /*
      COLHER
   */


   if(
       modoColheita &&
       terra.dataset.status === "pronto"
   ){


       colher(terra);


   }


});


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