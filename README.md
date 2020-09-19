# figma-svg-cli

> Export Figma frames as minified SVG files

## Install

Ensure you have Node.js version 8+ installed. Then run the following:

```
$ npm install --global figma-svg-cli
```

## Usage

```
$ figma-svg --help

	Usage
		$ figma-svg --file PTAtA9Z --token 63214-7e15e

	Options
		--file,   -f  The file ID from Figma
		--token,  -t  The Figma personal access token
		--dist,   -d  The directory the svg files get saved to
		--raw,    -r  Do not minify the SVG files with SVGO

	Examples
		$ figma-svg --file PTAtA9Z --token 63214-7e15e
		✔ Downloaded 370 files to ./dist
```

## Related

[replace-in-files-cli](https://github.com/sindresorhus/replace-in-files-cli) - Replace matching strings and regexes in files
