/* ==========================
   REFERÊNCIAS
========================== */

const plantacao1 = document.getElementById("plantacao1");
const plantacao2 = document.getElementById("plantacao2");

const menuPlantio = document.getElementById("menuPlantio");
const viewport = document.querySelector(".viewport");

/* ==========================
   FUNÇÃO CRIAR PLANTAÇÃO
========================== */

function criarPlantacao(container) {
  const COLUNAS = 6;
  const LINHAS = 6;

  const ESPACO_X = 50;
  const ESPACO_Y = 25;

  for (let linha = 0; linha < LINHAS; linha++) {
    for (let coluna = 0; coluna < COLUNAS; coluna++) {

      const terra = document.createElement("div");
      terra.className = "terra";

      const img = document.createElement("img");
      img.src = "/img/simulador/terra.png";

      terra.appendChild(img);

      const x = (coluna * ESPACO_X) - (linha * ESPACO_X);
      const y = (coluna * ESPACO_Y) + (linha * ESPACO_Y);

      terra.style.left = x + "px";
      terra.style.top = y + "px";

      container.appendChild(terra);
    }
  }
}

/* ==========================
   CRIAR AS DUAS PLANTAÇÕES
========================== */

criarPlantacao(plantacao1);
criarPlantacao(plantacao2);
criarPlantacao(plantacao3);
criarPlantacao(plantacao4);

/* ==========================
   CULTURAS
========================== */

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

document.addEventListener("click", (e) => {
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
  const clicouMenu = e.target.closest("#menuPlantio");
  const clicouTerra = e.target.closest(".terra");

  if (clicouMenu || clicouTerra) return;

  menuPlantio.classList.add("oculto");
});

/* ==========================
   FECHAR MENU NO DRAG
========================== */

if (viewport) {
  viewport.addEventListener("mousedown", () => {
    menuPlantio.classList.add("oculto");
  });
}

/* ==========================
   PLANTAR
========================== */

document.querySelectorAll(".opcao").forEach((botao) => {
  botao.addEventListener("click", () => {

    const cultura = botao.dataset.cultura;

    if (!terraSelecionada) return;

    if (terraSelecionada.querySelector(".planta")) return;

    const dados = culturas[cultura];

    if (!dados) return;

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