const canvas = document.getElementById("can");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const nodes = [];
const edges = [];
const adj = [];

let firstNode = null;

let selectedNode = null;
let dragging = false;

let mode = "create";
let isBusy = false;

let isPaused = false;
let stepMode = false;

const deleteBtn = document.getElementById("deleteBtn");

deleteBtn.onclick = () => {

    mode = "delete";

    createBtn.classList.remove("active");
    weightBtn.classList.remove("active");
    deleteBtn.classList.add("active");
};

const createBtn = document.getElementById("createBtn");
const weightBtn = document.getElementById("weightBtn");

createBtn.onclick = () => {

    mode = "create";

    createBtn.classList.add("active");
    weightBtn.classList.remove("active");
    deleteBtn.classList.remove("active");
};

weightBtn.onclick = () => {

    mode = "weight";

    weightBtn.classList.add("active");
    createBtn.classList.remove("active");
    deleteBtn.classList.remove("active");
};

function drawNode(x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawEdge(x1, y1, x2, y2, weight , color , width) {

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();

    let mx = (x1 + x2) / 2;
    let my = (y1 + y2) / 2;

    ctx.beginPath();
    ctx.arc(mx, my, 14, 0, Math.PI * 2);
    ctx.fillStyle = "pink";
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "15px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(weight, mx, my);
}
/*creating node*/

function render() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let edge of edges) {

    let color = "white";
    let width = 3;

    if (edge.mst) {
        color = "red";
        width = 6;
    }

    drawEdge(
        edge.from.x,
        edge.from.y,
        edge.to.x,
        edge.to.y,
        edge.weight,
        color,
        width
    );
}

    for (let node of nodes) {

        if (node === firstNode)
            drawNode(node.x, node.y, 25, "red");
        else
            drawNode(node.x, node.y, 25, node.color);
    }
}
/*condition*/

function getNode(x, y) {

    for (let node of nodes) {

        let dx = x - node.x;
        let dy = y - node.y;

        if (Math.sqrt(dx * dx + dy * dy) < 25)
            return node;
    }

    return null;
}

/*creating node with condition*/

canvas.addEventListener("click", function (event) {

    if (mode !== "create") return;

    let x = event.offsetX;
    let y = event.offsetY;

    if (getNode(x, y)) return;

    for (let node of nodes) {

        let dx = x - node.x;
        let dy = y - node.y;

        if (Math.sqrt(dx * dx + dy * dy) < 50)
            return;
    }

    nodes.push({
        x: x,
        y: y,
        index: nodes.length,
        color : "dodgerblue"
    });

    adj.push([]);

    render();
});

/*creating connection edge*/

canvas.addEventListener("click", function (event) {

    if (mode !== "create") return;

    let x = event.offsetX;
    let y = event.offsetY;

    let clickedNode = getNode(x, y);

    if (!clickedNode)
        return;

    if (firstNode == null) {

        firstNode = clickedNode;

    } else {

        if (firstNode !== clickedNode) {

            let already = false;

            for (let edge of edges) {

                if (
                    (edge.from === firstNode && edge.to === clickedNode) ||
                    (edge.from === clickedNode && edge.to === firstNode)
                ) {
                    already = true;
                    break;
                }
            }

            if (!already) {

                edges.push({
                    from: firstNode,
                    to: clickedNode,
                    weight: 0
                });

                adj[firstNode.index].push({
                    node: clickedNode.index,
                    weight: 0
                });

                adj[clickedNode.index].push({
                    node: firstNode.index,
                    weight: 0
                });
            }
        }

        firstNode = null;
    }

    render();
});

function setStatus(text) {
    document.getElementById("status").innerText = text;
}

/*dragging node*/

canvas.addEventListener("mousedown", function (event) {

    if (mode !== "create") return;

    let x = event.offsetX;
    let y = event.offsetY;

    let node = getNode(x, y);

    if (node) {
        selectedNode = node;
        dragging = true;
    }
});

canvas.addEventListener("mousemove", function (event) {

    if (!dragging) return;

    selectedNode.x = event.offsetX;
    selectedNode.y = event.offsetY;

    render();
});

canvas.addEventListener("mouseup", function () {

    dragging = false;
    selectedNode = null;
});

/*edit weights*/

