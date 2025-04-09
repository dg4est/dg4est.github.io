---
layout: docs
title: Getting Started
---

dg4est
=========
dg4est is a software framework designed to support the development of
hp-finite element methods for massively parallel scalable solvers using
dynamically adaptive meshes. The code has hooks for WAKE3D, which is a
multi-solver, multi-mesh overset framework.

This code contains a discontinuous Galerken Compressible Navier-Stokes
solver, CartDG, which is formulated based on nodal Lagrange basis functions
using a weak formulation and a split form summation-by-parts formulation.
Additionally, modal Legendre basis functions are available within the weak
formulation.

## NSF CRII Timeline Milestones  
<img align="right" src="https://github.com/dg4est/dg4est/assets/37650539/f79eebb4-d442-4f4e-b428-6f640f0b47a9">

*Year 1*  
**Q1**: May 1, 2024 - July 31, 2024  
**Q2**: August 1, 2024 - October 31, 2024  
**Q3**: November 1, 2024 - January 31, 2025  
**Q4**: February 1, 2025 - April 30, 2025   

*Year 2*  
**Q5**: May 1, 2025 - July 31, 2025  
**Q6**: August 1, 2025 - October 31, 2025  
**Q7**: November 1, 2025 - January 31, 2026  
**Q8**: February 1, 2026 - April 30, 2026

---
# 1. Obtaining the code
    git clone https://github.com/dg4est/dg4est.git

---
# 2. Compilation
    To compile dg4est and the 3rd party libraries (p4est, metis, googletest):
    ./makescript.sh <options>

**Usage**: ./makescript.sh `{OPTIONS}`...`{COMPILER OPTIONS}`...`{DG4EST OPTIONS}`...`{3PL OPTIONS}`

| OPTIONS:             | Shortcut    | Description                                         |
|:---------------------|-------------|:----------------------------------------------------|
| --3pl                | -3pl        | build the 3rd party libraries: metis, p4est, gtest  |
| --acoustics          | -acoustics  | build the FW-H Acoustics library                    |
| --dg4est             | -dg4est     | build dg4est amr library                            |
|                      |             |                                                     |
| --help               | -h          | displays this help message                          |
| --clean              | -c          | removes local build directories                     |
| --distclean          | -dc         | removes builds and install directories              |
| --release            | -opt        | compile the project in optimized mode               |
| --debug              | -deb        | compile the project in debug mode                   |
| --testsON            | -ton        | turn on unit tests (Google tests)                   |
|                      |             |                                                     |
| **COMPILER OPTIONS**:|             |                                                     |
| CC=`<arg>`           | cc=`<arg>`  | set the C compiler                                  |
| CXX=`<arg>`          | cxx=`<arg>` | set the C++ compiler                                |
| FC=`<arg>`           | fc=`<arg>`  | set the Fortran compiler                            |
|                      |             |                                                     |
| **3PL OPTIONS**:     |             |                                                     |
| --ALL3P              | -all3p      | compile all 3rd party libraries                     |
| --P4EST              | -p4est      | compile p4est                                       |
| --METIS              | -metis      | compile metis                                       |
| --GTEST              | -gtest      | compile google test                                 |

# Common Build Options:
**NWSC (-nwsc)**: Sets CC=mpicc CXX=mpicxx FC=mpif90
    ./makescript.sh -nwsc

**Intel MPI (-impi)**: Sets CC=mpiicc CXX=mpiicpc FC=mpiifort
    ./makescript.sh -impi

---
# 3. Dependencies
    Software:
        CMake (Version 3.1 or newer): We also recommend ccmake or cmake-gui.
        MPI: optional MPI-3 one-sided functions available
        libtool: apt install libtool
        automake: apt install automake
        zlib: apt install zlib1g zlibc

    Documentation:
        doxygen: apt install doxygen
        graphviz: apt install graphviz
        latex: apt install texlive-full texmaker

---
# 4. License

The MIT License (MIT)

Copyright (c) 2023 Andrew C. Kirby, Dimitri J. Mavriplis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
