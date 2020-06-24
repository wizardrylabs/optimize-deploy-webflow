const { src, dest, series, parallel } = require('gulp');

const INPUT_PATH = process.env.INPUT || `${__dirname}/export.zip`;
const BUILD_DIR = process.env.OUTPUT || `${__dirname}/build`;
const TMP_PATH = `${__dirname}/tmp`;

const GLOB = {
  CSS: `${TMP_PATH}/css/**/*.css`,
  JS: `${TMP_PATH}/js/**/*.js`,
  HTML: `${TMP_PATH}/**/*.html`
};

const unzip = () => src(INPUT_PATH)
  .pipe(require('gulp-unzip')())
  .pipe(dest(TMP_PATH));

const cleanBuild = () => src(BUILD_DIR, { read: false, allowEmpty: true })
  .pipe(require('gulp-clean')());

const cleanTmp = () => src(TMP_PATH, { read: false })
  .pipe(require('gulp-clean')());

const css = () => {
  const postcss = require('gulp-postcss');
  return src(GLOB.CSS)
    .pipe(postcss([
      require('autoprefixer'),
      require('cssnano'),
    ]))
    .pipe(dest(`${BUILD_DIR}/css`));
}

const js = () => {
  const uglify = require('gulp-uglify');
  const strip = require('gulp-strip-comments');
  return src(GLOB.JS)
    .pipe(strip())
    .pipe(uglify())
    .pipe(dest(`${BUILD_DIR}/js`));
};

const html = () => {
  const htmlmin = require('gulp-htmlmin');
  return src(GLOB.HTML)
    .pipe(htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true
    }))
    .pipe(dest(BUILD_DIR));
};

const copy = () => {
  const copy = require('gulp-copy');
  const globs = [
    `${TMP_PATH}/**/*.*`,
    `!${GLOB.HTML}`,
    `!${GLOB.JS}`,
    `!${GLOB.CSS}`
  ];
  return src(globs)
    .pipe(copy(BUILD_DIR, { prefix: 1 }))
    .pipe(dest(BUILD_DIR))
};

const optimize = series(
  parallel(
    cleanBuild,
    unzip,
  ),
  parallel(
    css,
    js,
    html,
    copy,
  ),
  cleanTmp,
);

exports.default = series(optimize);
