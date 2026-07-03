/*==================================================
= 1. CONFIGURAÇÃO DAS CULTURAS
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
= 2. CONFIGURAÇÕES GERAIS
==================================================*/

const GAME = {

    TOTAL_SUPERIOR: 102,
    TOTAL_INFERIOR: 224,
    TOTAL_PLOTS: 326,

    MAP_WIDTH: 3000,
    MAP_HEIGHT: 2000,

    INITIAL_MONEY: 120,

    INITIAL_WATER: 100,
    MAX_WATER: 200,

    WATER_PER_IRRIGATION: 10,

    WATER_SELL_AMOUNT: 10,
    WATER_SELL_PRICE: 20,

    RAIN_INTERVAL: 600000,
    RAIN_DURATION: 30000,
    RAIN_WATER_GAIN: 50

};



/*==================================================
= 3. ESTADO GLOBAL DO JOGO
==================================================*/

let gameState = {

    money: GAME.INITIAL_MONEY,

    water: GAME.INITIAL_WATER,

    maxWater: GAME.MAX_WATER,

    currentMode: "normal",

    selectedCrop: null,

    activeBalloon: null,

    inventory: {

        milho: 0,
        soja: 0,
        tomate: 0,
        alface: 0,
        cenoura: 0

    },

    seeds: {

        milho: 5,
        soja: 5,
        tomate: 5,
        alface: 5,
        cenoura: 5

    },

    plots: {}

};



/*==================================================
= 4. REFERÊNCIAS DOS ELEMENTOS
==================================================*/

let viewport = null;
let map = null;

let superiorGrid = null;
let inferiorGrid = null;



/*==================================================
= 5. CONTROLE DO MAPA
==================================================*/

let currentZoom = 0.7;

let mapX = -100;
let mapY = -50;

let dragging = false;

let dragStartX = 0;
let dragStartY = 0;



/*==================================================
= 6. CACHE DOS ELEMENTOS HTML
==================================================*/

function cacheElements() {

    viewport = document.getElementById("game-viewport");

    map = document.getElementById("farm-map");

    superiorGrid = document.getElementById("plantacao-superior");

    inferiorGrid = document.getElementById("plantacao-inferior");

}


/*==================================================
= 7. CRIAÇÃO DAS TERRAS
==================================================*/

function createPlots() {

    let id = 1;

    createSuperiorPlots(id);

    id += GAME.TOTAL_SUPERIOR;

    createInferiorPlots(id);

}



/*==================================================
= PLANTAÇÃO SUPERIOR
==================================================*/

function createSuperiorPlots(initialId) {

    let id = initialId;

    for (let i = 0; i < GAME.TOTAL_SUPERIOR; i++) {

        superiorGrid.appendChild(
            createSinglePlot(id)
        );

        id++;

    }

}



/*==================================================
= PLANTAÇÃO INFERIOR
==================================================*/

function createInferiorPlots(initialId) {

    let id = initialId;

    for (let i = 0; i < GAME.TOTAL_INFERIOR; i++) {

        inferiorGrid.appendChild(
            createSinglePlot(id)
        );

        id++;

    }

}



/*==================================================
= CRIA UMA ÚNICA TERRA
==================================================*/

function createSinglePlot(id) {

    const plot = document.createElement("div");

    plot.className = "plot";

    plot.dataset.id = id;

    gameState.plots[id] = {

        id: id,

        element: plot,

        crop: null,

        stage: 0,

        timer: 0,

        isWet: false,

        plantedAt: 0,

        paused: false

    };

    return plot;

}



/*==================================================
= BUSCAR DADOS DA TERRA
==================================================*/

function getPlot(id) {

    return gameState.plots[id] || null;

}



/*==================================================
= BUSCAR ELEMENTO DA TERRA
==================================================*/

function getPlotElement(id) {

    const plot = getPlot(id);

    if (!plot) return null;

    return plot.element;

}



/*==================================================
= VERIFICA SE A TERRA EXISTE
==================================================*/

function plotExists(id) {

    return !!gameState.plots[id];

}



/*==================================================
= VERIFICA SE A TERRA ESTÁ LIVRE
==================================================*/

function plotIsEmpty(id) {

    const plot = getPlot(id);

    if (!plot) return false;

    return plot.crop === null;

}



/*==================================================
= LIMPA UMA TERRA
==================================================*/

function clearPlot(id) {

    const plot = getPlot(id);

    if (!plot) return;

    plot.crop = null;

    plot.stage = 0;

    plot.timer = 0;

    plot.isWet = false;

    plot.plantedAt = 0;

    plot.paused = false;

    plot.element.classList.remove("wet");

    plot.element.innerHTML = "";

}



/*==================================================
= RESETA TODAS AS TERRAS
==================================================*/

