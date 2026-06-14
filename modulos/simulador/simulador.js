/* ==========================
   REFERÊNCIAS
========================== */

const plantacao =
document.getElementById("plantacao");

const menuPlantio =
document.getElementById("menuPlantio");

let terraSelecionada = null;

/* ==========================
   GRADE DE TERRAS
========================== */

const COLUNAS = 10;
const LINHAS = 11;

const ESPACO_X = 50;
const ESPACO_Y = 25;

for(let linha = 0; linha < LINHAS; linha++){

    for(let coluna = 0; coluna < COLUNAS; coluna++){

        const terra =
        document.createElement("div");

        terra.className = "terra";

        const img =
        document.createElement("img");

        img.scr = "/img/simulador/terra.png";

        terra.appendChild(img);

        const x =
        (coluna * ESPACO_X) -
        (linha * ESPACO_X);

        const y =
        (coluna * ESPACO_Y) +
        (linha * ESPACO_Y);

        terra.style.left =
        x + "px";

        terra.style.top =
        y + "px";

        plantacao.appendChild(terra);

    }

}


/* ==================================
   CULTURAS
================================== */

const culturas = {
  milho: {
    crescimento: 15000,
    estagios: {
      broto: {
        src: "/img/simulador/milho_broto.png",
        width: 80,
        height: 90,
        offsetX: -12,
        offsetY: 0
      },
      jovem: {
        src: "/img/simulador/milho_jovem.png",
        width: 120,
        height: 140,
        offsetX: 0,
        offsetY: 0
      },
      adulto: {
        src: "/img/simulador/milho_adulto.png",
        width: 150,
        height: 180,
        offsetX: -10,
        offsetY: 0
      }
    }
  },

  soja: {
    crescimento: 15000,
    estagios: {
      broto: {
        src: "/img/simulador/soja_broto.png",
        width: 80,
        height: 90,
        offsetX: -12,
        offsetY: 0
      },
      jovem: {
        src: "/img/simulador/soja_jovem.png",
        width: 120,
        height: 140,
        offsetX: 0,
        offsetY: 0
      },
      adulto: {
        src: "/img/simulador/soja_adulto.png",
        width: 150,
        height: 180,
        offsetX: -10,
        offsetY: 0
      }
    }
  },

  tomate: {
    crescimento: 15000,
    estagios: {
      broto: {
        src: "/img/simulador/tomate_broto.png",
        width: 80,
        height: 90,
        offsetX: -12,
        offsetY: 0
      },
      jovem: {
        src: "/img/simulador/tomate_jovem.png",
        width: 120,
        height: 140,
        offsetX: 0,
        offsetY: 0
      },
      adulto: {
        src: "/img/simulador/tomate_adulto.png",
        width: 150,
        height: 180,
        offsetX: -10,
        offsetY: 0
      }
    }
  },

  cenoura: {
    crescimento: 15000,
    estagios: {
      broto: {
        src: "/img/simulador/cenoura_broto.png",
        width: 80,
        height: 90,
        offsetX: -12,
        offsetY: 0
      },
      jovem: {
        src: "/img/simulador/cenoura_jovem.png",
        width: 120,
        height: 140,
        offsetX: 0,
        offsetY: 0
      },
      adulto: {
        src: "/img/simulador/cenoura_adulto.png",
        width: 150,
        height: 180,
        offsetX: -10,
        offsetY: 0
      }
    }
  },

  alface: {
    crescimento: 15000,
    estagios: {
      broto: {
        src: "/img/simulador/alface_broto.png",
        width: 80,
        height: 90,
        offsetX: -12,
        offsetY: 0
      },
      jovem: {
        src: "/img/simulador/alface_jovem.png",
        width: 120,
        height: 140,
        offsetX: 0,
        offsetY: 0
      },
      adulto: {
        src: "/img/simulador/alface_adulto.png",
        width: 150,
        height: 180,
        offsetX: -10,
        offsetY: 0
      }
    }
  }
};





/* ==========================
   ABRIR MENU
========================== */

plantacao.addEventListener("click", (e) => {
  const terra = e.target.closest(".terra");

  if (!terra) return;

  terraSelecionada = terra;

  const rect = terra.getBoundingClientRect();

  menuPlantio.style.left = (rect.left - 35) + "px";
  menuPlantio.style.top = (rect.top - 150) + "px";

  menuPlantio.classList.remove("oculto");
});


/* ==========================
   FECHAR MENU
========================== */

document.addEventListener("click", (e) => {
  const clicouTerra = e.target.closest(".terra");
  const clicouMenu = e.target.closest("#menuPlantio");

  if (clicouTerra || clicouMenu) return;

  menuPlantio.classList.add("oculto");
});


/* ⚠️ CORREÇÃO IMPORTANTE:
   você NÃO tinha isso declarado no seu código
*/

const viewport = document.querySelector(".viewport");

viewport.addEventListener("mousedown", () => {
  menuPlantio.classList.add("oculto");
});


/* ==========================
   PLANTAR
========================== */

document.querySelectorAll(".opcao").forEach((botao) => {
  botao.addEventListener("click", () => {

    const cultura = botao.dataset.cultura;

    console.log("cultura escolhida:", cultura);
    console.log("terra selecionada:", terraSelecionada);

    if (!terraSelecionada) return;

    // impede plantar duas vezes na mesma terra
    if (terraSelecionada.querySelector(".planta")) return;

    const dados = culturas[cultura];

    if (!dados) {
      console.log("cultura não existe no objeto culturas");
      return;
    }

    const planta = document.createElement("img");

    planta.className = "planta";

    planta.src = dados.estagios.broto.src;

    planta.style.width = dados.estagios.broto.width + "px";
    planta.style.height = dados.estagios.broto.height + "px";

    planta.style.left = dados.estagios.broto.offsetX + "px";
    planta.style.top = dados.estagios.broto.offsetY + "px";

    terraSelecionada.appendChild(planta);

    menuPlantio.classList.add("oculto");
  });
});

    
