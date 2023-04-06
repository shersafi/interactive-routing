// Default nodes and edges
var nodes = [
    { data: { id: "1", label: randomIP() + ", 1" } },
    { data: { id: "2", label: randomIP() + ", 2" } },
    { data: { id: "3", label: randomIP() + ", 3" } },
    { data: { id: "4", label: randomIP() + ", 4" } },
    { data: { id: "5", label: randomIP() + ", 5" } },
];
var edges = [
    { data: { id: "edge1", source: "1", target: "2", weight: 3 } },
    { data: { id: "edge2", source: "2", target: "3", weight: 7 } },
    { data: { id: "edge3", source: "3", target: "5", weight: 1 } },
    { data: { id: "edge4", source: "4", target: "5", weight: 10 } },
    { data: { id: "edge5", source: "1", target: "4", weight: 17 } },
    { data: { id: "edge6", source: "2", target: "4", weight: 13 } },
];


function randomIP() {
    let ip =
        Math.floor(Math.random() * 255) +
        1 +
        "." +
        Math.floor(Math.random() * 255) +
        "." +
        Math.floor(Math.random() * 255) +
        "." +
        Math.floor(Math.random() * 255);
    return ip;
}


function cyGraphToGraph(cy) {
    const graph = {};

    cy.nodes().forEach((node) => {
        const id = node.id();
        graph[id] = {};
    });

    cy.edges().forEach((edge) => {
        const source = edge.source().id();
        const target = edge.target().id();
        const weight = edge.data('weight');
        graph[source][target] = weight;
        graph[target][source] = weight;
    });

    return graph;
}

// dijkstra's shortest path algorithm
function dijkstra(graph, start, end) {
    const distances = {};
    const visited = {};
    const previous = {};
    const queue = [];

    // initialize all distances to infinity except the start node
    for (const node in graph) {
        distances[node] = Infinity;
        previous[node] = null;
    }
    distances[start] = 0;

 
    for (const node in graph) {
        queue.push(node);
    }

    
    while (queue.length > 0) {
        // get the node with the smallest distance from the start node
        let smallest = queue[0];
        for (let i = 1; i < queue.length; i++) {
            if (distances[queue[i]] < distances[smallest]) {
                smallest = queue[i];
                }
        }
            
    visited[smallest] = true;
    queue.splice(queue.indexOf(smallest), 1);

    // if the end node has been reached, return the shortest path
    if (smallest === end) {
        const path = [];
        while (previous[smallest]) {
            path.push(smallest);
            smallest = previous[smallest];
        }
        return path.reverse();
    }


    for (const neighbor in graph[smallest]) {
       
        if (!visited[neighbor]) {
            const alt = distances[smallest] + graph[smallest][neighbor];
            // if the new path to the neighbor is shorter than the current shortest path
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                previous[neighbor] = smallest;
            }
        }
    }
}


return null;
}
//  innit cy
var cy = cytoscape({
    container: document.getElementById("cy"),
    elements: {
    nodes: nodes,
    edges: edges,
    },
    layout: {
    name: "random",
    },
    });
    
    // get the start and end nodes from the user and run the algorithm
    const start = prompt("Enter the ID of the start node:");
    const end = prompt("Enter the ID of the end node:");
    const path = dijkstra(cyGraphToGraph(cy), start, end);
    
   
    if (path) {
    for (let i = 0; i < path.length - 1; i++) {
    const edgeId = cy.edgesBetween(path[i], path[i + 1])[0].id();
    cy.$("#" + edgeId).style("line-color", "red");
    }
    } else {
    alert("oh oh poopoo");
    }