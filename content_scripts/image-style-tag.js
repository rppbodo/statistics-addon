'use strict';

var generateImageStyleTag = function(selectedTag) {
	var data = [];

	for (var i in attributes) {
		var attr = attributes[i];
		data[i] = {
			y: tagStyle[selectedTag][attr],
			type: 'box',
			name: attr
		};
	}

	var layout = {
  	title: "Statistics of " + selectedTag + "'s styles."
	};

	var div = document.createElement("div");
	Plotly.newPlot(div, data, layout).then(function(gd) {
		Plotly.toImage(gd, { width: 960, height: 540 }).then(function(data) {
			var blob = dataURItoBlob(data, "image/png");
			saveAs(blob, window.location.host.replace("www.", "") + ".png");
		});
	});
};

var imageStyleTag = function(request, sender, sendResponse) {
	init();
	load(document.getElementsByTagName('body')[0]);
	generateImageStyleTag(request.selectedTag);
	browser.runtime.onMessage.removeListener(imageStyleTag);
};

browser.runtime.onMessage.addListener(imageStyleTag);