function clearAllPlots() {

    for (const id in gameState.plots) {

        clearPlot(id);

    }

}



/*==================================================
= CONTAGEM DAS TERRAS
==================================================*/

function countPlots() {

    return Object.keys(gameState.plots).length;

}



/*==================================================
= TERRAS PLANTADAS
==================================================*/

function countPlantedPlots() {

    let total = 0;

    for (const id in gameState.plots) {

        if (gameState.plots[id].crop) {

            total++;

        }

    }

    return total;

}



/*==================================================
= TERRAS LIVRES
==================================================*/

function countEmptyPlots() {

    return GAME.TOTAL_PLOTS - countPlantedPlots();

}



/*==================================================
= LISTA DE TERRAS LIVRES
==================================================*/

function getEmptyPlots() {

    const list = [];

    for (const id in gameState.plots) {

        if (plotIsEmpty(id)) {

            list.push(gameState.plots[id]);

        }

    }

    return list;

}



/*==================================================
= LISTA DE TERRAS PLANTADAS
==================================================*/

function getPlantedPlots() {

    const list = [];

    for (const id in gameState.plots) {

        if (!plotIsEmpty(id)) {

            list.push(gameState.plots[id]);

        }

    }

    return list;

}



/*==================================================
= VERIFICA SE TODAS AS TERRAS ESTÃO OCUPADAS
==================================================*/

function allPlotsOccupied() {

    return countPlantedPlots() === GAME.TOTAL_PLOTS;

}



/*==================================================
= VERIFICA SE TODAS AS TERRAS ESTÃO VAZIAS
==================================================*/

function allPlotsEmpty() {

    return countPlantedPlots() === 0;

}


/*==================================================
= ATUALIZA A HUD
==================================================*/

function updateHUD() {

    const money = document.getElementById("hud-money");
    if (money) {
        money.innerText = gameState.money;
    }

    const water = document.getElementById("hud-water");
    if (water) {
        water.innerText = gameState.water;
    }

}



/*==================================================
= TEXTO FLUTUANTE
==================================================*/

function createFloatingText(text, element) {

    if (!element || !map) return;

    const div = document.createElement("div");

    div.className = "floating-text";

    div.innerText = text;

    div.style.left =
        (element.offsetLeft + 15) + "px";

    div.style.top =
        (element.offsetTop + 15) + "px";

    map.appendChild(div);

    setTimeout(() => {

        div.remove();

    }, 1200);

}



/*==================================================
= FECHA O BALÃO ATIVO
==================================================*/

function closeActiveBalloon() {

    const layer =
        document.getElementById("balloon-layer");

    if (!layer) return;

    layer.innerHTML = "";

    gameState.activeBalloon = null;

}



/*==================================================
= ABRE UM MODAL
==================================================*/

function openModal(id) {

    closeModals();

    const modal = document.getElementById(id);

    if (!modal) {

        console.warn("Modal não encontrado:", id);

        return;

    }

    modal.classList.add("active");

}



/*==================================================
= FECHA TODOS OS MODAIS
==================================================*/

function closeModals() {

    document
        .querySelectorAll(".modal-panel")
        .forEach(modal => {

            modal.classList.remove("active");

        });

}



/*==================================================
= FECHA TODOS OS BALÕES E MODAIS
==================================================*/

function closeInterfaces() {

    closeActiveBalloon();

    closeModals();

}



/*==================================================
= SAI DO MODO ESPECIAL
==================================================*/

function exitSpecialModes() {

    gameState.currentMode = "normal";

    gameState.selectedCrop = null;

    const indicator =
        document.getElementById(
            "active-mode-indicator"
        );

    if (indicator) {

        indicator.innerText = "";

    }

    const cursor =
        document.getElementById(
            "custom-cursor"
        );

    if (cursor) {

        cursor.style.display = "none";

    }

}



/*==================================================
= RESETA TODA A INTERFACE
==================================================*/

function resetInterface() {

    closeInterfaces();

    exitSpecialModes();

}



/*==================================================
= MOSTRA MENSAGEM
==================================================*/

function showMessage(message) {

    alert(message);

}



/*==================================================
= VERIFICA SE EXISTE UM ELEMENTO HTML
==================================================*/

function elementExists(id) {

    return document.getElementById(id) !== null;

}



/*==================================================
= OBTÉM UM ELEMENTO HTML
==================================================*/

function getElement(id) {

    return document.getElementById(id);

}



/*==================================================
= DEFINE TEXTO DE UM ELEMENTO
==================================================*/

function setText(id, value) {

    const element = getElement(id);

    if (!element) return;

    element.innerText = value;

}



/*==================================================
= DEFINE HTML DE UM ELEMENTO
==================================================*/

function setHTML(id, value) {

    const element = getElement(id);

    if (!element) return;

    element.innerHTML = value;

}



