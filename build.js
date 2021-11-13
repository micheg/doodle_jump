// defaults
const optionDefinitions = [
    { name: 'target', type: String, multiple: false, defaultValue: 'release' },
  ]

// Import the filesystem module
const copy = require('recursive-copy');
const fs = require('fs');
const commandLineArgs = require('command-line-args');

const options = commandLineArgs(optionDefinitions);

// define dirs
const base_dir = __dirname;
const src_dir = `${base_dir}/src`;
const js_dir = `${src_dir}/js`;
const css_dir = `${src_dir}/css`;
const img_dir = `${src_dir}/img/`;
const out_dir = `${base_dir}/dist`;

console.log('clearing dist');
fs.rmdirSync(out_dir, { recursive: true });
fs.mkdirSync(out_dir);

console.log(base_dir);

let minify = options.target === 'release' ? true : options.target === 'debug' ? false : null;

if(minify === null)
{
    console.log('wrong argument target');
    process.exit(-1);
}

require('esbuild').buildSync({
    entryPoints: [`${css_dir}/main.css`],
    bundle: true,
    minify: minify,
    outfile: `${out_dir}/out.css`
  })

require('esbuild').buildSync(
{
    entryPoints: [`${js_dir}/game.js`],
    bundle: true,
    minify: minify,
    sourcemap: false,
    outfile: `${out_dir}/out.js`
});

console.log('copying index');
fs.copyFileSync(`${src_dir}/index.html`, `${out_dir}/index.html`);
copy(img_dir, `${out_dir}/img`, function(error, results) {
    if (error)
    {
        console.error('Copy failed: ' + error);
    }
    else
    {
        console.info('Copied ' + results.length + ' files');
    }
});
