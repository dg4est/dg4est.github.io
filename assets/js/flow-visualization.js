/******************************************************************************************
 * assets/js/flow-visualization.js
 * ----------------------------------------------------------------------------------------
 * Public class FlowVisualization
 *
 *     FlowVisualization.staticViewer( target , stlURL , opts? )
 *     FlowVisualization.fluidViewer ( target , base   , n , opts? )
 *
 * …where *target* is either a DOM element or its id-string.
 *
 * Responsibilities
 * ─────────────────
 *  • Creates a 500-pixel-tall `<div>` for every viewer (so you never write raw HTML).
 *  • Adds an optional “▶ / ⏸” overlay for the animated viewer.
 *  • Shows a tiny, fixed-orientation axes helper (gizmo) in the top-right corner.
 *  • Delegates the heavy lifting to:
 *        window.STLViewer        – single model
 *        window.FluidSimViewer   – frame sequence
 *
 * NOTE – each viewer’s render loop does     window._fvCam = camera;
 *        The gizmo reads that variable to orient its world axes once per frame.
 ******************************************************************************************/
(function () {

  class FlowVisualization {

    /* ░░░░░░░░░░░░░░░░░░   PRIVATE HELPERS   ░░░░░░░░░░░░░░░░░░ */

    /* simple uid generator so multiple viewers never clash on id attributes */
    static #ctr = 0;
    static #uid(prefix = 'fv') { return `${prefix}-${++this.#ctr}`; }

    /** id-string ↔ HTMLElement lookup (throws if not found) */
    static #el(x) {
      const el = typeof x === 'string' ? document.getElementById(x) : x;
      if (!el) throw Error(`FlowVisualization: mount '${x}' not found`);
      return el;
    }

    /** returns a ready-styled DIV that will host a WebGL canvas            */
    static #viewerBox(id) {
      const div = document.createElement('div');
      div.id = id;
      Object.assign(div.style, {
        position  : 'relative',
        width     : '100%',
        height    : '500px',
        border    : '1px solid #444',
        background: '#121212',
        overflow  : 'hidden'
      });
      return div;
    }

    /** top-centre banner used for “Loading … / Failed …” messages          */
    static #banner(text, color) {
      const b = document.createElement('div');
      b.textContent = text;
      Object.assign(b.style, {
        position      : 'absolute',
        inset         : '0 0 auto 0',  /* stretch across the top */
        textAlign     : 'center',
        padding       : '.5rem',
        color,
        pointerEvents : 'none'
      });
      return b;
    }

    /** returns a small PLAY + PAUSE button cluster (upper-right overlay)   */
    static #overlayButtons() {
      const wrap = document.createElement('div');
      Object.assign(wrap.style, {
        position : 'absolute',
        top      : '.5rem',
        right    : '.5rem',
        display  : 'flex',
        gap      : '.4rem',
        zIndex   : 2        /* ensured above WebGL canvas                  */
      });
      const makeBtn = (txt, cls) => {
        const b = document.createElement('button');
        b.textContent = txt;
        b.className   = `btn btn-sm ${cls}`;
        return b;
      };
      const play  = makeBtn('▶', 'btn-success');
      const pause = makeBtn('⏸', 'btn-danger');
      wrap.append(play, pause);
      return Object.assign(wrap, { play, pause });
    }

    /* ░░░░░░░░░░░░░░░░░░   PUBLIC API   ░░░░░░░░░░░░░░░░░░ */

    /**
     * View a single STL file.
     * @param target  HTMLElement or id
     * @param url     path to a `.stl`
     * @param opts    forwarded to STLViewer
     */
    static staticViewer(target, url, opts = {}) {
      const host = this.#el(target);
      const id   = this.#uid('stl');
      host.appendChild(this.#viewerBox(id));   // create container
      this.#addAxesOverlay(host.lastChild);    // gizmo inside same box
      window.STLViewer?.(id, url, opts);       // fire up actual viewer
    }

    /**
     * View N STL frames as an animation (e.g. CFD results).
     * @param target
     * @param basePath   prefix (before the numeric index)
     * @param n          last index → files are basePath1.stl … basePathN.stl
     * @param opts       forwarded to FluidSimViewer
     */
    static fluidViewer(target, basePath, n = 1, opts = {}) {
      const host = this.#el(target);
      const id   = this.#uid('fluid');
      const box  = this.#viewerBox(id);
      host.appendChild(box);

      /* banner while the frames stream in -------------------------- */
      const loading = this.#banner('Loading frames…', '#facc15');
      box.appendChild(loading);

      /* play / pause overlay --------------------------------------- */
      const ctrl = this.#overlayButtons();
      box.appendChild(ctrl);

      /* static axes helper ----------------------------------------- */
      this.#addAxesOverlay(box);

      /* build array of absolute urls  ------------------------------ */
      const frames = Array.from({ length: n }, (_, i) => `${basePath}${i + 1}.stl`);
      console.log('[FlowVisualization] STL frames:', frames);

      /* wire buttons ONLY after FluidSimViewer attaches playFluid()  */
      ctrl.play.onclick  = () => window.playFluid?.();
      ctrl.pause.onclick = () => window.pauseFluid?.();

      /* delegate real work; tidy banner depending on outcome         */
      try {
        window.FluidSimViewer?.(id, frames, opts);
        loading.remove();                     // success
      } catch (err) {
        loading.textContent = 'Failed to load simulation frames';
        loading.style.color = '#f87171';
        console.error('[FlowVisualization] error:', err);
      }
    }

    /* ░░░░░░░░░░░░░░░░░░   AXES OVERLAY   ░░░░░░░░░░░░░░░░░░ */

    /**
     * Adds a 100×100-px overlay canvas which renders an AxesHelper.
     * The helper camera NEVER copies the scene camera (so the widget
     * stays in a stable 2-D orientation, like CAD view-cubes).
     */
    /* ─── orbit gizmo: fixed 2-D position, but matches scene rotation ─── */
    static #addAxesOverlay(parent) {
      const W = 100, H = 100;

      /* 1 – overlay canvas -------------------------------------------- */
      const canvas = document.createElement('canvas');
      Object.assign(canvas.style, {
        position      : 'absolute',
        width         : `${W}px`,
        height        : `${H}px`,
        inset         : '.5rem .5rem auto auto',  // top-right
        zIndex        : 1,                        // above WebGL canvas
        pointerEvents : 'none'
      });
      parent.appendChild(canvas);

      /* 2 – tiny Three.js pipeline ------------------------------------ */
      const THREE     = window.THREE;
      const renderer  = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
      renderer.setSize(W, H);

      const scene     = new THREE.Scene();
      const gizmoCam  = new THREE.PerspectiveCamera(50, W / H, 0.1, 10);
      gizmoCam.position.set(1.2, 1.2, 1.2);      // view cube look
      gizmoCam.lookAt(0, 0, 0);

      /* AxesHelper whose orientation we’ll keep updating */
      scene.add(new THREE.AxesHelper(0.8));

      /* 3 – animation loop: copy orientation, render gizmo ----------- */
      (function renderGizmo() {
        requestAnimationFrame(renderGizmo);

        /* main viewers set window._fvCam = their camera each frame */
        if (window._fvCam) {
          gizmoCam.quaternion.copy(window._fvCam.quaternion);
        }

        renderer.render(scene, gizmoCam);
      })();
    }
  }

  /* Global export -------------------------------------------------- */
  window.FlowVisualization = FlowVisualization;
})();
