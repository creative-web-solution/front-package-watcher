'use strict';

let fs              = require( 'fs-extra' );
let path            = require( 'path' );
let gutil           = require( 'gulp-util' );
let PluginError     = gutil.PluginError;

const PLUGIN_NAME       = 'gulp-packages-change-check';
const CACHE_FOLDER_PATH = [ __dirname, '../filescache' ].join( '/' )

module.exports = function Watcher() {

    function hasPropertyChange( property, fileContent, cachedFile ) {
        let keys;

        if ( !fileContent[ property ] || !cachedFile[ property ] ) {
            return true;
        }

        keys = Object.keys( fileContent[ property ] );

        for (let index = 0; index < keys.length; index++) {
            const key = keys[ index ];

            if ( fileContent[ property ][ key ] !== cachedFile[ property ][ key ] ) {
                return true;
            }
        }

        return false;
    }

    function cleanFilePath( filePath ) {
        return [ CACHE_FOLDER_PATH, filePath.replace( /[/\\]/g, '_' ) ].join( '/' );
    }


    function compare( options, fileContent, filePath ) {
        const cleanPath = cleanFilePath( filePath );

        return new Promise(function(resolve, reject) {
            let hasChange, cachedFile;

            if ( !fs.existsSync( cleanPath ) ) {
                fs.outputFile( cleanPath, Buffer.from( JSON.stringify( fileContent ) ) )
                    .then( function() {
                        resolve();
                    } );

                    return;
            }

            cachedFile = fs.readFileSync( cleanPath, 'utf8' );

            for (let index = 0; index < options.properties.length; index++) {
                const property = options.properties[ index ];

                if ( hasPropertyChange( property, fileContent, JSON.parse( cachedFile ) ) ) {
                    hasChange = true;
                    break;
                }
            }

            if ( hasChange ) {
                reject();
            }
            else {
                resolve();
            }
        });
    }


    this.check = function( options, file, cb ) {
        let fileName = path.basename( file.path );

        console.log( '\x1b[32m%s\x1b[0m', '>>> ', [ 'Checking "', fileName, '" for changes ' ].join( '' ) );

        let fileContent = JSON.parse( file.contents.toString() );

        compare( options, fileContent, file.path )
            .then( function() {
                console.log( '\x1b[32m%s\x1b[0m', '>>> ', [ 'No change found in "', fileName, '"' ].join( '' ) );
                cb();
            } )
            .catch( function( err ) {
                if ( !err ) {
                    console.log( '\x1b[32m%s\x1b[0m', '>>> ',
                    '-----------------------------------------------------' );
                    console.log( '\x1b[32m%s\x1b[0m', '>>> ',
                    '-                                                   -' );
                    console.log( '\x1b[32m%s\x1b[0m', '>>> ',
                    [ '-       Warning: "', fileName, '" has changes!!       -' ].join( '' ) );
                    console.log( '\x1b[32m%s\x1b[0m', '>>> ',
                    '-           You must update your packages           -' );
                    console.log( '\x1b[32m%s\x1b[0m', '>>> ',
                    '-                                                   -' );
                    console.log( '\x1b[32m%s\x1b[0m', '>>> ',
                    '-----------------------------------------------------' );

                    cb();
                    process.exit(0);
                }

                cb( new PluginError( PLUGIN_NAME, err ) );
            } );
    };


    this.updateCache = function( file, cb ) {
        const cleanPath = cleanFilePath( file.path );
        fs.outputFile( cleanPath, file.contents.toString() )
            .then( function() {
                cb();
            } );
    }
}
