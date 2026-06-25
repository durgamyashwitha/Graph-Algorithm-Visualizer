async function kruskalMST() {

    resetColors();

    // Remove previous MST markings
    for (let edge of edges) {
        edge.mst = false;
    }

    let parent = [];
    let rank = [];

    for (let i = 0; i < nodes.length; i++) {
        parent[i] = i;
        rank[i] = 0;
    }

    function find(x) {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    function union(a, b) {

        let pa = find(a);
        let pb = find(b);

        if (pa === pb) return false;

        if (rank[pa] < rank[pb]) {
            parent[pa] = pb;
        }
        else if (rank[pb] < rank[pa]) {
            parent[pb] = pa;
        }
        else {
            parent[pb] = pa;
            rank[pa]++;
        }

        return true;
    }

    let sortedEdges = [...edges];

    sortedEdges.sort((a, b) => a.weight - b.weight);

    let totalWeight = 0;
    let mstEdges = [];

    for (let edge of sortedEdges) {

        let u = edge.from.index;
        let v = edge.to.index;

        if (union(u, v)) {

            edge.mst = true;

            totalWeight += edge.weight;
            mstEdges.push({
                u,v,w:edge.weight
            })

            render();

            await sleep(600);
            await waitControl();

            if (mstEdges.length === nodes.length - 1)
                break;
        }
    }

    let mstText = mstEdges.map(
    edge => `${edge.u}-${edge.v} (${edge.w})`
    );

    document.getElementById("resultBox").innerHTML =
    `
    <b>Kruskal MST</b><br>
    <b>Total Weight:</b> ${totalWeight}<br><br>
    ${mstText.join("<br>")}
    `;
}