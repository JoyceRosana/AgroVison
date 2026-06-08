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

const terras = document.querySelectorAll('.plantacao .terra');

// Definições matemáticas para o encaixe perfeito do seu losango
const LARGURA_VISIVEL = 48; // Distância horizontal entre duas quinas laterais
const ALTURA_VISIVEL = 24;  // Distância vertical para encaixar acima/abaixo

const COLUNAS = 10; // 10 terras por fileira

terras.forEach((terra, index) => {
  // Descobre em qual linha (0 a 4) e coluna (0 a 9) o bloco está
  const col = index % COLUNAS;
  const lin = Math.floor(index / COLUNAS);

  // MÁGICA ISOMÉTRICA: Calcula a posição X e Y exata para grudar as 4 pontas
  const x = (col * LARGURA_BLOCO_X) + (lin * -LARGURA_BLOCO_X); // Tweak lateral por linha
  
  // Fórmula ajustada para o encaixe da sua imagem:
  const isoX = (col * LARGURA_VISIVEL) + (lin * -LARGURA_VISIVEL);
  const isoY = (col * ALTURA_VISIVEL) + (lin * ALTURA_VISIVEL);

  // Aplica a posição direto na imagem
  terra.style.left = `${isoX}px`;
  terra.style.top = `${isoY}px`;
  
  // Camadas: Garante que quem está na frente cubra corretamente quem está atrás
  terra.style.zIndex = col + lin;
});
