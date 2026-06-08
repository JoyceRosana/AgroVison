// Seleciona todas as imagens de terra que já estão no seu HTML
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
