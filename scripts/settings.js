/** 
 * Defines a set of configuartion options for Ace editors
 */

var jceConfig = {};

Hooks.once("init", function () {
	const namespace = "jce";
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
	const register = (name, type, choices, def, include) => {
		game.settings.register(namespace, name, {
			name: game.i18n.localize(`${namespace}.settings.${name}.Name`),
			hint: game.i18n.localize(`${namespace}.settings.${name}.Hint`),
			scope: "client",
			config: true,
			type: type,
			choices: choices,
			default: def
		});
		if (include) settings.push(name);
	}

	/** 
	 * Add a getter to jce that returns an object containing all the settings
	 * from the settings array. These can be passed directly to the jce initialization.
	 */
	Object.defineProperty(jceConfig, "userSettings", {
		get: () => { return Object.fromEntries(
			settings.map(name => [name, game.settings.get(namespace, name)])
		)}
	});

	// If user has activated CodeMirror, add the option to use it instead
	if (game.modules.get("_CodeMirror")?.active) {
		register("CodeMirror", Boolean, undefined, false, false);
	}

	register("AutoOpen", Boolean, undefined, false, false);

	register("selectionStyle", String, { "line": "line", "text": "text" }, "text", true);
	register("highlightActiveLine", Boolean, undefined, false, true);
	register("highlightSelectedWord", Boolean, undefined, true, true);
	register("readOnly", Boolean, undefined, false, true);
	register("cursorStyle", String, { "ace": "ace", "slim": "slim", "smooth": "smooth", "wide": "wide" }, "smooth", true);
	register("mergeUndoDeltas", String, undefined, "always", true);
	register("behavioursEnabled", Boolean, undefined, true, true);
	register("wrapBehavioursEnabled", Boolean, undefined, true, true);
	register("autoScrollEditorIntoView", Boolean, undefined, undefined, true);
	register("displayIndentGuides", Boolean, undefined, true, true);
	register("navigateWithinSoftTabs", Boolean, undefined, true, true);
	register("enableMultiselect", Boolean, undefined, true, true);
	register("highlightGutterLine", Boolean, undefined, true, true);
	register("animatedScroll", Boolean, undefined, true, true);
	register("showInvisibles", Boolean, undefined, true, true);
	register("showPrintMargin", Boolean, undefined, false, true);
	register("printMarginColumn", Number, undefined, 80, true);
	register("printMargin", Number, undefined, undefined, true);
	register("fadeFoldWidgets", Boolean, undefined, true, true);
	register("showFoldWidgets", Boolean, undefined, true, true);
	register("showLineNumbers", Boolean, undefined, true, true);
	register("showGutter", Boolean, undefined, true, true);
	register("fontSize", Number, undefined, 15, true);
	register("fontFamily", String, undefined, "monospace", true);
	register("scrollPastEnd", Number, undefined, 0.5, true);
	register("fixedWidthGutter", Boolean, undefined, false, true);
	register("theme", String, {
		"ace/theme/ambiance": "ambiance", "ace/theme/chaos": "chaos", "ace/theme/chrome": "chrome", "ace/theme/clouds": "clouds", "ace/theme/clouds_midnight": "clouds_midnight", "ace/theme/cobalt": "cobalt", "ace/theme/crimson_editor": "crimson_editor", "ace/theme/dawn": "dawn", "ace/theme/dracula": "dracula", "ace/theme/dreamweaver": "dreamweaver", "ace/theme/eclipse": "eclipse", "ace/theme/github": "github", "ace/theme/gob": "gob", "ace/theme/gruvbox": "gruvbox", "ace/theme/idle_fingers": "idle_fingers", "ace/theme/iplastic": "iplastic", "ace/theme/katzenmilch": "katzenmilch", "ace/theme/kr_theme": "kr_theme", "ace/theme/kuroir": "kuroir", "ace/theme/merbivore": "merbivore", "ace/theme/merbivore_soft": "merbivore_soft", "ace/theme/mono_industrial": "mono_industrial", "ace/theme/monokai": "monokai", "ace/theme/nord_dark": "nord_dark", "ace/theme/pastel_on_dark": "pastel_on_dark", "ace/theme/solarized_dark": "solarized_dark", "ace/theme/solarized_light": "solarized_light", "ace/theme/sqlserver": "sqlserver", "ace/theme/terminal": "terminal", "ace/theme/textmate": "textmate", "ace/theme/tomorrow": "tomorrow", "ace/theme/tomorrow_night_blue": "tomorrow_night_blue", "ace/theme/tomorrow_night_bright": "tomorrow_night_bright", "ace/theme/tomorrow_night_eighties": "tomorrow_night_eighties", "ace/theme/tomorrow_night": "tomorrow_night", "ace/theme/twilight": "twilight", "ace/theme/vibrant_ink": "vibrant_ink", "ace/theme/xcode": "xcode"
	}, "ace/theme/monokai", true);
	register("newLineMode", String, { "auto": "auto", "unix": "unix", "windows": "windows" }, "unix", true);
	register("useWorker", Boolean, undefined, true, true);
	register("tabSize", Number, undefined, 4, true);
	register("wrap", Boolean, undefined, true, true);
	register("foldStyle", String, { "markbegin": "markbegin", "markbeginend": "markbeginend", "manual": "manual" }, "markbegin", true);
	register("mode", String, { "ace/mode/html": "html", "ace/mode/markdown": "markdown", "ace/mode/textile": "textile", "ace/mode/text": "text" }, "ace/mode/html", true);
	register("enableBasicAutocompletion", Boolean, undefined, true, true);
	register("enableSnippets", Boolean, undefined, true, true);
	register("enableLiveAutocompletion", Boolean, undefined, true, true);
	register("useElasticTabstops", Boolean, undefined, true, true);
	register("KeyboardHandler", String, { "ace/mode/emacs": "emacs", "ace/mode/sublime": "sublime", "ace/mode/vim": "vim", "ace/mode/vscode": "vscode" }, "ace/mode/vscode", true);
	register("hScrollBarAlwaysVisible", Boolean, undefined, false, true);
	register("vScrollBarAlwaysVisible", Boolean, undefined, false, true);
	register("maxLines", Number, undefined, undefined, true);
	register("minLines", Number, undefined, undefined, true);
	register("maxPixelHeight", Number, undefined, 0, true);
	register("scrollSpeed", Number, undefined, 2, true);
	register("dragDelay", Number, undefined, 0, true);
	register("dragEnabled", Boolean, undefined, true, true);
	register("focusTimeout", Number, undefined, 0, true);
	register("tooltipFollowsMouse", Boolean, undefined, true, true);
	register("firstLineNumber", Number, undefined, 1, true);
	register("overwrite", Boolean, undefined, false, true);
	register("useSoftTabs", Boolean, undefined, true, true);
	register("indentedSoftWrap", Boolean, undefined, true, true);
});