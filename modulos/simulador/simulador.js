/* ==========================
   REFERÊNCIAS
========================== */

const plantacao1 = document.getElementById("plantacao1");
const plantacao2 = document.getElementById("plantacao2");
const plantacao3 = document.getElementById("plantacao3");
const plantacao4 = document.getElementById("plantacao4");

const menuPlantio = document.getElementById("menuPlantio");
const viewport = document.querySelector(".viewport");

/* ==========================
   CONFIGURAÇÃO DAS PLANTAÇÕES
========================== */

const configuracoesPlantacao = {
  plantacao1: { linhas: 10, colunas: 10 },
  plantacao2: { linhas: 10, colunas: 7 },
  plantacao3: { linhas: 5, colunas: 4 },
  plantacao4: { linhas: 4, colunas: 3 }
};

/* ==========================
   FUNÇÃO CRIAR PLANTAÇÃO
========================== */

function criarPlantacao(container, config) {
  const ESPACO_X = 50;
  const ESPACO_Y = 25;

  for (let linha = 0; linha < config.linhas; linha++) {
    for (let coluna = 0; coluna < config.colunas; coluna++) {

      const terra = document.createElement("div");
      terra.className = "terra";

      const img = document.createElement("img");
      img.src = "img/simulador/terra.png";
      terra.style.border = "2px solid red";
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
   CRIAR PLANTAÇÕES
========================== */

criarPlantacao(plantacao1, configuracoesPlantacao.plantacao1);
criarPlantacao(plantacao2, configuracoesPlantacao.plantacao2);
criarPlantacao(plantacao3, configuracoesPlantacao.plantacao3);
criarPlantacao(plantacao4, configuracoesPlantacao.plantacao4);

/* ==========================
   CULTURAS
========================== */

const culturas = {

  milho: {

    recompensa: 4,
    emoji: "🌽",

    crescimentoJovem: 60000,
    crescimentoAdulto: 120000,

    estagios: {

      broto: {
        src: "/img/simulador/milho_broto.png",
        width: 60,
        height: 90,
        offsetX: -12,
        offsetY: 0
      },

      jovem: {
        src: "/img/simulador/milho_jovem.png",
        width: 60,
        height: 140,
        offsetX: 0,
        offsetY: 0
      },

      adulto: {
        src: "/img/simulador/milho_adulto.png",
        width: 60,
        height: 180,
        offsetX: -10,
        offsetY: 0
      }

    }

  },

  soja: {

    recompensa: 5,
    emoji: "🌱",

    crescimentoJovem: 60000,
    crescimentoAdulto: 120000,

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
        width: 80,
        height: 90,
        offsetX: 0,
        offsetY: 0
      },

      adulto: {
        src: "/img/simulador/soja_adulto.png",
        width: 80,
        height: 90,
        offsetX: -10,
        offsetY: 0
      }

    }

  },

  tomate: {

    recompensa: 4,
    emoji: "🍅",

    crescimentoJovem: 45000,
    crescimentoAdulto: 90000,

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
        width: 80,
        height: 90,
        offsetX: 0,
        offsetY: 0
      },

      adulto: {
        src: "/img/simulador/tomate_adulto.png",
        width: 80,
        height: 90,
        offsetX: -10,
        offsetY: 0
      }

    }

  },

  cenoura: {

    recompensa: 2,
    emoji: "🥕",

    crescimentoJovem: 45000,
    crescimentoAdulto: 90000,

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
        width: 80,
        height: 90,
        offsetX: 0,
        offsetY: 0
      },

      adulto: {
        src: "/img/simulador/cenoura_adulto.png",
        width: 80,
        height: 90,
        offsetX: -10,
        offsetY: 0
      }

    }

  },

  alface: {

    recompensa: 2,
    emoji: "🥬",

    crescimentoJovem: 30000,
    crescimentoAdulto: 60000,

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
        width: 80,
        height: 90,
        offsetX: 0,
        offsetY: 0
      },

      adulto: {
        src: "/img/simulador/alface_adulto.png",
        width: 80,
        height: 90,
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
  menuPlantio.style.top = (rect.top - 145) + "px";
  menuPlantio.classList.remove("oculto");
});

/* ==========================
   FECHAR MENU
========================== */

document.addEventListener("click",(e)=>{

    const clicouMenu =
        e.target.closest("#menuPlantio");

    const clicouTerra =
        e.target.closest(".terra");

    if(clicouMenu || clicouTerra) return;

    menuPlantio.classList.add("oculto");

    modoPlantio = false;

    culturaSelecionada = null;

    document.body.classList.remove(
        "cursor-plantio"
    );

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

function iniciarCrescimento(planta, dados) {

    // BROTO -> JOVEM (30s)
    setTimeout(() => {

        planta.src = dados.estagios.jovem.src;

        planta.style.width =
            dados.estagios.jovem.width + "px";

        planta.style.height =
            dados.estagios.jovem.height + "px";


    }, 30000);

    // JOVEM -> ADULTA (mais 30s)
    setTimeout(() => {

        planta.src = dados.estagios.adulto.src;

        planta.style.width =
            dados.estagios.adulto.width + "px";

        planta.style.height =
            dados.estagios.adulto.height + "px";

        planta.dataset.adulta = "true";

    }, 60000);

}

document.querySelectorAll(".opcao").forEach((botao)=>{

    botao.addEventListener("click",()=>{

        const cultura = botao.dataset.cultura;

        culturaSelecionada = cultura;

        modoPlantio = true;

        document.body.classList.add("cursor-plantio");

    });

});
        // já tem planta nessa terra?
        if (terraSelecionada.querySelector(".planta")) return;

        const dados = culturas[cultura];

        if (!dados) return;

        const planta = document.createElement("img");

        planta.className = "planta";

        // FASE BROTO
        planta.src = dados.estagios.broto.src;

        planta.style.width =
            dados.estagios.broto.width + "px";

        planta.style.height =
            dados.estagios.broto.height + "px";

        planta.style.left =
            dados.estagios.broto.offsetX + "px";

        planta.style.top =
            dados.estagios.broto.offsetY + "px";

        terraSelecionada.appendChild(planta);

        menuPlantio.classList.add("oculto");

        iniciarCrescimento(planta, dados);



    document.addEventListener("mouseover",(e)=>{

    if(!modoPlantio) return;

    const terra = e.target.closest(".terra");

    if(!terra) return;

    if(terra.querySelector(".planta")) return;

    const dados = culturas[culturaSelecionada];

    if(!dados) return;

    const planta = document.createElement("img");

    planta.className = "planta";

    planta.src = dados.estagios.broto.src;

    planta.style.width =
        dados.estagios.broto.width + "px";

    planta.style.height =
        dados.estagios.broto.height + "px";

    terra.appendChild(planta);

    iniciarCrescimento(planta,dados);

});