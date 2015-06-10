// ---- Keyboard
var Keyboard = require('game-keyboard');
var keyMap = require('game-keyboard/key_map')['US'];
var clamp = require('clamp');

// ---- dat-gui
var dat = require('dat-gui');

var usedKeyCodes = [];

var charToKeyCodes = {
	'[': 'openbracket',
	']': 'closebraket',
	';': 'semicolon',
	'=': 'equals',
	',': 'comma',
	'-': 'dash',
	'.': 'period',
	'/': 'forwardslash',
	'`': 'graveaccent',
	'\\': 'backslash',
	'\'': 'singlequote',
	'*': "multiply",
	'+': "add",
	'-': "subtract",
	' ': "space"
};

function getKeyValue(keyStr)
{
	var keyValue = keyMap[keyStr.charCodeAt(0)];

	if (charToKeyCodes.hasOwnProperty(keyStr))
	{
		keyValue = charToKeyCodes[keyStr];
	}
	return keyValue;
}

function DatGuiKeyboardHelper()
{
	this.gui = new dat.GUI();
	this.keyboard = new Keyboard(keyMap);
	this.buttons = [];
	this.sliders = [];

	// Starts the keyboard loop
	this.keyboardLoop = this.keyboardLoop.bind(this);
	setInterval(this.keyboardLoop, 1000 / 60);
};

DatGuiKeyboardHelper.prototype.keyboardLoop = function() {
	for (var i = 0; i < this.buttons.length; i++)
	{
		var button = this.buttons[i];

		if (this.keyboard.consumePressed(button.keyValue))
		{
			button.object[button.valueKey]();
		}
	}

	for (var i = 0; i < this.sliders.length; i++)
	{
		var slider = this.sliders[i];
		var object = slider.object;
		var valueKey = slider.valueKey;
		var used = false;
		var oldValue = object[valueKey];

		var direction = 0;
		if(this.keyboard.isPressed(slider.increaseKeyValue)) direction += 1;
		if(this.keyboard.isPressed(slider.decreaseKeyValue)) direction -= 1;

		if (direction != 0) {
			object[valueKey] += slider.increment * slider.ease * slider.ease * direction;
			if(slider.ease < 2) slider.ease += 0.1;
			object[valueKey] = clamp(object[valueKey], slider.min, slider.max);
			if(object[valueKey] !== oldValue) slider.onChangeCallback();
		} else {
			slider.ease = 0.1;
		}
	}
}

DatGuiKeyboardHelper.prototype.addSlider = function( object, valueKey, onChangeCallback, increaseKeyStr, decreaseKeyStr, increment, label, min, max) {
	label = '│' + increaseKeyStr + '║' + decreaseKeyStr + '│ ' + label;

	var increaseKeyValue = getKeyValue(increaseKeyStr);
	var decreaseKeyValue = getKeyValue(decreaseKeyStr);

	this.sliders.forEach(function(slider) {
		if(slider.increaseKeyValue === increaseKeyValue || slider.decreaseKeyValue === decreaseKeyValue) {
			console.warn('You\'ve assigned the same keyboard key to multiple controls.');
		}
	})

	var widget = this.gui.add(object, valueKey, min, max).name(label).listen();
	widget.onChange(onChangeCallback);

	this.sliders.push({
		increaseKeyValue: increaseKeyValue,
		decreaseKeyValue: decreaseKeyValue,
		increment: increment,
		ease: 0,
		min: min,
		max: max,
		object: object,
		valueKey: valueKey,
		onChangeCallback: onChangeCallback
	});
};

DatGuiKeyboardHelper.prototype.addButton = function(object, valueKey, keyStr, label) {
	label = '│' + keyStr + '│ ' + label;

	var keyValue = getKeyValue(keyStr);

	this.gui.add(object, valueKey).name(label);

	this.buttons.push({
		keyValue: keyValue,
		object: object,
		valueKey: valueKey
	});
};

module.exports = DatGuiKeyboardHelper;
