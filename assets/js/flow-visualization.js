/* ------------------------------------------------------------------ */
/*  File: assets/js/flow-visualization.js                             */
/*  Exposes:  window.FlowVisualization                               */
/* ------------------------------------------------------------------ */
(function () {
  class FlowVisualization {
    /* ──────────────── private helpers ──────────────── */

    /* simple uid generator so every viewer div is unique               */
    static #ctr = 0;
    static #uid(prefix = 'fv') { return `${prefix}-${++this.#ctr}`; }

    /* id-string ↔ HTMLElement convenience                               */
    static #el(idOrEl) {
      const el = typeof idOrEl === 'string'
               ? document.getElementById(idOrEl)
               : idOrEl;
      if (!el) throw Error(`FlowVisualization: mount “${idOrEl}” not found`);
      return el;
    }

    /* reusable 500 px tall viewer box                                   */
    static #viewerBox(id){
      const div = document.createElement('div');
      div.id = id;
      Object.assign(div.style,{
        position:'relative', width:'100%', height:'500px',
        border:'1px solid #444', background:'#121212', overflow:'hidden'
      });
      return div;
    }

    /* top-centre banner (e.g. “Loading…”)                               */
    static #banner(txt,color){
      const b=document.createElement('div');
      b.textContent = txt;
      Object.assign(b.style,{
        position:'absolute', inset:'0 0 auto 0',
        textAlign:'center', padding:'.5rem',
        color, pointerEvents:'none'
      });
      return b;
    }

    /* play / pause overlay (upper-right corner)                         */
    static #overlayButtons(){
      const wrap=document.createElement('div');
      Object.assign(wrap.style,{
        position:'absolute', top:'.5rem', right:'.5rem',
        display:'flex', gap:'.4rem', zIndex:2
      });
      const mk=(txt,cls)=>{const b=document.createElement('button');
                           b.textContent=txt; b.className=`btn btn-sm ${cls}`; return b;};
      const play=mk('▶','btn-success'), pause=mk('⏸','btn-danger');
      wrap.append(play,pause);
      return Object.assign(wrap,{play,pause});
    }

    /* ──────────────── PUBLIC API ──────────────── */

    /** display ONE STL model                                           */
    static staticViewer(target, stlUrl, opts={}){
      const mount=this.#el(target), id=this.#uid('stl');
      const box=this.#viewerBox(id); mount.appendChild(box);
      this.#addAxesOverlay(box);                        // orbit gizmo
      window.STLViewer?.(id, stlUrl, opts);
    }

    /** display a sequence of STL frames (1 … n)                        */
    static fluidViewer(target, base, frameCount=1, opts={}){
      const mount=this.#el(target), id=this.#uid('fluid');
      const box=this.#viewerBox(id); mount.appendChild(box);

      /* status banner while frames load                               */
      const loading=this.#banner('Loading frames…','#facc15'); box.appendChild(loading);

      /* play / pause overlay                                          */
      const ctrl=this.#overlayButtons(); box.appendChild(ctrl);

      this.#addAxesOverlay(box);                         // orbit gizmo

      /* build frame URL list                                          */
      const frames=Array.from({length:frameCount},(_,i)=>`${base}${i+1}.stl`);
      console.log('[FlowVisualization] STL frames:',frames);

      ctrl.play.onclick  = () => window.playFluid?.();
      ctrl.pause.onclick = () => window.pauseFluid?.();

      /* start the viewer                                              */
      try{
        window.FluidSimViewer?.(id,frames,opts);
        loading.remove();
      }catch(err){
        loading.textContent='Failed to load simulation frames';
        loading.style.color='#f87171';
        console.error('[FlowVisualization] Fluid viewer error:',err);
      }
    }

    /* ──────────────── orbit-gizmo (axes widget) ──────────────── */
    static #addAxesOverlay(parent){
      const W=100,H=100;
      const canvas=document.createElement('canvas');
      Object.assign(canvas.style,{
        position:'absolute', width:`${W}px`, height:`${H}px`,
        inset:'.5rem .5rem auto auto', zIndex:1, pointerEvents:'none'
      });
      parent.appendChild(canvas);

      const THREE=window.THREE;
      const gizmoRenderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
      gizmoRenderer.setSize(W,H);

      const gizmoScene=new THREE.Scene();
      const gizmoCam  =new THREE.PerspectiveCamera(50,W/H,.1,10);
      gizmoCam.position.set(1.2,1.2,1.2);
      gizmoCam.lookAt(0,0,0);
      gizmoScene.add(new THREE.AxesHelper(.8));

      /* render every frame; copy orientation from whichever viewer    */
      (function renderGizmo(){
        requestAnimationFrame(renderGizmo);
        if (THREE.__currentCamera)                 // set in each viewer’s animate()
          gizmoCam.quaternion.copy(THREE.__currentCamera.quaternion);
        gizmoRenderer.render(gizmoScene, gizmoCam);
      })();
    }
  }

  /* global hook for markdown pages & other scripts                    */
  window.FlowVisualization = FlowVisualization;
})();
