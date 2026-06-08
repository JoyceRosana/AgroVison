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

viewport.addEventListener("mouseleave", () => { isDown = false; });
viewport.addEventListener("mouseup", () => { isDown = false; });

viewport.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - viewport.offsetLeft;
  const y = e.pageY - viewport.offsetTop;
  const walkX = (x - startX) * 1.5;
  const walkY = (y - startY) * 1.5;
  viewport.scrollLeft = scrollLeft - walkX;
  viewport.scrollTop = scrollTop - walkY;
});
  
const armazem = document.getElementById("armazem");
const info = document.getElementById("info");

// CONTROLE DE ESTOQUE: Criamos uma variável para controlar a quantidade de sementes
let estoqueMilho = 50; 

document.querySelector(".galpao").addEventListener("click", () => {
  armazem.classList.remove("oculto");
});

function fechar() {
  armazem.classList.add("oculto");
}

// Atualiza a função para mostrar a quantidade real de milho que você tem
function mostrar(item) {
  if (item === 'milho') {
    info.innerHTML = `
      <h2>🌽 Milho</h2>
      <p><b>Quantidade:</b> <span id="qtd-milho">${estoqueMilho}</span> kg</p>
      <p>✔ Usado na alimentação</p>
      <p>✔ Gera lucro na venda</p>
    `;
    return;
  }

  const dados = {
    soja: `<h2>🌱 Soja</h2><p><b>Quantidade:</b> 40 kg</p>`,
    feijao: `<h2>🫘 Feijão</h2><p><b>Quantidade:</b> 25 kg</p>`,
    alface: `<h2>🥬 Alface</h2><p><b>Quantidade:</b> 30 un.</p>`,
    organico: `<h2>🧺 Adubo Orgânico</h2><p><b>Quantidade:</b> 20 sacos</p>`,
    quimico: `<h2>🧪 Adubo Químico</h2><p><b>Quantidade:</b> 15 sacos</p>`
  };
  info.innerHTML = dados[item];
}

// ==========================================
// ALINHAMENTO DAS TERRAS (MANTIDO PERFEITO)
// ==========================================
const terras = document.querySelectorAll('.plantacao .terra');
const LARGURA_EMENDA = 51; 
const ALTURA_EMENDA = 26;  
const MAX_COLUNAS = 10; 

terras.forEach((terra, index) => {
  const col = index % MAX_COLUNAS;
  const lin = Math.floor(index / MAX_COLUNAS);

  const posX = (col * LARGURA_EMENDA) + (lin * -LARGURA_EMENDA);
  const posY = (col * ALTURA_EMENDA) + (lin * ALTURA_EMENDA);

  terra.style.left = `${posX}px`;
  terra.style.top = `${posY}px`;
  terra.style.zIndex = col + lin;

  // ==========================================
  // NOVA FUNÇÃO: CLICAR PARA PLANTAR MILHO
  // ==========================================
  terra.addEventListener('click', () => {
    // Se a semente no armazém acabar, você não pode plantar
    if (estoqueMilho <= 0) {
      alert("Você não tem sementes de milho suficientes no armazém!");
      return;
    }

    // Só planta se a terra estiver totalmente vazia
    if (terra.getAttribute('data-status') === 'vazio') {
      
      // 1. Altera o status da terra para ocupado
      terra.setAttribute('data-status', 'plantado');
      
      // 2. Desconta 1 semente do seu estoque
      estoqueMilho--; 
      
      // 3. Troca a imagem da terra seca pela imagem do milho crescendo
      // NOTA: Troque o caminho abaixo pelo caminho real da sua imagem de milho/broto!
      terra.src = "/img/simulador/milho_broto.png"; 

      // 4. Se o armazém estiver aberto, atualiza o número na tela na hora
      const telaQtd = document.getElementById('qtd-milho');
      if (telaQtd) telaQtd.innerText = estoqueMilho;

      console.log(`Milho plantado na terra ${index}. Estoque restante: ${estoqueMilho}`);
    }
  });
});