/*==================================================
= RENDERIZA O MAPA
==================================================*/

function renderMap() {

    if (!map) return;

    map.style.transform =
        `translate(${mapX}px, ${mapY}px) scale(${currentZoom})`;

}



/*==================================================
= INICIALIZA O MOVIMENTO
==================================================*/

function initMapMovement() {

    if (!viewport) return;

    viewport.addEventListener(
        "pointerdown",
        startDragging
    );

    viewport.addEventListener(
        "pointermove",
        dragMap
    );

    viewport.addEventListener(
        "pointerup",
        stopDragging
    );

    viewport.addEventListener(
        "pointerleave",
        stopDragging
    );

}



/*==================================================
= COMEÇA A ARRASTAR
==================================================*/

function startDragging(e) {

    if (

        e.target.closest(".plot") ||

        e.target.closest(".wood-balloon") ||

        e.target.closest(".modal-panel") ||

        e.target.closest(".objeto")

    ) {

        return;

    }

    dragging = true;

    dragStartX = e.clientX - mapX;

    dragStartY = e.clientY - mapY;

    if (viewport.setPointerCapture) {

        viewport.setPointerCapture(e.pointerId);

    }

}



/*==================================================
= MOVE O MAPA
==================================================*/

function dragMap(e) {

    if (!dragging) return;

    mapX = e.clientX - dragStartX;

    mapY = e.clientY - dragStartY;

    const minX =
        window.innerWidth -
        (GAME.MAP_WIDTH * currentZoom);

    const minY =
        window.innerHeight -
        (GAME.MAP_HEIGHT * currentZoom);

    mapX = Math.min(
        0,
        Math.max(minX, mapX)
    );

    mapY = Math.min(
        0,
        Math.max(minY, mapY)
    );

    renderMap();

}



/*==================================================
= PARA DE ARRASTAR
==================================================*/

function stopDragging(e) {

    if (!dragging) return;

    dragging = false;

    if (
        viewport &&
        viewport.releasePointerCapture
    ) {

        try {

            viewport.releasePointerCapture(
                e.pointerId
            );

        } catch {

        }

    }

}



/*==================================================
= CENTRALIZA O MAPA
==================================================*/

function centerMap() {

    mapX = -100;

    mapY = -50;

    renderMap();

}



/*==================================================
= DEFINE UMA POSIÇÃO DO MAPA
==================================================*/

function setMapPosition(x, y) {

    mapX = x;

    mapY = y;

    renderMap();

}



/*==================================================
= OBTÉM A POSIÇÃO DO MAPA
==================================================*/

function getMapPosition() {

    return {

        x: mapX,

        y: mapY,

        zoom: currentZoom

    };

}

/*==================================================
= FECHAR BALÃO ATIVO
==================================================*/

function closeActiveBalloon() {

    const layer = document.getElementById("balloon-layer");

    if (!layer) return;

    layer.innerHTML = "";

    gameState.activeBalloon = null;

}

/*==================================================
= ABRIR BALÃO DE PLANTIO
==================================================*/

function openPlantingBalloon(plotId) {

    closeActiveBalloon();

    gameState.activeBalloon = plotId;

    const layer = document.getElementById("balloon-layer");

    if (!layer) return;

    const balloon = document.createElement("div");
    balloon.className = "wood-balloon";

    for (const cropKey in CROPS) {

        const crop = CROPS[cropKey];

        const option = document.createElement("div");
        option.className = "crop-option";

        option.innerHTML = `
            <img src="${crop.img_adulto}">
            <div>${crop.name}</div>
        `;

        option.addEventListener("click", () => {

            startPlantMode(cropKey);

        });

        balloon.appendChild(option);

    }

    const rect = getPlotElement(plotId).getBoundingClientRect();

    balloon.style.left = (rect.left + 40) + "px";
    balloon.style.top = rect.top + "px";

    layer.appendChild(balloon);

}

/*==================================================
= ABRIR BALÃO DA FOICE
==================================================*/

function openHarvestBalloon(plotId) {

    closeActiveBalloon();

    gameState.activeBalloon = plotId;

    const layer = document.getElementById("balloon-layer");

    if (!layer) return;

    const balloon = document.createElement("div");
    balloon.className = "wood-balloon";

    balloon.innerHTML = `
        <div class="harvest-option">
            <img src="/img/simulador/foice.png">
            <div>Equipar Foice</div>
        </div>
    `;

    balloon.addEventListener("click", () => {

        startHarvestMode();

    });

    const rect = getPlotElement(plotId).getBoundingClientRect();

    balloon.style.left = (rect.left + 40) + "px";
    balloon.style.top = rect.top + "px";

    layer.appendChild(balloon);

}

/*==================================================
= FECHAR BALÃO AO CLICAR FORA
==================================================*/

