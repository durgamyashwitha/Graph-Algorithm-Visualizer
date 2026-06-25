function getPath(parent, target) {

    let path = [];

    while (target !== -1) {
        path.push(target);
        target = parent[target];
    }

    return path.reverse();
}

async function dijkstra(start,target) {

    let dist = new Array(nodes.length).fill(Infinity);
    let visited = new Array(nodes.length).fill(false);
    let parent = new Array(nodes.length).fill(-1);

    dist[start] = 0;

    for (let i = 0; i < nodes.length; i++) {

        let u = -1;
        let minDist = Infinity;

        for (let j = 0; j < nodes.length; j++) {
            if (!visited[j] && dist[j] < minDist) {
                minDist = dist[j];
                u = j;
            }
        }

        if (u === -1) break;

        visited[u] = true;

        nodes[u].color = "orange";
        render();
        await sleep(500);

        for (let edge of adj[u]) {

            let v = edge.node;
            let w = edge.weight;

            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                parent[v]=u;
            }
        }

        nodes[u].color = "green";

    }

    if(dist[target] === Infinity){
    showToast("No path exists!");
    showToast("Distance = " + dist[target]);
    return;
}

    let path = getPath(parent, target);

document.getElementById("resultBox").innerText =
    "Distance = " + dist[target] +
    "\nPath = " + path.join(" → ");


for (let i of path) {
    nodes[i].color = "red";
    render();
    await waitControl();
    await sleep(300);
}

    console.log("Shortest distances:", dist);
}