// Add Settings
Hooks.on("init", () => {
	// create Ace Settings Form Application
	class AceSettings extends FormApplication {
		constructor(sourceContent) {
			super();
			this.sourceContent = sourceContent;
		};

		// configure Form Application options
		static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['form'],
			popOut: true,
			resizable: false,
			template: `modules/sace/templates/saceEditor.html`,
			id: 'ace-settings',
			title: 'Ace Settings'
		});
		};

		// when saved, update journal entry with new data
		async _updateObject() {
			var editor = ace.edit(document.getElementById("editor"));
			var output = editor.getValue();
			game.settings.set("sace", "AceConfig", output);
		};
	}

	game.settings.register("sace", "AceConfig", {
        scope: "client",
        type: String,
        config: false,
        default: JSON.stringify({
			selectionStyle: "text",
			highlightActiveLine: false,
			highlightSelectedWord: true,
			readOnly: false,
			cursorStyle: "smooth",
			mergeUndoDeltas: "always",
			behavioursEnabled: true,
			wrapBehavioursEnabled: true,
			autoScrollEditorIntoView: false,
			copyWithEmptySelection: true,
			useSoftTabs: true,
			navigateWithinSoftTabs: true,
			enableMultiselect: true,
			hScrollBarAlwaysVisible: false,
			vScrollBarAlwaysVisible: false,
			highlightGutterLine: true,
			animatedScroll: true,
			showInvisibles: true,
			showPrintMargin: false,
			printMarginColumn: 80,
			printMargin: false ,
			fadeFoldWidgets: true,
			showFoldWidgets: true,
			showLineNumbers: true,
			showGutter: true,
			displayIndentGuides: true,
			fontSize: 15,
			fontFamily: "monospace",
			scrollPastEnd: 0.5,
			fixedWidthGutter: false,
			theme: "ace/theme/monokai",
			newLineMode: "unix",
			useWorker: true,
			useSoftTabs: true,
			tabSize: 4,
			wrap: true,
			foldStyle: "markbegin",
			mode: "ace/mode/html",
			enableBasicAutocompletion: true,
			enableSnippets: true,
			enableLiveAutocompletion: true,
			useElasticTabstops: true,
			KeyboardHandler: "ace/mode/vscode"
		})
    });

    game.settings.register("sace", "AutoOpen", {
        name: game.i18n.localize("SACE.AutoOpen.Name"),
        hint: game.i18n.localize("SACE.AutoOpen.Hint"),
        scope: "client",
        type: Boolean,
        config: true,
        default: false
    });

    game.settings.registerMenu("sace", "AceSettings", {
        name: game.i18n.localize("SACE.AceSettings.Name"),
        label: game.i18n.localize("SACE.AceSettings.Label"),
        icon: "fas fa-cogs",
        type: AceSettings,
        restricted: false
    });
});

Hooks.on("renderAceSettings", () => {
	// initialise ace editor
	var editor = ace.edit(document.getElementById("editor"));

	// populate with current settings
	editor.setValue(game.settings.get("sace", "AceConfig"));
});