
function onCalculateDvs() {
    clearAlgo()
    dvStart()
}

function dvStart() {
    cy.nodes().removeListener("dvUpdate", dvUpdate)
    cy.nodes().on("dvUpdate", dvUpdate)
    dvShare(cy)
}

function dvShare(cy) {
    cy.nodes().forEach(node => {
        let dv = node.data("dv") ?? {}
        node.connectedEdges().forEach(edge => {
            let node2 = otherNode(node, edge).id()
            dv[node2] = [edge.data("weight"), node2]
        })
        dv[node.id()] = [0, node.id()]
        node.data("dv", dv)
        updateLabel(node)
        animateUpdate(node)
    })

    cy.nodes().forEach(node => {
        node.connectedEdges().forEach(edge => {
            let node2 = otherNode(node, edge)

            setTimeout(
                (n, id, dv) => n.emit("dvUpdate", [id, dv]),
                Math.min(1000, edge.data("weight") * 300),
                node2, node.id(), node.data("dv")
            )
        })
    })
}

function otherNode(node, edge) {
    if (edge.target().id() == node.id()) {
        return edge.source()
    }
    return edge.target()
}

function dvUpdate({ target: node }, neighborId, neighborDv) {
    //console.log("dvUpdate", node.data("id"), neighborId, node.data("dv"), neighborDv)

    let dv = node.data("dv")
    let updated = false

    for (const nodeId in neighborDv) {
        let oldValue = (dv[nodeId] ?? [Infinity])[0]
        let newValue = dv[neighborId][0] + (neighborDv[nodeId] ?? [Infinity])[0]

        if (newValue < oldValue) {
            dv[nodeId] = [newValue, neighborId]
            updated = true
        }
    }

    if (updated) {
        node.data("dv", dv)
        updateLabel(node)
        animateUpdate(node)

        node.connectedEdges().forEach(edge => {
            let node2 = otherNode(node, edge)

            setTimeout(
                (n, id, dv) => n.emit("dvUpdate", [id, dv]),
                Math.min(1000, edge.data("weight") * 300),
                node2, node.id(), node.data("dv")
            )
        })
    }

}

function animateUpdate(node) {
    node.animate({
        style: { "background-color": "red" }
    }, {
        duration: 100,
        complete: function () {
            node.style("background-color", "white")
        },
        queue: false
    })
}

function onRouteDvs() {
    let start = cy.data("start")
    let end = cy.data("end")
    if (cy.getElementById(start).length  === 0) {
        alert(`No start node specified. Click a node and enter "start"`)
        return
    }
    if (cy.getElementById(end).length === 0) {
        alert(`No end node specified. Click a node and enter "end"`)
        return
    }

    cy.elements().removeStyle()
    relabel()

    dvRoute(cy, start, end)
}

function dvRoute(cy, start, end) {
    let node = cy.getElementById(start)
    if (node.length === 0) {
        alert(`Node ${start} does not exist`)
        return
    }

    node.style("background-color", "green")

    if (start === end) {
        let labels = node.data("labels")
        labels.push(``)
        labels.push(`Reached end!`)
        node.data("labels", labels)
        return
    }

    dv = node.data("dv") || {}
    if (dv[end]) {
        [dist, hop] = dv[end]
        let labels = node.data("labels")
        labels.push(``)
        labels.push(`Destination: ${end}`)
        labels.push(`Distance: ${dist}`)
        labels.push(`Hop node: ${hop}`)
        node.data("labels", labels)

        setTimeout(() => {
            let edge = cy.getElementById(edgeId(start, hop))
            edge.style("line-color", "green")
            edge.style("width", 8)
            dvRoute(cy, hop, end)
        }, 1000)
        return
    } else {
        alert(`Node ${end} is not connected`)
        return
    }
}
