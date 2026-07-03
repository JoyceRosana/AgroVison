"use strict";

/*==================================================
=
=  AGRO VISION
=  simulador.js
=
=  PARTE 1
=
=  ✔ Configuração
=  ✔ Estado do jogo
=  ✔ Criação automática das terras
=
==================================================*/



/*==================================================
= 1. CONFIGURAÇÃO DO JOGO
==================================================*/

const CROPS = {

    milho: {
        name: "Milho",
        seedPrice: 5,
        seedSellPrice: 3,
        sellPrice: 15,
        stageTime: 20,

        img_broto: "/img/simulador/milho_broto.png",
        img_jovem: "/img/simulador/milho_jovem.png",
        img_adulto: "/img/simulador/milho_adulto.png"
    },

    soja: {
        name: "Soja",
        seedPrice: 8,
        seedSellPrice: 5,
        sellPrice: 22,
        stageTime: 25,

        img_broto: "/img/simulador/soja_broto.png",
        img_jovem: "/img/simulador/soja_jovem.png",
        img_adulto: "/img/simulador/soja_adulto.png"
    },

    tomate: {
        name: "Tomate",
        seedPrice: 12,
        seedSellPrice: 8,
        sellPrice: 35,
        stageTime: 15,

        img_broto: "/img/simulador/tomate_broto.png",
        img_jovem: "/img/simulador/tomate_jovem.png",
        img_adulto: "/img/simulador/tomate_adulto.png"
    },

    alface: {
        name: "Alface",
        seedPrice: 3,
        seedSellPrice: 1,
        sellPrice: 9,
        stageTime: 15,

        img_broto: "/img/simulador/alface_broto.png",
        img_jovem: "/img/simulador/alface_jovem.png",
        img_adulto: "/img/simulador/alface_adulto.png"
    },

    cenoura: {
        name: "Cenoura",
        seedPrice: 4,
        seedSellPrice: 2,
        sellPrice: 12,
        stageTime: 18,

        img_broto: "/img/simulador/cenoura_broto.png",
        img_jovem: "/img/simulador/cenoura_jovem.png",
        img_adulto: "/img/simulador/cenoura_adulto.png"
    }

};



/*==================================================
= CONFIGURAÇÕES GERAIS
==================================================*/

const GAME = {

    TOTAL_SUPERIOR:102,

    TOTAL_INFERIOR:224,

    TOTAL_PLOTS:326,

    MAP_WIDTH:3000,

    MAP_HEIGHT:2000,

    INITIAL_MONEY:120,

    INITIAL_WATER:100,

    MAX_WATER:200,

    WATER_PER_IRRIGATION:10,

    WATER_SELL:10,

    WATER_SELL_PRICE:20,

    RAIN_INTERVAL:600000,

    RAIN_DURATION:30000,

    RAIN_WATER_GAIN:50

};



/*==================================================
= 2. ESTADO DO JOGO
==================================================*/

let gameState={

    money:GAME.INITIAL_MONEY,

    water:GAME.INITIAL_WATER,

    maxWater:GAME.MAX_WATER,

    currentMode:"normal",

    selectedCrop:null,

    activeBalloon:null,

    inventory:{

        milho:0,
        soja:0,
        tomate:0,
        alface:0,
        cenoura:0

    },

    seeds:{

        milho:5,
        soja:5,
        tomate:5,
        alface:5,
        cenoura:5

    },

    plots:{}

};



/*==================================================
= 3. VARIÁVEIS GLOBAIS
==================================================*/

let viewport;
let map;

let superiorGrid;
let inferiorGrid;

let currentZoom=0.7;

let mapX=-100;
let mapY=-50;

let dragging=false;

let dragStartX=0;
let dragStartY=0;



/*==================================================
= REFERÊNCIAS DOS ELEMENTOS HTML
==================================================*/

function cacheElements(){

    viewport=document.getElementById("game-viewport");

    map=document.getElementById("farm-map");

    superiorGrid=document.getElementById("plantacao-superior");

    inferiorGrid=document.getElementById("plantacao-inferior");

}



/*==================================================
= 4. CRIAÇÃO DAS TERRAS
==================================================*/