document.addEventListener("click", (e) => {

    if (
        e.target.closest(".plot") ||
        e.target.closest(".wood-balloon")
    ) {
        return;
    }

    closeActiveBalloon();

});


/*==================================================
= ENTRAR NO MODO PLANTAR
==================================================*/

function startPlantMode(cropKey) {

    gameState.currentMode = "planting";
    gameState.selectedCrop = cropKey;

    const indicator = document.getElementById("active-mode-indicator");

    if (indicator) {
        indicator.innerText = "SEMEANDO: " + CROPS[cropKey].name;
    }

    executePlanting(gameState.activeBalloon);

    closeActiveBalloon();

}

/*==================================================
= ENTRAR NO MODO COLHER
==================================================*/

function startHarvestMode() {

    gameState.currentMode = "harvesting";

    const indicator = document.getElementById("active-mode-indicator");

    if (indicator) {
        indicator.innerText = "COLHENDO";
    }

    const cursor = document.getElementById("custom-cursor");

    if (cursor) {
        cursor.src = "/img/simulador/foice.png";
        cursor.style.display = "block";
    }

    executeHarvest(gameState.activeBalloon);

    closeActiveBalloon();

}

/*==================================================
= SAIR DOS MODOS ESPECIAIS
==================================================*/

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

}

/*==================================================
= CURSOR DA FOICE
==================================================*/

document.addEventListener("pointermove", (e) => {

    const cursor = document.getElementById("custom-cursor");

    if (!cursor) return;

    if (gameState.currentMode !== "harvesting") return;

    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";

});

/*==================================================
= CANCELAR MODOS AO CLICAR FORA
==================================================*/

document.addEventListener("click", (e) => {

    if (
        e.target.closest(".plot") ||
        e.target.closest(".wood-balloon") ||
        e.target.closest(".modal-panel")
    ) {
        return;
    }

    closeActiveBalloon();

    exitSpecialModes();

});

/*==================================================
= VERIFICA SE ESTÁ NO MODO PLANTAR
==================================================*/

function isPlantMode() {

    return gameState.currentMode === "planting";

}

/*==================================================
= VERIFICA SE ESTÁ NO MODO COLHER
==================================================*/

function isHarvestMode() {

    return gameState.currentMode === "harvesting";

}

/*==================================================
= ALTERA O CURSOR PARA A FOICE
==================================================*/

function showHarvestCursor() {

    const cursor = document.getElementById("custom-cursor");

    if (!cursor) return;

    cursor.src = "/img/simulador/foice.png";
    cursor.style.display = "block";

}

/*==================================================
= ESCONDE O CURSOR PERSONALIZADO
==================================================*/

function hideHarvestCursor() {

    const cursor = document.getElementById("custom-cursor");

    if (!cursor) return;

    cursor.style.display = "none";

}

/*==================================================
= PODE PLANTAR?
==================================================*/

function canPlant(plotId) {

    const plot = getPlot(plotId);

    if (!plot) return false;

    if (plot.crop !== null) return false;

    if (!gameState.selectedCrop) return false;

    if (gameState.seeds[gameState.selectedCrop] <= 0) return false;

    return true;

}

/*==================================================
= PLANTAR
==================================================*/

function executePlanting(plotId) {

    if (!canPlant(plotId)) return;

    const plot = getPlot(plotId);
    const cropKey = gameState.selectedCrop;

    gameState.seeds[cropKey]--;

    plot.crop = cropKey;
    plot.stage = 1;
    plot.timer = 0;
    plot.isWet = false;
    plot.paused = false;
    plot.plantedAt = Date.now();

    plot.element.innerHTML = `
        <img
            class="plot-plant-img"
            src="${CROPS[cropKey].img_broto}"
        >
    `;

    createFloatingText(
        "🌱 " + CROPS[cropKey].name,
        plot.element
    );

    updateHUD();

}

/*==================================================
= PLANTAR ÁREA
==================================================*/

function plantArea(plotId) {

    executePlanting(plotId);

}

/*==================================================
= REINICIAR TERRA
==================================================*/

function resetPlot(plotId) {

    const plot = getPlot(plotId);

    if (!plot) return;

    plot.crop = null;
    plot.stage = 0;
    plot.timer = 0;
    plot.isWet = false;
    plot.paused = false;
    plot.plantedAt = 0;

    plot.element.classList.remove("wet");
    plot.element.innerHTML = "";

}

/*==================================================
= TERRA ESTÁ VAZIA?
==================================================*/

function plotIsEmpty(plotId) {

    const plot = getPlot(plotId);

    if (!plot) return false;

    return plot.crop === null;

}

/*==================================================
= CONTAR TERRAS PLANTADAS
==================================================*/