canvas.addEventListener("click",async function(event){

    if(mode !== "weight") return;

    const x = event.offsetX;
    const y = event.offsetY;

    for(let edge of edges){

        const midX = (edge.from.x + edge.to.x)/2;
        const midY = (edge.from.y + edge.to.y)/2;

        const dx = x - midX;
        const dy = y - midY;

        if(Math.sqrt(dx*dx + dy*dy) < 14){

            let newWeight = await getWeightInput(edge);

            if (newWeight === null) return;
            newWeight = parseInt(newWeight);

            if(isNaN(newWeight)){
                showToast("Please enter a valid number.");
                return;
            }

            edge.weight = newWeight;

            // Update adjacency list
            for(let neighbour of adj[edge.from.index]){
                if(neighbour.node === edge.to.index){
                    neighbour.weight = newWeight;
                }
            }

            for(let neighbour of adj[edge.to.index]){
                if(neighbour.node === edge.from.index){
                    neighbour.weight = newWeight;
                }
            }

            render();
            return;
        }
    }

});

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitControl() {
    while (isPaused) {
        await sleep(100);
    }

    if (stepMode) {
        isPaused = true;
        stepMode = false; // pause after each step
    }
}

document.getElementById("play").onclick = () => {
    isPaused = false;
};

document.getElementById("pause").onclick = () => {
    isPaused = true;
};

document.getElementById("step").onclick = () => {
    stepMode = true;
    isPaused = false;
};

/*resetting*/

function resetColors() {

    for (let node of nodes) {
        node.color = "dodgerblue";
    }

    for (let edge of edges) {
        edge.mst = false;
    }

    render();
}


/*MASTER CONTROLLER */

document.getElementById("runBtn").addEventListener("click", async function () {

    if (isBusy) return;
    isBusy = true;

    let algo = document.getElementById("algo").value;

    let start = Number(document.getElementById("startNode").value);
    let target = Number(document.getElementById("targetNode").value);

    resetColors();

    switch (algo) {

        case "bfs":
            if (isNaN(start)) start = 0;
            if(nodes.length === 0){
            showToast("Create graph first");
            isBusy = false;
            return;
        }
            await bfs(start);
            break;

        case "dfs":

            if (isNaN(start)) start = 0;
            let visited = new Array(nodes.length).fill(false);
            let order = [];
            await dfs(start, visited, order);
            document.getElementById("resultBox").innerHTML =
            `
            <b>DFS Traversal:</b><br>
            ${order.join(" → ")}
            `;
            break;

        case "dijkstra":
            await dijkstra(start, target);
            break;

        case "astar":
            await aStar(start, target);
            break;

        case "prims":
            if (isNaN(start)) start = 0;
            await primMST(start);
            break;

        case "kruskal":
            if(isNaN(start)) start = 0;
            await kruskalMST(start);
            break;   
    }

    isBusy = false;
});

function showToast(msg) {
    const toast = document.getElementById("toast");

    toast.innerText = msg;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}


/*components*/
document.getElementById("componentsBtn").addEventListener("click", function () {
    if (isBusy) return;
    isBusy = true;
    connected();
    isBusy = false;
});

/*cycle*/

document.getElementById("cycleBtn").addEventListener("click", function () {

    if (isBusy) return;
    isBusy = true;

    let result = hasCycle();   // 🔥 store result

    if (result) {
        showToast("Cycle Found");
        cycle(); // optional coloring function
    } else {
        showToast("No Cycle");
        resetColors();
    }
    isBusy = false;
});

/*bipartite check */

document.getElementById("bipartiteBtn").addEventListener("click", async function () {

    if (isBusy) return;

    isBusy = true;

    await bipartite();

    isBusy = false;
});


/*reset and clear*/

document.getElementById("resetBtn").addEventListener("click", function () {
    resetColors();

     document.getElementById("resultBox").innerText =
        "Result will appear here";
});

document.getElementById("clear").addEventListener("click", function () {

     document.getElementById("resultBox").innerText =
        "Result will appear here";

    nodes.length = 0;
    edges.length = 0;
    adj.length = 0;

    firstNode = null;
    selectedNode = null;
    dragging = false;

    render();
});

/*delete */

function deleteNode(nodeToDelete) {

    let idx = nodeToDelete.index;

    if(firstNode === nodeToDelete){
    firstNode = null;
}

    // Remove connected edges
    for(let i = edges.length - 1; i >= 0; i--){

        if(
            edges[i].from === nodeToDelete ||
            edges[i].to === nodeToDelete
        ){
            edges.splice(i, 1);
        }
    }

    // Remove node
    nodes.splice(idx, 1);

    // Rebuild indices
    for(let i = 0; i < nodes.length; i++){
        nodes[i].index = i;
    }

    showToast("Node Deleted");

    rebuildAdj();

    render();
}

