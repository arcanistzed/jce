/* global ace CodeMirror */

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
			template: "modules/jce/templates/jce.hbs",
			id: "journal-code-editor",
		});
	}

	/** @override */
	getData() {
		// Retrieve the data structure from the base sheet
		const context = super.getData();

		// Add editor list to context
		context.editors = Jce.EDITORS.filter(name => game.modules.get(name)?.active || name === "textarea");
		return context;
	}

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
		const selectBox = html[0].querySelector("#jce-select-editor");

		// Change editor to default if the current one is no longer enabled
		if (!game.modules.get(game.settings.get(Jce.ID, "editor"))?.active) {
			game.settings.set(Jce.ID, "editor", "textarea");
		}

		// Set to the editor saved in settings
		selectBox.value = game.settings.get(Jce.ID, "editor");

		// Once rendered
		Hooks.once("renderJce", () => {
			// Activate the selected editor
			this.activateEditor(selectBox.value, html[0]);

			// Listen for whenever the select box changes
			selectBox.addEventListener("change", () => {
				// Activate the corresponding editor
				this.activateEditor(selectBox.value, html[0]);

				// Save the current editor to settings
				game.settings.set(Jce.ID, "editor", selectBox.value);

				// Save value
				this._updateObject();
			});
		});

		// Save on submit
		html[0].querySelector("#jce-save").addEventListener("click", this._updateObject());
	}

	/**
	 * Activates a specific editor
	 * @param {string} editorName - The name of the editor to activate
	 * @param {HTMLElement} html - The element at the root of the sheet
	 */
	activateEditor(editorName, html) {
		// Get current Journal Entry content
		const sourceContent = this.object.data.content;

		// Enable selected editor
		let editor;
		if (editorName === "acelib") {
			// Transform textarea to div
			this.transformElement(html, "div");

			// Initialize ace editor
			editor = ace.edit("jce-editor");

			// Set ace options
			editor.setOptions(ace.userSettings);

			// Set to html mode
			editor.session.setMode("ace/mode/html");

			// Populate with journal entry source code
			editor.setValue(sourceContent);

			// Show keyboard shortcuts
			editor.commands.addCommand({
				name: "showKeyboardShortcuts",
				bindKey: { win: "Ctrl-Alt-h", mac: "Command-Alt-h" },
				// eslint-disable-next-line no-shadow
				exec: editor => {
					ace.config.loadModule("ace/ext/keybinding_menu", module => {
						module.init(editor);
						editor.showKeyboardShortcuts();
					});
				},
			});
		} else if (editorName === "_CodeMirror") {
			// Transform div to textarea
			const textarea = this.transformElement(html, "textarea");

			// Initialize Code Mirror
			editor = CodeMirror.fromTextArea(textarea, {
				mode: "html",
				...CodeMirror.userSettings,
				lineNumbers: true,
				autofocus: true,
			});

			// Set initial value
			editor.setValue(sourceContent);
		} else if (editorName === "textarea") {
			// Transform div to textarea
			const textarea = this.transformElement(html, "textarea");
			textarea.value = sourceContent;
		}
	}

	/**
	 * Transform the Div into a Textarea and vice versa
	 * @param {HTMLElement} html - The element at the root of the sheet
	 * @param {string} type - Either "div" or "textarea"
	 * @returns {HTMLElement} The transformed element
	 */
	transformElement(html, type) {
		html.querySelectorAll("#jce-editor").forEach(el => el.remove());
		const transformed = document.createElement(type);
		html.querySelector("#jce-editor-container").append(transformed);
		transformed.id = "jce-editor";
		return transformed;
	}

	/**
	 * Update the Journal Entry with new data
	 * @override
	 */
	async _updateObject() {
		const [html] = this.element;

		// Get current editor
		const editorName = html.querySelector("#jce-select-editor").value;

		let editor, output;
		switch (editorName) {
			case "acelib":
				editor = ace.edit("jce-editor");
				output = editor.getValue();
				editor.destroy();
				break;
			case "_CodeMirror":
				editor = html.querySelector("#jce-editor + .CodeMirror").CodeMirror;
				output = editor.getValue();
				break;
			case "textarea":
				output = html.querySelector("#jce-editor").value;
				break;
		}

		// Create update package
		const data = {
			_id: this.object.id,
			content: output,
		};

		// Update if changes have been made
		if (this.object.data.content !== output) JournalEntry.updateDocuments([data]);
	}
}

// Register new Journal Entry sheets with Document Sheet Registrar (before v9.231)
Hooks.on("preDocumentSheetRegistrarInit", settings => {
	if (isNewerVersion("9.231", game.version || game.data.version)) settings["JournalEntry"] = true;
});

// Register JCE sheets
Hooks.on("ready", () => {
	// Only if this is a GM
	if (game.user.isGM) {
		Journal.registerSheet?.(Jce.ID, Jce, {
			types: ["base"],
			makeDefault: true,
			label: "Journal Code Editor",
		});

		// Alert if library is not enabled on versions before v9d2, or is enabled on later versions
		if (
			(isNewerVersion("9.231", game.version || game.data.version) &&
				!game.modules.get("_document-sheet-registrar")?.active) ||
			// Or if it is enabled on versions after that
			(!isNewerVersion("9.231", game.version || game.data.version) &&
				game.modules.get("_document-sheet-registrar")?.active)
		) {
			ui.notifications.error(`${Jce.ID} | ${game.i18n.format("jce.DSRLibrary")}`, { permanent: true });
		}
	}
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
