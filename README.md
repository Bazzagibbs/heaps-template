# Heaps.io Template

This is an empty template for creating a new Heaps.io project.

## Build System Setup (Experimental)

Work In Progress: the current build system is annoying due to differences between the way intellij-haxe and vscode-haxe handle build.hxml files. While vscode-haxe can specify a per-config hxml, intellij-haxe requires a single hxml target for the entire module. It may be better to focus efforts to the development of the intellij-haxe plugin instead of hacking around it.
Also, hxml's lack of string macros is frustrating, but perhaps environment variables could be used to set file names/version/etc?

---

For exporting games using data from "config/project-settings.json", build configurations have to be set up manually.
1. Add a Gulp task from gulpfile.js -> "prepareBuild"
2. As the task's parameters, set the `--tier` and `--target` values appropriately, e.g. `--tier dev --target web` for a development web build.
3. Set the configuraton's custom run file to whatever is set as the output in the build target's hxml file. By default, this will be like "bin/TIER/APP_VERSION/TARGET/APPLICATION_NAME.EXT", e.g. "bin/dev/0.0.1/win/My Heaps Project.hl"
   - Note: web builds should run "index.html" instead of "APPLICATION_NAME.EXT"
4. Set "Project Structure > Modules > (project) > Haxe > HXML file" to "build.hxml" located in the root directory.

Should you wish to run static hl builds again, change the HXML file to "config/build-targets/build-manual.hxml" and set your configuration's run file to "bin/dev/editor/application.hl"

## Build system Gulp parameters

Files can be preprocessed using Gulp. The gulpfile is located in [config/gulp/gulpfile.js](config/gulp/gulpfile.js).

Pass the following parameters as arguments to the gulp invocation:

- `--tier`: dev, dist
- `--target`: port, web, win
  - Multiple may be passed in the following format: `--target port,web,win`
  