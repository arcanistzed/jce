Hooks.on("init", registerSettings)

function registerSettings(){
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
        type: sace,
        restricted: false
    });
}