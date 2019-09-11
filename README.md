# Frontend Package.json change watcher

Check if the package.json has changed and warn the user.

## Gulp tasks

```js
import watcher from 'front-package-watcher/watcher/gulp-watcher.js'

gulp.task(
    'check-package',
    () => {
        return gulp
                .src( 'package.json' )
                .pipe( watcher() );
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
```


## Check command

To check if the package change:

```
$ gulp check-package
```


## Cache update command

After a package install, run:

```
$ gulp save-package
```

It will update the cached file which we compare to.

**Auto cache update**

Add the cache update command in the `postinstall` property of the npm-scripts:

```json
{
    ...,
    "scripts": {
        "postinstall": "gulp save-package"
    },
    ...
}
```


## Options

You can list the properties to check in the options.

These are the default options:

```js
    watcher( {
        "properties": [ 'dependencies', 'devDependencies' ]
    } );
```