function countPlantedPlots() {

    let total = 0;

    for (const id in gameState.plots) {

        if (gameState.plots[id].crop !== null) {

            total++;

        }

    }

    return total;

}

/*==================================================
= CONTAR TERRAS LIVRES
==================================================*/

function countEmptyPlots() {

    return GAME.TOTAL_PLOTS - countPlantedPlots();

}

/*==================================================
= LIMPAR TODAS AS TERRAS
==================================================*/

function clearAllPlots() {

    for (const id in gameState.plots) {

        resetPlot(id);

    }

}


/*==================================================
= PODE IRRIGAR?
==================================================*/

function canIrrigate(plotId) {

    const plot = getPlot(plotId);

    if (!plot) return false;

    if (!plot.crop) return false;

    if (plot.stage >= 3) return false;

    if (plot.isWet) return false;

    if (gameState.water < GAME.WATER_PER_IRRIGATION) return false;

    return true;

}

/*==================================================
= IRRIGAR
==================================================*/

function irrigatePlot(plotId) {

    if (!canIrrigate(plotId)) return;

    const plot = getPlot(plotId);

    gameState.water -= GAME.WATER_PER_IRRIGATION;

    plot.isWet = true;

    plot.element.classList.add("wet");

    createFloatingText(
        "💧 Regado",
        plot.element
    );

    updateHUD();

}

/*==================================================
= IRRIGAR ÁREA
==================================================*/

function irrigateArea(plotId) {

    irrigatePlot(plotId);

}

/*==================================================
= REMOVER IRRIGAÇÃO
==================================================*/

function dryPlot(plotId) {

    const plot = getPlot(plotId);

    if (!plot) return;

    plot.isWet = false;

    plot.element.classList.remove("wet");

}

/*==================================================
= SOLO ESTÁ MOLHADO?
==================================================*/

function plotIsWet(plotId) {

    const plot = getPlot(plotId);

    if (!plot) return false;

    return plot.isWet;

}

/*==================================================
= ADICIONAR ÁGUA À CISTERNA
==================================================*/

function addWater(amount) {

    gameState.water = Math.min(
        gameState.maxWater,
        gameState.water + amount
    );

    updateHUD();

}

/*==================================================
= REMOVER ÁGUA DA CISTERNA
==================================================*/

function removeWater(amount) {

    if (gameState.water < amount) {

        return false;

    }

    gameState.water -= amount;

    updateHUD();

    return true;

}

/*==================================================
= CISTERNA ESTÁ CHEIA?
==================================================*/

function cisternaIsFull() {

    return gameState.water >= gameState.maxWater;

}

/*==================================================
= CISTERNA ESTÁ VAZIA?
==================================================*/

function cisternaIsEmpty() {

    return gameState.water <= 0;

}

/*==================================================
= ENCHER CISTERNA
==================================================*/

function refillWaterSystem() {

    if (cisternaIsFull()) {

        alert("Reservatório cheio!");

        return;

    }

    addWater(GAME.RAIN_WATER_GAIN);

}

/*==================================================
= INICIALIZAR EVENTOS DAS TERRAS
==================================================*/

function initPlotEvents() {

    for (const id in gameState.plots) {

        const plot = getPlotElement(id);

        /*==========================================
        = CLIQUE
        ==========================================*/

        plot.addEventListener("click", () => {

            const data = getPlot(id);

            if (!data) return;

            if (gameState.currentMode !== "normal") return;

            // Terra vazia
            if (!data.crop) {

                openPlantingBalloon(id);
                return;

            }

            // Planta pronta
            if (data.stage === 3) {

                openHarvestBalloon(id);
                return;

            }

            // Irrigar
            if (!data.isWet) {

                irrigatePlot(id);

            }

        });

        /*==========================================
        = PASSAR O MOUSE
        ==========================================*/

        plot.addEventListener("pointerenter", () => {

            if (
                gameState.currentMode === "planting" &&
                canPlant(id)
            ) {

                executePlanting(id);

            }

            if (
                gameState.currentMode === "harvesting" &&
                isReadyToHarvest(id)
            ) {

                executeHarvest(id);

            }

        });

    }

}

/*==================================================
= REMOVER EVENTOS DAS TERRAS
==================================================*/

function destroyPlotEvents() {

    for (const id in gameState.plots) {

        const plot = getPlotElement(id);

        const clone = plot.cloneNode(true);

        plot.parentNode.replaceChild(clone, plot);

        gameState.plots[id].element = clone;

    }

}

/*==================================================
= ATUALIZAR TODOS OS EVENTOS
==================================================*/

function reloadPlotEvents() {

    destroyPlotEvents();

    initPlotEvents();

}

/*==================================================
= ABRIR BALÃO DA TERRA
==================================================*/

