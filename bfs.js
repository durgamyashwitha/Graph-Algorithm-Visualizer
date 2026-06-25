async function bfs(start) {
    let visited = new Array(nodes.length).fill(false);
    let q = [];
    let order = [];

    visited[start] = true;
    q.push(start);

    while (q.length > 0) {
        let curr = q.shift();
        order.push(curr);

        nodes[curr].color = "orange";
        render();
        await sleep(500);

        for (let neigh of adj[curr]) {
            if (!visited[neigh.node]) {
                visited[neigh.node] = true;
                q.push(neigh.node);
            }
        }

        nodes[curr].color = "green";
        nodes[start].color = "yellow";
        render();
        render();
        await waitControl();
        await sleep(200);
    }
    document.getElementById("resultBox").innerHTML =
`
<b>BFS Traversal:</b><br>
${order.join(" → ")}
`;
}