// Default nodes and edges
var defaultGraph = [
    { group: "nodes", data: { id: "1", ip: randomIP() } },
    { group: "nodes", data: { id: "2", ip: randomIP() } },
    { group: "nodes", data: { id: "4", ip: randomIP() } },
    { group: "nodes", data: { id: "3", ip: randomIP() } },
    { group: "nodes", data: { id: "5", ip: randomIP() } },
    { group: "nodes", data: { id: "6", ip: randomIP() } },
    { group: "edges", data: { id: "1-2", source: "1", target: "2", weight: 2 } },
    { group: "edges", data: { id: "1-3", source: "1", target: "3", weight: 1 } },
    { group: "edges", data: { id: "1-4", source: "1", target: "4", weight: 5 } },
    { group: "edges", data: { id: "2-3", source: "2", target: "3", weight: 2 } },
    { group: "edges", data: { id: "3-5", source: "3", target: "5", weight: 1 } },
    { group: "edges", data: { id: "4-5", source: "5", target: "4", weight: 1 } },
    { group: "edges", data: { id: "4-6", source: "4", target: "6", weight: 5 } },
    { group: "edges", data: { id: "5-6", source: "5", target: "6", weight: 2 } },
    { group: "edges", data: { id: "2-4", source: "2", target: "4", weight: 3 } },
    { group: "edges", data: { id: "3-4", source: "3", target: "4", weight: 3 } },
];

// Init cytoscape
var cy = cytoscape({
    container: document.getElementById("cy"),
    // Merge node and edge list
    elements: defaultGraph,
    layout: {
        name: "avsdf",
        nodeSeparation: 400,
        fit: true,
        padding: 150,
    },
    data: {
        "start": "1",
        "end": "6"
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
                    if (labels) {
                        return labels.join("\n")
                    } else {
                        return ""
                    }
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

cy.on("layoutstop", () => {
    relabel()
})

let nodeMsg = `CONNECT NODE: Enter ID of target node
DELETE NODE: enter "x"
SET AS START NODE: enter "start"
SET AS END NODE: enter "end"`

let edgeMsg = `SET WEIGHT: Enter weight
DELETE EDGE: enter "x"`

// Customization, add on tap
cy.on("tap", function (event) {
    if (event.target === cy) { // Tap on the empty canvas to add a new node
        let id = 0
        cy.nodes().forEach(n => id = Math.max(id, parseInt(n.id())))
        id += 1

        cy.add({
            data: { id: id, ip: randomIP() },
            position: { x: event.position.x, y: event.position.y },
        });
        relabel()
    } else if (event.target.isNode()) { // Tap on a node to add a new edge
        var source = event.target.id();
        var target = prompt(nodeMsg)
        if (target === null) {
            return
        } else if (target === "x") {
            event.target.remove()
        } else if (target === "start") {
            cy.data("start", event.target.id())
            relabel()
            return
        } else if (target === "end") {
            cy.data("end", event.target.id())
            relabel()
            return
        } 
        if (target) { // If the user enters a target node and weight, add the new edge to the graph
            cy.add({
                data: {
                    group: "edges",
                    id: edgeId(source, target),
                    source: source,
                    target: target,
                    weight: 1,
                },
            });
        }
        return
    } else if (event.target.isEdge()) {
        let weight = prompt(edgeMsg)
        if (weight === "x") {
            event.target.remove()
            return
        }

        event.target.data("weight", parseInt(weight))
    }
});

function onDefault() {
    cy.elements().remove()
    cy.add(defaultGraph)
    rerender()
}

function onClear() {
    cy.elements().remove()
    rerender()
}

// Remove selected edges/nodes listener (click)
function onRemove () {
    // Remove selected button removes every selected node/edge
    var selectedNodes = cy.$("node:selected");
    var selectedEdges = cy.$("edge:selected");
    selectedNodes.remove();
    selectedEdges.remove();
};

function onRandomize() {
    cy.elements().remove()

    // Randomize a layout with nodes and edges (connected graph)
    var numNodes = Math.floor(Math.random() * 7) + 4; // Random nodeNum between [4, 10]

    // Generate nodes
    for (var i = 1; i <= numNodes; i++) {
        let ip = randomIP()
        cy.add({
            group: "nodes",
            data: { id: i.toString(), ip: ip},
        });
    }

    // Generate edges
    for (var i = 1; i <= numNodes - 1; i++) {
        var source = i;
        var target = i + 1;
        var weight = Math.floor(Math.random() * 20) + 1; // Random weight between [1, 20]
        cy.add({
            group: "edges",
            data: {
                id: edgeId(source.toString(), target.toString()),
                source: source.toString(),
                target: target.toString(),
                weight: weight,
            },
        });
    }

    var weight = Math.floor(Math.random() * 20) + 1; // Random weight between [1, 20]
    // Connect to first
    cy.add({
        group: "edges",
        data: {
            id: edgeId(numNodes.toString(), "1"),
            source: numNodes.toString(),
            target: "1",
            weight: weight,
        },
    });

    // Select random nodes to add random edges to
    for (let i = 1; i <= (numNodes - 1) * 2; i++) {
        let source = Math.floor(Math.random() * numNodes) + 1; // Select random node
        let target = Math.floor(Math.random() * numNodes) + 1; // Select random node
        let weight = Math.floor(Math.random() * 20) + 1; // Random weight between [1, 20]
        let id = edgeId(source.toString(), target.toString())

        if (!(source === target) && cy.getElementById(id).length === 0) {
            cy.add({
                group: "edges",
                data: {
                    id: id,
                    source: source.toString(),
                    target: target.toString(),
                    weight: weight,
                },
            });
        }
    }

    rerender()
};

// HELPERS

function clearAlgo() {
    cy.nodes().removeData("dv")
    cy.elements().removeStyle()
    relabel()
}

// Generate a random IP for a given node
function randomIP() {
    let n = () => Math.floor(Math.random() * 255)
    return `${n()+1}.${n()}.${n()}.${n()}`
}

function updateLabel(node) {
    node.forEach(n => {
        let labels = []
        if (n.id() === cy.data("start")) {
            labels.push(`START`)
        }

        if (n.id() === cy.data("end")) {
            labels.push(`END`)
        }

        labels.push(`IP: ${n.data("ip")}`)
        labels.push(`ID: ${n.id()}`)

        if (n.data("dv")) {
            labels.push(`Distance Vector:`)
            labels.push(`(dest, dist, hop)`)
            labels.push(...Object.entries(n.data("dv")).map(([dest, [dist, hop]]) => `${dest}, ${dist}, ${hop}`))
        }

        n.data("labels", labels)
    })
}

function rerender() {
    cy.layout({
        name: "avsdf",
        nodeSeparation: 400,
        fit: true,
        padding: 150,
    }).run()
}

function relabel() {
    updateLabel(cy.nodes())
}

function edgeId(node1, node2) {
    if (parseInt(node1) < parseInt(node2)) {
        return `${node1}-${node2}`
    }
    return `${node2}-${node1}`
}