function createPlots(){

    let id=1;

    createSuperiorPlots(id);

    id+=GAME.TOTAL_SUPERIOR;

    createInferiorPlots(id);

}



/*==================================================
= PLANTAÇÃO SUPERIOR
==================================================*/

function createSuperiorPlots(initialId){

    let id=initialId;

    for(let i=0;i<GAME.TOTAL_SUPERIOR;i++){

        superiorGrid.appendChild(createSinglePlot(id));

        id++;

    }

}



/*==================================================
= PLANTAÇÃO INFERIOR
==================================================*/

function createInferiorPlots(initialId){

    let id=initialId;

    for(let i=0;i<GAME.TOTAL_INFERIOR;i++){

        inferiorGrid.appendChild(createSinglePlot(id));

        id++;

    }

}



/*==================================================
= CRIA UMA TERRA
==================================================*/

function createSinglePlot(id){

    const plot=document.createElement("div");

    plot.className="plot";

    plot.dataset.id=id;

    gameState.plots[id]={

        id:id,

        element:plot,

        crop:null,

        stage:0,

        timer:0,

        isWet:false,

        plantedAt:0

    };

    return plot;

}



/*==================================================
= BUSCAR TERRA
==================================================*/

function getPlot(id){

    return gameState.plots[id];

}



/*==================================================
= BUSCAR ELEMENTO DA TERRA
==================================================*/

function getPlotElement(id){

    return gameState.plots[id].element;

}



/*==================================================
= VERIFICA SE A TERRA ESTÁ LIVRE
==================================================*/

function plotIsEmpty(id){

    return gameState.plots[id].crop===null;

}



/*==================================================
= LIMPA UMA TERRA
==================================================*/

function clearPlot(id){

    const plot=getPlot(id);

    plot.crop=null;

    plot.stage=0;

    plot.timer=0;

    plot.isWet=false;

    plot.plantedAt=0;

    plot.element.classList.remove("wet");

    plot.element.innerHTML="";

}



/*==================================================
= TEXTO FLUTUANTE
==================================================*/

function createFloatingText(text,element){

    const div=document.createElement("div");

    div.className="floating-text";

    div.innerText=text;

    div.style.left=(element.offsetLeft+
                    element.parentElement.offsetLeft+15)+"px";

    div.style.top=(element.offsetTop+
                   element.parentElement.offsetTop+15)+"px";

    map.appendChild(div);

    setTimeout(()=>{

        div.remove();

    },1200);

}



/*==================================================
= MODOS
==================================================*/

function exitSpecialModes(){

    gameState.currentMode="normal";

    gameState.selectedCrop=null;

}



/*==================================================
= ATUALIZA HUD
==================================================*/

function updateHUD(){

    document.getElementById("hud-money").innerText=gameState.money;

}



/*==================================================
= FIM DA PARTE 1
==================================================*/

/*==================================================
=
= PARTE 2
=
= ✔ Movimento do mapa
= ✔ Zoom
= ✔ Sistema de balões
= ✔ Eventos das terras
= ✔ Modo plantar
= ✔ Modo colher
=
==================================================*/



/*==================================================
= RENDERIZA O MAPA
==================================================*/

function renderMap(){

    map.style.transform=
        `translate(${mapX}px, ${mapY}px) scale(${currentZoom})`;

}



/*==================================================
= MOVIMENTO DO MAPA
==================================================*/

function initMapMovement(){

    viewport.addEventListener("pointerdown",startDragging);

    viewport.addEventListener("pointermove",dragMap);

    viewport.addEventListener("pointerup",stopDragging);

}



/*==================================================
= COMEÇAR A ARRASTAR
==================================================*/

function startDragging(e){

    if(
        e.target.closest(".plot") ||
        e.target.closest(".wood-balloon") ||
        e.target.closest(".modal-panel") ||
        e.target.closest(".objeto")
    ){
        return;
    }

    dragging=true;

    dragStartX=e.clientX-mapX;

    dragStartY=e.clientY-mapY;

    viewport.setPointerCapture(e.pointerId);

}



/*==================================================
= ARRASTAR
==================================================*/

