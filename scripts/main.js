var sourceContent;

// when a journal sheet is opened, render the sace editor
Hooks.on("renderJournalSheet", app => {
	var sourceContent = app.object.data.content.trim();
	var sourceTitle = app.object.data.name
	var sourceId = app.object.data._id
	new sace(sourceTitle, sourceContent, sourceId).render(true);
});

// create sace editor Form Application
class sace extends FormApplication {
	constructor(sourceTitle, sourceContent, sourceId) {
		super();
		this.sourceTitle = sourceTitle;
		this.sourceContent = sourceContent;
		this.sourceId = sourceId;
	}

	// configure Form Application options
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
		classes: ['form'],
		popOut: true,
		resizable: true,
		template: `modules/sace/saceEditor.html`,
		id: 'simple-ace-code-editor',
		title: `Simple Ace Code Editor: ${this.sourceTitle}`,
		width: window.innerWidth * 3/4
	  });
	}

	// when saved, update journal entry with new data
	async _updateObject() {
		var editor = ace.edit(document.getElementById("editor"));
		var output = editor.getValue()
		var data = {
			_id: this.sourceId,
			content: output
		};
		JournalEntry.update(data);
	}
}

Hooks.on("rendersace", app => {

	// initialise ace editor
	var editor = ace.edit(document.getElementById("editor"));
	
	// populate with journal entry source code
	editor.setValue(app.sourceContent);
	
	// set default options
	editor.setOptions({
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
		enableEmmet: true,
		useElasticTabstops: true,
		spellcheck: true
	});

	// show keyboard shortcuts
	editor.commands.addCommand({
        name: "showKeyboardShortcuts",
        bindKey: {win: "Ctrl-Alt-h", mac: "Command-Alt-h"},
        exec: function(editor) {
            ace.config.loadModule("ace/ext/keybinding_menu", function(module) {
                module.init(editor);
                editor.showKeyboardShortcuts()
            })
        }
    })

	editor.commands.addCommands(whitespace.commands); // add commands from "src/ext-whitespace.js"

	//suppress DOCTYPE warning
	var session = editor.getSession();
	session.on("changeAnnotation", function() {
  	var annotations = session.getAnnotations()||[], i = len = annotations.length;
  	while (i--) {
    	if(/doctype first\. Expected/.test(annotations[i].text)) {
      		annotations.splice(i, 1);
    	}
 	}
  	if(len>annotations.length) {
    	session.setAnnotations(annotations);
  	}
});
});