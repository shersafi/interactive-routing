// Default nodes and edges
var nodes = [
    { data: { id: "1", labels: [randomIP(), "1"] } },
    { data: { id: "2", labels: [randomIP(), "2"] } },
    { data: { id: "3", labels: [randomIP(), "3"] } },
    { data: { id: "4", labels: [randomIP(), "4"] } },
    { data: { id: "5", labels: [randomIP(), "5"] } },
];
var edges = [
    { data: { id: "edge1", source: "1", target: "2", weight: 3 } },
    { data: { id: "edge2", source: "2", target: "3", weight: 7 } },
    { data: { id: "edge3", source: "3", target: "5", weight: 1 } },
    { data: { id: "edge4", source: "4", target: "5", weight: 10 } },
    { data: { id: "edge5", source: "1", target: "4", weight: 17 } },
    { data: { id: "edge6", source: "2", target: "4", weight: 13 } },
];

// Generate a random IP for a given node
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


// Init cytoscape
var cy = cytoscape({
    container: document.getElementById("cy"),
    // Merge node and edge list
    elements: nodes.concat(edges),
    layout: {
        name: "cose",
        nodeRepulsion: function (node) {
            return 3000000;
        },
        edgeElasticity: function (edge) {
            return 1000;
        },
    },
    style: [
        {
            selector: "node",
            style: {
                "background-image": "images/web-server-icon.png",
                "background-fit": "cover",
                color: "blue",
                width: "50px",
                height: "50px",
                "background-clip": "node",
                shape: "rectangle",
                "background-opacity": 0,
                "text-wrap": "wrap",
                "text-max-width": 140,
                "text-overflow-wrap": "anywhere",
                label: function (ele) {
                    var labels = ele.data("labels");
                    return labels.join("\n");
                },
                "text-margin-y": "-10px",
            },
        },
        {
            selector: "edge",
            style: {
                label: function (ele) {
                    return ele.data("weight");
                },
                "curve-style": "bezier",
                "text-margin-y": "-20px",
                "text-rotation": "autorotate",
            },
        },
    ],
});

// Customization, add on tap
cy.on("tap", function (event) {
    if (event.target === cy) {
        // Tap on the empty canvas to add a new node
        var id = cy.nodes().size() + 1; // Generate a new ID for the node
        // If the user enters a weight, add the new node to the graph
        cy.add({
            data: { id: id, labels: [randomIP(), `${id}`] },
            position: { x: event.position.x, y: event.position.y },
        });
    } else if (event.target.isNode()) {
        // Tap on a node to add a new edge
        var source = event.target.id();
        var target = prompt("Enter ID of target node for edge from " + source);
        var weight = prompt(
            "Enter weight for edge from " + source + " to " + target
        );
        if (target && weight) {
            // If the user enters a target node and weight, add the new edge to the graph
            cy.add({
                data: {
                    id: "edge" + cy.edges().size() + 1,
                    source: source,
                    target: target,
                    weight: weight,
                },
            });
        }
    }
});

// Reset button event listener (click)
var reset = document.getElementById("reset-btn");
reset.onclick = function () {
    // Reset button resets all edges & nodes
    cy.elements().remove();
};

// Remove selected edges/nodes listener (click)
var removeSelected = document.getElementById("remove-selected");
removeSelected.onclick = function () {
    // Remove selected button removes every selected node/edge
    var selectedNodes = cy.$("node:selected");
    var selectedEdges = cy.$("edge:selected");
    selectedNodes.remove();
    selectedEdges.remove();
};

var randomize = document.getElementById("randomize");


// function onRandomize() {
//     cy.startBatch()

//     // https://javascript.info/array-methods#shuffle-an-array
//     function shuffle(array) {
//         for (let i = array.length - 1; i > 0; i--) {
//             let j = Math.floor(Math.random() * (i + 1));
//             [array[i], array[j]] = [array[j], array[i]];
//         }
//     }

//     numNodes = 20
//     numEdges = 10;

//     for (let i = 0; i <= numNodes; i++) {
//         cy.add({})
//     }

//     cy.endBatch()
// }



randomize.onclick = function () {
    // Randomize a layout with nodes and edges (connected graph)
    var numNodes = Math.floor(Math.random() * 9) + 4; // Random nodeNum between [4, 12]

    // Nodes and edges to append
    var nodes = [];
    var edges = [];

    // Generate nodes
    for (var i = 1; i <= numNodes; i++) {
        nodes.push({ data: { id: i.toString(), labels: [randomIP(), `${i}`] } });
    }

    // Generate edges
    for (var i = 1; i <= numNodes - 1; i++) {
        var source = i;
        var target = i + 1;
        var weight = Math.floor(Math.random() * 20) + 1; // Random weight between [1, 20]
        edges.push({
            data: {
                id: "edge" + i.toString(),
                source: source.toString(),
                target: target.toString(),
                weight: weight,
            },
        });
    }

    var weight = Math.floor(Math.random() * 20) + 1; // Random weight between [1, 20]
    // Connect to first
    edges.push({
        data: {
            id: "edge" + numNodes,
            source: numNodes.toString(),
            target: "1",
            weight: weight,
        },
    });

    // Select random nodes to add random edges to
    for (var i = 1; i <= (numNodes - 1) * 2; i++) {
        var source = Math.floor(Math.random() * numNodes) + 1; // Select random node
        var target = Math.floor(Math.random() * numNodes) + 1; // Select random node
        var weight = Math.floor(Math.random() * 20) + 1; // Random weight between [1, 20]

        if (!(source === target) && !isConnected(cy, source, target)) {
            edges.push({
                data: {
                    id: "edge" + i.toString(),
                    source: source.toString(),
                    target: target.toString(),
                    weight: weight,
                },
            });
        }
    }

    // Reset all edges & nodes
    cy.elements().remove();

    // Add the generated nodes and edges
    cy.add(nodes.concat(edges));
    cy.layout({
        name: "cose",
        nodeRepulsion: function (node) {
            return 2000000;
        },
        edgeElasticity: function (edge) {
            return 1000;
        },
    }).run();
};

// Start algorithm
var start = document.getElementById("start");
start.onclick = function () {
    // to-do
    const start = cy.nodes()[0];
    const end = cy.nodes().last();

    djikstra(start, end);
};

function djikstra(start, end) {
    // init distance vector
    distance = {};
    // init visited vector
    visited = {};

    // add distance and visited for each node
    cy.nodes().forEach(function (node) {
        // add distance
        distance[node.id()] = Infinity;
        // label initial distance infinity to nodes
        var labels = node.data('labels'); // grab pre-existing labels
        if (labels[labels.length - 1] !== '∞') {
            labels.push('∞');
        }
        node.data('labels', labels);


    })
}
