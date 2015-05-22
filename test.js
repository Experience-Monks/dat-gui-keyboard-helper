var DatGuiKeyboardHelper = require('./');
var datGuiKeyboardHelper = new DatGuiKeyboardHelper();

var brush = {
	strength: 0,
	progress: 0,
	brightness: function() {
		console.log('brightness mode');
	},
	base: function() {
		console.log('base mode');
	}
};

function onChangeStrength()
{
	console.log('changed strength');
}

function onChangeProgress()
{
	console.log('changed progress');
}

// closebraket is typo in 

datGuiKeyboardHelper.addSlider(
	brush, 'strength', onChangeStrength, 
	']', '[', 5, 'Strength', 0, 100);

datGuiKeyboardHelper.addSlider(
	brush, 'progress', onChangeProgress, 
	'+', '-', 10, 'Progress', 0, 100);

datGuiKeyboardHelper.addButton(brush, 'brightness', '1', 'Brightness');
datGuiKeyboardHelper.addButton(brush, 'base', '2', 'Base');

datGuiKeyboardHelper.hookItUp();

setInterval(function() {
	brush.progress = (brush.progress + 1) % 101; 	
	//onChangeProgress();

}, 1000 / 30);