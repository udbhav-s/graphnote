import { Options } from "vis-network/standalone";

export default {
  edges: {
    length: 40,
    font: {
      size: 8
    }
  },
  nodes: {
    size: 15,
    font: {
      size: 8
    }
  },
  physics: {
    enabled: true,
    barnesHut: {
      gravitationalConstant: -4000
    },
    stabilization: {
      enabled: true,
      updateInterval: 25
    },
    repulsion: {
      springConstant: 1,
    }
  },
  layout: {
    improvedLayout: true
  }
} as Options;
