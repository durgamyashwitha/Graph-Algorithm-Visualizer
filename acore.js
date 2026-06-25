async function aStar(start, target) {

    let openSet = [start];
    let cameFrom = new Array(nodes.length).fill(-1);

    let g = new Array(nodes.length).fill(Infinity);
    let f = new Array(nodes.length).fill(Infinity);
    let visited = new Array(nodes.length).fill(false);

    g[start] = 0;
    f[start] = heuristic(start, target);

    function heuristic(a, b) {
        let dx = nodes[a].x - nodes[b].x;
        let dy = nodes[a].y - nodes[b].y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    while (openSet.length > 0) {

        // pick node with smallest f
        let current = openSet.reduce((a, b) =>
            f[a] < f[b] ? a : b
        );

        if (current === target) break;

        openSet = openSet.filter(x => x !== current);
        visited[current] = true;

        nodes[current].color = "orange";
        render();
        await sleep(300);

        for (let edge of adj[current]) {

            let neighbor = edge.node;
            let weight = edge.weight;

            if (visited[neighbor]) continue;

            let tentativeG = g[current] + weight;

            if (tentativeG < g[neighbor]) {

                cameFrom[neighbor] = current;
                g[neighbor] = tentativeG;
                f[neighbor] = g[neighbor] + heuristic(neighbor, target);

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    //reconstruct path

    if (g[target] === Infinity) {

    document.getElementById("resultBox").innerHTML =
    `
    <b>A*</b><br>
    No path exists
    `;

    return;
}
    let path = [];
    let temp = target;

    while (temp !== -1) {
        path.push(temp);
        temp = cameFrom[temp];
    }

    path.reverse();

    for (let i of path) {
        nodes[i].color = "red";
        render();
        await waitControl();
        await sleep(200);
    }

   document.getElementById("resultBox").innerHTML =
`
<b>A* Distance:</b> ${g[target]}<br>
<b>Path:</b> ${path.join(" → ")}
`;
}