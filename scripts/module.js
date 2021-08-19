/** Manage JCE Journal Sheet */
class Jce extends JournalSheet {
	/** The module's ID */
	static ID = "jce";

	/** Compatible editor libraries */
	static EDITORS = ["acelib", "_CodeMirror"]

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

		// Activate the currently selected editor
		this.activateEditor(selectBox.value, html[0]);

		// Listen for whenever the select box changes
		selectBox.addEventListener("change", () => {
			// Activate the corresponding editor
			this.activateEditor(selectBox.value, html[0]);

			// Hide select box
			html[0].querySelector("#jce-sheet-header").style.display = "none";
		});

		// Save on submit
		html[0].querySelector("#jce-save").addEventListener("click", this._updateObject);
	};

	/** Activates a specific editor
	 * @param {String} editorName - The name of the editor to activate
	 * @param {HTMLElement} html - The element at the root of the sheet
	*/
	activateEditor(editorName, html) {
		// Alert and exit if module not enabled
		if (!game.modules.get(editorName)?.active) {
			ui.notifications.error("JCE | You must enable " + editorName);
			return;
		};

		// Get current Jounral Entry data
		let sourceId = this.object.id;
		let sourceContent = this.object.data.content;

		// Enable selected editor
		let editor;
		if (editorName === "acelib") {

			// Initialise ace editor
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
				exec: editor => {
					ace.config.loadModule("ace/ext/keybinding_menu", module => {
						module.init(editor);
						editor.showKeyboardShortcuts();
					})
				}
			});
		} else if (editorName === "_CodeMirror") {
			// Replace Div with Textarea
			const textarea = document.createElement("textarea");
			html.querySelector("#jce-editor").replaceWith(textarea);
			textarea.id = "jce-editor";

			// Initialise Code Mirror
			editor = CodeMirror.fromTextArea(textarea, {
				mode: "html",
				...CodeMirror.userSettings,
				lineNumbers: true,
				autofocus: true
			});

			// Set initial value
			editor.setValue(sourceContent);
		};
	};

	// When saved, update the Journal Entry with new data
	async _updateObject() {

		// Get current editor
		let editor, editorName = document.querySelector("#jce-select-editor").value;
		if (editorName === "acelib") {
			editor = ace.edit("jce-editor");
		} else if (editorName === "_CodeMirror") {
			editor = document.querySelector("#jce-editor + .CodeMirror");
		};

		// Create update package
		const output = editor.getValue();
		const data = {
			_id: this.sourceId,
			content: output
		};

		// Update if changes have been made
		if (this.sourceContent !== output) JournalEntry.updateDocuments([data]);
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
