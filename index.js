// ---- Keyboard
var Keyboard = require('game-keyboard');
var keyMap = require('game-keyboard/key_map')['US'];
var keyboard = new Keyboard(keyMap);

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
	// --------------- GUI
	this.gui = new dat.GUI();
	this.buttons = [];
	this.sliders = [];
}

DatGuiKeyboardHelper.prototype.hookItUp = function() {

	// Starts the keyboard loop
	setInterval(function() {

		for (var i = 0; i < this.buttons.length; i++)
		{
			var button = this.buttons[i];

			if (keyboard.consumePressed(button.keyValue))
			{
				button.object[button.valueKey]();
			}
		}

		for (var i = 0; i < this.sliders.length; i++)
		{
			var slider = this.sliders[i];

			if (keyboard.consumePressed(slider.increaseKeyValue))
			{
				if (slider.object[slider.valueKey] + slider.increment <= slider.max)
				{
					slider.object[slider.valueKey] =
					slider.object[slider.valueKey] + slider.increment;	

					slider.onChangeCallback();
				}
			}

			if (keyboard.consumePressed(slider.decreaseKeyValue))
			{
				if (slider.object[slider.valueKey] - slider.increment >= slider.min)
				{
					slider.object[slider.valueKey] =
					slider.object[slider.valueKey] - slider.increment;	

					slider.onChangeCallback();
				}
			}
		}

	}.bind(this), 1000 / 60);
};

DatGuiKeyboardHelper.prototype.addSlider = function(
	object, valueKey, onChangeCallback, 
	increaseKeyStr, decreaseKeyStr, increment, label, min, max )
{
	label = '│' + increaseKeyStr + '║' + decreaseKeyStr + '│ ' + label;

	var increaseKeyValue = getKeyValue(increaseKeyStr);
	var decreaseKeyValue = getKeyValue(decreaseKeyStr);

	var widget = this.gui.add(object, valueKey, min, max).name(label).listen();
	widget.onChange(onChangeCallback);

	this.sliders.push({
		increaseKeyValue: increaseKeyValue,
		decreaseKeyValue: decreaseKeyValue,
		increment: increment,
		min: min,
		max: max,
		object,
		valueKey,
		onChangeCallback: onChangeCallback
	});
};

DatGuiKeyboardHelper.prototype.addButton = function(
	object, valueKey, keyStr, label	)
{
	label = '│' + keyStr + '│ ' + label;

	var keyValue = getKeyValue(keyStr);

	this.gui.add(object, valueKey).name(label);

	this.buttons.push({
		keyValue: keyValue,
		object,
		valueKey
	});
};

module.exports = DatGuiKeyboardHelper;
