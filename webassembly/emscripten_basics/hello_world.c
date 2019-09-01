/*
 * Copyright 2011 The Emscripten Authors.  All rights reserved.
 * Emscripten is available under two separate licenses, the MIT license and the
 * University of Illinois/NCSA Open Source License.  Both these licenses can be
 * found in the LICENSE file.
 */

//#include <stdio.h>
#include <math.h>

int int_sqrt(int x) {
  return sqrt(x);
}


/*
int main() {
  printf("hello, world!\n");
  return 0;
}
*/

// emcc hello_world.c -o function.html -s EXPORTED_FUNCTIONS='["_int_sqrt"]' -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'
// emcc hello_world.c -o function.js -s EXPORTED_FUNCTIONS='["_int_sqrt"]' -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' -Os