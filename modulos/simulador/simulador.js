/*==================================================
= 1. CULTURAS
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
= 2. GAME CONFIG
==================================================*/

const GAME = {
    TOTAL_PLOTS: 326,
    INITIAL_MONEY: 120,
    INITIAL_WATER: 100,
    MAX_WATER: 200,
    WATER_PER_IRRIGATION: 10,
    RAIN_WATER_GAIN: 50
};

/*==================================================
= 3. STATE
==================================================*/

let gameState = {
    money: GAME.INITIAL_MONEY,
    water: GAME.INITIAL_WATER,

    seeds: { milho:5, soja:5, tomate:5, alface:5, cenoura:5 },
    inventory: { milho:0, soja:0, tomate:0, alface:0, cenoura:0 },

    plots: {},

    currentMode: "normal",
    selectedCrop: null,
    activeBalloon: null
};

/*==================================================
= 4. UI REFERENCES
==================================================*/

let viewport, map;
let mapX = -100, mapY = -50, zoom = 0.7;

/*==================================================
= 5. INIT
==================================================*/

window.addEventListener("DOMContentLoaded", () => {
    cacheElements();
    createPlots();
    initPlotEvents();
    startGrowthLoop();
    updateHUD();
});

/*==================================================
= 6. CACHE
==================================================*/

function cacheElements(){
    viewport = document.getElementById("game-viewport");
    map = document.getElementById("farm-map");
}

/*==================================================
= 7. PLOTS
==================================================*/

function createPlots(){
    let id = 1;

    for(let i=0;i<GAME.TOTAL_PLOTS;i++){
        const el = document.createElement("div");
        el.className = "plot";
        el.dataset.id = id;

        gameState.plots[id] = {
            id,
            element: el,
            crop: null,
            stage: 0,
            timer: 0,
            isWet: false,
            paused: false
        };

        el.addEventListener("click", ()=>handlePlot(id));

        document.getElementById(
            id<=102 ? "plantacao-superior" : "plantacao-inferior"
        ).appendChild(el);

        id++;
    }
}

/*==================================================
= 8. GAMEPLAY
==================================================*/

function handlePlot(id){
    const p = gameState.plots[id];

    if(!p.crop) return openPlantMenu(id);
    if(p.stage === 3) return openHarvestMenu(id);
    if(!p.isWet) irrigate(id);
}

function plant(id, crop){
    const p = gameState.plots[id];
    if(p.crop || gameState.seeds[crop] <= 0) return;

    gameState.seeds[crop]--;
    p.crop = crop;
    p.stage = 1;
    p.timer = 0;

    renderPlot(p);
}

function irrigate(id){
    const p = gameState.plots[id];
    if(gameState.water < GAME.WATER_PER_IRRIGATION) return;

    gameState.water -= GAME.WATER_PER_IRRIGATION;
    p.isWet = true;

    p.element.classList.add("wet");
    updateHUD();
}

function harvest(id){
    const p = gameState.plots[id];
    if(p.stage !== 3) return;

    gameState.inventory[p.crop] += 3;

    resetPlot(p);
    updateHUD();
}

/*==================================================
= 9. GROWTH SYSTEM
==================================================*/

function startGrowthLoop(){
    setInterval(updateGrowth, 1000);
}

function updateGrowth(){
    for(const id in gameState.plots){
        const p = gameState.plots[id];
        if(!p.crop || p.paused || p.stage === 3) continue;

        const crop = CROPS[p.crop];
        const speed = p.isWet ? 2 : 1;

        p.timer += speed;

        if(p.stage === 1 && p.timer >= crop.stageTime){
            p.stage = 2;
            renderPlot(p);
        }

        if(p.stage === 2 && p.timer >= crop.stageTime * 2){
            p.stage = 3;
            p.isWet = false;
            p.element.classList.remove("wet");
            renderPlot(p);
        }
    }
}

/*==================================================
= 10. RENDER
==================================================*/

function renderPlot(p){
    if(!p.crop) return;

    let img = "";

    if(p.stage === 1) img = CROPS[p.crop].img_broto;
    if(p.stage === 2) img = CROPS[p.crop].img_jovem;
    if(p.stage === 3) img = CROPS[p.crop].img_adulto;

    p.element.innerHTML = `<img class="plot-plant-img" src="${img}">`;
}

/*==================================================
= 11. HUD
==================================================*/

function updateHUD(){
    document.getElementById("hud-money").innerText = gameState.money;
    document.getElementById("hud-water").innerText = gameState.water;
}

/*==================================================
= 12. MENUS
==================================================*/

function openGalpao(){
    openModal("modal-galpao");
    renderGalpao();
}

function openCooperativa(){
    openModal("modal-cooperativa");
    renderCooperativa();
}

function openCisterna(){
    openModal("modal-cisterna");
    renderCisterna();
}

/*==================================================
= 13. RENDER MENUS
==================================================*/

function renderGalpao(){
    const el = document.getElementById("galpao-content");
    el.innerHTML = Object.keys(CROPS)
        .map(k=>`${CROPS[k].name} | sementes: ${gameState.seeds[k]} | estoque: ${gameState.inventory[k]}`)
        .join("<br>");
}

function renderCooperativa(){
    const el = document.getElementById("coop-content");

    el.innerHTML = Object.keys(CROPS)
        .map(k=>`
            <div>
                ${CROPS[k].name}
                <button onclick="sell('${k}')">Vender</button>
                <button onclick="buy('${k}')">Comprar sementes</button>
            </div>
        `).join("");
}

function renderCisterna(){
    document.getElementById("cisterna-content").innerHTML =
        `Água: ${gameState.water}/${GAME.MAX_WATER}`;
}

/*==================================================
= 14. MODAIS
==================================================*/

function openModal(id){
    document.querySelectorAll(".modal-panel")
        .forEach(m=>m.classList.remove("active"));

    document.getElementById(id).classList.add("active");
}

function closeModals(){
    document.querySelectorAll(".modal-panel")
        .forEach(m=>m.classList.remove("active"));
}

/*==================================================
= 15. SAVE SYSTEM
==================================================*/

function saveGame(){
    localStorage.setItem("save", JSON.stringify(gameState));
}

function loadGame(){
    const data = JSON.parse(localStorage.getItem("save"));
    if(data) gameState = data;
}