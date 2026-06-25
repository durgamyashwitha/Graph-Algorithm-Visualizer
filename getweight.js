let currentEdge = null;

function getWeightInput(edge) {
    return new Promise((resolve) => {

        currentEdge = edge;

        document.getElementById("weightModal").style.display = "block";
        document.getElementById("weightInput").value = edge.weight;

        document.getElementById("saveWeight").onclick = () => {
            let val = Number(document.getElementById("weightInput").value);
            document.getElementById("weightModal").style.display = "none";
            resolve(val);
        };

        document.getElementById("cancelWeight").onclick = () => {
            document.getElementById("weightModal").style.display = "none";
            resolve(null);
        };
    });
}