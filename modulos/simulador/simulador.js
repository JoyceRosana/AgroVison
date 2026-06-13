const plantacao = document.getElementById("plantacao");

const COLUNAS = 10;
const LINHAS = 11;

const ESPACO_X = 50;
const ESPACO_Y = 25;

for(let linha = 0; linha < LINHAS; linha++){

    for(let coluna = 0; coluna < COLUNAS; coluna++){

        const terra = document.createElement("div");

        terra.className = "terra";

        const img = document.createElement("img");

        img.src = "/img/simulador/terra.png";

        terra.appendChild(img);

        const x =
            (coluna * ESPACO_X) -
            (linha * ESPACO_X);

        const y =
            (coluna * ESPACO_Y) +
            (linha * ESPACO_Y);

        terra.style.left = x + "px";
        terra.style.top = y + "px";

        plantacao.appendChild(terra);

    }

}