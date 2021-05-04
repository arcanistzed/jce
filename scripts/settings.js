Hooks.on("init", registerSettings)

function registerSettings(){
    game.settings.register("sace", "AutoOpen", {
        name: "SACE.AutoOpen.Name",
        hint: "SACE.AutoOpen.Hint",
        scope: "client",
        type: Boolean,
        config: true,
        default: false
    });

    game.settings.registerMenu("sace", "AceSettings", {
        name: "SACE.AceSettings.Name",
        label: "SACE.AceSettings.Label",
        icon: "fas fa-cogs",
        type: sace,
        restricted: false
    });
}