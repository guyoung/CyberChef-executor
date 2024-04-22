
const path = require("path");
const webpack = require("webpack");

const nodeFlags = "--experimental-modules --experimental-json-modules --experimental-specifier-resolution=node --no-warnings --no-deprecation";

module.exports = function (grunt) {
    grunt.file.defaultEncoding = "utf8";
    grunt.file.preserveBOM = false;

    // Tasks
    grunt.registerTask("build",
        "A persistent task which creates a development build whenever source files are modified.",
        ["clean:build", 
        "clean:config",    
        "copy:crypto",    
        "exec:generateConfig", 
        "webpack"]);

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks("grunt-webpack");
    grunt.loadNpmTasks('grunt-contrib-copy');

    function chainCommands(cmds) {
        const win = process.platform === "win32";
        if (!win) {
            return cmds.join(";");
        }
        return cmds
            // && means that subsequent commands will not be executed if the
            // previous one fails. & would coninue on a fail
            .join("&&")
            // Windows does not support \n properly
            .replace(/\n/g, "\\n");
    }


    grunt.initConfig({
        clean: {
            build: ["dist/*"],
            config: ["src/core/config/OperationConfig.json", "src/core/config/modules/*", "src/code/operations/index.mjs"],

        },

        webpack: {
            myconfig: () => ({
                //mode: "production",
                mode: "development",
               
                entry: {
                    main: "./src/update/index.js"
                },
                output: {
                    path: __dirname + "/dist",
                    filename: "[name].js",
                    library: {
                        name: 'chef',
                        type: 'umd',
                        export: 'default',
                    },
                   globalObject: "this",
                   publicPath: './'
                },
                plugins: [
                    new webpack.ProvidePlugin({

                        log: "loglevel",
                        // process and Buffer are no longer polyfilled in webpack 5 but
                        // many of our dependencies expect them, so it is easiest to just
                        // provide them everywhere as was the case in webpack 4-
                        process: "process",
                        Buffer: ["buffer", "Buffer"],

                     
                    }),
                    new webpack.DefinePlugin({                       
                        "process.browser": "true"
                    }),
                ],
                resolve: {
                    extensions: [".mjs", ".js", ".json"], // Allows importing files without extensions
                    alias: {
                        "zlibjs": path.resolve(__dirname,'node_modules/zlib-module-js'),
                        "isomorphic-fetch": path.resolve(__dirname,'node_modules/fetchapi-module'),
                        "randombytes": path.resolve(__dirname,'node_modules/randombytes-adapter'),

                        "jimp": path.resolve(__dirname,"node_modules/jimp/es"),

                        "chi-squared": path.resolve(__dirname,'src/update/chi-squared'),
                        "crypto-api": path.resolve(__dirname,'src/update/crypto-api'),
                        "node-forge": path.resolve(__dirname,'src/update/node-forge'),
                        "node-md6": path.resolve(__dirname,'src/update/node-md6'),
                        
                        
                        // Setting resolve.alias to false will tell webpack to ignore a module.
                        "fs": false,
                        "child_process": false,
                        "net": false,
                        "tls": false,                             
                        "load-bmfont": false   

                    },
                    fallback: {         
                        "process": require.resolve('process/browser'),
                        "path": require.resolve("path/"),
                        "buffer": require.resolve("buffer/"),
                        "assert": require.resolve("assert/"),
                        "crypto": require.resolve("crypto-browserify"),
                        "stream": require.resolve("stream-browserify"),
                        "zlib": require.resolve("browserify-zlib"),
                        "vm": require.resolve("vm-browserify"),

                      
                                  
                    }
                },
                module: {
                    /***
                    argon2-browser loads argon2.wasm by itself, so Webpack should not load it
                    noParse: /argon2\.wasm$/,
                    ***/
                    rules: [
                        {
                            test: /\.m?js$/,
                            exclude: /node_modules\/(?!crypto-api)/,
                            options: {
                                configFile: path.resolve(__dirname, "babel.config.js"),
                                cacheDirectory: true,
                                compact: false
                            },
                            type: "javascript/auto",
                            loader: "babel-loader"
                        },
                        /***
                        {
                            test: /node-forge/,
                            loader: "imports-loader",
                            options: {
                                additionalCode: "var jQuery = false;"
                            }
                        },
                        ***/
                       /***
                        {
                            // Load argon2.wasm as base64-encoded binary file expected by argon2-browser
                            test: /argon2\.wasm$/,
                            loader: "base64-loader",
                            type: "javascript/auto"
                        },
                        ***/
                       /***
                        {
                            test: /\.(ico|eot|ttf|woff|woff2)$/,
                            type: "asset/resource",
                        },
                        {
                            test: /\.svg$/,
                            type: "asset/inline",
                        },
                        { // Store font .fnt and .png files in a separate fonts folder
                            test: /(\.fnt$|bmfonts\/.+\.png$)/,
                            type: "asset/resource",
                            generator: {
                                filename: "assets/fonts/[name][ext]"
                            }
                        },
                        { // First party images are saved as files to be cached
                            test: /\.(png|jpg|gif)$/,
                            exclude: /(node_modules|bmfonts)/,
                            type: "asset/resource",
                            generator: {
                                filename: "images/[name][ext]"
                            }
                        },
                        { // Third party images are inlined
                            test: /\.(png|jpg|gif)$/,
                            exclude: /web\/static/,
                            type: "asset/inline",
                        },
                        ***/
                    ]
                },

                ignoreWarnings: [
                    /source-map/,
                    /source map/,
                    /dependency is an expression/,
                    /export 'default'/,
                    /Can't resolve 'sodium'/
                ],
            }),
        },

        copy: {
            crypto: {
                expand: true,
                cwd: 'src/update/crypto-api',
                src: '**',               
                dest: 'node_modules/crypto-api',
              },
          
        },


        exec: {

            generateConfig: {
                command: chainCommands([
                    "echo '\n--- Regenerating config files. ---'",
                    "echo [] > src/core/config/OperationConfig.json",
                    `node ${nodeFlags} src/update/scripts/generateOpsIndex.mjs`,
                    `node ${nodeFlags} src/update/scripts/generateConfig.mjs`,
                    "echo '--- Config scripts finished. ---\n'"
                ]),
                sync: true
            },
            

            fixCryptoApiImports: {
                command: function () {
                    switch (process.platform) {
                        case "darwin":
                            return `find ./node_modules/crypto-api/src/ \\( -type d -name .git -prune \\) -o -type f -print0 | xargs -0 sed -i '' -e '/\\.mjs/!s/\\(from "\\.[^"]*\\)";/\\1.mjs";/g'`;
                        default:
                            return `find ./node_modules/crypto-api/src/ \\( -type d -name .git -prune \\) -o -type f -print0 | xargs -0 sed -i -e '/\\.mjs/!s/\\(from "\\.[^"]*\\)";/\\1.mjs";/g'`;
                    }
                },
                stdout: false
            },
       
        }

    });
};

