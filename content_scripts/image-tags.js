'use strict';

var generateImageTags = function() {
	var labels = [];
	var values = [];

	for (var key in sortObject(tagHist)) {
		labels.push(key + " (" + tagHist[key] + " occurrences)");
		values.push(tagHist[key]);
		if (tagHist[key] / nTags < 0.01) break;
	}

	console.dir(tagHist);

	var data = [{
		labels: labels,
		values: values,
		type: 'pie'
	}];

	var div = document.createElement("div");
	Plotly.newPlot(div, data).then(function(gd) {
		Plotly.toImage(gd, { width: 960, height: 540 }).then(function(data) {
			var blob = dataURItoBlob(data, "image/png");
			saveAs(blob, window.location.host.replace("www.", "") + ".png");
		});
	});
};

var imageTags = function(request, sender, sendResponse) {
	init();
	load(document.getElementsByTagName('body')[0]);
	generateImageTags();
	browser.runtime.onMessage.removeListener(imageTags);
};

browser.runtime.onMessage.addListener(imageTags);
