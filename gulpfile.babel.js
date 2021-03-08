const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const autoprefixer = require('gulp-autoprefixer');

const {
  src,
  dest,
} = require('gulp');
const cmq = require('gulp-combine-mq');


const base = 'local';
// Дополнительные пути с точкой в начале названий шаблонов прописаны для gulp.watch (он использует chokidar для поиска glob),
// т.к. он не следит за папками с точками без явного указания, в отличие от gulp.src(использует micromatch, в которую передаем опцию dot: true)
const paths = {
  styles: {
    src: [
      './local/components/**/!(*.min).scss',
      './local/components/**/.*/!(*.min).scss',
      './local/components/**/!(*.min).scss',
      './local/components/**/.*/!(*.min).scss',

      './local/templates/*/components/**/!(*.min).scss',
      './local/templates/*/components/**/.*/!(*.min).scss',
      './local/templates/.*/components/**/!(*.min).scss',
      './local/templates/.*/components/**/.*/!(*.min).scss',
    ],
    dest: `./${base}/`,
  },
  scripts: {
    src: [
      './local/components/**/!(*.min).js',
      './local/components/**/.*/!(*.min).js',
      './local/components/**/!(*.min).js',
      './local/components/**/.*/!(*.min).js',


      './local/templates/*/components/**/!(*.min).js',
      './local/templates/*/components/**/.*/!(*.min).js',
      './local/templates/.*/components/**/!(*.min).js',
      './local/templates/.*/components/**/.*/!(*.min).js',
    ],
    dest: `./${base}/`,
  },
  images: {
    src: [
      './local/templates/*/images/**/!(*.min).+(png|gif|jpg|jpeg|svg)',
      './local/templates/.*/images/**/!(*.min).+(png|gif|jpg|jpeg|svg)',

      './local/templates/*/components/**/images/**/!(*.min).+(png|gif|jpg|jpeg|svg)',
      './local/templates/*/components/**/.*/images/**/!(*.min).+(png|gif|jpg|jpeg|svg)',
      './local/templates/.*/components/**/images/**/!(*.min).+(png|gif|jpg|jpeg|svg)',
      './local/templates/.*/components/**/.*/images/**/!(*.min).+(png|gif|jpg|jpeg|svg)',
    ],
    dest: `./${base}/`,
  },
};

function styles() {
  let oldExtension;
  return gulp.src(paths.styles.src, {
    dot: true,
    base,
  })
    .pipe(rename((path) => {
      oldExtension = path.extname;
      path.extname = '.css';
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(cmq())
    .pipe(cleanCSS({ rebase: false }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(rename((path) => {
      oldExtension = path.extname;
      path.basename += '.min';
      path.extname = '.css';
    }))
  // .pipe(sourcemaps.init())
  // .pipe(changed(paths.styles.dest)) // ниже можно вставить в стрим remember(), чтобы забрать из кеша и неизмененные файлы
    .pipe(autoprefixer())
    .pipe(cleanCSS({ rebase: false }))
  // .pipe(sourcemaps.mapSources((sourcePath, file) => {
  //   sourcePath = path.basename(sourcePath, '.min.css') + oldExtension;
  //   return sourcePath;
  // }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
  return gulp.src(paths.scripts.src, {
    dot: true,
    base,
  })
    .pipe(sourcemaps.init())
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(changed(paths.scripts.dest))
    .pipe(babel())
    .pipe(uglify())
  // .pipe(sourcemaps.mapSources((sourcePath, file) => {
  //   sourcePath = `${path.basename(sourcePath, '.min.js')}.js`;
  //   return sourcePath;
  // }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function images() {
  return gulp.src(paths.images.src, {
    dot: true,
    base,
  })
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(changed(paths.images.dest))
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles, (event) => {
    console.log(event);
  });

  gulp.watch(paths.images.src, images);
}

const watching = gulp.series(gulp.parallel(styles, scripts, images), watch);
const build = gulp.parallel(styles, scripts, images);
gulp.task('watch', watching);

gulp.task('build', build);