function openPlotBalloon(plotId) {

    const plot = getPlot(plotId);

    if (!plot) return;

    if (!plot.crop) {

        openPlantingBalloon(plotId);
        return;

    }

    if (plot.stage === 3) {

        openHarvestBalloon(plotId);
        return;

    }

    if (!plot.isWet) {

        irrigatePlot(plotId);

    }

}


/*==================================================
= INICIAR SISTEMA DE CRESCIMENTO
==================================================*/

function startGrowthSystem() {

    setInterval(updatePlantGrowth, 1000);

}

/*==================================================
= ATUALIZAR TODAS AS PLANTAS
==================================================*/

function updatePlantGrowth() {

    for (const id in gameState.plots) {

        const plot = getPlot(id);

        if (!plot) continue;

        if (!plot.crop) continue;

        if (plot.stage >= 3) continue;

        if (plot.paused) continue;

        updateSinglePlant(plot);

    }

}

/*==================================================
= ATUALIZAR UMA PLANTA
==================================================*/

function updateSinglePlant(plot) {

    const crop = CROPS[plot.crop];

    let speed = 1;

    // Planta irrigada cresce duas vezes mais rápido

    if (plot.isWet) {

        speed = 2;

    }

    plot.timer += speed;

    const stageTime = crop.stageTime;

    /*==========================================
    = BROTO → JOVEM
    ==========================================*/

    if (

        plot.stage === 1 &&
        plot.timer >= stageTime

    ) {

        plot.stage = 2;

        updatePlantImage(plot.id);

        createFloatingText(
            "🌿 Cresceu",
            plot.element
        );

        return;

    }

    /*==========================================
    = JOVEM → ADULTA
    ==========================================*/

    if (

        plot.stage === 2 &&
        plot.timer >= stageTime * 2

    ) {

        plot.stage = 3;

        updatePlantImage(plot.id);

        plot.isWet = false;

        plot.element.classList.remove("wet");

        createFloatingText(
            "🌾 Pronta",
            plot.element
        );

    }

}

/*==================================================
= PAUSAR CRESCIMENTO
==================================================*/

function pauseGrowth(plotId) {

    const plot = getPlot(plotId);

    if (!plot) return;

    plot.paused = true;

}

/*==================================================
= CONTINUAR CRESCIMENTO
==================================================*/

function resumeGrowth(plotId) {

    const plot = getPlot(plotId);

    if (!plot) return;

    plot.paused = false;

}

/*==================================================
= REINICIAR CRESCIMENTO
==================================================*/

function resetGrowth(plotId) {

    const plot = getPlot(plotId);

    if (!plot) return;

    plot.timer = 0;
    plot.stage = 1;
    plot.isWet = false;
    plot.paused = false;

    updatePlantImage(plotId);

}

/*==================================================
= ATUALIZAR IMAGEM DA PLANTA
==================================================*/

function updatePlantImage(plotId) {

    const plot = getPlot(plotId);

    if (!plot) return;

    if (!plot.crop) return;

    let image = "";

    switch (plot.stage) {

        case 1:
            image = CROPS[plot.crop].img_broto;
            break;

        case 2:
            image = CROPS[plot.crop].img_jovem;
            break;

        case 3:
            image = CROPS[plot.crop].img_adulto;
            break;

    }

    plot.element.innerHTML = `
        <img
            class="plot-plant-img"
            src="${image}"
        >
    `;

}

/*==================================================
= TEMPO TOTAL DA CULTURA
==================================================*/

function getCropTotalTime(cropKey) {

    if (!CROPS[cropKey]) return 0;

    return CROPS[cropKey].stageTime * 3;

}

/*==================================================
= TEMPO RESTANTE
==================================================*/

function getRemainingTime(plotId) {

    const plot = getPlot(plotId);

    if (!plot) return 0;

    if (!plot.crop) return 0;

    const total = getCropTotalTime(plot.crop);

    return Math.max(0, total - plot.timer);

}

/*==================================================
= PORCENTAGEM DE CRESCIMENTO
==================================================*/

function getGrowthPercent(plotId) {

    const plot = getPlot(plotId);

    if (!plot) return 0;

    if (!plot.crop) return 0;

    const total = getCropTotalTime(plot.crop);

    return Math.min(
        100,
        Math.floor((plot.timer / total) * 100)
    );

}

/*==================================================
= PLANTA ESTÁ PRONTA?
==================================================*/

function isReadyToHarvest(plotId) {

    const plot = getPlot(plotId);

    if (!plot) return false;

    return plot.crop !== null && plot.stage === 3;

}

/*==================================================
= OBTER INFORMAÇÕES DA PLANTA
==================================================*/

