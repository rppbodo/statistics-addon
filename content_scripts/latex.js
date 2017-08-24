'use strict';

var generateLatex = function() {
	var sortedHist = sortObject(tagHist);
	var data = "Statistics of HTML elements:\n\n";
	data += "\\begin{tabular}{ l l l }\n"
	data += "tag & occurrences & percentage \\\\\n";
	data += "\\hline\n";
	for (var key in sortedHist) {
		data += key + " & " + sortedHist[key] + " & " + formatFloat(100.0 * sortedHist[key] / nTags) + "\\% \\\\\n";
	}
	data += "\\end{tabular}\n";

	data += "\n";

	data += "Global statistics of style:\n\n";
	data += "\\begin{tabular}{ l l l l l }\n"
	data += "attribute & avg & std & min & max \\\\\n";
	data += "\\hline\n";
	for (var i in attributes) {
		var attr = attributes[i];
		data += attr + " & ";
		data += formatFloat(average(globalStyle[attr])) + " & ";
		data += formatFloat(standardDeviation(globalStyle[attr])) + " & ";
		data += Math.min.apply(Math, globalStyle[attr]) + " & ";
		data += Math.max.apply(Math, globalStyle[attr]) + " \\\\\n";
	}
	data += "\\end{tabular}\n";

	data += "\n";

	data += "Statistics of style by tag:\n\n";
	var k = 1;
	for (var key in sortedHist) {
		data += "% " + k + "\n"; k += 1;
		data += "\\begin{tabular}{ l l l l l }\n"
		data += key + " & avg & std & min & max \\\\\n";
		data += "\\hline\n";
		for (var i in attributes) {
			var attr = attributes[i];
			data += attr + " & ";
			data += formatFloat(average(tagStyle[key][attr])) + " & ";
			data += formatFloat(standardDeviation(tagStyle[key][attr])) + " & ";
			data += Math.min.apply(Math, tagStyle[key][attr]) + " & ";
			data += Math.max.apply(Math, tagStyle[key][attr]) + " \\\\\n";
		}
		data += "\\end{tabular}\n\n";
	}

	var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
	saveAs(blob, window.location.host.replace("www.", "") + ".tex");
};

var latex = function(request, sender, sendResponse) {
	init();
	load(document.getElementsByTagName('body')[0]);
	generateLatex();
	browser.runtime.onMessage.removeListener(latex);
};

browser.runtime.onMessage.addListener(latex);
