var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'); 

var PATHS = {
	JS:{
		SRC:['./src/util.js','./src/logger.js','./src/di.js']
	}
};

function reportError(e){
	console.log(e); 
}

gulp.task('jshint',function(){
	return gulp.src(PATHS.JS.SRC)
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
});

gulp.task('concat',['jshint'],function(){
	gulp.src(PATHS.JS.SRC)
		.on('error',reportError)
		.pipe(concat('shinjector.js'))
		.pipe(gulp.dest('./'))
		.pipe(concat('shinjector.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./')); 
});

gulp.task('watch',['concat'],function(){
	gulp.watch(PATHS.JS.SRC, ['concat']);
});

gulp.task('default',['concat'],function(){

});