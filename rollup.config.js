'use strict';

import clear from 'rollup-plugin-clear';
import execute from 'rollup-plugin-execute'
import multiEntry from 'rollup-plugin-multi-entry';
import typescript from 'rollup-plugin-typescript2';
import string from 'rollup-plugin-string';


export default {
  input: ['src/**/*.spec.ts', 'test/**/*.spec.ts'],
  output: {
    name: 'tests',
    file: 'test/dist/tests.js',
    format: 'iife',
    sourcemap: true
  },
  watch: {
    chokidar: false
  },
  plugins: [
    multiEntry(),
    clear({ targets: ['test/dist'] }),
    typescript(),
    string({ include: '**/*.txt' }),
    // For some reason output is getting eaten by rollup
    execute('karma start')
  ]
}
