async function getGraphName() {

    return new Promise(resolve => {

        const modal = document.getElementById("graphModal");

        document.getElementById("graphModalTitle").innerText =
            "Enter Graph Name";

        document.getElementById("graphNameInput").value = "";

        document.getElementById("graphList").innerHTML = "";

        modal.style.display = "flex";

        document.getElementById("graphOk").onclick = () => {

            modal.style.display = "none";

            resolve(
                document.getElementById("graphNameInput").value
            );
        };

        document.getElementById("graphCancel").onclick = () => {

            modal.style.display = "none";

            resolve(null);
        };
    });
}