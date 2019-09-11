'use strict';

let through = require( 'through2' );
let Watcher = require( './watcher' );
let watcher = new Watcher();


// plugin level function (dealing with files)
module.exports = function( userOptions ) {
    let options = {
        "properties": [ 'dependencies', 'devDependencies' ]
    };

    if ( userOptions && userOptions !== 'update-cache' ) {
        options = Object.assign( options, userOptions );
    }

    // creating a stream through which each file will pass
    return through.obj(
        function( file, enc, cb ) {

            if ( userOptions === 'update-cache' ) {
                watcher.updateCache( file, cb );
                this.push( file );
                return;
            }

            watcher.check( options, file, cb );

            // make sure the file goes through the next gulp plugin
            this.push( file );
        }
    );
}

