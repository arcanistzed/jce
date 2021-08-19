/** Manage JCE Journal Sheet */
class Jce extends JournalSheet {
	/** The module's ID */
	static ID = "jce";

	/** Compatible editor libraries */
	static EDITORS = ["acelib", "_CodeMirror", "textarea"]

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["jce-sheet", "sheet"],
			template: `modules/jce/templates/sheet.hbs`,
			id: 'journal-code-editor'
		});
	};

	/** @override */
	get template() {
		return "modules/jce/templates/sheet.hbs";
	};

	/** @override */
	getData() {
		// Retrieve the data structure from the base sheet
		const context = super.getData();

		// Add editor list to context
		context.editors = Jce.EDITORS;
		return context;
	};

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) return;

		// Get the editor choice select box
		let selectBox = html[0].querySelector("#jce-select-editor");

		// Activate the editor saved in settings
		selectBox.value = game.settings.get(Jce.ID, "editor");
		this.activateEditor(selectBox.value, html[0]);

		// Listen for whenever the select box changes
		selectBox.addEventListener("change", () => {
			// Activate the corresponding editor
			this.activateEditor(selectBox.value, html[0]);

			// Save the current editor to settings
			game.settings.set(Jce.ID, "editor", selectBox.value);

			// Re-render the sheet
			this.render(true);
		});

		// Save on submit
		html[0].querySelector("#jce-save").addEventListener("click", this._updateObject());
	};

	/** Activates a specific editor
	 * @param {String} editorName - The name of the editor to activate
	 * @param {HTMLElement} html - The element at the root of the sheet
	*/
	activateEditor(editorName, html) {
		// Alert and exit if module not enabled
		if (!game.modules.get(editorName)?.active && editorName !== "textarea") {
			ui.notifications.error("JCE | You must enable " + editorName);
			return;
		};

		// Get current Jounral Entry content
		let sourceContent = this.object.data.content;

		// Enable selected editor
		let editor;
		if (editorName === "acelib") {

			// Initialise ace editor
			editor = ace.edit("jce-editor");

			// Set ace options
			editor.setOptions(ace.userSettings);
			
			// Update editor size to fill area
			editor.resize();

			// Set to html mode
			editor.session.setMode("ace/mode/html");

			// Populate with journal entry source code
			editor.setValue(sourceContent);

			// Show keyboard shortcuts
			editor.commands.addCommand({
				name: "showKeyboardShortcuts",
				bindKey: { win: "Ctrl-Alt-h", mac: "Command-Alt-h" },
				exec: editor => {
					ace.config.loadModule("ace/ext/keybinding_menu", module => {
						module.init(editor);
						editor.showKeyboardShortcuts();
					})
				}
			});

		} else if (editorName === "_CodeMirror") {
			// Replace Div with Textarea
			let textarea = divToTextarea(html);

			// Initialise Code Mirror
			editor = CodeMirror.fromTextArea(textarea, {
				mode: "html",
				...CodeMirror.userSettings,
				lineNumbers: true,
				autofocus: true
			});

			// Set initial value
			editor.setValue(sourceContent);
		} else if (editorName === "textarea") {
			// Replace Div with Textarea
			let textarea = divToTextarea(html);
			textarea.value = sourceContent;
		};

		/** Helper function to transform the Div into a Textarea
		 * @param {HTMLElement} html - The element at the root of the sheet
		 * @returns The new textarea
		 */
		function divToTextarea(html) {
			const textarea = document.createElement("textarea");
			html.querySelector("#jce-editor").replaceWith(textarea);
			textarea.id = "jce-editor";
			return textarea;
		};
	};

	// When saved, update the Journal Entry with new data
	async _updateObject() {

		// Get current editor
		let editor, output, editorName = document.querySelector("#jce-select-editor").value;
		if (editorName === "acelib") {
			editor = ace.edit("jce-editor");
			output = editor.getValue();
		} else if (editorName === "_CodeMirror") {
			editor = document.querySelector("#jce-editor + .CodeMirror").CodeMirror;
			output = editor.getValue();
		} else if (editorName === "textarea") {
			output = document.querySelector("#jce-editor").value;
		};

		// Create update package
		const data = {
			_id: this.object.id,
			content: output
		};

		// Update if changes have been made
		if (this.object.data.content !== output) JournalEntry.updateDocuments([data]);
		this.close();
	};
};

// Register new Journal Entry sheets
Hooks.on("preDocumentSheetRegistrarInit", (settings) => {
	settings["JournalEntry"] = true;
});

// Register JCE sheet
Hooks.on("documentSheetRegistrarInit", () => {
	Journal.registerSheet?.(Jce.ID, Jce, {
		types: ["base"],
		makeDefault: true,
		label: "Journal Code Editor"
	});
});

// Register a setting to store current editor
Hooks.on("init", () => {
	game.settings.register(Jce.ID, "editor", {
        scope: "client",
        config: false,
        type: String,
        default: Jce.EDITORS[0],
    });
});

// Add context menu option for toggling JCE
Hooks.on("getJournalDirectoryEntryContext", (_html, contextEntries) => {
	if (game.user.isGM) { // Only show for GMs
		contextEntries.push({
			name: game.i18n.localize("jce.ContextMenu"),
			icon: `<i class="fas fa-code"></i>`,
			callback: data => {
				// Get Journal Entry
				let journalEntry = game.journal.get(data[0].dataset.entityId);

				// Toggle sheet class flag
				if (journalEntry.data.flags.core.sheetClass === "jce.Jce") {
					journalEntry.setFlag("core", "sheetClass", "");
				} else {
					journalEntry.setFlag("core", "sheetClass", "jce.Jce");
				};
			}
		});
	};
});
