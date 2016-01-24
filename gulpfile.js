const gulp       = require('gulp');
const supervisor = require('gulp-supervisor');
const plumber    = require('gulp-plumber');
const webpack    = require('webpack-stream');

gulp.task('default', ['server', 'webpack'])

gulp.task('server', () => {
  supervisor('./bin/www', {
    ignore: ['./public']
  })
});

gulp.task('build', () => {
  return gulp.src('public/javascripts/main.js')
    .pipe(plumber())
    .pipe(webpack({
      watch: false,
      output: { filename: 'bundle.js' },
      module: {
        loaders: [{
          loader: 'babel',
          exclude: /node_modules/,
          test: /\.js[x]?$/,
          query: {
            cacheDirectory: false,
            presets: ['react', 'es2015']
          }
        }],
      }
    }))
    .pipe(gulp.dest('public/javascripts/'))
});

gulp.task('webpack', () => {
  return gulp.src('public/javascripts/main.js')
    .pipe(plumber())
    .pipe(webpack({
      watch: true,
      output: { filename: 'bundle.js' },
      module: {
        loaders: [{
          loader: 'babel',
          exclude: /node_modules/,
          test: /\.js[x]?$/,
          query: {
            cacheDirectory: true,
            presets: ['react', 'es2015']
          }
        }],
      }
    }))
    .pipe(gulp.dest('public/javascripts/'))
});
