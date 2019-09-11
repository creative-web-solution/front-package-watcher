const presets = [
    ["@babel/env", {
        "useBuiltIns": false,
        "debug": false,
        "configPath": "./src/js/",
        "corejs": 3
    }]
];

const plugins = [
];

module.exports = {
    presets,
    plugins
};
