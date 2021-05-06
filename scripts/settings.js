/** 
 * Defines a set of configuartion options for Ace editors
 */

var saceConfig = {};

Hooks.once("init", function () {
	const namespace = "sace";
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
	 * Add a getter to sace that returns an object containing all the settings
	 * from the settings array. These can be passed directly to the sace initialization.
	 */
	Object.defineProperty(saceConfig, "userSettings", {
		get: () => { return Object.fromEntries(
			settings.map(name => [name, game.settings.get(namespace, name)])
		)}
	});


	register("AutoOpen", Boolean, undefined, false, false);

	register("selectionStyle", String, { "line": "line", "text": "text" }, "text", true);
	register("highlightActiveLine", Boolean, undefined, false, true);
	register("highlightSelectedWord", Boolean, undefined, true, true);
	register("readOnly", Boolean, undefined, false, true);
	register("cursorStyle", String, { "ace": "ace", "slim": "slim", "smooth": "smooth", "wide": "wide" }, "smooth", true);
	register("mergeUndoDeltas", String, undefined, "always", false);
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
		"ambiance":"ace/theme/ambiance",
		"chaos":"ace/theme/chaos",
		"chrome":"ace/theme/chrome",
		"clouds":"ace/theme/clouds",
		"clouds_midnight":"ace/theme/clouds_midnight",
		"cobalt":"ace/theme/cobalt",
		"crimson_editor":"ace/theme/crimson_editor",
		"dawn":"ace/theme/dawn",
		"dracula":"ace/theme/dracula",
		"dreamweaver":"ace/theme/dreamweaver",
		"eclipse":"ace/theme/eclipse",
		"github":"ace/theme/github",
		"gob":"ace/theme/gob",
		"gruvbox":"ace/theme/gruvbox",
		"idle_fingers":"ace/theme/idle_fingers",
		"iplastic":"ace/theme/iplastic",
		"katzenmilch":"ace/theme/katzenmilch",
		"kr_theme":"ace/theme/kr_theme",
		"kuroir":"ace/theme/kuroir",
		"merbivore":"ace/theme/merbivore",
		"merbivore_soft":"ace/theme/merbivore_soft",
		"mono_industrial":"ace/theme/mono_industrial",
		"monokai":"ace/theme/monokai",
		"nord_dark":"ace/theme/nord_dark",
		"pastel_on_dark":"ace/theme/pastel_on_dark",
		"solarized_dark":"ace/theme/solarized_dark",
		"solarized_light":"ace/theme/solarized_light",
		"sqlserver":"ace/theme/sqlserver",
		"terminal":"ace/theme/terminal",
		"textmate":"ace/theme/textmate",
		"tomorrow":"ace/theme/tomorrow",
		"tomorrow_night_blue":"ace/theme/tomorrow_night_blue",
		"tomorrow_night_bright":"ace/theme/tomorrow_night_bright",
		"tomorrow_night_eighties":"ace/theme/tomorrow_night_eighties",
		"tomorrow_night":"ace/theme/tomorrow_night",
		"twilight":"ace/theme/twilight",
		"vibrant_ink":"ace/theme/vibrant_ink",
		"xcode":"ace/theme/xcode"
	}, "ace/theme/monokai", true);
	register("newLineMode", String, { "auto": "auto", "unix": "unix", "windows": "windows" }, "unix", true);
	register("useWorker", Boolean, undefined, true, true);
	register("tabSize", Number, undefined, 4, true);
	register("wrap", Boolean, undefined, true, true);
	register("foldStyle", String, { "markbegin": "markbegin", "markbeginend": "markbeginend", "manual": "manual" }, "markbegin", true);
	register("mode", String, { "html": "ace/mode/html", "markdown": "ace/mode/markdown", "textile": "ace/mode/textile", "text": "ace/mode/text" }, "ace/mode/html", true);
	register("enableBasicAutocompletion", Boolean, undefined, true, true);
	register("enableSnippets", Boolean, undefined, true, true);
	register("enableLiveAutocompletion", Boolean, undefined, true, true);
	register("useElasticTabstops", Boolean, undefined, true, true);
	register("KeyboardHandler", String, { "emacs": "ace/mode/emacs", "sublime": "ace/mode/sublime", "vim": "ace/mode/vim", "vscode": "ace/mode/vscode" }, "ace/mode/vscode", true);
	register("hScrollBarAlwaysVisible", Boolean, undefined, false, true);
	register("vScrollBarAlwaysVisible", Boolean, undefined, false, true);
	register("maxLines", Number, undefined, undefined, true);
	register("minLines", Number, undefined, undefined, true);
	register("maxPixelHeight", Number, undefined, 0, true);
	register("scrollSpeed", Number, undefined, 2, true);
	register("dragDelay", Number, undefined, 0, true);
	register("dragEnabled", Boolean, undefined, true, true);
	register("focusTimout", Number, undefined, 0, true);
	register("tooltipFollowsMouse", Boolean, undefined, true, true);
	register("firstLineNumber", Number, undefined, 1, true);
	register("overwrite", Boolean, undefined, false, true);
	register("useSoftTabs", Boolean, undefined, true, true);
	register("indentedSoftWrap", Boolean, undefined, true, true);

	console.log("saceConfig SETTINGS HERE!!!");
	console.table(settings);
	console.table(saceConfig);
	console.log(settings, saceConfig);
});