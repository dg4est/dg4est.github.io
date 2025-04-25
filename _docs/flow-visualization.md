---
title: flow-visualization
layout: docs
permalink: /docs/flow-visualization/
---

## Embedded STL Viewer

Below is a single STL model you can rotate, zoom and pan.

<div id="stl-demo"></div>

---

## Fluid Simulation (59 STL Frames)

Below is a looping series of STL frames.  
Dataset: [3D STL Human Airways on Figshare](https://figshare.com/articles/dataset/3D_STL_models_of_Human_Airways_for_CFD_and_CFPD_simulations_/24787773)

<div id="fluid-demo"></div>

{% comment %}
------------------------------------------------------------------------

Everything below can live in a layout include so every page doesn’t need
to repeat it; it’s inlined here for completeness
------------------------------------------------------------------------

{% endcomment %}

<!-- Dependencies -->
<script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
<script src="{{ '/assets/js/stl-viewer.js'       | relative_url }}"></script>
<script src="{{ '/assets/js/fluidsimviewer.js'  | relative_url }}"></script>

<!-- Interface for simpler implimentation of the above dependencies -->
<script src="{{ '/assets/js/flow-visualization.js' | relative_url }}"></script>

<!-- Page-specific initialisation -->
<script>
  /* Single-model viewer */
  FlowVisualization.staticViewer(
    'stl-demo',
    '{{ "/assets/models/example.stl" | relative_url }}',
    { color: 0xfacc15, cameraZ: 150 }
  );

  /* 59-frame fluid simulation */
  FlowVisualization.fluidViewer(
    'fluid-demo',
    '{{ "/assets/models/airways/outlet" | relative_url }}', // prefix
    59,                                                    // frame count
    { color: 0x1caaff, cameraZ: 120, frameDelay: 200 }
  );
</script>
