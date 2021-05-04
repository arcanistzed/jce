Hooks.on("init", registerSettings)

function registerSettings(){
    game.settings.register("sace", "AutoOpen", {
        name: "Auto-Open Editor",
        hint: "When enabled, the sace editor will open each time you open a journal entry.",
        scope: "client",
        type: Boolean,
        config: true,
        default: false
    });

    game.settings.registerMenu("sace", "AceSettings", {
        name: "Configure Ace",
        label: "Ace Settings",
        icon: "fas fa-cogs",
        type: sace,
        restricted: false
    });
}