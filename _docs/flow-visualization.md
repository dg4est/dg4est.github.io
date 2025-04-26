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

<!-- 1️⃣ Three core + helper modules -->
<script type="module" src="{{ '/assets/js/init-three-global.js' | relative_url }}"></script>

<!-- 2️⃣ Viewer implementations (ES-modules) -->
<script type="module" src="{{ '/assets/js/stl-viewer.js'      | relative_url }}"></script>
<script type="module" src="{{ '/assets/js/fluidsimviewer.js'  | relative_url }}"></script>

<!-- 3️⃣ Wrapper that provides FlowVisualization (plain script) -->
<script src="{{ '/assets/js/flow-visualization.js' | relative_url }}"></script>

<!-- 4️⃣ Bootstrap: two separate listeners for clarity -->
<script>
  /* Single STL model */
  document.addEventListener('three-ready', () => {
    FlowVisualization.staticViewer(
      'stl-demo',
      {{ '/assets/models/example.stl' | relative_url | jsonify }},
      { color: 0xfacc15, cameraZ: 150 }
    );
  });

  /* 59-frame fluid simulation */
  document.addEventListener('three-ready', () => {
    FlowVisualization.fluidViewer(
      'fluid-demo',
      {{ '/assets/models/airways/outlet' | relative_url | jsonify }},
      59,
      { color: 0x1caaff, cameraZ: 120, frameDelay: 200 }
    );
  });
</script>
