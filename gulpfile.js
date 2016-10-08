const gulp = require("gulp");
const less = require("gulp-less");
const browserify = require("browserify");
const cleanCSS = require("gulp-clean-css");
const source = require("vinyl-source-stream");

let debug = false;

gulp.task("debug", () => {debug = true;});

gulp.task("scripts", () => {
	browserify("./scripts/index.js", {debug})
		.transform("babelify", {presets: ["es2015"]})
		.transform("uglifyify", {global: true})
		.bundle()
		.on("error", (error) => console.log(error.toString()))
		.pipe(source("index.js"))
		.pipe(gulp.dest("./static/"));
});

gulp.task("styles", () => {
	return gulp.src("./styles/index.less")
		.pipe(less({
			paths: [__dirname + "/styles", __dirname + "/node_modules"]
		}))
		.pipe(cleanCSS())
		.pipe(gulp.dest("./static"));
});

gulp.task("watch", () => {
	gulp.watch("./scripts/**", ["scripts"]);
	gulp.watch("./styles/**", ["styles"]);
});

gulp.task("default", ["scripts", "styles"]);
gulp.task("dev", ["debug", "default", "watch"]);