function getCropInfo(plotId) {

    const plot = getPlot(plotId);

    if (!plot) return null;

    if (!plot.crop) return null;

    return {

        cultura: CROPS[plot.crop].name,

        fase: plot.stage,

        tempo: plot.timer,

        restante: getRemainingTime(plotId),

        porcentagem: getGrowthPercent(plotId),

        irrigada: plot.isWet,

        pronta: isReadyToHarvest(plotId)

    };

}
/*==================================================
= TEMPOS DAS CULTURAS
==================================================

Milho
20 s por fase
60 s total

Soja
25 s por fase
75 s total

Tomate
15 s por fase
45 s total

Alface
15 s por fase
45 s total

Cenoura
18 s por fase
54 s total

Plantas irrigadas:
crescem 2× mais rápido.

==================================================*/

/*==================================================
= PODE COLHER?
==================================================*/

function canHarvest(plotId) {

    const plot = getPlot(plotId);

    if (!plot) return false;

    if (!plot.crop) return false;

    if (plot.stage !== 3) return false;

    return true;

}

/*==================================================
= COLHER
==================================================*/

function executeHarvest(plotId) {

    if (!canHarvest(plotId)) return;

    const plot = getPlot(plotId);

    const cropKey = plot.crop;

    const crop = CROPS[cropKey];

    // produção base por planta
    const amount = 3;

    gameState.inventory[cropKey] += amount;

    createFloatingText(
        "+" + amount + " " + crop.name,
        plot.element
    );

    resetPlot(plotId);

    updateHUD();

}

/*==================================================
= COLHER ÁREA
==================================================*/

function harvestArea(plotId) {

    executeHarvest(plotId);

}

/*==================================================
= TOTAL DE ESTOQUE
==================================================*/

function getInventoryTotal() {

    let total = 0;

    for (const k in gameState.inventory) {

        total += gameState.inventory[k];

    }

    return total;

}

/*==================================================
= VERIFICAR ESTOQUE VAZIO
==================================================*/

function inventoryIsEmpty() {

    return getInventoryTotal() === 0;

}

/*==================================================
= VERIFICAR ITEM NO ESTOQUE
==================================================*/

function hasInventory(cropKey) {

    return gameState.inventory[cropKey] > 0;

}

/*==================================================
= ADICIONAR AO ESTOQUE
==================================================*/

function addInventory(cropKey, amount) {

    if (!gameState.inventory[cropKey]) {

        gameState.inventory[cropKey] = 0;

    }

    gameState.inventory[cropKey] += amount;

}

/*==================================================
= REMOVER DO ESTOQUE
==================================================*/

function removeInventory(cropKey, amount) {

    if (gameState.inventory[cropKey] < amount) {

        return false;

    }

    gameState.inventory[cropKey] -= amount;

    return true;

}

/*==================================================
= ENTRAR NO MODO COLHER
==================================================*/

function startHarvestMode() {

    gameState.currentMode = "harvesting";

    const indicator = document.getElementById("active-mode-indicator");

    if (indicator) {
        indicator.innerText = "COLHENDO";
    }

    const cursor = document.getElementById("custom-cursor");

    if (cursor) {
        cursor.src = "/img/simulador/foice.png";
        cursor.style.display = "block";
    }

    executeHarvest(gameState.activeBalloon);

    closeActiveBalloon();

}

/*==================================================
= SAIR DO MODO COLHER
==================================================*/

function stopHarvestMode() {

    if (gameState.currentMode !== "harvesting") return;

    exitSpecialModes();

    const indicator = document.getElementById("active-mode-indicator");
    if (indicator) indicator.innerText = "";

    const cursor = document.getElementById("custom-cursor");
    if (cursor) cursor.style.display = "none";

}

/*==================================================
= ESTATÍSTICAS DO ESTOQUE
==================================================*/

function inventoryStats() {

    return {
        milho: gameState.inventory.milho,
        soja: gameState.inventory.soja,
        tomate: gameState.inventory.tomate,
        alface: gameState.inventory.alface,
        cenoura: gameState.inventory.cenoura,
        total: getInventoryTotal()
    };

}

/*==================================================
= LIMPAR ESTOQUE
==================================================*/

function clearInventory() {

    for (const k in gameState.inventory) {

        gameState.inventory[k] = 0;

    }

}

/*==================================================
= VERIFICAR ESTOQUE POR ITEM
==================================================*/

function getInventory(cropKey) {

    return gameState.inventory[cropKey] || 0;

}

/*==================================================
= GERAR SAVE
==================================================*/

function generateSaveCode() {

    const payload = {

        m: gameState.money,
        w: gameState.water,
        i: gameState.inventory,
        s: gameState.seeds,
        p: {}

    };

    for (const id in gameState.plots) {

        const p = gameState.plots[id];

        payload.p[id] = {

            c: p.crop,
            s: p.stage,
            t: p.timer,
            w: p.isWet,
            pa: p.paused || false

        };

    }

    const json = JSON.stringify(payload);
    const code = btoa(unescape(encodeURIComponent(json)));

    const output = document.getElementById("save-code-output");

    if (output) {
        output.value = code;
    }

}

