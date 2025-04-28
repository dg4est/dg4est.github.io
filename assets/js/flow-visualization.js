/* ------------------------------------------------------------------ */
/*  File: assets/js/flow-visualization.js                             */
/*  Exposes: window.FlowVisualization                                */
/* ------------------------------------------------------------------ */
(function () {
  class FlowVisualization {
    /* ---------- private utilities ---------- */
    static #ctr = 0;
    static #uid(p = 'fv') { return `${p}-${++this.#ctr}`; }
    static #el(idOrEl) {
      const el = typeof idOrEl === 'string' ? document.getElementById(idOrEl) : idOrEl;
      if (!el) throw Error(`FlowVisualization: mount “${idOrEl}” not found`);
      return el;
    }
    // Viewer Box Elements modular and resizable for config
    static #viewerBox(id) {
      const div = document.createElement('div');
      div.id = id;
      Object.assign(div.style, {
        position: 'relative',
        width: '100%',
        height: '500px',
        border: '1px solid #444',
        background: '#121212',
        overflow: 'hidden'
      });
      return div;
    }
    static #banner(txt, color) {
      const b = document.createElement('div');
      b.textContent = txt;
      Object.assign(b.style, {
        position: 'absolute',
        inset: '0 0 auto 0',
        textAlign: 'center',
        padding: '.5rem',
        background: 'transparent',
        color,
        pointerEvents: 'none'
      });
      return b;
    }
    static #overlayButtons() {
      const wrap = document.createElement('div');
      Object.assign(wrap.style, {
        position: 'absolute',
        top: '.5rem',
        right: '.5rem',
        display: 'flex',
        gap: '.4rem',
        zIndex: 2
      });
      // use the built in document and Play extenders
      const mk = (txt, cls) => {
        const btn = document.createElement('button');
        btn.textContent = txt;
        btn.className = `btn btn-sm ${cls}`;
        return btn;
      };
      const play  = mk('▶', 'btn-success');
      const pause = mk('⏸', 'btn-danger');
      wrap.append(play, pause);
      // buttons must be wrappable and or resizable for window size
      return Object.assign(wrap, { play, pause });
    }

    /* ---------- public API ---------- */

    static staticViewer(target, stlUrl, opts = {}) {
      const mount     = this.#el(target);
      const boxId     = this.#uid('stl');
      const box       = this.#viewerBox(boxId);
      mount.appendChild(box);

      this.#addAxesOverlay(box);            // NEW: orbit widget 
      window.STLViewer?.(boxId, stlUrl, opts);
    }

    static fluidViewer(target, base, n = 1, opts = {}) {
      const mount = this.#el(target);

      const boxId = this.#uid('fluid');
      const box   = this.#viewerBox(boxId);
      mount.appendChild(box);

      /* banner */
      const loading = this.#banner('Loading frames…', '#facc15');
      box.appendChild(loading);

      /* overlay play/pause */
      const ctrl = this.#overlayButtons();
      box.appendChild(ctrl);

      /* gizmo */
      this.#addAxesOverlay(box);            // NEW: orbit widget

      /* assemble frame URLs */
      const frames = Array.from({ length: n }, (_ ,i)=>`${base}${i+1}.stl`);
      console.log('[FlowVisualization] STL frames:', frames);

      /* wire buttons after viewer attaches its global fns */
      ctrl.play.onclick  = () => window.playFluid?.();
      ctrl.pause.onclick = () => window.pauseFluid?.();

      /* run the viewer */
      try {
        window.FluidSimViewer?.(boxId, frames, opts);
        loading.remove();
      } catch (err) {
        loading.textContent = 'Failed to load simulation frames';
        loading.style.color = '#f87171';
        console.error('[FlowVisualization] Fluid viewer error:', err);
      }
    }

    /* ---------- mini orbit-gizmo ---------- */
    // Inspired by CAD Interfaces
    static #addAxesOverlay(parent) {
      const w = 100, h = 100;
      const canvas = document.createElement('canvas');
      Object.assign(canvas.style, {
        position: 'absolute',
        width:  `${w}px`,
        height: `${h}px`,
        inset:  '.5rem .5rem auto auto',
        zIndex: 1,
        pointerEvents: 'none'
      });
      parent.appendChild(canvas);

      const THREE = window.THREE;
      const r     = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
      r.setSize(w, h);

      const s = new THREE.Scene();
      const c = new THREE.PerspectiveCamera(50, w/h, .1, 10);
      c.position.set(1.2,1.2,1.2);
      c.lookAt(0,0,0);
      s.add(new THREE.AxesHelper(.8));

      /* keep spinning for visual cue */
      (function spin() {
        requestAnimationFrame(spin);
        s.rotation.y += 0.01;
        r.render(s,c);
      })();
    }
  }

  window.FlowVisualization = FlowVisualization;
})();
