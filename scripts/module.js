var sourceContent;

// If the user has enabled it, when a journal sheet is opened, render the jce editor
Hooks.on("renderJournalSheet", app => {
	var AutoOpen = game.settings.get("jce", "AutoOpen");
	if (AutoOpen === true) {
		var sourceContent = app.object.data.content.trim();
		var sourceTitle = app.object.data.name;
		var sourceId = app.object.data._id;
		new jce(sourceTitle, sourceContent, sourceId).render(true);
	};
});

// create jce editor Form Application
class jce extends FormApplication {
	constructor(sourceTitle, sourceContent, sourceId) {
		super();
		this.sourceTitle = sourceTitle;
		this.sourceContent = sourceContent;
		this.sourceId = sourceId;
		this.options.title = `${game.i18n.localize("Simple Ace Code Editor")}: ${this.sourceTitle}`;
	};

	// configure Form Application options
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['form'],
			popOut: true,
			resizable: true,
			template: `modules/jce/templates/jceEditor.html`,
			id: 'journal-code-editor',
			width: window.innerWidth * 3 / 4
		});
	};

	// when saved, update journal entry with new data
	async _updateObject() {

		var editor;
		var useCodeMirror;

		// Check if user is using CodeMirror or Ace
		if (game.modules.get("_CodeMirror")?.active) {
			useCodeMirror = game.settings.get("jce", "CodeMirror");
		};
		if (useCodeMirror === true) {
			editor = document.getElementsByClassName("CodeMirror")[0].CodeMirror;
		} else {
			editor = ace.edit(document.getElementById("jce-editor"));
		};
		var output = editor.getValue();
		var data = {
			_id: this.sourceId,
			content: output
		};
		JournalEntry.update([data]);
	};
};

// Add context menu option for opening the jce editor
Hooks.on('getJournalDirectoryEntryContext', (_html, contextEntries) => {
	contextEntries.push({
		name: game.i18n.localize("jce.ContextMenu"),
		icon: `<i class="fas fa-code"></i>`,
		condition: {},
		callback: data => {
			var sourceId = data[0].dataset.entityId;
			var sourceJournal = game.journal.get(sourceId);
			if (sourceJournal.data.content != null) { var sourceContent = sourceJournal.data.content.trim() }; // only trim content if content exists
			var sourceTitle = sourceJournal.data.name;

			new jce(sourceTitle, sourceContent, sourceId).render(true); // render jce editor
		}
	})
});

Hooks.on("renderjce", app => {

	var editor;
	var useCodeMirror;

	// Check if user wants to use CodeMirror or Ace
	if (game.modules.get("_CodeMirror")?.active) {
		useCodeMirror = game.settings.get("jce", "CodeMirror");
	};
	if (useCodeMirror === true) {

		// Initialise Code Mirror
		var ce = document.getElementById("jce-editor");
		var editor = CodeMirror(node => ce.parentNode.replaceChild(node, ce), {
			value: app.sourceContent,
			mode: "html",
			...CodeMirror.userSettings,
			lineNumbers: true,
			inputStyle: "contenteditable",
			autofocus: true
		});
		editor.setSize(null, app.position.height);
	} else {
		// initialise ace editor
		editor = ace.edit(document.getElementById("jce-editor"));

		// set ace options
		editor.setOptions(jceConfig.userSettings);

		// populate with journal entry source code
		editor.setValue(app.sourceContent);

		// show keyboard shortcuts
		editor.commands.addCommand({
			name: "showKeyboardShortcuts",
			bindKey: { win: "Ctrl-Alt-h", mac: "Command-Alt-h" },
			exec: editor => {
				ace.config.loadModule("ace/ext/keybinding_menu", module => {
					module.init(editor);
					editor.showKeyboardShortcuts()
				})
			}
		});

		// suppress DOCTYPE warning
		var session = editor.getSession();
		session.on("changeAnnotation", () => {
			var annotations = session.getAnnotations() || [], i = len = annotations.length;
			while (i--) {
				if (/doctype first\. Expected/.test(annotations[i].text)) {
					annotations.splice(i, 1);
				};
			};
			if (len > annotations.length) {
				session.setAnnotations(annotations);
			};
		});
	};
});