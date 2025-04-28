/**********************************************************************
 * assets/js/flow-visualization.js
 * --------------------------------------------------------------------
 * High-level helper that spawns either:
 *   • a single STL viewer     → staticViewer()
 *   • a looping STL sequence  → fluidViewer()
 *
 * Adds:
 *   • 500 px-tall auto-styled viewer div
 *   • Play / Pause overlay (animation only)
 *   • Corner axes gizmo (for both)
 *********************************************************************/
(function(){

  /* ====================================================================
   *                UTILITY  HELPERS  (private, static)
   * ================================================================= */
  class FlowVisualization {
    /* counters for unique DOM ids ----------------------------------- */
    static #ctr = 0;
    static #uid(p='fv'){ return `${p}-${++this.#ctr}`; }
  
    /* id-string ↔ HTMLElement helper -------------------------------- */
    static #el(x){
      const el = typeof x === 'string' ? document.getElementById(x) : x;
      if(!el) throw Error(`FlowVisualization: mount '${x}' not found`);
      return el;
    }
  
    /* Styled container for any viewer ------------------------------- */
    static #viewerBox(id){
      const d = document.createElement('div');
      d.id = id;
      Object.assign(d.style,{
        position:'relative',
        width:'100%', height:'500px',
        border:'1px solid #444',
        background:'#121212',
        overflow:'hidden'
      });
      return d;
    }
  
    /* Banner (loading / failed) ------------------------------------- */
    static #banner(text,color){
      const b = document.createElement('div');
      b.textContent = text;
      Object.assign(b.style,{
        position:'absolute',
        inset:'0 0 auto 0',
        textAlign:'center',
        padding:'.5rem',
        color,
        pointerEvents:'none'
      });
      return b;
    }
  
    /* Small play / pause overlay ------------------------------------ */
    static #overlayButtons(){
      const box=document.createElement('div');
      Object.assign(box.style,{
        position:'absolute', top:'.5rem', right:'.5rem',
        display:'flex', gap:'.4rem', zIndex:2
      });
      const mk=(txt,cls)=>{const b=document.createElement('button');
                           b.textContent=txt; b.className=`btn btn-sm ${cls}`; return b;};
      const play = mk('▶','btn-success');
      const stop = mk('⏸','btn-danger');
      box.append(play,stop);
      return Object.assign(box,{play,stop});
    }
  
  /* ====================================================================
   *                            PUBLIC API
   * ================================================================= */
  
    /** Single model -------------------------------------------------- */
    static staticViewer(target, stlURL, opts={}){
      const host=this.#el(target); const id=this.#uid('stl');
      const box=this.#viewerBox(id); host.appendChild(box);
      this.#addGizmo(box);                     // axes helper
      window.STLViewer?.(id, stlURL, opts);    // delegate
    }
  
    /** Animated frames ---------------------------------------------- */
    static fluidViewer(target, base, n=1, opts={}){
      const host=this.#el(target); const id=this.#uid('fluid');
      const box=this.#viewerBox(id); host.appendChild(box);
  
      /* banner */
      const load=this.#banner('Loading frames…','#facc15'); box.appendChild(load);
  
      /* play/pause overlay */
      const btns=this.#overlayButtons(); box.appendChild(btns);
  
      /* axes widget */
      this.#addGizmo(box);
  
      /* build frame URL list */
      const frames=Array.from({length:n},(_,i)=>`${base}${i+1}.stl`);
      console.log('[FlowVisualization] STL frames:',frames);
  
      /* wire buttons _after_ viewer installs globals */
      btns.play.onclick =()=>window.playFluid?.();
      btns.stop.onclick =()=>window.pauseFluid?.();
  
      /* start viewer */
      try{
        window.FluidSimViewer?.(id,frames,opts);
        load.remove();
      }catch(e){
        load.textContent='Failed to load frames';
        load.style.color='#f87171';
        console.error('[FlowVisualization] error:',e);
      }
    }
  
  /* ====================================================================
   *                        G I Z M O   (axes helper)
   * ================================================================= */
    /**
     * Small 100×100 canvas that:
     *  • lives in the top-right corner of `parent`
     *  • copies the quaternion of `window._fvCam` each frame
     *    (viewers set this in their animate() loops)
     */
    static #addGizmo(parent){
      const W=100,H=100;
      const canvas=document.createElement('canvas');
      Object.assign(canvas.style,{
        position:'absolute',
        width:`${W}px`, height:`${H}px`,
        inset:'.5rem .5rem auto auto',
        zIndex:1,
        pointerEvents:'none'
      });
      parent.appendChild(canvas);
  
      /* Tiny Three.js pipeline */
      const THREE=window.THREE;
      const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(W,H);
  
      const scene=new THREE.Scene();
      const cam  =new THREE.PerspectiveCamera(50,W/H,.1,10);
      cam.position.set(1.2,1.2,1.2); cam.lookAt(0,0,0);
      scene.add(new THREE.AxesHelper(0.8));
  
      /* RAF loop: copy orientation then draw */
      (function loop(){
        requestAnimationFrame(loop);
        if(window._fvCam){                 // set by viewers each frame
          cam.quaternion.copy(window._fvCam.quaternion);
        }
        renderer.render(scene,cam);
      })();
    }
  }
  
  /* expose globally for markdown pages ------------------------------- */
  window.FlowVisualization = FlowVisualization;
  
  })();
  