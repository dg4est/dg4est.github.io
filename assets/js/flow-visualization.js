/******************************************************************************************
 * assets/js/flow-visualization.js
 * ----------------------------------------------------------------------------------------
 * High-level wrapper that lets any page create:
 *
 *     • a SINGLE-model viewer      →  FlowVisualization.staticViewer()
 *     • a MULTI-frame animation    →  FlowVisualization.fluidViewer()
 *
 * Extras added automatically:
 *     ◦ 500-px-tall dark viewer box (no inline HTML required)
 *     ◦ Play ⏵ / Pause ⏸ overlay (for the animation viewer)
 *     ◦ A tiny axes “gizmo” fixed in the top-right corner that rotates
 *       with the active camera but never moves on screen.
 *
 * The heavy lifting is delegated to:
 *     window.STLViewer        (single model)
 *     window.FluidSimViewer   (frame sequence)
 *
 * Each viewer must, in its own render loop, set:
 *     window._fvCam = camera;
 * The gizmo reads that variable every frame to copy the orientation.
 ******************************************************************************************/
(function () {

  /**************************************************************************
   *  Small utility helpers (private)                                       *
   **************************************************************************/

  /* ——— unique-id generator ——— */
  let idCounter = 0;
  function uid(prefix = 'fv') { return `${prefix}-${++idCounter}`; }

  /* ——— resolve => HTMLElement ——— */
  function asElement(x) {
    const el = (typeof x === 'string') ? document.getElementById(x) : x;
    if (!el) throw Error(`FlowVisualization: mount “${x}” not found`);
    return el;
  }

  /* ——— styled 500-px viewer box ——— */
  function makeViewerBox(id) {
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

  /* ——— centred status banner ——— */
  function makeBanner(text, color) {
    const b = document.createElement('div');
    b.textContent = text;
    Object.assign(b.style, {
      position     : 'absolute',
      inset        : '0 0 auto 0',
      textAlign    : 'center',
      padding      : '.5rem',
      color,
      pointerEvents: 'none'
    });
    return b;
  }

  /* ——— Play / Pause overlay ——— */
  function makePlayPause() {
    const wrap = document.createElement('div');
    Object.assign(wrap.style, {
      position : 'absolute',
      top      : '.5rem',
      right    : '.5rem',
      display  : 'flex',
      gap      : '.4rem',
      zIndex   : 2
    });

    const mk = (txt, cls) => {
      const btn = document.createElement('button');
      btn.textContent = txt;
      btn.className   = `btn btn-sm ${cls}`;
      return btn;
    };

    const play  = mk('▶', 'btn-success');
    const pause = mk('⏸', 'btn-danger');
    wrap.append(play, pause);
    return Object.assign(wrap, { play, pause });
  }

  /**************************************************************************
   *                        PUBLIC   API                                    *
   **************************************************************************/
  class FlowVisualization {

    /**
     * Show ONE STL file.
     */
    static staticViewer(target, stlURL, opts = {}) {
      const host = asElement(target);
      const boxId = uid('stl');
      const box   = makeViewerBox(boxId);
      host.appendChild(box);

      addGizmo(box);                      // axes helper
      window.STLViewer?.(boxId, stlURL, opts);
    }

    /**
     * Show an ANIMATED sequence of STL frames.
     */
    static fluidViewer(target, basePath, frameCount = 1, opts = {}) {
      const host = asElement(target);
      const boxId = uid('fluid');
      const box   = makeViewerBox(boxId);
      host.appendChild(box);

      /* loading banner -------------------------------------------------- */
      const banner = makeBanner('Loading frames…', '#facc15');
      box.appendChild(banner);

      /* play / pause overlay ------------------------------------------- */
      const buttons = makePlayPause();
      box.appendChild(buttons);

      /* axes helper ----------------------------------------------------- */
      addGizmo(box);

      /* build full list of frame URLs ---------------------------------- */
      const frames = Array.from({ length: frameCount },
                                (_, i) => `${basePath}${i + 1}.stl`);
      console.log('[FlowVisualization] frames →', frames);

      /* wire buttons AFTER viewer installs global handlers ------------- */
      buttons.play.onclick  = () => window.playFluid ?.();
      buttons.pause.onclick = () => window.pauseFluid?.();

      /* start the heavy viewer ----------------------------------------- */
      try {
        window.FluidSimViewer?.(boxId, frames, opts);
        banner.remove();                      // success
      } catch (err) {
        banner.textContent = 'Failed to load simulation frames';
        banner.style.color = '#f87171';
        console.error('[FlowVisualization] error:', err);
      }
    }
  }

  /**************************************************************************
   *                 AXES G I Z M O  (overlay)                             *
   **************************************************************************/
  function addGizmo(parent) {
    const W = 100, H = 100;

    /* overlay canvas (never moves) */
    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, {
      position      : 'absolute',
      width         : `${W}px`,
      height        : `${H}px`,
      inset         : '.5rem .5rem auto auto',   // top-right
      zIndex        : 1,
      pointerEvents : 'none'
    });
    parent.appendChild(canvas);

    /* tiny Three.js pipeline */
    const THREE     = window.THREE;
    const renderer  = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
    renderer.setSize(W, H);

    const scene     = new THREE.Scene();
    const gizmoCam  = new THREE.PerspectiveCamera(50, W / H, 0.1, 10);
    gizmoCam.position.set(1.2, 1.2, 1.2);
    gizmoCam.lookAt(0, 0, 0);
    scene.add(new THREE.AxesHelper(0.8));

    /* RAF loop: copy quaternion from the active viewer camera */
    (function renderGizmo() {
      requestAnimationFrame(renderGizmo);

      if (window._fvCam) {
        gizmoCam.quaternion.copy(window._fvCam.quaternion);
      }
      renderer.render(scene, gizmoCam);
    })();
  }

  /* expose globally so Markdown can call  FlowVisualization.*           */
  window.FlowVisualization = FlowVisualization;

})();
