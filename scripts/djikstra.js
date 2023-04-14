let queue = [];
let distances = {};
let previousNodes = {};

function enqueue(node) {
    queue.push(node);
    queue.sort((a, b) => distances[a] - distances[b]);
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function onDjikstra() {
    let start = cy.getElementById(cy.data("start"))
    clearAlgo()
    djikstra(start)
}

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
        // grab curr labels
        var labels = node.data("labels");

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

    //console.log(cy.nodes()[3].neighborhood().nodes().length);
    //console.log(queue);

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

        //   neighborNodes.forEach(function(neighborNode) {
        //     console.log(neighborNode.id());
        //   });

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
                //console.log(currentNode.id().toString());
                enqueue(neighborNode.id());
                //   edge.style('line-color', 'blue');
                edge.animate({
                    style: { "line-color": "blue", "width": 8},
                    duration: 1000,
                    easing: "ease-in-out",
                });
            }
        });
    }

    cy.edges().forEach(function (edge) {
        edge.removeStyle("line-color");
    });

    // Color the minimum path edges
    // Loop through previousNodes dictionary
    Object.keys(previousNodes).forEach(function (nodeId) {
        var previousNodeId = previousNodes[nodeId];
        if (previousNodeId !== null) {
            // Get the edge connecting the node with its previous node
            var edge = cy.edges(
                '[source="' + previousNodeId + '"][target="' + nodeId + '"]'
            );
            if (edge.length === 0) {
                edge = cy.edges(
                    '[source="' + nodeId + '"][target="' + previousNodeId + '"]'
                );
            }

            // Apply a style to color the edge
            edge.style("line-color", "green");
            edge.style("width", 8);
            edge.style("target-arrow-shape", "triangle");
            edge.style("target-arrow-color", "green");
        }
    });

    cy.nodes().animate({
        style: { "background-color": "white" },
        duration: 1000,
        easing: "ease-in-out",
    });
}