function dragMap(e){

    if(!dragging) return;

    mapX=e.clientX-dragStartX;

    mapY=e.clientY-dragStartY;

    mapX=Math.min(
        0,
        Math.max(window.innerWidth-(GAME.MAP_WIDTH*currentZoom),mapX)
    );

    mapY=Math.min(
        0,
        Math.max(window.innerHeight-(GAME.MAP_HEIGHT*currentZoom),mapY)
    );

    renderMap();

}



/*==================================================
= PARAR ARRASTAR
==================================================*/

function stopDragging(e){

    dragging=false;

    viewport.releasePointerCapture(e.pointerId);

}



/*==================================================
= ZOOM
==================================================*/

function changeZoom(value){

    currentZoom+=value;

    if(currentZoom<0.3){

        currentZoom=0.3;

    }

    if(currentZoom>1.5){

        currentZoom=1.5;

    }

    renderMap();

}



/*==================================================
= SISTEMA DE BALÕES
==================================================*/

function closeActiveBalloon(){

    const layer=document.getElementById("balloon-layer");

    layer.innerHTML="";

    gameState.activeBalloon=null;

}



/*==================================================
= BALÃO DE SEMENTES
==================================================*/

function openPlantingBalloon(id){

    closeActiveBalloon();

    gameState.activeBalloon=id;

    const layer=document.getElementById("balloon-layer");

    const balloon=document.createElement("div");

    balloon.className="wood-balloon";

    for(const crop in CROPS){

        const option=document.createElement("div");

        option.className="crop-option";

        option.innerHTML=`

            <img src="${CROPS[crop].img_adulto}">

            <div>${CROPS[crop].name}</div>

        `;

        option.onclick=()=>{

            startPlantMode(crop);

        };

        balloon.appendChild(option);

    }

    const rect=getPlotElement(id).getBoundingClientRect();

    balloon.style.left=(rect.left+40)+"px";

    balloon.style.top=rect.top+"px";

    layer.appendChild(balloon);

}



/*==================================================
= BALÃO DA FOICE
==================================================*/

function openHarvestBalloon(id){

    closeActiveBalloon();

    gameState.activeBalloon=id;

    const layer=document.getElementById("balloon-layer");

    const balloon=document.createElement("div");

    balloon.className="wood-balloon";

    balloon.innerHTML=`

        <div class="harvest-option">

            <img src="/img/simulador/foice.png">

            <div>Equipar Foice</div>

        </div>

    `;

    balloon.onclick=()=>{

        startHarvestMode();

    };

    const rect=getPlotElement(id).getBoundingClientRect();

    balloon.style.left=(rect.left+40)+"px";

    balloon.style.top=rect.top+"px";

    layer.appendChild(balloon);

}



/*==================================================
= MODO PLANTAR
==================================================*/

function startPlantMode(crop){

    gameState.currentMode="planting";

    gameState.selectedCrop=crop;

    document.getElementById("active-mode-indicator").innerText=

        "SEMEANDO : "+CROPS[crop].name;

    executePlanting(gameState.activeBalloon);

    closeActiveBalloon();

}



/*==================================================
= MODO COLHER
==================================================*/

function startHarvestMode(){

    gameState.currentMode="harvesting";

    document.getElementById("active-mode-indicator").innerText=

        "COLHENDO";

    const cursor=document.getElementById("custom-cursor");

    cursor.src="/img/simulador/foice.png";

    cursor.style.display="block";

    executeHarvest(gameState.activeBalloon);

    closeActiveBalloon();

}



/*==================================================
= CURSOR DA FOICE
==================================================*/

document.addEventListener("pointermove", (e) => {

    const cursor = document.getElementById("custom-cursor");

    if (!cursor) return;

    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";

});



/*==================================================
= EVENTOS DAS TERRAS
==================================================*/