function deleteEdge(edgeToDelete){

    let idx = edges.indexOf(edgeToDelete);

    if(idx !== -1){
        edges.splice(idx, 1);
    }
    showToast("Edge Deleted");

    rebuildAdj();

    render();
}

/*detect edge*/

function rebuildAdj() {

    adj.length = 0;

    for(let i = 0; i < nodes.length; i++){
        adj.push([]);
    }

    for(let edge of edges){

        adj[edge.from.index].push({
            node: edge.to.index,
            weight: edge.weight
        });

        adj[edge.to.index].push({
            node: edge.from.index,
            weight: edge.weight
        });
    }
}

function getEdge(x, y){

    for(let edge of edges){

        let mx = (edge.from.x + edge.to.x) / 2;
        let my = (edge.from.y + edge.to.y) / 2;

        let dx = x - mx;
        let dy = y - my;

        if(Math.sqrt(dx*dx + dy*dy) < 15){
            return edge;
        }
    }

    return null;
}

canvas.addEventListener("click", function(event){

    if(mode !== "delete") return;

    let x = event.offsetX;
    let y = event.offsetY;

    let node = getNode(x, y);

    if(node){
        deleteNode(node);
        return;
    }

    let edge = getEdge(x, y);

    if(edge){
        deleteEdge(edge);
        return;
    }

});

/*helper function */
document.getElementById("exportBtn")
.addEventListener("click", function(){
    console.log("Export clicked");
});

function loadGraph(data) {

    nodes.length = 0;
    edges.length = 0;
    adj.length = 0;

    for (let i = 0; i < data.nodes.length; i++) {

        nodes.push({
            x: data.nodes[i].x,
            y: data.nodes[i].y,
            color: data.nodes[i].color,
            index: i
        });

        adj.push([]);
    }

    for (let e of data.edges) {

        edges.push({
            from: nodes[e.from],
            to: nodes[e.to],
            weight: e.weight
        });

        adj[e.from].push({
            node: e.to,
            weight: e.weight
        });

        adj[e.to].push({
            node: e.from,
            weight: e.weight
        });
    }

    render();

    showToast("Graph Loaded!");
}

/*save graph*/

document.getElementById("saveBtn")
.addEventListener("click", async function(){
    await saveGraph();
});

async function saveGraph() {

    let name = await getGraphName();

    name = name.trim();

    if(name === ""){
        showToast("Enter graph name");
        return;
    }

    let savedGraphs =
        JSON.parse(localStorage.getItem("graphs")) || {};

    if(savedGraphs[name]){
    showToast("Graph already exists");
    return;
   }    

   savedGraphs[name] = {
    nodes: nodes.map(node => ({
        x: node.x,
        y: node.y,
        color: node.color
    })),

    edges: edges.map(edge => ({
        from: edge.from.index,
        to: edge.to.index,
        weight: edge.weight
    }))
};

    localStorage.setItem(
        "graphs",
        JSON.stringify(savedGraphs)
    );

    showToast("Graph Saved");
    console.log(localStorage.getItem("graphs"));
}
/*load graph */

document.getElementById("loadBtn")
.addEventListener("click", async function(){

    let graphName = await chooseGraph();

    if(!graphName) return;

    let graphs =
        JSON.parse(localStorage.getItem("graphs"));

    if(!graphs || !graphs[graphName]){
    showToast("Graph not found");
    return;
     }    

    loadGraph(graphs[graphName]);
});

/*delete graph saved */
document.getElementById("deleteGraphBtn")
.addEventListener("click", async function(){

    let graphName = await chooseGraph();

    if(!graphName) return;

    let graphs =
        JSON.parse(localStorage.getItem("graphs")) || {};

    delete graphs[graphName];

    localStorage.setItem(
        "graphs",
        JSON.stringify(graphs)
    );

    showToast("Graph Deleted");
});

/*explore*/

document.getElementById("exportBtn")
.addEventListener("click", function(){

    const graphData = {

        nodes: nodes.map(node => ({
            x: node.x,
            y: node.y,
            color: node.color
        })),

        edges: edges.map(edge => ({
            from: edge.from.index,
            to: edge.to.index,
            weight: edge.weight
        }))
    };

    const blob = new Blob(
        [JSON.stringify(graphData, null, 2)],
        {type:"application/json"}
    );

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "graph.json";

    a.click();
});

/*import */

document.getElementById("importBtn")
.addEventListener("click", function(){

    document.getElementById("importFile").click();

});

document.getElementById("importFile")
.addEventListener("change", function(event){

    const file = event.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        const data =
            JSON.parse(e.target.result);

        loadGraph(data);

        showToast("Graph Imported");
    };

    reader.readAsText(file);
});