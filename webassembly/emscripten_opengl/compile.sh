#!/bin/bash
emcc main.cpp -std=c++11 -s WASM=1 -s USE_SDL=2 -O3 -o renderer.js