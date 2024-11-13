const Image = require("@11ty/eleventy-img");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { minify } = require('html-minifier-terser');
const { DateTime } = require('luxon');


// helper imports
// import transformCSS from './helpers/transform/css.js';
// import transformHTML from './helpers/transform/html.js';
// import transformJS from './helpers/transform/js.js';

// import base64 from './helpers/base64.js';
// import { formatDate } from './helpers/dates.js';

// Filters
// import mimetype from './elva/filters/mimetype.js';
// import random from './elva/filters/random.js';

// import sort from './elva/filters/sort.js';
// import where from './elva/filters/where.js';


// 11ty setup
module.exports = function(eleventyConfig) {

    // plugins
    eleventyConfig.addPlugin(syntaxHighlight);

    // passthrough paths
    eleventyConfig.addPassthroughCopy("content/assets/css/bundle.css");
    eleventyConfig.addPassthroughCopy("content/assets/js/bundle.js");
    eleventyConfig.addPassthroughCopy("content/assets/images/");
    eleventyConfig.addPassthroughCopy("content/assets/css/sitemap.xsl");
    

    // watch files / during local dev
    eleventyConfig.addWatchTarget('./content/assets/css');
    eleventyConfig.addWatchTarget('./content/assets/js');
    eleventyConfig.addWatchTarget('./content/assets/**/*.{css,js}');
   
    // minify html output
	eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
        if( this.outputPath.endsWith(".html") ) {
            const minified = minify(content, {
                useShortDoctype: true,
                removeComments: true,
                minifyJS: true,
                collapseWhitespace: true
            });

            return minified;
        }
        return content;
    });

    // date helper filter
    eleventyConfig.addFilter('formatDate', (dateObj, formatStr) => {
        // convert any date strings to read dates
        if(typeof(dateObj) == "string") {
        dateObj = new Date(dateObj);
        }
        const format = formatStr ? formatStr : 'LLLL d, y';
        return DateTime.fromJSDate(dateObj, {
        zone: 'utc'
        }).toFormat(format);
    });

    // custom shortcodes
    eleventyConfig.addShortcode('version', () => `${+ new Date()}`);
    eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);
    eleventyConfig.addShortcode('build', () => `${new Date().toISOString().split('T')[0]}`);

    return {
        dir: {
            input: 'content',
            includes: '_includes',
            output: 'dist'
        },
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk'
    };
};