function initPlotEvents(){

    for(const id in gameState.plots){

        const plot=getPlotElement(id);

        plot.addEventListener("click",()=>{

            const data=getPlot(id);

            if(gameState.currentMode!=="normal") return;

            if(!data.crop){

                openPlantingBalloon(id);

                return;

            }

            if(data.stage===3){

                openHarvestBalloon(id);

                return;

            }

            if(!data.isWet){

                irrigatePlot(id);

            }

        });

        plot.addEventListener("pointerenter",()=>{

            if(

                gameState.currentMode==="planting" &&

                plotIsEmpty(id)

            ){

                executePlanting(id);

            }

            if(

                gameState.currentMode==="harvesting" &&

                getPlot(id).stage===3

            ){

                executeHarvest(id);

            }

        });

    }

}



/*==================================================
= SAIR DOS MODOS ESPECIAIS
==================================================*/

document.addEventListener("click",(e)=>{

    if(

        e.target.closest(".plot") ||

        e.target.closest(".wood-balloon")

    ){

        return;

    }

    closeActiveBalloon();

    exitSpecialModes();

    document.getElementById("active-mode-indicator").innerText="";

    document.getElementById("custom-cursor").style.display="none";

});



/*==================================================
= FIM DA PARTE 2
==================================================*/

/*==================================================
=
= PARTE 3
=
= ✔ Plantio
= ✔ Irrigação
= ✔ Validações
= ✔ Imagens do broto
=
==================================================*/


/*==================================================
= PLANTAR
==================================================*/

function executePlanting(id){

    if(id==null) return;

    const plot=getPlot(id);

    if(!plot) return;

    if(plot.crop!==null) return;

    const cropKey=gameState.selectedCrop;

    if(!cropKey) return;

    if(gameState.seeds[cropKey]<=0){

        alert("Você não possui mais sementes de "+CROPS[cropKey].name);

        exitSpecialModes();

        return;

    }

    gameState.seeds[cropKey]--;

    plot.crop=cropKey;

    plot.stage=1;

    plot.timer=0;

    plot.isWet=false;

    plot.plantedAt=Date.now();

    plot.element.innerHTML=`

        <img
            class="plot-plant-img"
            src="${CROPS[cropKey].img_broto}"
        >

    `;

    updateHUD();

}



/*==================================================
= IRRIGAR
==================================================*/

function irrigatePlot(id){

    const plot=getPlot(id);

    if(!plot) return;

    if(!plot.crop) return;

    if(plot.stage>=3) return;

    if(plot.isWet) return;

    if(gameState.water<GAME.WATER_PER_IRRIGATION){

        alert("Água insuficiente.");

        return;

    }

    gameState.water-=GAME.WATER_PER_IRRIGATION;

    plot.isWet=true;

    plot.element.classList.add("wet");

    createFloatingText("💧 Regado",plot.element);

    updateHUD();

}



/*==================================================
= REMOVER IRRIGAÇÃO
==================================================*/

function dryPlot(id){

    const plot=getPlot(id);

    if(!plot) return;

    plot.isWet=false;

    plot.element.classList.remove("wet");

}



/*==================================================
= ALTERAR IMAGEM DA PLANTA
==================================================*/

function updatePlantImage(id){

    const plot=getPlot(id);

    if(!plot.crop) return;

    let image="";

    switch(plot.stage){

        case 1:

            image=CROPS[plot.crop].img_broto;

        break;

        case 2:

            image=CROPS[plot.crop].img_jovem;

        break;

        case 3:

            image=CROPS[plot.crop].img_adulto;

        break;

    }

    plot.element.innerHTML=`

        <img
            class="plot-plant-img"
            src="${image}"
        >

    `;

}



/*==================================================
= VERIFICA SE PODE PLANTAR
==================================================*/

function canPlant(id){

    const plot=getPlot(id);

    if(!plot) return false;

    if(plot.crop!==null) return false;

    if(!gameState.selectedCrop) return false;

    if(gameState.seeds[gameState.selectedCrop]<=0) return false;

    return true;

}



/*==================================================
= VERIFICA SE PODE REGAR
==================================================*/

function canIrrigate(id){

    const plot=getPlot(id);

    if(!plot) return false;

    if(!plot.crop) return false;

    if(plot.stage>=3) return false;

    if(plot.isWet) return false;

    if(gameState.water<GAME.WATER_PER_IRRIGATION) return false;

    return true;

}



