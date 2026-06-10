const viewport = document.querySelector(".viewport");
let isDown = false, startX, startY, scrollLeft, scrollTop;

// =======================
// MOVIMENTAÇÃO DO MAPA
// =======================
viewport.addEventListener("mousedown", e => {
  // Evita mover o mapa ao clicar nas opções do menu de plantio
  if (e.target.closest("#menuPlantio")) return;
  
  isDown = true;
  startX = e.pageX - viewport.offsetLeft;
  startY = e.pageY - viewport.offsetTop;
  scrollLeft = viewport.scrollLeft;
  scrollTop = viewport.scrollTop;
});

viewport.addEventListener("mouseleave", () => isDown = false);
viewport.addEventListener("mouseup", () => isDown = false);

viewport.addEventListener("mousemove", e => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - viewport.offsetLeft;
  const y = e.pageY - viewport.offsetTop;
  viewport.scrollLeft = scrollLeft - (x - startX) * 1.5;
  viewport.scrollTop = scrollTop - (y - startY) * 1.5;
});

// =======================
// CRIAÇÃO DAS TERRAS (10x10)
// =======================
const plantacao = document.getElementById("plantacao");
const LARGURA_EMENDA = 50, ALTURA_EMENDA = 20, MAX_COLUNAS = 10, MAX_LINHAS = 10;

for (let lin = 0; lin < MAX_LINHAS; lin++) {
  for (let col = 0; col < MAX_COLUNAS; col++) {
    const terra = document.createElement("div");
    terra.classList.add("terra");
    terra.dataset.status = "vazio";

    const ref = document.createElement("div");
    ref.classList.add("terra-ref");

    const imgTerra = document.createElement("img");
    imgTerra.src = "/img/simulador/terra.png";
    imgTerra.classList.add("terra-img");

    const planta = document.createElement("img");
    planta.classList.add("planta", "oculto");

    terra.appendChild(ref);
    terra.appendChild(imgTerra);
    terra.appendChild(planta);

    const posX = (col * LARGURA_EMENDA) + (lin * -LARGURA_EMENDA);
    const posY = (col * ALTURA_EMENDA) + (lin * ALTURA_EMENDA);
    terra.style.left = `${posX}px`;
    terra.style.top = `${posY}px`;
    terra.style.zIndex = col + lin;

    // Controla a entrada do mouse na terra para alternar os cursores
    terra.addEventListener("mouseenter", () => {
      const status = terra.dataset.status;
      
      if (status === "vazio" && culturaSelecionada) {
        document.body.classList.add("plantio-ativo");
        cursorPlantio.classList.remove("oculto");
      } else if (status === "pronto") {
        document.body.classList.add("plantio-ativo");
        cursorFoice.classList.remove("oculto");
      }
    });

    // Controla a saída do mouse restaurando o ponteiro original fora da terra
    terra.addEventListener("mouseleave", () => {
      document.body.classList.remove("plantio-ativo");
      cursorPlantio.classList.add("oculto");
      cursorFoice.classList.add("oculto");
    });

    plantacao.appendChild(terra);
  }
}

// =======================
// CULTURAS
// =======================
let culturaSelecionada = null;
const culturas = {
  milho: { crescimento: 15000, broto:"/img/simulador/milho_broto.png", jovem:"/img/simulador/milho_jovem.png", pronta:"/img/simulador/milho_adulto.png" },
  soja: { crescimento: 5000, broto:"/img/simulador/soja_broto.png", jovem:"/img/simulador/soja_jovem.png", pronta:"/img/simulador/soja_pronto.png" },
  alface: { crescimento: 5000, broto:"/img/simulador/alface_broto.png", jovem:"/img/simulador/alface_jovem.png", pronta:"/img/simulador/alface_pronto.png" },
  cenoura: { crescimento: 5000, broto:"/img/simulador/cenoura_broto.png", jovem:"/img/simulador/cenoura_jovem.png", pronta:"/img/simulador/cenoura_pronto.png" },
  tomate: { crescimento: 5000, broto:"/img/simulador/tomate_broto.png", jovem:"/img/simulador/tomate_jovem.png", pronta:"/img/simulador/tomate_pronto.png" }
};

