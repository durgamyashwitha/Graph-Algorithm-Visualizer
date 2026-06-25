async function primMST(start = 0) {

    let visited = new Array(nodes.length).fill(false);
    let total = 0;
    let mstEdges = [];

    visited[start] = true;
    nodes[start].color = "green";
    render();
    await sleep(500);

    while (true) {

        let minEdge = null;
        let minWeight = Infinity;

        // 🔍 find minimum edge from visited → unvisited
        for (let u = 0; u < nodes.length; u++) {

            if (!visited[u]) continue;

            for (let edge of adj[u]) {

                let v = edge.node;
                let w = edge.weight;

                if (!visited[v] && w < minWeight) {
                    minWeight = w;
                    minEdge = { u, v, w };
                }
            }
        }

        // 🚫 no more edges → done
        if (!minEdge) break;

        let { u, v, w } = minEdge;

        visited[v] = true;

        // add to MST
        mstEdges.push(minEdge);
        total += w;

        // 🎨 highlight node
        nodes[v].color = "orange";

        // 🎨 highlight edge in MST
        edges.push({
            from: nodes[u],
            to: nodes[v],
            weight: w,
            mst: true
        });

        render();
        await sleep(600);
    }

    // 🔥 final coloring
    for (let i = 0; i < nodes.length; i++) {
        if (visited[i]) {
            nodes[i].color = "green";
        }
    }

    render();

    let mstPath = mstEdges.map(
    edge => `${edge.u}-${edge.v} (${edge.w})`
    );

    document.getElementById("resultBox").innerHTML =
    `
    <b>Prim's MST</b><br>
    <b>Total Weight:</b> ${total}<br><br>
    ${mstPath.join("<br>")}
    `;
}