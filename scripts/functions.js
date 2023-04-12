// Default nodes and edges
var nodes = [
  { data: { id: "1", labels: ["IP: " + randomIP(), "ID: 1"] } },
  { data: { id: "2", labels: ["IP: " + randomIP(), "ID: 2"] } },
  { data: { id: "3", labels: ["IP: " + randomIP(), "ID: 3"] } },
  { data: { id: "4", labels: ["IP: " + randomIP(), "ID: 4"] } },
  { data: { id: "5", labels: ["IP: " + randomIP(), "ID: 5"] } },
  { data: { id: "6", labels: ["IP: " + randomIP(), "ID: 6"] } },
];
var edges = [
  { data: { id: "edge1", source: "1", target: "2", weight: 2 } },
  { data: { id: "edge2", source: "1", target: "3", weight: 1 } },
  { data: { id: "edge3", source: "1", target: "4", weight: 5 } },
  { data: { id: "edge4", source: "2", target: "3", weight: 2 } },
  { data: { id: "edge5", source: "3", target: "5", weight: 1 } },
  { data: { id: "edge6", source: "5", target: "4", weight: 1 } },
  { data: { id: "edge7", source: "4", target: "6", weight: 5 } },
  { data: { id: "edge8", source: "5", target: "6", weight: 2 } },
  { data: { id: "edge9", source: "2", target: "4", weight: 3 } },
  { data: { id: "edge10", source: "3", target: "4", weight: 3 } },
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
  wheelSensitivity: 0.25,
  // Merge node and edge list
  elements: nodes.concat(edges),
  layout: {
    name: "avsdf",
    nodeSeparation: 200,
    fit: true,
    padding: 150,
  },
  style: [
    {
      selector: "node",
      style: {
        "background-image": "images/web-server-icon.png",
        "background-fit": "cover",
        color: "black",
        width: "50px",
        height: "50px",
        "text-outline-color": "yellow",
        "text-outline-width": "4px",
        "background-clip": "node",
        shape: "roundrectangle",
        "background-color": "white",
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
      data: { id: id, labels: ["IP: " + randomIP(), `ID: ${id}`] },
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
          weight: parseInt(weight),
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

// Checks if two nodes are connected
function isConnected(cy, node1, node2) {
  var node1 = cy.getElementById(node1);
  var node2 = cy.getElementById(node2);

  var edges = node1.connectedEdges();

  for (var i = 0; i < edges.length; i++) {
    var source = edges[i].source();
    var target = edges[i].target();

    // check if they are connected
    if (
      (source === node1 && target === node2) ||
      (source === node2 && target === node1)
    ) {
      return true;
    }
  }

  return false;
}

var randomize = document.getElementById("randomize");
randomize.onclick = function () {
  // Randomize a layout with nodes and edges (connected graph)
  var numNodes = Math.floor(Math.random() * 7) + 4; // Random nodeNum between [4, 10]

  // Nodes and edges to append
  var nodes = [];
  var edges = [];

  // Generate nodes
  for (var i = 1; i <= numNodes; i++) {
    let ip = randomIP()
    nodes.push({
      data: { id: i.toString(), ip: ip, labels: ["IP: " + ip, `ID: ${i}`] },
    });
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
    name: "avsdf",
    nodeSeparation: 200,
    fit: true,
    padding: 150,
  }).run();
};

// Start algorithm
var start = document.getElementById("start");
start.onclick = function () {
  // to-do
  const start = cy.nodes()[0];

  djikstra(start);
};


const queue = [];
const distances = {};
const previousNodes = {};

function enqueue(node) {
  queue.push(node);
  queue.sort((a, b) => distances[a] - distances[b]);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function djikstra(startNode) {
  // Set initial distances and previous nodes

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
          style: { "line-color": "blue" },
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
