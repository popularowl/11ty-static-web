const Image = require("@11ty/eleventy-img");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { minify } = require('html-minifier-terser');
const { DateTime } = require('luxon');


// 11ty setup
module.exports = function(eleventyConfig) {

    // plugins
    eleventyConfig.addPlugin(syntaxHighlight);

    // passthrough paths
    eleventyConfig.addPassthroughCopy("content/css/bundle.css");
    eleventyConfig.addPassthroughCopy("content/js/bundle.js");
    eleventyConfig.addPassthroughCopy("content/images/");
    eleventyConfig.addPassthroughCopy("content/css/sitemap.xsl");
    

    // watch files / during local dev
    eleventyConfig.addWatchTarget('./content/css');
    eleventyConfig.addWatchTarget('./content/js');
    eleventyConfig.addWatchTarget('./content/**/*.{css,js}');
   
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
