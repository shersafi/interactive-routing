
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
                edge.data("weight") * 200,
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

            //node2.emit("dvUpdate", [to.id(), to.data("dv")])

            setTimeout(
                (n, id, dv) => n.emit("dvUpdate", [id, dv]),
                edge.data("weight") * 200,
                node2, node.id(), node.data("dv")
            )
        })
    }

}

function animateUpdate(node) {
    node.animate({
        style: { "background-color": "green" }
    }, {
        duration: 100,
        complete: function () {
            node.style("background-color", "white")
        },
        queue: false
    })
}

function bfRoute(cy, start, end) {
    let node = cy.getElementById(start)

    dv = node.data("dv") || {}
    if (dv[end]) {
        
    } else {
        alert(`Node ${end} is not connected`)
        return
    }
}

