'use strict';

import watcher from '../watcher/gulp-watcher.js'

export default ( gulp ) => {
    gulp.task(
        'check-package',
        () => {
            return gulp
            .src( 'package.json' )
            .pipe( watcher( {
                "properties": [ 'dependencies', 'devDependencies' ]
            } ) );
        }
    );

    gulp.task(
        'save-package',
        () => {
            return gulp
            .src( 'package.json' )
            .pipe( watcher( 'update-cache' ) );
        }
    );
};
