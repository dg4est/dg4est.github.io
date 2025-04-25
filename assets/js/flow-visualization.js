/**
 * flow-visualization.js
 * ------------------------------------------------------------
 * Helper for rendering single STL models or looping STL “frames”
 * (e.g. CFD simulation) inside a page without inline HTML/JS.
 *
 * Dependencies (include before this script):
 *   <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
 *   <script src="/path/to/STLViewer.js"></script>      // must expose window.STLViewer
 *   <script src="/path/to/FluidSimViewer.js"></script> // must expose window.FluidSimViewer + play/pause methods
 *
 * Public API:
 *   FlowVisualization.staticViewer(target, modelUrl, options)
 *   FlowVisualization.fluidViewer(target, basePath, frameCount, options)
 *
 *   • target        – HTMLElement | string (id of mount point)
 *   • modelUrl      – string – `.stl` file for single model
 *   • basePath      – string – prefix path (e.g. '/assets/models/airways/outlet')
 *   • frameCount    – number  – last frame index (files are assumed 1 … frameCount)
 *   • options       – { color, cameraZ, frameDelay }
 *
 * Example:
 *   FlowVisualization.staticViewer('stl-example', '/assets/models/example.stl', { color: 0xfacc15 });
 *
 *   FlowVisualization.fluidViewer('fluid-demo', '/assets/models/airways/outlet', 59,
 *                                 { color: 0x1caaff, frameDelay: 200 });
 * ------------------------------------------------------------
 */
(function () {
  class FlowVisualization {
    /* -------------------------------------------------- */
    /*          PRIVATE STATIC STATE &  UTILITIES         */
    /* -------------------------------------------------- */
    /**
     * Monotonic counter used to mint unique element IDs.
     * Declared as a *private static* field so TypeScript (and
     * modern browsers) know it exists — this fixes the
     * “Private field '#counter' must be declared” error.
     */
    static #counter = 0;

    /** Return a unique id in the form `${prefix}-N`. */
    static #uniqueId(prefix = "fv") {
      return `${prefix}-${++FlowVisualization.#counter}`;
    }

    /** Resolve a string id → HTMLElement, or return the element passed */
    static #resolveTarget(t) {
      const el = typeof t === "string" ? document.getElementById(t) : t;
      if (!el) {
        throw new Error(`FlowVisualization: mount point "${t}" not found`);
      }
      return el;
    }

    /** Create a styled viewer container */
    static #makeViewerDiv(id) {
      const div = document.createElement("div");
      div.id = id;
      Object.assign(div.style, {
        width: "100%",
        height: "500px",
        border: "1px solid #444",
        backgroundColor: "#121212",
      });
      return div;
    }

    /** Create a status banner (hidden if `hidden=true`) */
    static #banner(msg, color, hidden = false) {
      const div = document.createElement("div");
      div.textContent = msg;
      Object.assign(div.style, {
        textAlign: "center",
        color,
        marginBottom: "1rem",
        display: hidden ? "none" : "block",
      });
      return div;
    }

    /** Convenience wrapper for play/pause buttons */
    static #makeControls() {
      const wrap = document.createElement("div");
      Object.assign(wrap.style, { textAlign: "center", marginTop: "1rem" });

      const play = document.createElement("button");
      play.textContent = "▶ Play";
      play.className = "btn btn-success me-2";

      const pause = document.createElement("button");
      pause.textContent = "⏸ Pause";
      pause.className = "btn btn-danger";

      wrap.append(play, pause);
      return Object.assign(wrap, { play, pause });
    }

    /* -------------------------------------------------- */
    /*                    PUBLIC  API                     */
    /* -------------------------------------------------- */

    /**
     * Render a *single* STL model.
     * @param {HTMLElement|string} target  Mount point (id or element)
     * @param {string} modelUrl            STL file to load
     * @param {object} opts                Viewer options (color, cameraZ, …)
     */
    static staticViewer(target, modelUrl, opts = {}) {
      const mount = FlowVisualization.#resolveTarget(target);
      const viewerId = FlowVisualization.#uniqueId("stl");
      const viewerDiv = FlowVisualization.#makeViewerDiv(viewerId);
      mount.appendChild(viewerDiv);

      // Delegate to the existing viewer implementation
      window.STLViewer?.(viewerId, modelUrl, opts);
    }

    /**
     * Render a *sequence* of STL frames (e.g. CFD simulation).
     * @param {HTMLElement|string} target  Mount point (id or element)
     * @param {string} basePath            Path prefix before frame index
     * @param {number} frameCount          Number of frames (e.g. 59 → paths 1..59)
     * @param {object} opts                Viewer options (color, cameraZ, frameDelay)
     */
    static fluidViewer(target, basePath, frameCount = 1, opts = {}) {
      const mount = FlowVisualization.#resolveTarget(target);

      /* loading + error banners */
      const loading = FlowVisualization.#banner(
        "Loading simulation frames…",
        "#facc15"
      );
      const error = FlowVisualization.#banner(
        "Failed to load simulation frames. Please try again later.",
        "#f87171",
        true
      );
      mount.append(loading, error);

      /* main viewer div */
      const viewerId = FlowVisualization.#uniqueId("fluid");
      const viewerDiv = FlowVisualization.#makeViewerDiv(viewerId);
      mount.appendChild(viewerDiv);

      /* controls */
      const controls = FlowVisualization.#makeControls();
      mount.appendChild(controls);

      /* assemble frame URLs */
      const frames = Array.from({ length: frameCount }, (_v, i) => `${basePath}${
        i + 1
      }.stl`);
      console.log("[FlowVisualization] STL frames:", frames);

      /* wire buttons */
      controls.play.addEventListener("click", () => window.playFluid?.());
      controls.pause.addEventListener("click", () => window.pauseFluid?.());

      try {
        window.FluidSimViewer?.(viewerId, frames, opts);
        loading.remove();
      } catch (e) {
        console.error("[FlowVisualization] Fluid viewer error:", e);
        loading.remove();
        error.style.display = "block";
      }
    }
  }

  // Expose globally
  window.FlowVisualization = FlowVisualization;
})();
