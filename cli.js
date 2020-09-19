#!/usr/bin/env node
'use strict';
const meow = require('meow');
const api = require('./api');

const cli = meow(`
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
`, {
	flags: {
		file: {
			type: 'string',
			isRequired: true,
			alias: 'f'
		},
		token: {
			type: 'string',
			isRequired: true,
			alias: 't'
		},
		dist: {
			type: 'string',
			default: './dist',
			alias: 'd'
		},
		raw: {
			type: 'boolean',
			alias: 'm'
		}
	}
});

(async () => {
	try {
		await api(cli.flags);
	} catch (error) {
		console.error(error.message);
	}
})();
