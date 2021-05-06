/** 
 * Defines a set of configuartion options for Ace editors
 */
Hooks.once("init", function () {
	const namespace = "Ace";
	const settings = [];

	/**
	 * Registers a single game setting for this module.
	 *
	 * The settings is registered with the module's namespace, 
	 * and the name and hint are assigned translated values 
	 * based on the setting name.
	 *
	 * All the settings are world scoped.
	 *
	 * @param {string} name - The name of the setting, also used for .
	 * @param {type} type - The data type of the setting value.
	 * @param {object} choices - The choices object
	 * @param {Number|Boolean|String} def - The default value of the setting.
	 * @param {Boolean} include - Whether or not to include this setting in the settings array.
	 */
	const register = function(name, type, choices, def, include) {
		game.settings.register(namespace, name, {
			name: game.i18n.localize(`${namespace}.settings.${name}.name`),
			hint: game.i18n.localize(`${namespace}.settings.${name}.hint`),
			scope: "client",
			config: true,
			type: type,
			choices: choices,
			default: def
		});
		if (include) settings.push(name);
	}

	/** 
	  * Add a getter to sace that returns an object containing all the settings
	  * from the settings array. These can be passed directly to the sace initialization.
	  */
	Object.defineProperty(Ace, "userSettings", {
		get: function() { return Object.fromEntries(
			settings.map(name => [name, game.settings.get(namespace, name)])
		)}
	});


	register("AutoOpen"  	 	, Boolean,	{								}, false, false);

	register("selectionStyle", String, { "line": "line", "text": "text" },  "text", TRUE);
	register("highlightActiveLine", Boolean, {},  "FALSE", TRUE);
	register("highlightSelectedWord", Boolean, {},  "TRUE", TRUE);
	register("readOnly", Boolean, {},  "FALSE", TRUE);
	register("cursorStyle", String, { "ace": "ace", "slim": "slim", "smooth": "smooth", "wide": "wide" },  "smooth", TRUE);
	register("mergeUndoDeltas", String, {},  "always", FALSE);
	register("behavioursEnabled", Boolean, {},  "TRUE", TRUE);
	register("wrapBehavioursEnabled", Boolean, {},  "TRUE", TRUE);
	register("autoScrollEditorIntoView", Boolean, {},  "undefined", TRUE);
	register("displayIndentGuides", Boolean, {},  "TRUE", TRUE);
	register("navigateWithinSoftTabs", Boolean, {},  "TRUE", TRUE);
	register("enableMultiselect", Boolean, {},  "TRUE", TRUE);
	register("highlightGutterLine", Boolean, {},  "TRUE", TRUE);
	register("animatedScroll", Boolean, {},  "TRUE", TRUE);
	register("showInvisibles", Boolean, {},  "TRUE", TRUE);
	register("showPrintMargin", Boolean, {},  "FALSE", TRUE);
	register("printMarginColumn", Number, {},  "80", TRUE);
	register("printMargin", Number, {},  "undefined", TRUE);
	register("fadeFoldWidgets", Boolean, {},  "TRUE", TRUE);
	register("showFoldWidgets", Boolean, {},  "TRUE", TRUE);
	register("showLineNumbers", Boolean, {},  "TRUE", TRUE);
	register("showGutter", Boolean, {},  "TRUE", TRUE);
	register("fontSize", Number, {},  "15", TRUE);
	register("fontFamily", String, {},  "monospace", TRUE);
	register("scrollPastEnd", Number, {},  "0.5", TRUE);
	register("fixedWidthGutter", Boolean, {},  "FALSE", TRUE);
	register("theme", String, { "ambiance": "ace/theme/ambiance", "ace/theme/chaos": "ace/theme/chaos", "ace/theme/chrome": "ace/theme/chrome", "ace/theme/clouds": "ace/theme/clouds" },  "ace/theme/monokai", TRUE);
	register("newLineMode", String, { "auto": "auto", "unix": "unix", "windows": "windows" },  "unix", TRUE);
	register("useWorker", Boolean, {},  "TRUE", TRUE);
	register("tabSize", Number, {},  "4", TRUE);
	register("wrap", Boolean, {},  "TRUE", TRUE);
	register("foldStyle", String, { "markbegin": "markbegin", "markbeginend": "markbeginend", "manual": "manual" },  "markbegin", TRUE);
	register("mode", String, { "html": "ace/mode/html", "markdown": "ace/mode/markdown", "textile": "ace/mode/textile", "text": "ace/mode/text" },  "ace/mode/html", TRUE);
	register("enableBasicAutocompletion", Boolean, {},  "TRUE", TRUE);
	register("enableSnippets", Boolean, {},  "TRUE", TRUE);
	register("enableLiveAutocompletion", Boolean, {},  "TRUE", TRUE);
	register("useElasticTabstops", Boolean, {},  "TRUE", TRUE);
	register("KeyboardHandler", String, { "emacs": "ace/mode/emacs", "sublime": "ace/mode/sublime", "vim": "ace/mode/vim", "vscode": "ace/mode/vscode" },  "ace/mode/vscode", TRUE);
	register("hScrollBarAlwaysVisible", Boolean, {},  "FALSE", TRUE);
	register("vScrollBarAlwaysVisible", Boolean, {},  "FALSE", TRUE);
	register("maxLines", Number, {},  "undefined", TRUE);
	register("minLines", Number, {},  "undefined", TRUE);
	register("maxPixelHeight", Number, {},  "0", TRUE);
	register("scrollSpeed", Number, {},  "2", TRUE);
	register("dragDelay", Number, {},  "0", TRUE);
	register("dragEnabled", Boolean, {},  "TRUE", TRUE);
	register("focusTimout", Number, {},  "0", TRUE);
	register("tooltipFollowsMouse", Boolean, {},  "TRUE", TRUE);
	register("firstLineNumber", Number, {},  "1", TRUE);
	register("overwrite", Boolean, {},  "FALSE", TRUE);
	register("useSoftTabs", Boolean, {},  "TRUE", TRUE);
	register("indentedSoftWrap", Boolean, {},  "TRUE", TRUE);
});