'use strict';

import gulp from 'gulp';
import frontendPackageChangeCheck from './gulp/front-package-watcher';


frontendPackageChangeCheck(gulp);

gulp.task(
    'default',
    gulp.series( 'check-package' )
);