/*==================================================
= PLANTAR VÁRIAS TERRAS
==================================================*/

function plantArea(id){

    if(!canPlant(id)) return;

    executePlanting(id);

}



/*==================================================
= REGAR VÁRIAS TERRAS
==================================================*/

function irrigateArea(id){

    if(!canIrrigate(id)) return;

    irrigatePlot(id);

}



/*==================================================
= LIMPAR UMA TERRA
==================================================*/

function resetPlot(id){

    const plot=getPlot(id);

    plot.crop=null;

    plot.stage=0;

    plot.timer=0;

    plot.isWet=false;

    plot.plantedAt=0;

    plot.element.classList.remove("wet");

    plot.element.innerHTML="";

}



/*==================================================
= CONTAGEM DE TERRAS PLANTADAS
==================================================*/

function countPlantedPlots(){

    let total=0;

    for(const id in gameState.plots){

        if(gameState.plots[id].crop){

            total++;

        }

    }

    return total;

}



/*==================================================
= CONTAGEM DE TERRAS LIVRES
==================================================*/

function countEmptyPlots(){

    return GAME.TOTAL_PLOTS-countPlantedPlots();

}



/*==================================================
= FIM DA PARTE 3
==================================================*/

/*==================================================
=
= PARTE 4
=
= ✔ Crescimento automático
= ✔ 3 fases
= ✔ Irrigação acelera
= ✔ Tempos individuais
=
==================================================*/


/*==================================================
= INICIAR SISTEMA DE CRESCIMENTO
==================================================*/

function startGrowthSystem(){

    setInterval(updatePlantGrowth,1000);

}



/*==================================================
= ATUALIZA TODAS AS PLANTAS
==================================================*/

function updatePlantGrowth(){

    for(const id in gameState.plots){

        const plot=getPlot(id);

        if(!plot.crop) continue;

        if(plot.stage>=3) continue;

        updateSinglePlant(plot);

    }

}



/*==================================================
= ATUALIZA UMA PLANTA
==================================================*/

function updateSinglePlant(plot){

    const crop=CROPS[plot.crop];

    let speed=1;

    // irrigada cresce 2x mais rápido

    if(plot.isWet){

        speed=2;

    }

    plot.timer+=speed;

    const t=crop.stageTime;

    //==============================
    // BROTO -> JOVEM
    //==============================

    if(plot.stage===1 && plot.timer>=t){

        plot.stage=2;

        updatePlantImage(plot.id);

        createFloatingText("🌿 Cresceu",plot.element);

        return;

    }

    //==============================
    // JOVEM -> ADULTA
    //==============================

    if(plot.stage===2 && plot.timer>=t*2){

        plot.stage=3;

        updatePlantImage(plot.id);

        plot.isWet=false;

        plot.element.classList.remove("wet");

        createFloatingText("🌾 Pronta",plot.element);

    }

}



/*==================================================
= TEMPO TOTAL DA CULTURA
==================================================*/

function getCropTotalTime(cropKey){

    return CROPS[cropKey].stageTime*3;

}



/*==================================================
= TEMPO RESTANTE
==================================================*/

function getRemainingTime(id){

    const plot=getPlot(id);

    if(!plot.crop){

        return 0;

    }

    const crop=CROPS[plot.crop];

    const total=crop.stageTime*3;

    return Math.max(

        0,

        total-plot.timer

    );

}



/*==================================================
= PORCENTAGEM
==================================================*/

function getGrowthPercent(id){

    const plot=getPlot(id);

    if(!plot.crop){

        return 0;

    }

    const crop=CROPS[plot.crop];

    const total=crop.stageTime*3;

    return Math.min(

        100,

        Math.floor((plot.timer/total)*100)

    );

}



/*==================================================
= VERIFICA SE ESTÁ PRONTA
==================================================*/

function isReadyToHarvest(id){

    const plot=getPlot(id);

    if(!plot.crop){

        return false;

    }

    return plot.stage===3;

}



/*==================================================
= REINICIAR CRESCIMENTO
==================================================*/

function resetGrowth(id){

    const plot=getPlot(id);

    plot.timer=0;

    plot.stage=1;

    plot.isWet=false;

    updatePlantImage(id);

}



