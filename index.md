---
layout: default
title: "Home Page"
description: "Scientific landing page for documentation and interactive tools"
---

<!-- Masthead -->
<header class="masthead" style="background-color: #2c2c2c; color: #f1f5f9;">
  <div class="container px-4 px-lg-5 h-100">
    <div class="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
      <div class="col-lg-8 align-self-end">
        <h1 class="fw-bold" style="color: #f8fafc;">Built for precision. Engineered for parallelism.</h1>
        <hr class="divider" />
      </div>
      <div class="col-lg-8 align-self-baseline">
        <p class="text-light mb-5">dg4est is a software framework designed to support the development of hp-finite element methods for massively parallel scalable solvers using dynamically adaptive meshes. The code has hooks for WAKE3D, a multi-solver, multi-mesh overset framework.</p>
        <a class="btn btn-warning btn-xl" href="#about">Learn More</a>
      </div>
    </div>
  </div>
</header>

<!-- About -->
<section class="page-section" id="about" style="background-color: #272727;">
  <div class="container px-4 px-lg-5">
    <div class="row gx-4 gx-lg-5 justify-content-center text-center">
      <div class="col-lg-8">
        <h2 class="text-white mt-0">Why Dg4est?</h2>
        <hr class="divider divider-light" />
        <p class="text-light mb-4">Designed to scale. Built with adaptability in mind. Dg4est powers high-fidelity numerical simulations with advanced hp-adaptive finite element methods.</p>
        <a class="btn btn-outline-light btn-xl" href="#services">Explore Sections</a>
      </div>
    </div>
  </div>
</section>

<!-- Core Sections -->
<section class="page-section" id="services" style="background-color: #2c2c2c;">
  <div class="container px-4 px-lg-5">
    <h2 class="text-center text-white mt-0">Core Sections</h2>
    <hr class="divider divider-light" />
    <div class="row gx-4 gx-lg-5">
      <div class="col-lg-3 col-md-6 text-center">
        <div class="mt-5">
          <div class="mb-2"><i class="bi-person-lines-fill fs-1 text-warning"></i></div>
          <h3 class="h4 mb-2 text-white">Authors</h3>
          <p class="text-light mb-0">Meet the contributors behind the research and tools.</p>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 text-center">
        <div class="mt-5">
          <div class="mb-2"><i class="bi-play-circle fs-1 text-warning"></i></div>
          <h3 class="h4 mb-2 text-white">Getting Started</h3>
          <p class="text-light mb-0">New to Dg4est? This is your starting point for setup and usage.</p>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 text-center">
        <div class="mt-5">
          <div class="mb-2"><i class="bi-journal-code fs-1 text-warning"></i></div>
          <h3 class="h4 mb-2 text-white">Documentation</h3>
          <p class="text-light mb-0">Read the technical documentation and implementation details.</p>
        </div>
      </div>
      <div class="col-lg-3 col-md-6 text-center">
        <div class="mt-5">
          <div class="mb-2"><i class="bi-journals fs-1 text-warning"></i></div>
          <h3 class="h4 mb-2 text-white">Publications</h3>
          <p class="text-light mb-0">Browse academic papers, posters, and reference materials.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Portfolio -->
<section id="portfolio" style="background-color: #272727;">
  <div class="container-fluid p-0">
    <div class="row g-0">
      {% for i in (1..6) %}
      <div class="col-lg-4 col-sm-6">
        <a class="portfolio-box" href="{{ '/assets/img/portfolio/fullsize/' | append: i | append: '.jpg' | relative_url }}" title="Project Name">
          <img class="img-fluid" src="{{ '/assets/img/portfolio/thumbnails/' | append: i | append: '.jpg' | relative_url }}" alt="Project {{ i }}" />
          <div class="portfolio-box-caption{% if i == 6 %} p-3{% endif %}">
            <div class="project-category text-white-50">Category</div>
            <div class="project-name text-white">Project Name</div>
          </div>
        </a>
      </div>
      {% endfor %}
    </div>
  </div>
</section>

<!-- Call to Action (Inverted Colors) -->
<section class="page-section bg-light text-dark">
  <div class="container px-4 px-lg-5 text-center">
    <h2 class="mb-4">Free Download on GitHub</h2>
    <a class="btn btn-dark btn-xl" href="https://github.com/dg4est/dg4est.github.io">Download Now</a>
  </div>
</section>

 