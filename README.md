# Heaps.io Template

This is an empty template for creating a new Heaps.io project.

## Build system macros

Files can be preprocessed using Gulp. The gulpfile is located in [config/gulp/gulpfile.js](config/gulp/gulpfile.js).

Pass the following parameters as arguments to the gulp invocation:

- `--tier`: dev, dist
- `--target`: port, web, win
  - Multiple may be passed in the following format: `--target port,web,win`
  - The first target listed will be run after building.