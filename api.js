const fs = require('fs').promises;
const got = require('got');
const SVGO = require('svgo');
const ora = require('ora');
const svgoOptions = require('./svgo-options.json');

const generateSvg = async (imageData, svgo, dist, callback) => {
	try {
		const {name, url} = imageData;
		let svg = await got(url, {resolveBodyOnly: true});

		if (svgo) {
			const {data} = await svgo.optimize(svg);
			svg = data;
		}

		await fs.writeFile(`${dist}/${name}.svg`, svg);
		callback();
	} catch (error) {
		console.error(error);
	}
};

module.exports = async options => {
	const spinner = ora('Opening figma file').start();

	try {
		const apiVersion = 'v1';
		const gotOptions = {
			headers: {'X-FIGMA-TOKEN': options.token},
			responseType: 'json',
			resolveBodyOnly: true
		};

		const figmaAPI = API => `https://api.figma.com/${apiVersion}/${API}/${options.file}/`;

		const figmaRoot = await got(figmaAPI('files'), gotOptions);
		const figmaData = figmaRoot.document.children[0].children;

		let count = 0;
		spinner.text = `Downloaded ${count}/${figmaData.length} files to ${options.dist}`;
		const updateSpinnerCount = spinner => {
			count++;
			spinner.text = `Downloaded ${count}/${figmaData.length} files to ${options.dist}`;
		};

		// Create the directory for the icons if it doesn't exist
		await fs.mkdir(options.dist, {recursive: true});

		// Format the data
		const imageData = {};
		for (const {id, name} of figmaData) {
			imageData[id] = {name};
		}

		// Get the URLs of the images
		const imageAPI = `${figmaAPI('images')}?ids=${Object.keys(imageData).join(',')}&format=svg`;
		const {images} = await got(imageAPI, gotOptions);
		for (const [id, url] of Object.entries(images)) {
			imageData[id].url = url;
		}

		// Download the SVG files
		const imageIds = Object.keys(imageData);

		const svgo = options.raw ? null : new SVGO({svgoOptions});
		const svgTasks = imageIds.map(id => generateSvg(
			imageData[id],
			svgo,
			options.dist,
			() => updateSpinnerCount(spinner)
		));
		await Promise.all(svgTasks);

		spinner.succeed(`Downloaded ${figmaData.length} SVG files to ${options.dist} directory`);
	} catch (error) {
		spinner.fail(error.message);
	}
};
