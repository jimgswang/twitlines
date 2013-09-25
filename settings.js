var settings = {
    dev: {
        twitterConsumerKey : process.env.twitterConsumerKey || '',
        twitterConsumerSecret : process.env.twitterConsumerSecret || '',
        twitterAccessToken : process.env.twitterAccessToken || '',
        twitterAccessTokenSecret : process.env.twitterAccessTokenSecret || ''
    }
}

module.exports = settings;
