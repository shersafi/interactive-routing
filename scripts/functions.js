function createGraph() {
  var numNodes = parseInt(document.getElementById("numNodes").value);
  var edgeWeightsStr = document.getElementById("edgeWeights").value;
  var edgeWeights = edgeWeightsStr.split(",");
  var numEdges = edgeWeights.length;

  var cy = cytoscape({
    container: document.getElementById("cy"),
    elements: {
      nodes: initNodes(numNodes),
      edges: initEdges(numEdges, edgeWeights),
    },
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
      //   {
      //       selector: 'edge#ab',
      //       style: {
      //           'line-color': 'red',
      //       }
      //   },
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
}

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

function initEdges(numEdges, edgeWeights) {
  let edges = [];
  let edgeIndex = 1;

  for (var i = 1; i <= numEdges; i++) {
    let sourceNodeIndex = i;
    let targetNodeIndex = (i % numEdges) + 1;
    var weight = parseInt(edgeWeights[i - 1]);

    edges.push({
      data: {
        id: "e" + edgeIndex,
        source: "n" + sourceNodeIndex,
        target: "n" + targetNodeIndex,
        weight: weight,
      },
    });

    edgeIndex++;
  }

  return edges;
}

function initNodes(numNodes) {
  let nodes = [];

  for (var i = 1; i <= numNodes; i++) {
    nodes.push({ data: { id: "n" + i, label: randomIP() } });
  }

  return nodes;
}
