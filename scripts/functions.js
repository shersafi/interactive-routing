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

// Checks if two nodes are connected
function isConnected(cy, node1, node2) {
    var node1 = cy.getElementById(node1);
    var node2 = cy.getElementById(node2);

    var edges = node1.connectedEdges();

    for (var i = 0; i < edges.length; i++) {
        var source = edges[i].source();
        var target = edges[i].target();

        // check if they are connected
        if ((source === node1 && target === node2) || (source === node2 && target === node1)) {
            return true;
        }
    }

    return false;
}

// Init cytoscape
var cy = cytoscape({
  container: document.getElementById("cy"),
  // Merge node and edge list
  elements: nodes.concat(edges),
  layout: { name: 'cose', nodeRepulsion: function( node ){ return 3000000; },
  edgeElasticity: function( edge ){ return 1000; } },
  style: [
    {
      selector: "node",
      style: {
        "background-image": "images/web-server-icon.png",
        "background-fit": "cover",
        width: "50px",
        height: "50px",
        "background-clip": "node",
        shape: "rectangle",
        "background-opacity": 0,
        label: function (ele) {
          return ele.data("label");
        },
        "text-margin-y": "-10px",
      },
    },
    // This is how we add line colour
    // {
    //   selector: "edge#edge1",
    //   style: {
    //     "line-color": "red",
    //   },
    // },
    {
      selector: "edge",
      style: {
        label: function (ele) {
          return ele.data("weight");
        },
        'curve-style': 'bezier',
        "text-margin-y": "-20px",
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
      data: { id: id, label: randomIP() + `, ${id}` },
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
var reset = document.getElementById('reset-btn');
reset.onclick = function() {
    // Reset button resets all edges & nodes
    cy.elements().remove();
};

// Remove selected edges/nodes listener (click)
var removeSelected = document.getElementById('remove-selected');
removeSelected.onclick = function() {
    // Remove selected button removes every selected node/edge
    var selectedNodes = cy.$('node:selected');
    var selectedEdges = cy.$('edge:selected');
    selectedNodes.remove();
    selectedEdges.remove();
};

var randomize = document.getElementById('randomize');
randomize.onclick = function() {
    // Randomize a layout with nodes and edges (connected graph)
    var numNodes = Math.floor(Math.random() * 9) + 4; // Random nodeNum between [4, 12]
    
    // Nodes and edges to append
    var nodes = [];
    var edges = [];

    // Generate nodes
    for (var i = 1; i <= numNodes; i++) {
        nodes.push({ data: { id: i.toString(), label: randomIP() + `, ${i}` } });
    }

    // Generate edges
    for (var i = 1; i <= numNodes - 1; i++) {
        var source = i;
        var target = i + 1;
        var weight = Math.floor(Math.random() * 20) + 1; // Random weight between [1, 20]
        edges.push({ data: { id: 'edge' + i.toString(), source: source.toString(), target: target.toString(), weight: weight } });
    }

    var weight = Math.floor(Math.random() * 20) + 1; // Random weight between [1, 20]
    // Connect to first
    edges.push({ data: { id: 'edge' + numNodes, source: numNodes.toString(), target: '1', weight: weight } });
    
    // Select random nodes to add random edges to
    for (var i = 1; i <= (numNodes - 1)*2; i++) {
        var source = Math.floor(Math.random() * numNodes) + 1; // Select random node
        var target = Math.floor(Math.random() * numNodes) + 1; // Select random node
        var weight = Math.floor(Math.random() * 20) + 1; // Random weight between [1, 20]

        if (!(source === target) && !isConnected(cy, source, target)) {
            edges.push({ data: { id: 'edge' + i.toString(), source: source.toString(), target: target.toString(), weight: weight } });
        }
     
    }    

    // Reset all edges & nodes
    cy.elements().remove();

    console.log(nodes);
    console.log(edges);

    // Add the generated nodes and edges
    cy.add(nodes.concat(edges));
    cy.layout({ name: 'cose', nodeRepulsion: function( node ){ return 2000000; },
    edgeElasticity: function( edge ){ return 1000; } }).run();

};