/*==================================================
= 1. CULTURAS
==================================================*/

const CROPS = {
    milho: { name:"Milho", time:20, seed:5, sell:15,
        img:["/img/milho_broto.png","/img/milho_jovem.png","/img/milho_adulto.png"] },

    soja: { name:"Soja", time:25, seed:8, sell:22,
        img:["/img/soja_broto.png","/img/soja_jovem.png","/img/soja_adulto.png"] },

    tomate: { name:"Tomate", time:15, seed:12, sell:35,
        img:["/img/tomate_broto.png","/img/tomate_jovem.png","/img/tomate_adulto.png"] },

    alface: { name:"Alface", time:15, seed:3, sell:9,
        img:["/img/alface_broto.png","/img/alface_jovem.png","/img/alface_adulto.png"] },

    cenoura: { name:"Cenoura", time:18, seed:4, sell:12,
        img:["/img/cenoura_broto.png","/img/cenoura_jovem.png","/img/cenoura_adulto.png"] }
};

/*==================================================
= 2. ESTADO GLOBAL
==================================================*/

const GAME = {
    TOTAL: 326,
    WATER_MAX: 200,
    IRRIGATE_COST: 10
};

let state = {
    money:120,
    water:100,
    seeds:{ milho:5, soja:5, tomate:5, alface:5, cenoura:5 },
    inventory:{ milho:0, soja:0, tomate:0, alface:0, cenoura:0 },
    mode:"normal",
    cropSelected:null,
    plots:{},
    cisterna:{ filtered:true, stored:100 }
};

/*==================================================
= 3. MAPA
==================================================*/

let viewport, map;
let mapX=-100, mapY=-50;
let zoom=0.7;
let dragging=false, startX=0, startY=0;

/*==================================================
= 4. INIT
==================================================*/

window.addEventListener("DOMContentLoaded", () => {
    cache();
    createPlots();
    events();
    growthLoop();
    hud();
    mapRender();
});

/*==================================================
= 5. CACHE
==================================================*/

function cache(){
    viewport=document.getElementById("game-viewport");
    map=document.getElementById("farm-map");
}

/*==================================================
= 6. 326 TERRAS
==================================================*/

function createPlots(){
    let id=1;

    for(let i=0;i<GAME.TOTAL;i++){
        const el=document.createElement("div");
        el.className="plot";
        el.dataset.id=id;

        state.plots[id]={
            id,
            el,
            crop:null,
            stage:0,
            timer:0,
            wet:false
        };

        el.onclick=()=>plotClick(id);

        if(id<=102)
            document.getElementById("plantacao-superior").appendChild(el);
        else
            document.getElementById("plantacao-inferior").appendChild(el);

        id++;
    }
}

/*==================================================
= 7. CLIQUE NA TERRA
==================================================*/

function plotClick(id){
    const p=state.plots[id];

    if(state.mode==="plant"){
        plant(id);
        return;
    }

    if(state.mode==="harvest"){
        harvest(id);
        return;
    }

    if(!p.crop){
        openGalpao();
        return;
    }

    if(p.stage===3){
        harvest(id);
        return;
    }

    irrigate(id);
}

/*==================================================
= 8. PLANTAR
==================================================*/

function plant(id){
    const p=state.plots[id];
    const c=state.cropSelected;

    if(!c || p.crop) return;
    if(state.seeds[c]<=0) return;

    state.seeds[c]--;

    p.crop=c;
    p.stage=1;
    p.timer=0;

    renderPlant(p);
    hud();
}

/*==================================================
= 9. REGAR
==================================================*/

function irrigate(id){
    const p=state.plots[id];
    if(!p.crop || p.wet) return;

    p.wet=true;
    state.water-=GAME.IRRIGATE_COST;
    hud();
}

/*==================================================
= 10. CRESCIMENTO
==================================================*/

function growthLoop(){
    setInterval(()=>{
        for(const id in state.plots){
            const p=state.plots[id];
            if(!p.crop || p.stage===3) continue;

            let speed = p.wet ? 2 : 1;
            p.timer+=speed;

            const crop=CROPS[p.crop];

            if(p.stage===1 && p.timer>=crop.time){
                p.stage=2;
                renderPlant(p);
            }

            if(p.stage===2 && p.timer>=crop.time*2){
                p.stage=3;
                p.wet=false;
                renderPlant(p);
            }
        }
    },1000);
}

/*==================================================
= 11. COLHER
==================================================*/

function harvest(id){
    const p=state.plots[id];
    if(p.stage!==3) return;

    state.inventory[p.crop]+=3;

    p.crop=null;
    p.stage=0;
    p.timer=0;
    p.el.innerHTML="";

    hud();
}

