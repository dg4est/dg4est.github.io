---
title: flow-visualization
layout: docs
permalink: /docs/flow-visualization/
---

## Embedded STL Viewer  
<div id="stl-demo" style="height:500px;"></div>

---

## Fluid Simulation (59 STL Frames)  
<div id="fluid-demo" style="height:500px;"></div>

<!-- 1) Three core + helpers -->
<script type="module" src="{{ '/assets/js/init-three-global.js' | relative_url }}"></script>

<!-- 2) Viewer implementations -->
<script type="module" src="{{ '/assets/js/stl-viewer.js' | relative_url }}"></script>
<script type="module" src="{{ '/assets/js/fluidsimviewer.js' | relative_url }}"></script>

<!-- 3) Wrapper that exposes FlowVisualization -->
<script src="{{ '/assets/js/flow-visualization.js' | relative_url }}"></script>

<!-- 4) Bootstrap AFTER "three-ready" event -->
<script>
  document.addEventListener('three-ready', () => {
    /* single STL */
    FlowVisualization.staticViewer(
      'stl-demo',
      {{ '/assets/models/example.stl' | relative_url | jsonify }},
      { color: 0xfacc15, cameraZ: 150 }
    );

    /* 59-frame simulation */
    FlowVisualization.fluidViewer(
      'fluid-demo',
      {{ '/assets/models/airways/outlet' | relative_url | jsonify }},
      59,
      { color: 0x1caaff, cameraZ: 120, frameDelay: 200 }
    );
  });
</script>