/*==================================================
= PAUSAR
==================================================*/

function pauseGrowth(id){

    const plot=getPlot(id);

    plot.paused=true;

}



/*==================================================
= CONTINUAR
==================================================*/

function resumeGrowth(id){

    const plot=getPlot(id);

    plot.paused=false;

}



/*==================================================
= INFORMAÇÕES DA PLANTA
==================================================*/

function getCropInfo(id){

    const plot=getPlot(id);

    if(!plot.crop){

        return null;

    }

    return{

        cultura:CROPS[plot.crop].name,

        fase:plot.stage,

        tempo:plot.timer,

        restante:getRemainingTime(id),

        porcentagem:getGrowthPercent(id),

        irrigada:plot.isWet

    };

}



/*==================================================
= TEMPOS DAS CULTURAS
==================================================

Milho
20s broto
20s jovem
20s adulta
TOTAL = 60s

Soja
25s
25s
25s
TOTAL = 75s

Tomate
15s
15s
15s
TOTAL = 45s

Alface
15s
15s
15s
TOTAL = 45s

Cenoura
18s
18s
18s
TOTAL = 54s

Se irrigada:
cresce 2x mais rápido.

==================================================*/


/*==================================================
= FIM DA PARTE 4
==================================================*/

/*==================================================
=
= PARTE 5
=
= ✔ Colheita
= ✔ Estoque
= ✔ Modo colher
= ✔ Limpeza da terra
=
==================================================*/


/*==================================================
= COLHER UMA TERRA
==================================================*/

function executeHarvest(id){

    if(id==null) return;

    const plot=getPlot(id);

    if(!plot) return;

    if(!plot.crop) return;

    if(plot.stage!==3) return;

    const cropKey=plot.crop;

    const crop=CROPS[cropKey];

    // quantidade produzida

    const amount=3;

    gameState.inventory[cropKey]+=amount;

    createFloatingText(

        "+"+amount+" "+crop.name,

        plot.element

    );

    resetPlot(id);

    updateHUD();

}



/*==================================================
= COLHER VÁRIAS TERRAS
==================================================*/

function harvestArea(id){

    if(!isReadyToHarvest(id)) return;

    executeHarvest(id);

}



/*==================================================
= ENTRAR NO MODO COLHER
==================================================*/

function startHarvestMode(){

    gameState.currentMode="harvesting";

    document.getElementById(

        "active-mode-indicator"

    ).innerText="COLHENDO";

    const cursor=document.getElementById(

        "custom-cursor"

    );

    cursor.src="/img/simulador/foice.png";

    cursor.style.display="block";

    executeHarvest(

        gameState.activeBalloon

    );

    closeActiveBalloon();

}



/*==================================================
= SAIR DO MODO COLHER
==================================================*/

function stopHarvestMode(){

    if(gameState.currentMode!=="harvesting"){

        return;

    }

    exitSpecialModes();

    document.getElementById(

        "active-mode-indicator"

    ).innerText="";

    document.getElementById(

        "custom-cursor"

    ).style.display="none";

}



/*==================================================
= TOTAL DE ITENS DO ESTOQUE
==================================================*/

function getInventoryTotal(){

    let total=0;

    for(const crop in gameState.inventory){

        total+=gameState.inventory[crop];

    }

    return total;

}



/*==================================================
= ESTOQUE DE UMA CULTURA
==================================================*/

function getInventory(crop){

    return gameState.inventory[crop];

}



/*==================================================
= ADICIONA AO ESTOQUE
==================================================*/

function addInventory(crop,amount){

    gameState.inventory[crop]+=amount;

}



/*==================================================
= REMOVE DO ESTOQUE
==================================================*/

function removeInventory(crop,amount){

    if(gameState.inventory[crop]<amount){

        return false;

    }

    gameState.inventory[crop]-=amount;

    return true;

}



/*==================================================
= LIMPA TODO O ESTOQUE
==================================================*/

function clearInventory(){

    for(const crop in gameState.inventory){

        gameState.inventory[crop]=0;

    }

}



/*==================================================
= ESTATÍSTICAS DO ESTOQUE
==================================================*/

