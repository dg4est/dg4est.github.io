.. DG4EST documentation master file, created by
   sphinx-quickstart on Sun Apr 14 15:08:20 2024.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to DG4EST's documentation!
==================================

.. raw:: html

   <!-- Header Section -->
   <header class="w-full text-white drop-shadow-xl font-bold text-xl md:text-2xl">
     <div class="px-4 md:px-0 container mx-auto py-6 flex flex-row items-center justify-center md:justify-start gap-x-4">
       <img src="_static/logo.png" alt="Project Logo" class="hidden md:inline h-6" />
       <div>Project Name</div>
     </div>
   </header>

.. raw:: html

   <!-- Hero Section & Navigation -->
   <div class="px-4 md:px-0 container mx-auto flex flex-col gap-8 py-8 md:py-12">
     <div class="flex flex-col md:flex-row items-center gap-10 md:gap-16 py-8 md:py-16">
       <div class="w-full flex flex-col items-center md:items-start">
         <img src="_static/logo.png" alt="Project Logo" class="h-20 md:h-24" />
       </div>
       <div class="w-full text-white text-md md:text-lg text-justify font-semibold">
         Lorem ipsum dolor sit amet consectetur adipiscing elit.
       </div>
     </div>
     <nav class="flex justify-center">
       <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 md:gap-x-8 text-md md:text-xl text-center text-white font-medium">
         <a href="#" class="px-4 flex flex-row items-center py-4 border-b-2 hover:border-amber-400">
           <i class="pr-4 fa-brands fa-github"></i>
           <span class="flex-1">GitHub</span>
         </a>
         <a href="#" class="px-4 flex flex-row items-center py-4 border-b-2 hover:border-amber-400">
           <i class="pr-4 fa-solid fa-download"></i>
           <span class="flex-1">Download</span>
         </a>
         <a href="#" class="px-4 flex flex-row items-center py-4 border-b-2 hover:border-amber-400">
           <i class="pr-4 fa-solid fa-rocket"></i>
           <span class="flex-1">Quick Start</span>
         </a>
         <a href="#" class="px-4 flex flex-row items-center py-4 border-b-2 hover:border-amber-400">
           <i class="pr-4 fa-solid fa-book"></i>
           <span class="flex-1">Documentation</span>
         </a>
         <a href="#" class="px-4 flex flex-row items-center py-4 border-b-2 hover:border-amber-400">
           <i class="pr-4 fa-solid fa-newspaper"></i>
           <span class="flex-1">Papers</span>
         </a>
       </div>
     </nav>
   </div>

.. raw:: html

   <!-- Featured Simulations Section -->
   <main class="px-4 md:px-0 bg-white flex-1 py-6 md:py-12">
     <div class="container mx-auto flex flex-col gap-8 md:gap-12">
       <section id="simulations" class="flex flex-col gap-4">
         <h2 class="text-xl md:text-2xl font-extrabold">Featured Simulations??</h2>
         <div id="ft-sim" class="grid grid-cols-1 md:grid-cols-3 gap-8">
           <!-- Example Simulation Card -->
           <div class="flex flex-col text-white rounded bg-slate-900 rounded-b-lg">
             <div class="flex-1 grid bg-white pb-2">
               <img src="https://via.placeholder.com/400x225.png?text=Sim+1" alt="Simulation Alpha Visualization" class="place-self-center" />
             </div>
             <div class="flex flex-row items-center px-2 py-1">
               <div class="flex flex-col h-full bg-white justify-center">
                 <img src="_static/logo.png" alt="Logo" class="h-10" />
               </div>
               <div class="flex-1 p-2 font-semibold text-center">Simulation Alpha</div>
               <a href="#" class="w-10 text-center">
                 <i class="fa-solid fa-arrow-up-right-from-square"></i>
               </a>
             </div>
             <div class="grid grid-cols-3 gap-4 px-4 py-2">
               <div class="flex flex-row items-center">
                 <div class="pr-2"><i class="fa-solid fa-server"></i></div>
                 <div class="flex-1 text-center">System A</div>
               </div>
               <div class="flex flex-row items-center">
                 <div class="pr-2"><i class="fa-solid fa-microchip"></i></div>
                 <div class="flex-1 text-center">128 GPUs</div>
               </div>
               <div class="flex flex-row items-center">
                 <div class="pr-2"><i class="fa-solid fa-clock"></i></div>
                 <div class="flex-1 text-center">12h</div>
               </div>
             </div>
           </div>
           <!-- Additional simulation cards can follow the same structure -->
         </div>
       </section>
     </div>
   </main>

.. raw:: html

   <!-- Weak Scaling Results Section -->
   <section id="scaling" class="flex flex-col gap-4">
     <h2 class="text-xl md:text-2xl font-extrabold">Weak Scaling Results EXAMPLE</h2>
     <div id="ft-scaling" class="flex flex-col md:flex-row gap-8 md:justify-around">
       <div class="flex flex-col text-white rounded bg-slate-900 rounded-b-lg md:w-1/3">
         <div class="flex-1 grid bg-white pb-2">
           <img src="https://via.placeholder.com/400x300.png?text=Chart+1" alt="Scaling Chart - Frontier" class="place-self-center" />
         </div>
         <div class="p-2 font-semibold text-center">Frontier (AMD GPUs)</div>
       </div>
       <div class="flex flex-col text-white rounded bg-slate-900 rounded-b-lg md:w-1/3">
         <div class="flex-1 grid bg-white pb-2">
           <img src="https://via.placeholder.com/400x300.png?text=Chart+2" alt="Scaling Chart - Summit" class="place-self-center" />
         </div>
         <div class="p-2 font-semibold text-center">Summit (NVIDIA GPUs)</div>
       </div>
     </div>
   </section>

.. raw:: html

   <!-- Contributors Section -->
   <section id="contributors" class="flex flex-col gap-4">
     <h2 class="text-xl md:text-2xl font-extrabold">Contributors</h2>
     <div id="ft-contrib" class="flex flex-wrap">
       <a href="#" class="m-1"><img src="https://via.placeholder.com/48" alt="Contributor 1" class="w-12 h-12 object-cover" /></a>
       <a href="#" class="m-1"><img src="https://via.placeholder.com/48" alt="Contributor 2" class="w-12 h-12 object-cover" /></a>
       <a href="#" class="m-1"><img src="https://via.placeholder.com/48" alt="Contributor 3" class="w-12 h-12 object-cover" /></a>
       <a href="#" class="m-1"><img src="https://via.placeholder.com/48" alt="Contributor 4" class="w-12 h-12 object-cover" /></a>
     </div>
   </section>

.. raw:: html

   <!-- Footer -->
   <footer class="flex flex-col w-full px-4 md:px-0 text-white py-8 gap-4 container mx-auto">
     <div class="font-bold text-center text-sm md:text-md md:text-left">
       &copy; <span id="year">2025</span> Your Name or Organization
     </div>
     <div class="text-justify flex-1 text-xs md:text-sm text-neutral-300">
       Supported by multiple organizations and funding agencies.
     </div>
   </footer>
