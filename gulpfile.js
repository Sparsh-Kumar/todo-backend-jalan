const gulp = require("gulp");
const ts = require("gulp-typescript");
const nodemon = require("gulp-nodemon");

const tsProject = ts.createProject("tsconfig.json");

const SRC_DIR = "src";
const DEST_DIR = "dist";
const CONFIG_DIR = "config";

const BUILD_TASKS = ["compile", "copy_locales"];

gulp.task("compile", () => {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
});

gulp.task("copy_locales", () => {
  return gulp
    .src([`${SRC_DIR}/locales/*.json`])
    .pipe(gulp.dest(`${DEST_DIR}/locales/`));
});

gulp.task("build", gulp.series(BUILD_TASKS));

gulp.task(
  "serve",
  gulp.series("build", () => {
    nodemon({
      exec: `node ./${DEST_DIR}/server/server`,
      watch: [`${SRC_DIR}/**/*.*`, CONFIG_DIR],
      tasks: BUILD_TASKS,
    });
  })
);
