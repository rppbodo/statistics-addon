'use strict';

var generateImageStyleGlobal = function() {
	var data = [];

	for (var i in attributes) {
		var attr = attributes[i];
		data[i] = {
			y: globalStyle[attr],
			type: 'box',
			name: attr
		};
	}

	var div = document.createElement("div");
	Plotly.newPlot(div, data).then(function(gd) {
		Plotly.toImage(gd, { width: 960, height: 540 }).then(function(data) {
			var blob = dataURItoBlob(data, "image/png");
			saveAs(blob, window.location.host.replace("www.", "") + ".png");
		});
	});
};

var imageStyleGlobal = function(request, sender, sendResponse) {
	init();
	load(document.getElementsByTagName('body')[0]);
	generateImageStyleGlobal();
	browser.runtime.onMessage.removeListener(imageStyleGlobal);
};

browser.runtime.onMessage.addListener(imageStyleGlobal);