function inventoryStats(){

    return{

        milho:gameState.inventory.milho,

        soja:gameState.inventory.soja,

        tomate:gameState.inventory.tomate,

        alface:gameState.inventory.alface,

        cenoura:gameState.inventory.cenoura,

        total:getInventoryTotal()

    };

}



/*==================================================
= VERIFICA SE O ESTOQUE ESTÁ VAZIO
==================================================*/

function inventoryIsEmpty(){

    return getInventoryTotal()===0;

}



/*==================================================
= VERIFICA SE EXISTE UM PRODUTO
==================================================*/

function hasInventory(crop){

    return gameState.inventory[crop]>0;

}



/*==================================================
= FIM DA PARTE 5
==================================================*/

// 6. CISTERNA (ÁGUA / SISTEMA HÍDRICO)

function openCisterna() {
    closeActiveBalloon();
    exitSpecialModes();
    updateCisternaLabel();
    openModal('modal-cisterna');
}

function updateCisternaLabel() {
    const el = document.getElementById('modal-water-label');
    el.innerText = `${gameState.water}L / ${gameState.maxWater}L`;
}

function irrigatePlot(id, plotElement) {
    const plot = gameState.plots[id];
    if (!plot || plot.isWet) return;

    if (gameState.water < 10) {
        alert("Água insuficiente.");
        return;
    }

    gameState.water -= 10;
    plot.isWet = true;
    plotElement.classList.add('wet');

    createFloatingText("💧 Regado!", plotElement);
    updateCisternaLabel();
}

function refillWaterSystem() {
    if (gameState.water >= gameState.maxWater) {
        alert("Reservatório cheio!");
        return;
    }

    gameState.water = Math.min(gameState.maxWater, gameState.water + 50);
    updateCisternaLabel();
}

// 7. COOPERATIVA (MERCADO)

function openCooperativa() {
    closeActiveBalloon();
    exitSpecialModes();
    renderCooperativa();
    openModal('modal-cooperativa');
}

function renderCooperativa() {
    const container = document.getElementById('market-list');
    container.innerHTML = "";

    container.innerHTML += `
        <div class="item-row">
            <button class="btn-action" onclick="sellWaterResource()">
                Vender 10L de Água (+$20)
            </button>
        </div>
    `;

    for (let k in CROPS) {
        container.innerHTML += `
            <div class="item-row">
                <strong>${CROPS[k].name}</strong>
                <button onclick="buySeed('${k}')">Comprar (-$${CROPS[k].seedPrice})</button>
                <button onclick="sellSeed('${k}')">Vender (+$${CROPS[k].seedSellPrice})</button>
                <button onclick="sellCrop('${k}')">Liquidar Estoque</button>
            </div>
        `;
    }
}

function buySeed(key) {
    if (gameState.money < CROPS[key].seedPrice) return alert("Sem dinheiro.");

    gameState.money -= CROPS[key].seedPrice;
    gameState.seeds[key]++;
    updateHUD();
    renderCooperativa();
}

function sellSeed(key) {
    if (gameState.seeds[key] <= 0) return alert("Sem sementes.");

    gameState.seeds[key]--;
    gameState.money += CROPS[key].seedSellPrice;
    updateHUD();
    renderCooperativa();
}

function sellCrop(key) {
    if (gameState.inventory[key] <= 0) return alert("Sem estoque.");

    gameState.money += gameState.inventory[key] * CROPS[key].sellPrice;
    gameState.inventory[key] = 0;

    updateHUD();
    renderCooperativa();
}

function sellWaterResource() {
    if (gameState.water < 10) return alert("Água insuficiente.");

    gameState.water -= 10;
    gameState.money += 20;

    updateHUD();
    updateCisternaLabel();
    renderCooperativa();
}

// 8. GALPÃO + HUD

function openGalpao() {
    closeActiveBalloon();
    exitSpecialModes();

    const container = document.getElementById("stock-list");
    container.innerHTML = "";

    for (let k in gameState.inventory) {
        container.innerHTML += `
            <div class="item-row">
                <span>${CROPS[k].name}</span>
                <span>
                    sementes: ${gameState.seeds[k]} |
                    estoque: ${gameState.inventory[k]}
                </span>
            </div>
        `;
    }

    openModal("modal-galpao");
}

