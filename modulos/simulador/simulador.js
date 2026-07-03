
/*==================================================
= 1. CULTURAS (TEMPOS INDIVIDUAIS REAIS)
==================================================*/

const CROPS = {
    milho:   { name:"Milho",   stageTime:20, sellPrice:15 },
    soja:    { name:"Soja",    stageTime:25, sellPrice:22 },
    tomate:  { name:"Tomate",  stageTime:15, sellPrice:35 },
    alface:  { name:"Alface",  stageTime:15, sellPrice:9  },
    cenoura: { name:"Cenoura", stageTime:18, sellPrice:12 }
};

/*==================================================
= 2. CONFIGURAÇÃO DO JOGO
==================================================*/

const GAME = {
    TOTAL_PLOTS: 326,
    INITIAL_MONEY: 120,
    INITIAL_WATER: 100,
    MAX_WATER: 200,
    WATER_PER_IRRIGATION: 10,

    RAIN_INTERVAL: 180000, // chuva automática
    RAIN_WATER_GAIN: 40
};

/*==================================================
= 3. ESTADO GLOBAL (TUDO AQUI)
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
= 4. MAPA
==================================================*/

let viewport, map;
let mapX = -100, mapY = -50, zoom = 0.7;

/*==================================================
= 5. INICIALIZAÇÃO
==================================================*/

window.addEventListener("DOMContentLoaded", () => {
    cache();
    createPlots();
    initEvents();
    startGrowth();
    startRain();
    updateHUD();
});

/*==================================================
= 6. CACHE HTML
==================================================*/

function cache(){
    viewport = document.getElementById("game-viewport");
    map = document.getElementById("farm-map");
}

/*==================================================
= 7. CRIAÇÃO DAS 326 TERRAS
==================================================*/

function createPlots(){
    let id = 1;

    for(let i=0;i<GAME.TOTAL_PLOTS;i++){
        const el = document.createElement("div");
        el.className="plot";
        el.dataset.id=id;

        gameState.plots[id]={
            id,
            element:el,
            crop:null,
            stage:0,
            timer:0,
            isWet:false,
            paused:false
        };

        el.onclick = ()=>handlePlot(id);

        document.getElementById(
            id<=102 ? "plantacao-superior" : "plantacao-inferior"
        ).appendChild(el);

        id++;
    }
}

/*==================================================
= 8. AÇÕES PRINCIPAIS
==================================================*/

function handlePlot(id){
    const p = gameState.plots[id];

    if(!p.crop) return openPlantBalloon(id);
    if(p.stage===3) return openHarvestBalloon(id);
    if(!p.isWet) irrigate(id);
}

function plant(id,crop){
    const p=gameState.plots[id];
    if(!p || p.crop || gameState.seeds[crop]<=0) return;

    gameState.seeds[crop]--;

    p.crop=crop;
    p.stage=1;
    p.timer=0;

    renderPlot(p);
}

function irrigate(id){
    const p=gameState.plots[id];
    if(gameState.water < GAME.WATER_PER_IRRIGATION) return;

    gameState.water -= GAME.WATER_PER_IRRIGATION;
    p.isWet = true;

    p.element.classList.add("wet");
    updateHUD();
}

function harvest(id){
    const p=gameState.plots[id];
    if(p.stage!==3) return;

    gameState.inventory[p.crop] += 3;

    resetPlot(p);
    updateHUD();
}

/*==================================================
= 9. CRESCIMENTO AUTOMÁTICO
==================================================*/

function startGrowth(){
    setInterval(()=>{
        for(const id in gameState.plots){
            const p = gameState.plots[id];
            if(!p.crop || p.stage===3 || p.paused) continue;

            const crop = CROPS[p.crop];
            const speed = p.isWet ? 2 : 1;

            p.timer += speed;

            if(p.stage===1 && p.timer>=crop.stageTime){
                p.stage=2;
                renderPlot(p);
                floatText("🌿 Cresceu",p);
            }

            if(p.stage===2 && p.timer>=crop.stageTime*2){
                p.stage=3;
                p.isWet=false;
                p.element.classList.remove("wet");
                renderPlot(p);
                floatText("🌾 Pronto",p);
            }
        }
    },1000);
}

/*==================================================
= 10. CHUVA AUTOMÁTICA
==================================================*/

function startRain(){
    setInterval(()=>{
        gameState.water = Math.min(
            GAME.MAX_WATER,
            gameState.water + GAME.RAIN_WATER_GAIN
        );

        updateHUD();
        floatText("🌧️ Chuva!", {element:document.body});
    }, GAME.RAIN_INTERVAL);
}

/*==================================================
= 11. RENDER PLANTA
==================================================*/

function renderPlot(p){
    if(!p.crop) return;

    let img="";

    if(p.stage===1) img="/img/broto.png";
    if(p.stage===2) img="/img/jovem.png";
    if(p.stage===3) img="/img/adulto.png";

    p.element.innerHTML = `<img class="plot-plant-img" src="${img}">`;
}

/*==================================================
= 12. HUD COMPLETA
==================================================*/

function updateHUD(){
    document.getElementById("hud-money").innerText = gameState.money;
    document.getElementById("hud-water").innerText = gameState.water;
}

/*==================================================
= 13. FLOATING TEXT
==================================================*/

function floatText(text,p){
    const div=document.createElement("div");
    div.className="floating-text";
    div.innerText=text;

    p.element.appendChild(div);

    setTimeout(()=>div.remove(),1200);
}

/*==================================================
= 14. MODOS
==================================================*/

function setPlantMode(crop){
    gameState.currentMode="plant";
    gameState.selectedCrop=crop;
}

function setHarvestMode(){
    gameState.currentMode="harvest";
}

function exitMode(){
    gameState.currentMode="normal";
    gameState.selectedCrop=null;
}

/*==================================================
= 15. BALÕES
==================================================*/

function openPlantBalloon(id){
    gameState.activeBalloon=id;
    openModal("plant-modal");
}

function openHarvestBalloon(id){
    gameState.activeBalloon=id;
    openModal("harvest-modal");
}

/*==================================================
= 16. GALPÃO / COOPERATIVA / CISTERNA
==================================================*/

function openGalpao(){ openModal("galpao"); }
function openCooperativa(){ openModal("coop"); }
function openCisterna(){ openModal("cisterna"); }

/*==================================================
= 17. SAVE / LOAD
==================================================*/

function saveGame(){
    localStorage.setItem("save", JSON.stringify(gameState));
}

function loadGame(){
    const data = JSON.parse(localStorage.getItem("save"));
    if(data) gameState=data;
}

/*==================================================
= 18. MAPA
==================================================*/

function renderMap(){
    map.style.transform =
        `translate(${mapX}px,${mapY}px) scale(${zoom})`;
}