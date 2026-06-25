function cycle() {

    let visited = new Array(nodes.length).fill(false);
    let parent = new Array(nodes.length).fill(-1);

    let cycleNodes = [];
    let foundCycle = false;

    function dfs(u, par) {

        visited[u] = true;

        for (let edge of adj[u]) {

            let v = edge.node;

            if (!visited[v]) {

                parent[v] = u;

                if (dfs(v, u)) return true;

            } else if (v !== par) {

                // cycle found
                let curr = u;
                cycleNodes = [];

                cycleNodes.push(v);

                while (curr !== v && curr !== -1) {
                    cycleNodes.push(curr);
                    curr = parent[curr];
                }

                return true;
            }
        }

        return false;
    }

    for (let i = 0; i < nodes.length; i++) {
        if (!visited[i]) {
            if (dfs(i, -1)) {
                foundCycle = true;
                break;
            }
        }
    }

    // 🎨 reset colors first (IMPORTANT)
    for (let node of nodes) {
        node.color = "dodgerblue";
    }

    // 🎨 only color if cycle exists
    if (foundCycle) {
        for (let i of cycleNodes) {
            nodes[i].color = "red";
        }
        console.log("Cycle found");
    } else {
        console.log("No cycle found");
    }

    render();
}

function hasCycle() {

    let visited = new Array(nodes.length).fill(false);

    function dfs(u, parent) {

        visited[u] = true;

        for (let edge of adj[u]) {

            let v = edge.node;

            if (!visited[v]) {

                if (dfs(v, u)) return true;

            } else if (v !== parent) {
                return true;
            }
        }

        return false;
    }

    for (let i = 0; i < nodes.length; i++) {
        if (!visited[i]) {
            if (dfs(i, -1)) return true;
        }
    }

    return false;
}