/***********************************************************************
 * assets/js/flow-visualization.js
 * ---------------------------------------------------------------------
 * Glue-layer that lets a page embed:
 *     • ONE static STL viewer           →  FlowVisualization.staticViewer()
 *     • ONE animated “fluid” sequence   →  FlowVisualization.fluidViewer()
 *
 * • It creates all HTML containers for you (no inline <div> needed).
 * • Adds Play / Pause buttons (upper-right) for the animation viewer.
 * • Adds a tiny axes-helper “gizmo” in the same corner of EVERY viewer.
 * • Relies on:
 *       window.STLViewer        (single-model implementation)
 *       window.FluidSimViewer   (multi-frame implementation)
 *
 * To keep the gizmo orientation in sync, each viewer’s render loop sets
 *   window._fvCam = camera                  (see stl-viewer.js etc.)
 *
 * The code below is intentionally framework-free; just plain DOM + Three.js.
 **********************************************************************/
(function () {

  class FlowVisualization {
    /* ===============================================================
     *                     PRIVATE  HELPERS
     * ============================================================= */

    /** monotonic id generator so we can mount multiple viewers safely */
    static #ctr = 0;
    static #uid(prefix = 'fv') { return `${prefix}-${++this.#ctr}`; }

    /** id string → HTMLElement OR return the element that was passed */
    static #el(target) {
      const el = typeof target === 'string' ? document.getElementById(target)
                                            : target;
      if (!el) throw Error(`FlowVisualization: mount '${target}' not found`);
      return el;
    }

    /** A self-contained <div> that will hold a renderer’s <canvas>   */
    static #viewerBox(id) {
      const div = document.createElement('div');
      div.id = id;
      Object.assign(div.style, {
        position  : 'relative',
        width     : '100%',
        height    : '500px',
        border    : '1px solid #444',
        background: '#121212',      // dark theme
        overflow  : 'hidden'
      });
      return div;
    }

    /** Text banner (e.g. “Loading …”) that floats at the very top    */
    static #banner(text, color) {
      const b = document.createElement('div');
      b.textContent = text;
      Object.assign(b.style, {
        position      : 'absolute',
        inset         : '0 0 auto 0',   // top-stretch
        textAlign     : 'center',
        padding       : '.5rem',
        color,
        pointerEvents : 'none'
      });
      return b;
    }

    /** Small Play / Pause overlay used by the animated viewer        */
    static #overlayButtons() {
      const box = document.createElement('div');
      Object.assign(box.style, {
        position : 'absolute',
        top      : '.5rem',
        right    : '.5rem',
        display  : 'flex',
        gap      : '.4rem',
        zIndex   : 2        // above renderer canvas
      });

      const makeBtn = (txt, cls) => {
        const b = document.createElement('button');
        b.textContent = txt;
        b.className   = `btn btn-sm ${cls}`;
        return b;
      };

      const play  = makeBtn('▶', 'btn-success');
      const pause = makeBtn('⏸', 'btn-danger');

      box.append(play, pause);
      return Object.assign(box, { play, pause });
    }

    /* ===============================================================
     *                     PUBLIC  API
     * ============================================================= */

    /**
     * Show one STL file.
     * @param {string|HTMLElement} target  element or id to mount into
     * @param {string}             url     path to .stl
     * @param {object}             opts    forwarded to STLViewer
     */
    static staticViewer(target, url, opts = {}) {
      const mount = this.#el(target);           // resolve HTMLElement
      const boxId = this.#uid('stl');           // unique id for this viewer
      const box   = this.#viewerBox(boxId);
      mount.appendChild(box);

      this.#addAxesOverlay(box);                // little corner gizmo
      window.STLViewer?.(boxId, url, opts);     // delegate real work
    }

    /**
     * Show a looping sequence of STL frames (e.g. CFD time-steps).
     * @param {string|HTMLElement} target
     * @param {string}             base    prefix before numeric index
     * @param {number}             n       how many frames (1 … n)
     * @param {object}             opts    forwarded to FluidSimViewer
     */
    static fluidViewer(target, base, n = 1, opts = {}) {
      const mount = this.#el(target);
      const boxId = this.#uid('fluid');
      const box   = this.#viewerBox(boxId);
      mount.appendChild(box);

      /* status banner while frames stream in ---------------------- */
      const loading = this.#banner('Loading frames…', '#facc15');
      box.appendChild(loading);

      /* Play / Pause controls ------------------------------------- */
      const ctrl = this.#overlayButtons();
      box.appendChild(ctrl);

      /* axes widget ----------------------------------------------- */
      this.#addAxesOverlay(box);

      /* Build absolute URLs: base + (1 … n) + ".stl" -------------- */
      const frames = Array.from({ length: n }, (_, i) => `${base}${i + 1}.stl`);
      console.log('[FlowVisualization] STL frames:', frames);

      /* Wire the buttons AFTER FluidSimViewer installs its globals  */
      ctrl.play.onclick  = () => window.playFluid?.();
      ctrl.pause.onclick = () => window.pauseFluid?.();

      /* Spin up the FluidSimViewer -------------------------------- */
      try {
        window.FluidSimViewer?.(boxId, frames, opts);
        loading.remove();                      // success
      } catch (err) {
        loading.textContent = 'Failed to load simulation frames';
        loading.style.color = '#f87171';
        console.error('[FlowVisualization] error:', err);
      }
    }

    /* ===============================================================
     *              AXES GIZMO  (top-right, follows camera)
     * ============================================================= */
    static #addAxesOverlay(parent) {
      const W = 100, H = 100;

      /* a second <canvas> layered above the main renderer ---------- */
      const canvas = document.createElement('canvas');
      Object.assign(canvas.style, {
        position       : 'absolute',
        width          : `${W}px`,
        height         : `${H}px`,
        inset          : '.5rem .5rem auto auto',  // top-right
        zIndex         : 1,
        pointerEvents  : 'none'
      });
      parent.appendChild(canvas);

      /* its own WebGL renderer + tiny scene ----------------------- */
      const THREE = window.THREE;
      const r     = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
      r.setSize(W, H);

      const scene = new THREE.Scene();
      const cam   = new THREE.PerspectiveCamera(50, W/H, .1, 10);
      cam.position.set(1.2, 1.2, 1.2);
      cam.lookAt(0, 0, 0);
      scene.add(new THREE.AxesHelper(0.8));

      /* animation loop: copy quaternion from whichever viewer set
         window._fvCam last, then render the helper                 */
      (function tick() {
        requestAnimationFrame(tick);
        if (window._fvCam) cam.quaternion.copy(window._fvCam.quaternion);
        r.render(scene, cam);
      })();
    }
  }

  /* expose the class globally so markdown can call it ------------- */
  window.FlowVisualization = FlowVisualization;
})();
