// gulpfile.mjs
import gulp from "gulp";
const { src, dest, watch, series, parallel } = gulp;

import dartSass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import sourcemaps from "gulp-sourcemaps";
import cssnano from "cssnano";

import imagemin from "gulp-imagemin";
import webp from "gulp-webp";
import avif from "gulp-avif";

// Compilar SASS → CSS
export function css() {
  return (
    src("src/scss/app.scss")
      .pipe(sourcemaps.init())
      .pipe(dartSass().on("error", dartSass.logError))
      // .pipe(postcss([autoprefixer(), cssnano()]))
      .pipe(postcss([autoprefixer()]))
      .pipe(sourcemaps.write("."))
      .pipe(dest("build/css"))
  );
}

// Optimizar imágenes
export function imagenes() {
  return src("src/img/**/*")
    .pipe(imagemin({ optimizationLevel: 3 }))
    .pipe(dest("build/img"));
}

// WebP y AVIF
export const versionWebp = () =>
  src("src/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 50 }))
    .pipe(dest("build/img"));
export const versionAvif = () =>
  src("src/img/**/*.{png,jpg}")
    .pipe(avif({ quality: 50 }))
    .pipe(dest("build/img"));

// Watch
export function dev() {
  watch("src/scss/**/*.scss", css);
  watch("src/img/**/*", series(imagenes, versionWebp, versionAvif));
}

// Tarea por defecto
export default series(imagenes, versionWebp, versionAvif, css, dev);
