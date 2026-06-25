async function dfs(u, visited,order) {
    let start = u;

    visited[u] = true;
    order.push(u);

    nodes[u].color = "orange";
    render();
    await sleep(500);

    for (let neigh of adj[u]) {

        if (!visited[neigh.node]) {
            await dfs(neigh.node, visited,order);
        }
    }

    nodes[u].color = "green";
    render();
    await waitControl();
    await sleep(300);
}