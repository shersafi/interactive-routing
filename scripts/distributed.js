
cy.nodes().on("dvUpdate", dvUpdate)

function dvStart(cy) {
    dvShare(cy)
}

function dvShare(cy) {
    cy.nodes().forEach(node => {
        let dv = node.data("dv") ?? {}
        node.connectedEdges().forEach(edge => {
            dv[otherNode(node, edge).id()] = edge.data("weight")
        })
        dv[node.id()] = 0
        node.data("dv", dv)
    })

    cy.nodes().forEach(node => {
        node.connectedEdges().forEach(edge => {
            let node2 = otherNode(node, edge)

            node2.emit("dvUpdate", [node.id(), node.data("dv")])


            // setTimeout(
            //     (n, id, dv) => n.emit("dvUpdate", [id, dv]),
            //     edge.data("weight") * 100,
            //     node2, node.id(), node.data("dv")
            // )
        })
    })
}

function otherNode(node, edge) {
    if (edge.target().id() == node.id()) {
        return edge.source()
    }
    return edge.target()
}

function dvUpdate({target: to}, newId, newDv) {
    console.log("dvUpdate", to.data("id"), newId, to.data("dv"), newDv)

    let selfDv = to.data("dv")
    let updated = false

    let a = selfDv[newId]

    for (const nodeId in newDv) {
        let newValue = a + (newDv[nodeId] ?? Infinity)
        let oldValue = (selfDv[nodeId] ?? Infinity)

        if (newValue < oldValue) {
            console.log(newValue, "<", oldValue, "for key", nodeId)
            selfDv[nodeId] = newValue
            updated = true
        }
    }

    to.data("dv", selfDv)
    updateLabel(to)

    if (updated) {
        console.log("doing this for some reason????")
        to.connectedEdges().forEach(edge => {
            let node2 = otherNode(to, edge)

            node2.emit("dvUpdate", [to.id(), to.data("dv")])

            // setTimeout(
            //     (n, id, dv) => n.emit("dvUpdate", [id, dv]),
            //     edge.data("weight") * 100,
            //     node2, to.id(), to.data("dv")
            // )
        })
    }
    
}

function updateLabel(node) {
    node.data("labels", [`id: ${node.id()}`].concat(Object.entries(node.data("dv")).map(([k, v]) => `${k}: ${v}`)) )
}
