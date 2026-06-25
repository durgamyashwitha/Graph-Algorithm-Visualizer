async function chooseGraph() {

    return new Promise(resolve => {

        const savedGraphs =
            JSON.parse(localStorage.getItem("graphs")) || {};

        const names = Object.keys(savedGraphs);

        const modal =
            document.getElementById("graphModal");

        document.getElementById("graphModalTitle")
            .innerText = "Select Graph";

        document.getElementById("graphNameInput")
            .style.display = "none";

        const list =
            document.getElementById("graphList");

        list.innerHTML = "";

        names.forEach(name => {

            const btn =
                document.createElement("button");

            btn.innerText = name;

            btn.onclick = () => {

                modal.style.display = "none";

                document.getElementById("graphNameInput")
                    .style.display = "block";

                resolve(name);
            };

            list.appendChild(btn);
        });

        modal.style.display = "flex";

        document.getElementById("graphCancel").onclick = () => {

            modal.style.display = "none";

            document.getElementById("graphNameInput")
                .style.display = "block";

            resolve(null);
        };
    });
}