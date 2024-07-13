const fs = require('fs');
const path = require('path');

const fileTypes = [
    'js',
    'ts',
    'tsx',
];

function readFolder(folder) {
    let lines = 0;
    for (let file of fs.readdirSync(path.join(__dirname, folder))) {
        if (!file.includes('.')) lines += readFolder(folder+ '/' +file);
        else lines += readFile(folder+ '/' +file);
    }
    return lines;
}

function readFile(file) {
    const split = file.split('.');
    if (!fileTypes.includes(split[split.length-1])) return 0;  // Check file type
    
    return fs.readFileSync(path.join(__dirname, file), 'utf8').split('\n').length;
}

console.log(readFolder('./'));