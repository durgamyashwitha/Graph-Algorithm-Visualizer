async function bipartite() {

    resetColors();

    let color = new Array(nodes.length).fill(-1);

    for (let start = 0; start < nodes.length; start++) {

        if (color[start] !== -1) continue;

        let q = [];
        q.push(start);

        color[start] = 0;
        nodes[start].color = "deepskyblue";

        while (q.length > 0) {

            let curr = q.shift();

            render();
            await sleep(500);
            await waitControl();

            for (let edge of adj[curr]) {

                let neigh = edge.node;

                if (color[neigh] === -1) {

                    color[neigh] = 1 - color[curr];

                    if (color[neigh] === 0)
                        nodes[neigh].color = "deepskyblue";
                    else
                        nodes[neigh].color = "gold";

                    q.push(neigh);
                }

                else if (color[neigh] === color[curr]) {

                    nodes[curr].color = "red";
                    nodes[neigh].color = "red";

                    render();

                    showToast("Graph is NOT Bipartite");
                    return false;
                }
            }
        }
    }

    render();

    showToast("Graph is Bipartite");
    return true;
}