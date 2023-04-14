let queue = []; // Initialize priority queue object
let distances = {}; // Holds distances from node to node
let previousNodes = {}; // Tracks previous node during traversal

// Priority queue append
function enqueue(node) {
    queue.push(node);
    queue.sort((a, b) => distances[a] - distances[b]); // Sort by distance in the priority queue
}

// Sleep function that delays each step
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// When "Start Djikstra's" is clicked, start the algorithm
function onDjikstra() {
    let start = cy.getElementById(cy.data("start"))
    clearAlgo() // Clear to ensure no algorithm was applied before
    djikstra(start)
}

// Djikstra's algorithm implementation
async function djikstra(startNode) {
    // Set initial distances and previous nodes
    queue = [];
    distances = {};
    previousNodes = {};

    cy.nodes().forEach(function (node) {
        distances[node.id()] = Infinity;
        previousNodes[node.id()] = null;
    });
    distances[startNode.id()] = 0;

    // Update the distance labels
    cy.nodes().forEach(function (node) {
        // Grab current labels
        var labels = node.data("labels");

        // Initialize distance labels
        if (!labels[labels.length - 1].includes("Distance:")) {
            if (node.id() === startNode.id()) {
                labels.push("Distance: 0");
                node.data("labels", labels);
            } else {
                labels.push("Distance: ∞");
                node.data("labels", labels);
            }
        }
    });

    enqueue(startNode.id());

    // Loop until the queue is empty
    while (!(queue.length == 0)) {
        // Get the node with the smallest distance
        var currentNode = cy.nodes('[id="' + queue.shift() + '"]');

        currentNode.animate({
            style: { "background-color": "red" },
            duration: 500,
            easing: "ease-in-out",
        });

        // sleep
        await sleep(1500); // 1.5 second sleep

        // Get the neighbors of the current node
        var neighborNodes = currentNode.neighborhood().nodes();

        // Loop through the neighbors
        neighborNodes.forEach(function (neighborNode) {
            var edge = currentNode.edgesWith(neighborNode);
            var distance = edge.data("weight") + distances[currentNode.id()];

            if (distance < distances[neighborNode.id()]) {
                distances[neighborNode.id()] = distance;

                // grab curr labels
                var labels = neighborNode.data("labels");

                labels[labels.length - 1] = "Distance: " + distances[neighborNode.id()];
                neighborNode.data("labels", labels);
                previousNodes[neighborNode.id()] = currentNode.id();
                enqueue(neighborNode.id());
                edge.animate({
                    style: { "line-color": "blue", "width": 8},
                    duration: 1000,
                    easing: "ease-in-out",
                });
            }
        });
    }

    // Remove blue traversal lines
    cy.edges().forEach(function (edge) {
        edge.removeStyle("line-color");
    });

    // Color the minimum path edges
    // Loop through previousNodes dictionary
    Object.keys(previousNodes).forEach(function (nodeId) {
        var previousNodeId = previousNodes[nodeId];
        if (previousNodeId !== null) {
            // Get the edge connecting the node with its previous node
            let edge = cy.getElementById(edgeId(previousNodeId, nodeId))

            // Apply a style to color the edge
            edge.style("line-color", "green");
            edge.style("width", 8);
        }
    });

    cy.nodes().animate({
        style: { "background-color": "white" },
        duration: 1000,
        easing: "ease-in-out",
    });
}