/*==================================================
= CARREGAR SAVE
==================================================*/

function loadSaveCode() {

    const input = document.getElementById("save-code-input");

    if (!input || !input.value.trim()) return;

    try {

        const data = JSON.parse(
            decodeURIComponent(escape(atob(input.value.trim())))
        );

        gameState.money = data.m;
        gameState.water = data.w;
        gameState.inventory = data.i;
        gameState.seeds = data.s;

        for (const id in data.p) {

            if (!gameState.plots[id]) continue;

            const saved = data.p[id];
            const plot = gameState.plots[id];

            plot.crop = saved.c;
            plot.stage = saved.s;
            plot.timer = saved.t;
            plot.isWet = saved.w;
            plot.paused = saved.pa;

            const el = plot.element;

            if (!el) continue;

            if (!plot.crop) {

                el.innerHTML = "";
                el.classList.remove("wet");
                continue;

            }

            updatePlantImage(id);
            el.classList.toggle("wet", plot.isWet);

        }

        updateHUD();

        alert("Partida carregada com sucesso!");

        closeModals();

    } catch (e) {

        alert("Código inválido!");

    }

}
/*==================================================
= CACHE DE ELEMENTOS
==================================================*/

function cacheElements() {

    viewport = document.getElementById("game-viewport");
    map = document.getElementById("farm-map");

    superiorGrid = document.getElementById("plantacao-superior");
    inferiorGrid = document.getElementById("plantacao-inferior");

}

/*==================================================
= CRIAR TODAS AS TERRAS
==================================================*/

function createPlots() {

    let id = 1;

    for (let i = 0; i < GAME.TOTAL_SUPERIOR; i++) {

        const plot = createSinglePlot(id++);
        superiorGrid.appendChild(plot);

    }

    for (let i = 0; i < GAME.TOTAL_INFERIOR; i++) {

        const plot = createSinglePlot(id++);
        inferiorGrid.appendChild(plot);

    }

}

/*==================================================
= INICIALIZAÇÃO DO JOGO
==================================================*/

window.addEventListener("DOMContentLoaded", () => {

    cacheElements();

    createPlots();

    initPlotEvents();

    initMapMovement();

    startGrowthSystem();

    updateHUD();

    renderMap();

    // Botões principais

    const galpao = document.getElementById("galpao");
    if (galpao) galpao.addEventListener("click", openGalpao);

    const cooperativa = document.getElementById("cooperativa");
    if (cooperativa) cooperativa.addEventListener("click", openCooperativa);

    const cisterna = document.getElementById("cisterna");
    if (cisterna) cisterna.addEventListener("click", openCisterna);

    // Carregamento automático opcional
    const autoLoad = document.getElementById("auto-load");
    if (autoLoad && autoLoad.value) {
        loadSaveCode();
    }

});

/*==================================================
= MODAIS
==================================================*/

function openModal(id) {

    closeModals();

    const modal = document.getElementById(id);

    if (!modal) {
        console.warn("Modal não encontrado:", id);
        return;
    }

    modal.classList.add("active");

}

/*==================================================
= FECHAR MODAIS
==================================================*/

function closeModals() {

    document.querySelectorAll(".modal-panel").forEach(m => {
        m.classList.remove("active");
    });

}

/*==================================================
= FECHAR BALÕES (FINAL SEGURA)
==================================================*/

function closeActiveBalloon() {

    const layer = document.getElementById("balloon-layer");

    if (layer) layer.innerHTML = "";

    gameState.activeBalloon = null;

}

/*==================================================
= SAIR DE MODOS ESPECIAIS (FINAL SEGURA)
==================================================*/

function exitSpecialModes() {

    gameState.currentMode = "normal";
    gameState.selectedCrop = null;

    const indicator = document.getElementById("active-mode-indicator");
    if (indicator) indicator.innerText = "";

    const cursor = document.getElementById("custom-cursor");
    if (cursor) cursor.style.display = "none";

}

/*==================================================
= RENDER DO MAPA
==================================================*/

function renderMap() {

    map.style.transform =
        `translate(${mapX}px, ${mapY}px) scale(${currentZoom})`;

}

/*==================================================
= ATUALIZA HUD
==================================================*/

function updateHUD() {

    const money = document.getElementById("hud-money");
    if (money) money.innerText = gameState.money;

    const water = document.getElementById("hud-water");
    if (water) water.innerText = gameState.water;

}

/*==================================================
= UTILITÁRIO FINAL (DEBUG OPCIONAL)
==================================================*/

function debugGameState() {

    console.log("STATE:", gameState);

}
