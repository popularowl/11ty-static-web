const Image = require("@11ty/eleventy-img");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");
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

    eleventyConfig.addPlugin(feedPlugin, {
		type: "atom", // or "rss", "json"
		outputPath: "/feed.xml",
		collection: {
			name: "blog", // iterate over `collections.blog`
			limit: 10,     // 0 means no limit
		},
		metadata: {
			language: "en",
			title: "11ty static website",
			subtitle: "Minimal static 11ty website",
			base: "https://localhost:8080/",
			author: {
				name: "Popularowl",
				email: "", // Optional
			}
		}
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
