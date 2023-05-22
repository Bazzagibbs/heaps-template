# Heaps.io Template

This is an empty template for creating a new Heaps.io project.

## Build Config Setup (Intellij)

Due to current limitations with the intellij-haxe plugin, only one hxml file can be used for all build configs. Unfortunately this means each time you change your selected build config, you'll need to also change the target hxml file.

1. Set your project's HXML file: "Project Structure > Modules > (project) > Haxe > HXML file".
   - HXML files are located in "config/build-targets"
2. Set appropriate Intellij Run Config. 
   - For any distribution build, use "Distribution - Web" as distribution native builds need further compilation.

Build configs that include a web target should include a post-build task, "Build artifacts > Prepare web container X" depending on whether it is a dev or dist config.

Note: dist-port and dist-win builds will output C code into its "intermediate" output directory. A C compiler will be required for each native target from there.

## Build Config Setup (VSCode)

Work in progress

## Build target differences

- "Port" builds use the SDL graphics backend. 
- "Win" builds use DirectX. Only required if using DX12-specific features, as SDL supports up to DX11.

