class JceTinyMCE {
    constructor() {
        this.createEditor();

        Hooks.on("ready", () => {
            JceTinyMCE.EDITORS.acelib.instance = ace.edit("tox-jce-editor");
            CONFIG.TinyMCE.toolbar += " jce";
            CONFIG.TinyMCE.plugins += " -jce";
        });

        tinymce.PluginManager.add(JceTinyMCE.ID, function (editor) {
            editor.ui.registry.addButton(JceTinyMCE.ID, {
                icon: "sourcecode",
                tooltip: "Journal Code Editor",
                onAction: () => {
                    JceTinyMCE.displayToxEditorModal();
                    let content = editor.dom.decode(editor.getContent({ source_view: !0 }));
                    let session = ace.createEditSession(content, "ace/mode/html");
                    JceTinyMCE.EDITORS.acelib.instance.setSession(session);
                }
            });
            return {
                getMetadata: () => {
                    return {
                        name: "Journal Code Editor",
                    };
                }
            }
        });
    };

    /** Compatible editor libraries */
    static EDITORS = {
        "acelib": {
            title: "Ace library",
            instance: {}
        },
        "_CodeMirror": {
            title: "Code Mirror",
            instance: {}
        },
        "textarea": {
            title: "Text Area",
            instance: {}
        },
    };

    static displayToxEditorModal(display = true) {
        let el = document.getElementById("tox-jce-wrap");
        if (display) {
            el.style.display = "flex";
            el.focus();
            document.body.classList.add("tox-jce__disable-scroll");
        } else {
            el.style.display = "none";
            document.body.classList.remove("tox-jce__disable-scroll");
            tinymce.activeEditor.focus();
        }
    }
    static saveContent() {
        const editor = tinymce.activeEditor;
        editor.focus();
        editor.undoManager.transact(() => editor.setContent(JceTinyMCE.getValue()));
        editor.selection.setCursorLocation();
        editor.nodeChanged();
        JceTinyMCE.displayToxEditorModal(false);
    }
    static getValue() {
        return JceTinyMCE.EDITORS.acelib.instance.getValue();
    };

    async createEditor() {
        const jce = document.createElement("div");
        jce.id = "tox-jce-wrap";
        jce.innerHTML = await renderTemplate("modules/jce/templates/jce.hbs", {
            editors: Object.keys(JceTinyMCE.EDITORS).filter(editor => game.modules.get(editor.name)?.active || editor.name === "textarea"),
        });
        document.body.appendChild(jce);
    };
};

Hooks.on("init", () => new JceTinyMCE());
