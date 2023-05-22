const fs = require('fs');
const { src, dest, series, symlink} = require('gulp');
const replace = require('gulp-replace');
const rename = require('gulp-rename');

const macroTokenRegex = /\$[A-Z0-9_]+\$/g;

const macroTransformRegex = /_[a-z]/g;

class BuildLog {
    // From build config/settings
    name = "New Heaps Project";
    company = "DefaultCompany";
    version = "0.0.0";
    tier = "dev";
    targets = [];

    // Generated
    targetFiles = [];
    outputDirs = [];

    constructor(shouldLoadFromFile = false){
        if(!shouldLoadFromFile) return;

        let str = fs.readFileSync('../../temp/build-log.json', 'utf8');
        let obj = JSON.parse(str);
        this.name = obj["name"];
        this.company = obj["company"];
        this.version = obj["version"];
        this.tier = obj["tier"];
        this.targets = obj["targets"];
        this.outputDirs = obj["outputDirs"];
    }

    store(){
        let data = JSON.stringify(this);
        fs.writeFileSync('../../temp/build-log.json', data);
    }
}

function getParam(paramKey){
    let keyArgIdx = process.argv.indexOf(paramKey);
    if(keyArgIdx <= -1 || keyArgIdx === process.argv.length - 1){
        console.log("Missing argument: " + paramKey);
        return null;
    }

    return process.argv[keyArgIdx + 1];
}

// Parse the project settings json
function loadProjectSettings() {
    let str = fs.readFileSync("../project-settings.json", 'utf8');
    return JSON.parse(str);
}



// Create temporary build targets with project settings information.
function setBuildConfig(done){
    let buildLog = new BuildLog();

    let projSettings = loadProjectSettings();
    buildLog.name = projSettings["application"]["name"];
    buildLog.version = projSettings["application"]["version"];

    let targetsParam = getParam("--target"); // can be one or many targets separated by a comma and no space.
    buildLog.targets = targetsParam.split(','); // TODO: change this
    buildLog.tier = getParam("--tier");  // can be "dev" or "dist"

    let dirFormat = projSettings["build"]["directoryFormat"];

    buildLog.targets.forEach((target) => {
        // $MY_MACRO_NAME$ => myMacroName => buildLog[myMacroName]
        buildLog.outputDirs.push(dirFormat.replaceAll(macroTokenRegex, (tok) => {
            let macroName = tok.substring(1, tok.length - 1)
                .toLowerCase()
                .replaceAll(macroTransformRegex, (wordStartChar) => {
                    return wordStartChar.charAt(1).toUpperCase()
                });
            if(macroName === 'target') {
                return target;
            }
            return buildLog[macroName].toString();
        }));
    });
    buildLog.store();

    // Create temporary config hxml file for target
    let genHxmlString = "# Generated file\n";
    if(buildLog.tier === "dev"){
        genHxmlString += "--debug\n--each\n";
    }

    let i = 0;
    let numTargets = buildLog.targets.length;
    buildLog.targets.forEach(target => {
        let targetFile = `${buildLog.tier}-${target}.hxml`;
        buildLog.targetFiles.push(targetFile);
        genHxmlString += `temp/build/targets/${targetFile}\n`;
        if(i < numTargets -1){
            genHxmlString += "--next\n"
        }
        i++;
    });

    fs.writeFileSync('../../temp/build/config-generated.hxml', genHxmlString);

    // Copy and transform build targets to temp dir
    buildLog.targetFiles.forEach((targetFile, idx) => {
        return src(`../build-targets/${targetFile}`)
            .pipe(replace('replaceme-output-dir', buildLog.outputDirs[idx]))
            .pipe(replace('replaceme-application-name', buildLog.name))
            .pipe(dest('../../temp/build/targets/'));

    });
    done();
}

// Copy web container to the build output directories and replace project settings macros.
function prepareWebContainer() {
    let buildLog = new BuildLog(true);
    let webOutputDir = buildLog.outputDirs.find((dir) => dir.contains("web"));

    return src('../../template/index.html')
        .pipe(replace('replaceme-application-name', buildLog.name))
        .pipe(dest(`../../${webOutputDir}`));
}


// Register build steps in Gulp
exports.prepareBuild = setBuildConfig;
exports.prepareWebContainer = prepareWebContainer;