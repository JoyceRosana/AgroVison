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

// ==========================================
// SISTEMA DE GRUDA-QUINA DAS 50 TERRAS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const terras = document.querySelectorAll('.plantacao .terra');
  
  if (terras.length === 0) {
    console.error("ERRO: Nenhuma imagem de terra foi encontrada no HTML!");
    return;
  }

  // Distâncias para o seu sprite de 100px
  const LARGURA_VISIVEL = 48; 
  const ALTURA_VISIVEL = 24;  
  const COLUNAS = 10; 

  terras.forEach((terra, index) => {
    const col = index % COLUNAS;
    const lin = Math.floor(index / COLUNAS);

    // Ajuste na fórmula para evitar que valores negativos de 'lin' joguem a terra para fora da tela à esquerda
    const isoX = (col * LARGURA_VISIVEL) - (lin * LARGURA_VISIVEL);
    const isoY = (col * ALTURA_VISIVEL) + (lin * ALTURA_VISIVEL);

    // Posiciona fisicamente
    terra.style.left = `${isoX}px`;
    terra.style.top = `${isoY}px`;
    terra.style.zIndex = col + lin;
  });
  
  console.log(`Sucesso: ${terras.length} terras posicionadas.`);
});
