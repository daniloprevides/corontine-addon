const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
const files = [
'./dist/components/runtime-es2015.js',
'./dist/components/polyfills-es2015.js',
'./dist/components/main-es2015.js',
'./dist/components/vendor-es2015.js',
]
await fs.ensureDir('elements')
await concat(files, '../src/views/public/components.js');
})()
