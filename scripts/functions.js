function randomIP() {
    var ip = (Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255));
    return ip;
}

var cy = cytoscape({
    container: document.getElementById('cy'),
    elements: [
      { data: { id: 'a', label: randomIP() } },
      { data: { id: 'b', label: randomIP() } },
      { data: { id: 'c', label: randomIP() } },
      { data: { id: 'd', label: randomIP() } },
      { data: { id: 'e', label: randomIP() } },
      { data: { id: 'ab', source: 'a', target: 'b', weight: 3 }},
      { data: { id: 'bc', source: 'b', target: 'c', weight: 7  }},
      { data: { id: 'cd', source: 'c', target: 'e', weight: 1  }},
      { data: { id: 'de', source: 'd', target: 'e', weight: 10  }},
      { data: { id: 'ad', source: 'a', target: 'd', weight: 17  }},
      { data: { id: 'bd', source: 'b', target: 'd', weight: 13  }}
      ],
      style: [
          {
              selector: 'node',
              style: {
                  'background-image': 'images/web-server-icon.png',
                  'background-fit': 'cover',
                  'width': '50px',
                  'height': '50px',
                  'background-clip': 'node',
                  'shape': 'rectangle',
                  'background-opacity': 0,
                  'label': function(ele) {
                    return ele.data('label');
                  },
                  'text-margin-y': '-10px'
              }
          },
          {
              selector: 'edge#ab',
              style: {
                  'line-color': 'red',
              }
          },
          {
              selector: 'edge',
              style: {
                  'label': function(ele) {
                      return ele.data('weight');
                  },
                  'text-margin-y': '-20px'
                  
              }
          }
          
      ]
  });