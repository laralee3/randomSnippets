// Does the picking for me for March Madness
// Made for SMACKTALK, which runs on Turbo Tourney

var randomSmackPicker = function () {
	// Get the "set" number from the first argument of the href javascript
	function getSetNumber(pickAnchor) {
		return pickAnchor.getAttribute('href').match(/PickIt\((.*),/)[1];
	}

	function compareOrder(a, b) {
		return getSetNumber(a) - getSetNumber(b);
	}

	function randomPicker(a, b) {
		(Math.random() >= 0.5) ? a.click(): b.click();
	}

	// Math.random() * (max - min) + min
	function finalScoreGenerator() {
		// Last 4 years lowest total: 2014, Connecticut 60-54
		// Highest: 2013, Louisville, 82-76
		return Math.floor((Math.random() * (158 - 114)) + 114);
	}

	// Get all pickable items, sans the "champ" which is still an anchor for no good reason
	var picks = Array.prototype.filter.call(document.getElementsByClassName('pick'), function (pick) {
		return pick.getAttribute('href') !== null;
	});

	// Sort the results!
	Array.prototype.sort.call(picks, compareOrder);

	// Now...pick stuff.
	while (picks.length) {
		randomPicker(
			Array.prototype.shift.call(picks),
			Array.prototype.shift.call(picks)
		)
	}

	// Enters in a final score
	document.getElementsByClassName('datatable')[0].getElementsByClassName('playerdatainput')[0].value = finalScoreGenerator();
};
