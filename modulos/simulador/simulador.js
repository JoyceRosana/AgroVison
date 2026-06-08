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

viewport.addEventListener("mouseleave", () => {
  isDown = false;
});

viewport.addEventListener("mouseup", () => {
  isDown = false;
});
  
const armazem = document.getElementById("armazem");
const info = document.getElementById("info");

document.querySelector(".galpao").addEventListener("click", () => {
  armazem.classList.remove("oculto");
});

function fechar() {
  armazem.classList.add("oculto");
}

function mostrar(item) {

  const dados = {

    milho: `
      <h2>🌽 Milho</h2>
      <p><b>Quantidade:</b> 50 kg</p>
      <p>✔ Usado na alimentação</p>
      <p>✔ Gera lucro na venda</p>
    `,

    soja: `
      <h2>🌱 Soja</h2>
      <p><b>Quantidade:</b> 40 kg</p>
      <p>✔ Alto valor comercial</p>
      <p>✔ Exportação agrícola</p>
    `,

    feijao: `
      <h2>🫘 Feijão</h2>
      <p><b>Quantidade:</b> 25 kg</p>
      <p>✔ Alimento básico</p>
      <p>✔ Rico em nutrientes</p>
    `,

    alface: `
      <h2>🥬 Alface</h2>
      <p><b>Quantidade:</b> 30 un.</p>
      <p>✔ Crescimento rápido</p>
      <p>✔ Venda em feiras</p>
    `,

    organico: `
      <h2>🧺 Adubo Orgânico</h2>
      <p><b>Quantidade:</b> 20 sacos</p>
      <p>✔ Melhora o solo</p>
      <p>✔ Reduz poluição</p>
    `,

    quimico: `
      <h2>🧪 Adubo Químico</h2>
      <p><b>Quantidade:</b> 15 sacos</p>
      <p>✔ Crescimento rápido</p>
      <p>✔ Alta produtividade</p>
    `
  };

  info.innerHTML = dados[item];
}

document.addEventListener("DOMContentLoaded", () => {
  const terras = document.querySelectorAll('.plantacao .terra');
  
  // Define o desenho exato da foto: 5 de profundidade por 10 de largura
  const MAX_COLUNAS = 10; 

  // Medidas perfeitas para o encaixe do seu losango de 100px com a folga de 1 a 3px
  const LARGURA_EMENDA = 51; // Espaço horizontal entre as quinas
  const ALTURA_EMENDA = 26;  // Espaço vertical entre as quinas

  terras.forEach((terra, index) => {
    // Organiza os 50 blocos na matriz 5x10
    const col = index % MAX_COLUNAS; // Vai de 0 a 9 (as 10 colunas descendo para a direita)
    const lin = Math.floor(index / MAX_COLUNAS); // Vai de 0 a 4 (as 5 fileiras subindo para a esquerda)

    // FÓRMULA ISOMÉTRICA DE FAZENDA (Idêntica ao seu exemplo gráfico):
    // As colunas avançam para a direita (+) e descem (+). 
    // As linhas avançam para a esquerda (-) e também descem (+).
    const posX = (col * LARGURA_EMENDA) + (lin * -LARGURA_EMENDA);
    const posY = (col * ALTURA_EMENDA) + (lin * ALTURA_EMENDA);

    // Posiciona a imagem milimetricamente na tela
    terra.style.left = `${posX}px`;
    terra.style.top = `${posY}px`;
    
    // ORDEM DE CAMADAS PERFEITA:
    // Garante nativamente que as terras da direita e da frente cubram as de trás/esquerda
    terra.style.zIndex = col + lin;
  });
});

