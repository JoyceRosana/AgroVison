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
  
  const COLUNAS = 10; // 10 terras na horizontal

  // Ajustes milimétricos baseados no seu sprite de 100px para dar o espaço de 1 a 3px
  const ESPACAMENTO_X = 51; // Controla a distância lateral (esquerda/direita)
  const ESPACAMENTO_Y = 26; // Controla a distância vertical (cima/baixo)

  terras.forEach((terra, index) => {
    // Descobre a linha (0 a 4) e a coluna (0 a 9) de cada um dos 50 blocos
    const col = index % COLUNAS;
    const lin = Math.floor(index / COLUNAS);

    // MÁGICA ISOMÉTRICA DA FAZENDA:
    // Monta o tabuleiro perfeito deslocando as linhas em diagonal pura
    const posX = (col * ESPACAMENTO_X) + (lin * -ESPACAMENTO_X);
    const posY = (col * ESPACAMENTO_Y) + (lin * ESPACAMENTO_Y);

    // Aplica a posição exata em pixels na imagem
    terra.style.left = `${posX}px`;
    terra.style.top = `${posY}px`;
    
    // ORDEM DE CAMADAS PERFEITA:
    // Quanto maior a coluna (mais à direita), maior o zIndex (fica por cima)
    // Quanto maior a linha (mais à frente), maior o zIndex (fica por cima)
    terra.style.zIndex = (lin * 20) + col;
  });
});

