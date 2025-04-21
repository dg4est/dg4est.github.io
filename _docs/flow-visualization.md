---
title: flow-visualization
layout: docs
permalink: /docs/flow-visualization/
---

# Embedded STL Viewer Example

Below is an embedded STL model rendered using Three.js. You can rotate, zoom, and pan using your mouse.

<div id="stl-viewer" style="width: 100%; height: 500px; border: 1px solid #444; background-color: #121212;"></div>

<script>
  window.STLViewer?.("stl-viewer", "{{ '/assets/models/example.stl' | relative_url }}", {
    color: 0xfacc15,
    cameraZ: 150
  });
</script>

---

# TESTING STL VIDEO with STL Frames

Below is an embedded model rendered using Three.js that loops through a series of 3D frames. You can rotate, zoom, and pan using your mouse.  
Dataset: [3D STL Human Airways on Figshare](https://figshare.com/articles/dataset/3D_STL_models_of_Human_Airways_for_CFD_and_CFPD_simulations_/24787773)

<div id="fluid-loading-message" style="text-align: center; color: #facc15; margin-bottom: 1rem;">
  Loading simulation frames...
</div>
<div id="fluid-error-message" style="display: none; text-align: center; color: #f87171; margin-bottom: 1rem;">
  Failed to load simulation frames. Please try again later.
</div>

<!-- Viewer container -->
<div id="fluid-viewer" style="width:100%; height:500px; border: 1px solid #444; background-color: #121212;"></div>

<!-- Play/Pause Buttons -->
<div style="text-align: center; margin-top: 1rem;">
  <button onclick="window.playFluid()" class="btn btn-success me-2">▶ Play</button>
  <button onclick="window.pauseFluid()" class="btn btn-danger">⏸ Pause</button>
</div>

<script>
  const basePath = "{{ '/assets/models/airways/outlet' | relative_url }}";
  const paths = [];
  for (let i = 1; i <= 59; i++) {
    paths.push(`${basePath}${i}.stl`);
  }
  console.log("Loaded STL paths:", paths);

  const loadingEl = document.getElementById("fluid-loading-message");
  const errorEl = document.getElementById("fluid-error-message");

  try {
    window.FluidSimViewer?.("fluid-viewer", paths, {
      color: 0x1caaff,
      cameraZ: 120,
      frameDelay: 200
    });
    loadingEl?.remove();
  } catch (err) {
    console.error("Error initializing fluid sim viewer:", err);
    loadingEl?.remove();
    errorEl.style.display = "block";
  }
</script>
