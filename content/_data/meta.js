
// capture env variable values and pass it to 11ty
module.exports = function() {
    return {
        environment: process.env.ELEVENTY_ENV || "dev"
    };
};
