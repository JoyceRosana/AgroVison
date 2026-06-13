/* ==========================
   REFERÊNCIAS
========================== */

const plantacao =
document.getElementById("plantacao");

const menuPlantio =
document.getElementById("menuPlantio");

/* ==========================
   GRADE DE TERRAS
========================== */

const COLUNAS = 10;
const LINHAS = 11;

const ESPACO_X = 50;
const ESPACO_Y = 25;

for(let linha = 0; linha < LINHAS; linha++){

    for(let coluna = 0; coluna < COLUNAS; coluna++){

        const terra =
        document.createElement("div");

        terra.className = "terra";

        const img =
        document.createElement("img");

        img.src =
        "/img/simulador/terra.png";

        terra.appendChild(img);

        const x =
        (coluna * ESPACO_X) -
        (linha * ESPACO_X);

        const y =
        (coluna * ESPACO_Y) +
        (linha * ESPACO_Y);

        terra.style.left =
        x + "px";

        terra.style.top =
        y + "px";

        plantacao.appendChild(terra);

    }

}

/* ==========================
   ABRIR MENU
========================== */

plantacao.addEventListener(
"click",
(e)=>{

    const terra =
    e.target.closest(".terra");

    if(!terra) return;

    menuPlantio.style.left =
    (e.clientX - 160) + "px";

    menuPlantio.style.top =
    (e.clientY - 220) + "px";

    menuPlantio.classList.remove(
        "oculto"
    );

}
);

/* ==========================
   FECHAR MENU
========================== */

document.addEventListener(
"click",
(e)=>{

    const terra =
    e.target.closest(".terra");

    const menu =
    e.target.closest(
        "#menuPlantio"
    );

    if(
        terra ||
        menu
    ) return;

    menuPlantio.classList.add(
        "oculto"
    );

}
);