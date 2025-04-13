---
title: Getting Started
layout: docs
permalink: /docs/getting-started/
---

# `Dg4est`
***
`Dg4est` is a software framework designed to support the development of **hp-finite element methods** for massively parallel scalable solvers using dynamically adaptive meshes.  
The code has hooks for **WAKE3D**, a multi-solver, multi-mesh overset framework.

This code contains a discontinuous Galerkin compressible Navier-Stokes solver, **CartDG**, which is formulated using nodal Lagrange basis functions via a weak formulation and split-form summation-by-parts.  
Additionally, modal Legendre basis functions are available within the weak formulation.

---

## NSF CRII Timeline Milestones

<img align="right" src="/assets/img/328063860-f79eebb4-d442-4f4e-b428-6f640f0b47a9.png" width="300">

### Year 1
- **Q1**: May 1, 2024 – July 31, 2024  
- **Q2**: August 1, 2024 – October 31, 2024  
- **Q3**: November 1, 2024 – January 31, 2025  
- **Q4**: February 1, 2025 – April 30, 2025  

### Year 2
- **Q5**: May 1, 2025 – July 31, 2025  
- **Q6**: August 1, 2025 – October 31, 2025  
- **Q7**: November 1, 2025 – January 31, 2026  
- **Q8**: February 1, 2026 – April 30, 2026  

---

## 1. Obtaining the Code

```bash
git clone https://github.com/dg4est/dg4est.git
```

---

## 2. Compilation

To compile `dg4est` and third-party libraries (e.g., `p4est`, `metis`, `googletest`):

```bash
./makescript.sh <options>
```

**Usage**:
```bash
./makescript.sh {OPTIONS}... {COMPILER OPTIONS}... {DG4EST OPTIONS}... {3PL OPTIONS}
```

### Available Options

| Option             | Shortcut    | Description                                         |
|-------------------|-------------|-----------------------------------------------------|
| `--3pl`            | `-3pl`      | Build metis, p4est, and googletest                 |
| `--acoustics`      | `-acoustics`| Build FW-H Acoustics library                       |
| `--dg4est`         | `-dg4est`   | Build the `dg4est` AMR library                     |
| `--help`           | `-h`        | Display help message                               |
| `--clean`          | `-c`        | Remove local build directories                     |
| `--distclean`      | `-dc`       | Remove builds and install directories              |
| `--release`        | `-opt`      | Compile in optimized mode                          |
| `--debug`          | `-deb`      | Compile in debug mode                              |
| `--testsON`        | `-ton`      | Enable unit tests (Google Test)                    |

### Compiler Options

| Option        | Shortcut   | Description              |
|---------------|------------|--------------------------|
| `CC=<arg>`    | `cc=<arg>` | Set C compiler           |
| `CXX=<arg>`   | `cxx=<arg>`| Set C++ compiler         |
| `FC=<arg>`    | `fc=<arg>` | Set Fortran compiler     |

### Third-Party Library Options

| Option     | Shortcut  | Description             |
|------------|-----------|-------------------------|
| `--ALL3P`  | `-all3p`   | Compile all 3rd parties |
| `--P4EST`  | `-p4est`   | Compile `p4est`         |
| `--METIS`  | `-metis`   | Compile `metis`         |
| `--GTEST`  | `-gtest`   | Compile Google Test     |

---

## 3. Common Build Options

- **NWSC (Wyoming HPC)**:
  ```bash
  ./makescript.sh -nwsc
  # Sets: CC=mpicc CXX=mpicxx FC=mpif90
  ```

- **Intel MPI**:
  ```bash
  ./makescript.sh -impi
  # Sets: CC=mpiicc CXX=mpiicpc FC=mpiifort
  ```

---

## 4. Dependencies

### Required Software

- `cmake` (v3.1+)
- `libtool`: `apt install libtool`
- `automake`: `apt install automake`
- `zlib`: `apt install zlib1g zlibc`
- Optional: MPI-3 one-sided functions

### Documentation Tools

- `doxygen`: `apt install doxygen`
- `graphviz`: `apt install graphviz`
- `latex`: `apt install texlive-full texmaker`

---

## 5. License

> MIT License (MIT)  
> © 2023 Andrew C. Kirby, Dimitri J. Mavriplis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction...