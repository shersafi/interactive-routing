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

// Init cytoscape
var cy = cytoscape({
  container: document.getElementById("cy"),
  // Merge node and edge list
  elements: nodes.concat(edges),
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
var resetBtn = document.getElementById('reset-btn');
resetBtn.onclick = function() {
    // Reset button resets all edges & nodes
    cy.nodes().remove();
    cy.edges().remove();
};

var removeSelected = document.getElementById('remove-selected');
removeSelected.onclick = function() {
    var selectedNodes = cy.$('node:selected');
    var selectedEdges = cy.$('edge:selected');
    selectedNodes.remove();
    selectedEdges.remove();
};
