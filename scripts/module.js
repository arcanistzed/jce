/** Manage JCE Journal Sheet for editing content */
class Jce extends JournalSheet {
	/** The module's ID */
	static ID = "jce";

	/** Compatible editor libraries */
	static EDITORS = ["acelib", "_CodeMirror", "textarea"];

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["jce-sheet"],
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
		context.editors = Jce.EDITORS.filter(name => game.modules.get(name)?.active || name === "textarea");
		return context;
	};

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// Everything below here is only needed if the sheet is editable
		if (!this.options.editable) return;

		// If this is not the GM, unregister this sheet and notify the user
		if (!game.user.isGM) {
			Journal.unregisterSheet?.(Jce.ID, Jce, { types: ["base"] });
			ui.notifications.error("JCE | This module can only be used by the GM");
			return;
		}

		// Get the editor choice select box
		let selectBox = html[0].querySelector("#jce-select-editor");

		// Change editor to default if the current one is no longer enabled
		if (!game.modules.get(game.settings.get(Jce.ID, "editor"))?.active) {
			game.settings.set(Jce.ID, "editor", "textarea");
		};

		// Activate the editor saved in settings
		selectBox.value = game.settings.get(Jce.ID, "editor");
		this.activateEditor(selectBox.value, html[0]);

		// Listen for whenever the select box changes
		selectBox.addEventListener("change", () => {
			// Activate the corresponding editor
			this.activateEditor(selectBox.value, html[0]);

			// Save the current editor to settings
			game.settings.set(Jce.ID, "editor", selectBox.value);

			// Save value
			this._updateObject();

			// Activate the corresponding editor
			this.activateEditor(selectBox.value, html[0]);
		});

		// Save on submit
		html[0].querySelector("#jce-save").addEventListener("click", this._updateObject());
	};

	/** Activates a specific editor
	 * @param {String} editorName - The name of the editor to activate
	 * @param {HTMLElement} html - The element at the root of the sheet
	*/
	activateEditor(editorName, html) {
		// Get current Journal Entry content
		const sourceContent = this.object.data.content;

		// Enable selected editor
		let editor;
		if (editorName === "acelib") {

			// Initialize ace editor
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
				},
			});

		} else if (editorName === "_CodeMirror") {
			// Replace Div with Textarea
			const textarea = divToTextarea(html);

			// Initialize Code Mirror
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
			const textarea = divToTextarea(html);
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

	/**
	 * Update the Journal Entry with new data
	 * @override
	 */
	async _updateObject() {
		// Get current editor
		let editor, output, editorName = document.querySelector("#jce-select-editor").value;
		if (editorName === "acelib") {
			editor = ace.edit("jce-editor");
			output = editor.getValue();
			editor.on("change", () => editor.resize()); // Adjust size whenever the editor is changed
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
	};
};

// Register new Journal Entry sheets with Document Sheet Registrar (before v9.231)
Hooks.on("preDocumentSheetRegistrarInit", settings => {
	if (isNewerVersion("9.231", game.version || game.data.version))
	settings["JournalEntry"] = true;
});

// Register JCE sheets
Hooks.on("ready", () => {
	// Only if this is a GM
	if (game.user.isGM) {
		Journal.registerSheet?.(Jce.ID, Jce, {
			types: ["base"],
			makeDefault: true,
			label: "Journal Code Editor"
		});

		// Alert if library is not enabled on versions before v9d2, or is enabled on later versions
		if ((isNewerVersion("9.231", game.version || game.data.version) && !game.modules.get("_document-sheet-registrar")?.active)
			// Or if it is enabled on versions after that
			|| (!isNewerVersion("9.231", game.version || game.data.version) && game.modules.get("_document-sheet-registrar")?.active))
			ui.notifications.error(`${Jce.ID} | ${game.i18n.format("jce.DSRLibrary")}`, { permanent: true });
	};
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
			callback: async data => {
				// Get Journal Entry
				const journalEntry = game.journal.get(data[0].dataset.entityId || data[0].dataset.documentId);

				// Get sheet
				const sheet = journalEntry.sheet;

				// JCE's sheet class
				const sheetClass = "jce.Jce";

				// Close sheet
				await sheet.close();
				journalEntry._sheet = null;
				delete journalEntry.apps[sheet.appId];

				// Toggle sheet class flag
				if (journalEntry.data.flags.core?.sheetClass === sheetClass) {
					await journalEntry.setFlag("core", "sheetClass", "");
				} else {
					await journalEntry.setFlag("core", "sheetClass", sheetClass);
				};
			}
		});
	};
});
