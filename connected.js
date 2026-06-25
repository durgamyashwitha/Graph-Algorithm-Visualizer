function connected(){
     let visited = new Array(nodes.length).fill(false);

    function dfs(node,color){

        visited[node]=true;
        nodes[node].color = color;

        for(let edge of adj[node]){
            let neigh = edge.node;
            if(!visited[neigh]){
                dfs(neigh,color);
            }
        }
    }

    let colors = ["red","green","blue","orange","purple","yellow"];
    let c =0;
    
    for(let i=0;i<nodes.length;i++){
        if(!visited[i]){
            dfs(i,colors[c % colors.length]);
            c++;
        }
    }

render();

}