// =======================
// MENU E CURSORES
// =======================
const menuPlantio = document.getElementById("menuPlantio");
const cursorPlantio = document.getElementById("cursorPlantio");
const cursorFoice = document.getElementById("cursorFoice");

// Fecha o menu de sementes ao clicar no espaço vazio do mapa
window.addEventListener("click", e => {
  if (!menuPlantio.classList.contains("oculto") && !e.target.closest(".terra") && !e.target.closest("#menuPlantio")) {
    menuPlantio.classList.add("oculto");
  }
});

// =======================
// CLIQUE NA TERRA
// =======================
plantacao.addEventListener("click", e => {
  const terra = e.target.closest(".terra");
  if (!terra) return;
  const status = terra.dataset.status;

  // Abrir o menu de sementes (Coordenadas corrigidas com clientX/clientY)
  if (status === "vazio" && !culturaSelecionada) {
    menuPlantio.style.left = e.clientX + "px";
    menuPlantio.style.top = e.clientY + "px";
    menuPlantio.classList.remove("oculto");
    return;
  }

  // Executar o plantio na terra válida
  if (status === "vazio" && culturaSelecionada) {
    const cultura = culturas[culturaSelecionada];
    const planta = terra.querySelector(".planta");
    planta.src = cultura.broto;
    planta.classList.remove("oculto");
    terra.dataset.status = "crescendo";
    terra.dataset.cultura = culturaSelecionada;

    // Desativa o modo de plantio logo após clicar
    culturaSelecionada = null;
    document.body.classList.remove("plantio-ativo");
    cursorPlantio.classList.add("oculto");

    // Ciclo de crescimento cronometrado e seguro
    setTimeout(() => {
      if (terra.dataset.status === "crescendo") {
        planta.src = cultura.jovem;
      }
    }, cultura.crescimento / 2);

    setTimeout(() => {
      if (terra.dataset.status === "crescendo") {
        planta.src = cultura.pronta;
        terra.dataset.status = "pronto";
        
        // Se o mouse continuar posicionado na terra ao amadurecer, ativa a foice na hora
        if (terra.matches(":hover")) {
          document.body.classList.add("plantio-ativo");
          cursorFoice.classList.remove("oculto");
        }
      }
    }, cultura.crescimento);

    return;
  }

  // Executar a colheita
  if (status === "pronto") {
    const planta = terra.querySelector(".planta");
    planta.classList.add("oculto");
    planta.src = "";
    terra.dataset.status = "vazio";
    terra.dataset.cultura = "";
    
    // Reseta o cursor de foice imediatamente após limpar a terra
    document.body.classList.remove("plantio-ativo");
    cursorFoice.classList.add("oculto");
  }
});

// =======================
// ESCOLHER CULTURA
// =======================
document.querySelectorAll("#menuPlantio button").forEach(botao => {
  botao.addEventListener("click", e => {
    e.stopPropagation(); // Impede interferências no clique global do mapa
    culturaSelecionada = botao.dataset.cultura;
    menuPlantio.classList.add("oculto");
  });
});

// =======================
// CURSORES SEGUEM MOUSE
// =======================
document.addEventListener("mousemove", e => {
  if (!cursorPlantio.classList.contains("oculto")) {
    cursorPlantio.style.left = e.clientX + "px";
    cursorPlantio.style.top = e.clientY + "px";
  }
  if (!cursorFoice.classList.contains("oculto")) {
    cursorFoice.style.left = e.clientX + "px";
    cursorFoice.style.top = e.clientY + "px";
  }
});

// =======================
// ESC CANCELA PLANTIO/COLHEITA
// =======================
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    culturaSelecionada = null;
    document.body.classList.remove("plantio-ativo"); // Devolve o cursor normal do Windows
    menuPlantio.classList.add("oculto");
    cursorPlantio.classList.add("oculto");
    cursorFoice.classList.add("oculto");
  }
});

