'use strict';

var getStatsType = function() {
	var radios = document.getElementsByName("stats-type");
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			return radios[i].value;
		}
	}
	return -1;
};

var getSelectedTag = function() {
	var selectTag = document.getElementById("select-tag");
	return selectTag.options[selectTag.selectedIndex].value;
};

document.addEventListener("click", (e) => {
	if (e.target.nodeName == "INPUT") {
		var statsType = getStatsType();
		if (statsType == 2) {
			browser.tabs.executeScript(null, {
				file: "/content_scripts/tags.js"
			});

			var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
			gettingActiveTab.then((tabs) => {
				browser.tabs.sendMessage(tabs[0].id, { }).then(response => {
					var html = "TAG: <select id=\"select-tag\">";
					var tag;
					for (tag in response.response) {
						html += "<option>" + response.response[tag] + "</option>";
					}
					html += "</select>";
					document.getElementById("tag-list").innerHTML = html;
		    });
			});
		} else {
			document.getElementById("tag-list").innerHTML = "";
		}
	} else if (e.target.nodeName == "BUTTON") {
		var statsType = getStatsType();
		var script = null;

		if (statsType == 0) {
			script = "image-tags";
		} else if (statsType == 1) {
			script = "image-style-global";
		} else if (statsType == 2) {
			script = "image-style-tag";
		} else if (statsType == 3) {
			script = "piano-roll";
		} else if (statsType == 4) {
			script = "latex";
		}

		browser.tabs.executeScript(null, {
			file: "/content_scripts/" + script + ".js"
		});

		var gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
		gettingActiveTab.then((tabs) => {
			browser.tabs.sendMessage(tabs[0].id, { selectedTag: getSelectedTag() });
		});
	}
});
