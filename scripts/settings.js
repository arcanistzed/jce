/** 
 * Defines a set of configuartion options for jce editors
 */
Hooks.once("init", function () {
    const namespace = "jce";

    /**
     * Registers a single game setting for this module.
     *
     * The settings is registered with the module's namespace, 
     * and the name and hint are assigned translated values 
     * based on the setting name.
     *
     * @param {string} name - The name of the setting
     */
    const register = name => {
        game.settings.register(namespace, name, {
            name: game.i18n.localize(`${namespace}.settings.${name}.Name`),
            hint: game.i18n.localize(`${namespace}.settings.${name}.Hint`),
            scope: "client",
            config: true,
            type: Boolean,
            default: false,
            config: true
        });
    }

    // If user has activated CodeMirror, add the option to use it instead
    if (game.modules.get("_CodeMirror")?.active) {
        register("CodeMirror");
    }

    register("AutoOpen");
});