function updateHUD() {

    const money = document.getElementById("hud-money");
    if (money) money.innerText = gameState.money;

    const water = document.getElementById("hud-water");
    if (water) water.innerText = gameState.water;

}

// 9. SAVE / LOAD

function generateSaveCode() {
    const payload = {
        m: gameState.money,
        w: gameState.water,
        i: gameState.inventory,
        s: gameState.seeds,
        p: {}
    };

    for (let id in gameState.plots) {
        const p = gameState.plots[id];
        payload.p[id] = {
            c: p.crop,
            s: p.stage,
            t: p.timer,
            w: p.isWet
        };
    }

    const code = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    document.getElementById("save-code-output").value = code;
}

function loadSaveCode() {
    const input = document.getElementById("save-code-input").value.trim();
    if (!input) return;

    try {
        const data = JSON.parse(decodeURIComponent(escape(atob(input))));

        gameState.money = data.m;
        gameState.water = data.w;
        gameState.inventory = data.i;
        gameState.seeds = data.s;

        for (let id in data.p) {
            if (!gameState.plots[id]) continue;

            gameState.plots[id] = {
                id: Number(id),
                crop: data.p[id].c,
                stage: data.p[id].s,
                timer: data.p[id].t,
                isWet: data.p[id].w
            };

            const el = document.querySelector(`.plot[data-id="${id}"]`);
            if (!el) continue;

            const p = gameState.plots[id];

            if (!p.crop) {
                el.innerHTML = "";
                continue;
            }

            const crop = CROPS[p.crop];
            let img = crop.img_broto;

            if (p.stage === 2) img = crop.img_jovem;
            if (p.stage === 3) img = crop.img_adulte;

            el.innerHTML = `<img class="plot-plant-img" src="${img}">`;

            el.classList.toggle("wet", p.isWet);
        }

        updateHUD();
        alert("Partida restaurada.");
        closeModals();

    } catch {
        alert("Código inválido.");
    }
}

// 10. INICIALIZAÇÃO + EVENTOS

window.addEventListener("DOMContentLoaded", () => {

    cacheElements();

    createPlots();

    initPlotEvents();

    initMapMovement();

    startGrowthSystem();

    updateHUD();

    renderMap();

    const galpao = document.getElementById("galpao");
    if (galpao) {
        galpao.addEventListener("click", openGalpao);
    }

    const cooperativa = document.getElementById("cooperativa");
    if (cooperativa) {
        cooperativa.addEventListener("click", openCooperativa);
    }

    const cisterna = document.getElementById("cisterna");
    if (cisterna) {
        cisterna.addEventListener("click", openCisterna);
    }

    updateCisternaLabel();

});

function openModal(id) {

    closeModals();

    const modal = document.getElementById(id);

    if (!modal) {
        console.warn("Modal não encontrado:", id);
        return;
    }

    modal.classList.add("active");

}

function closeModals() {

    document.querySelectorAll(".modal-panel").forEach(modal => {
        modal.classList.remove("active");
    });

}
function closeActiveBalloon() {

    const layer = document.getElementById("balloon-layer");

    if (!layer) return;

    layer.innerHTML = "";

    gameState.activeBalloon = null;

}


function exitSpecialModes() {

    gameState.currentMode = "normal";
    gameState.selectedCrop = null;

    const indicator = document.getElementById("active-mode-indicator");
    if (indicator) {
        indicator.innerText = "";
    }

    const cursor = document.getElementById("custom-cursor");
    if (cursor) {
        cursor.style.display = "none";
    }

    const viewport = document.getElementById("game-viewport");
    if (viewport) {
        viewport.className = "";
    }

}

function createFloatingText(text, el) {
    const div = document.createElement("div");
    div.className = "floating-text";
    div.innerText = text;

    div.style.left = el.offsetLeft + "px";
    div.style.top = el.offsetTop + "px";

    document.getElementById("farm-map").appendChild(div);

    setTimeout(() => div.remove(), 1200);
}