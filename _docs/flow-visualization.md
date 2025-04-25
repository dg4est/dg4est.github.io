---
title: flow-visualization
layout: docs
permalink: /docs/flow-visualization/
---

## Embedded STL Viewer  
<div id="stl-demo"></div>

---

## Fluid Simulation (59 STL Frames)  
<div id="fluid-demo"></div>

{% raw %}
<!-- 1) Three.js & all controls & loaders -->
<script type="module" src="{{ '/assets/js/init-three-global.js' | relative_url }}"></script>

<!-- 2) Viewer modules -->
<script type="module" src="{{ '/assets/js/stl-viewer.js'      | relative_url }}"></script>
<script type="module" src="{{ '/assets/js/fluidsimviewer.js'  | relative_url }}"></script>

<!-- 3) FlowVisualization wrapper (IIFE) -->
<script src="{{ '/assets/js/flow-visualization.js' | relative_url }}"></script>

<!-- 4) Page-specific bootstrap -->
<script>
  FlowVisualization.staticViewer(
    'stl-demo',
    '{{ "/assets/models/example.stl" | relative_url }}',
    { color: 0xfacc15, cameraZ: 150 }
  );

  FlowVisualization.fluidViewer(
    'fluid-demo',
    '{{ "/assets/models/airways/outlet" | relative_url }}',
    59,
    { color: 0x1caaff, cameraZ: 120, frameDelay: 200 }
  );
</script>
{% endraw %}
