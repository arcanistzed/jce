# JCE

![Version](https://img.shields.io/github/v/tag/arcanistzed/jce) ![Latest Release Download Count](https://img.shields.io/github/downloads/arcanistzed/jce/latest/module.zip?label=Downloads&style=flat-square&color=9b43a8) ![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Farcanistzed%2Fjce%2Fmain%2Fmodule.json&label=Foundry%20Core%20Compatible%20Version&query=$.compatibleCoreVersion&style=flat-square&color=ff6400)

Journal Code Editor is a module for Foundry VTT that allows you to modify the source code of your Journal Entries using Ace editor or [Code Mirror](https://github.com/League-of-Foundry-Developers/codemirror-lib).

## Installation

In the setup screen, use the URL `https://raw.githubusercontent.com/arcanistzed/jce/main/module.json` to install the module.

## Usage

Just right click on a journal entry in the sidebar and you will see an option to open it up with the editor. When you are done editing, make sure to click the save button so that you don't lose your changes.
More options such as auto-open, font size or theme can be found in module settings.

### Using Ace

Press Ctrl+Alt+h or Cmd+Alt+h to view a list of all the keyboard shortcuts available. You can access the command palette by pressing F1 while focusing on the editor.

### Using Code Mirror

Install the [Code Mirror](https://github.com/League-of-Foundry-Developers/codemirror-lib) and enable it, then enable the setting in the JCE module settings.

## License

This package is under an [MIT license](LICENSE)

## Bugs

You can submit bugs via [Github Issues](https://github.com/arcanistzed/jce/issues/new/choose) or on [my Discord server](https://discord.gg/AAkZWWqVav).

## Contact me

Come hang out on my [my Discord server](https://discord.gg/AAkZWWqVav) or [click here to send me an email](mailto:arcanistzed@gmail.com?subject=JCE%20module%20for%20Foundry%20VTT).

## TODO

- Integrate directly into journal sheet
- Make editor agnostic
- Add options for parsing Markdown, text, etc. to HTML