/*==================================================
= 12. IMAGEM PLANTA
==================================================*/

function renderPlant(p){
    const c=CROPS[p.crop];

    let img=c.img[0];
    if(p.stage===2) img=c.img[1];
    if(p.stage===3) img=c.img[2];

    p.el.innerHTML=`<img src="${img}" class="plot-plant-img">`;
}

/*==================================================
= 13. MAPA
==================================================*/

function events(){
    viewport.addEventListener("pointerdown",(e)=>{
        dragging=true;
        startX=e.clientX-mapX;
        startY=e.clientY-mapY;
    });

    window.addEventListener("pointermove",(e)=>{
        if(!dragging) return;
        mapX=e.clientX-startX;
        mapY=e.clientY-startY;
        mapRender();
    });

    window.addEventListener("pointerup",()=>dragging=false);
}

function mapRender(){
    map.style.transform=`translate(${mapX}px,${mapY}px) scale(${zoom})`;
}

/*==================================================
= 14. HUD
==================================================*/

function hud(){
    document.getElementById("hud-money").innerText=state.money;
}

/*==================================================
= 15. MODAIS
==================================================*/

function openGalpao() {
    closeActiveBalloon();
    exitSpecialModes();

    const c = document.getElementById("stock-list");
    c.innerHTML = "";

    for (let k in CROPS) {
        c.innerHTML += `
            <div class="item-row" style="flex-direction:column; align-items:stretch; gap:6px;">
                <strong>${CROPS[k].name}</strong>

                <div>
                    🌱 Sementes: ${gameState.seeds[k]} <br>
                    📦 Estoque: ${gameState.inventory[k]}
                </div>
            </div>
        `;
    }

    openModal("modal-galpao");
}

function renderCooperativa() {
    const c = document.getElementById("market-list");
    c.innerHTML = "";

    for (let k in CROPS) {
        c.innerHTML += `
            <div class="item-row" style="flex-direction:column; gap:6px;">
                <strong>${CROPS[k].name}</strong>

                🌱 Sementes: ${gameState.seeds[k]}<br>
                📦 Estoque: ${gameState.inventory[k]}

                <div style="display:flex; gap:5px; margin-top:5px;">
                    <button class="btn-action" onclick="buySeed('${k}')">Comprar</button>
                    <button class="btn-action" onclick="sellSeed('${k}')">Vender Sementes</button>
                    <button class="btn-action" onclick="sellCrop('${k}')">Vender Estoque</button>
                </div>
            </div>
        `;
    }

    openModal("modal-cooperativa");
}

let filterProgress = 0;
let isFiltering = false;

function openCisterna() {
    closeActiveBalloon();
    exitSpecialModes();
    updateCisternaLabel();

    document.getElementById("modal-cisterna").innerHTML = `
        <div class="modal-header">
            <span>Cisterna</span>
            <span class="close-btn" onclick="closeModals()">&times;</span>
        </div>

        <div class="item-row">
            💧 Água filtrada: <span id="water-label"></span>
        </div>

        <div class="item-row">
            ⚙️ Água bruta: <span id="raw-water">200L</span>
        </div>

        <button class="btn-action" onclick="startFiltering()">
            FILTRAR
        </button>

        <div id="filter-status" style="margin-top:10px;"></div>
    `;

    updateCisternaUI();
    openModal("modal-cisterna");
}
function startFiltering() {
    if (isFiltering) return;
    isFiltering = true;

    const status = document.getElementById("filter-status");

    const interval = setInterval(() => {
        if (gameState.water >= gameState.maxWater) {
            clearInterval(interval);
            isFiltering = false;
            status.innerText = "Reservatório cheio.";
            return;
        }

        gameState.water += 1;
        filterProgress++;

        updateCisternaUI();

        status.innerText = `Filtrando... ${filterProgress}L`;

    }, 2000);
}
function updateCisternaUI() {
    document.getElementById("water-label").innerText =
        gameState.water + "L / " + gameState.maxWater + "L";
}

function openConfigModal(){
    closeAll();
    document.getElementById("modal-config").classList.add("active");
}

function closeAll(){
    document.querySelectorAll(".modal-panel")
        .forEach(m=>m.classList.remove("active"));
}

/*==================================================
= 16. MODO
==================================================*/

function setPlantMode(c){
    state.mode="plant";
    state.cropSelected=c;
}

function setHarvestMode(){
    state.mode="harvest";
}

function exitMode(){
    state.mode="normal";
    state.cropSelected=null;
}

/*==================================================
= 17. SAVE
==================================================*/

function save(){
    localStorage.setItem("save",JSON.stringify(state));
}

function load(){
    const s=localStorage.getItem("save");
    if(!s) return;
    state=JSON.parse(s);
    location.reload();
}