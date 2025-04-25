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

{% comment %}
  The four script blocks below MUST remain in this order:
  1) init-three-global (module)
  2) stl-viewer + fluidsimviewer (modules)
  3) flow-visualization.js (plain script)
  4) your page-specific calls
{% endcomment %}

<!-- 1) Three.js & all controls & loaders -->
<script type="module" src="{{ '/assets/js/init-three-global.js' | relative_url }}"></script>

<!-- 2) Your two ES-module viewers which attach themselves to window renderer -->
<script type="module" src="{{ '/assets/js/stl-viewer.js'      | relative_url }}"></script>
<script type="module" src="{{ '/assets/js/fluidsimviewer.js'  | relative_url }}"></script>

<!-- 3) The FlowVisualization wrapper (IIFE) -->
<script src="{{ '/assets/js/flow-visualization.js' | relative_url }}"></script>

<!-- 4) Page-specific bootstrap calls -->
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
