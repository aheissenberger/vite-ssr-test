# Vite.js SSG Bundling Analyses

## Problem

The RSC and SSR implementation of [WAKU](https://github.com/dai-shi/waku) will load the browser modules of packages and crashed when code access objects (e.g. window) which does not exists in a node environment.
The error to be verified is this exception when running `pnpm waku build --with-ssr` from the [react-textarea-autosize package](https://unpkg.com/browse/react-textarea-autosize@8.5.3/package.json):
```
ReferenceError: document is not defined
    at file:///Users/ah/SVN-Checkouts/TST/waku-context-broken/dist/public/assets/rsc260-cf5b1cd47.js:1:4791
    at ModuleJob.run (node:internal/modules/esm/module_job:218:25)
    at async ModuleLoader.import (node:internal/modules/esm/loader:323:24)
node:internal/process/promises:289
            triggerUncaughtException(err, true /* fromPromise */);
            ^
```

`/dist/public/assets/rsc260-cf5b1cd47.js:1:4791` contains `react-textarea-autosize.browser.esm.js` as all files under `/dist/public/assets/` are build to run in a browser.

## Goal

The goal of this project was to analyse the conditions for bundeling and the modules loaded from the `nodes_modules` folder.

## Thesis

The packages loaded to render React to HTML are optimized for node and not the browser.
The build processes **never touch or use** the bundles **created to be served to the client** to be rendered in the browser.

## Setup

* NodeJS 20.11 DevContainer
* Vite.js official [SSR Example Project](https://vitejs.dev/guide/ssr.html)
* [Vite Docu SSG Prerender Script](https://vitejs.dev/guide/ssr.html#pre-rendering-ssg)
* [Mantine Component Library](https://mantine.dev) - Version 7.5 support SSR out of the box

> You only need to run this project in a DevContainer if you native system does not support the unix `strace` command - e.g. Macos. If you only interested in the result, a copy of the strace output is included in this repository

**install all packages**
`npm i`

## Adaptations

1. add Mantine CSS and `MantineProvider` Wrapper to `src/App.jsx`
2. modify `prerender.js` to handle the one file

## Tests

All tests use the unix tool `strace` to trace all access to files and write the output to `trace_ssr.txt` and `trace_ssg.txt`.
To reduce the size in the repository only the lines which contain `react-textarea-autosize`

### SSG

run this command to build the assets and generate the static pages (`dist/static`):
`npm run generate:trace`

grep all lines with `react-textarea-autosize` from the trace to see which files have been required by node
`npm run generate:trace:partial`

Output: `trace_ssg.txt`

> searching for `.browser` gives no result as only the node version of the package was loaded

you can server the generated static html with:
`npm run server:gererated`

### SSR

run this command, open the website and stop the server with `Ctrl-C`:
`npm run server:ssr:trace`

grep all lines with `react-textarea-autosize` from the trace to see which files have been required by node
`npm run server:ssr:trace:partial`

Output: `trace_ssg.txt`

> searching for `.browser` gives no result as only the node version of the package was loaded

## Results

* The `Mantine Component Library` has no problems with SSR and SSG in node
* The generated html with SSR and SSG had not hydration error in the client browser
* The target for the code rendering on the server should be the server (e.g. node or webworker) - see [Vite Documentation](https://vitejs.dev/guide/ssr.html#ssr-target)