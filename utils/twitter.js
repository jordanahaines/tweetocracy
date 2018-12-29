/**
 * This module includes utilities for getting tweets for Twitter
 */

const axios = require('axios');
const Twit = require('twit');
const _ = require('underscore');
const moment = require('moment');
const mongoose = require('mongoose');

const TweetSchema = require('../models/tweet');

mongoose.connect('mongodb://localhost:27017/TweetDB', {useNewUrlParser: true});

const TWITTER_AUTH = {
	consumer_key: 'MSgZJRYYkUdB7Xw28wsTLA',
	consumer_secret: 'y1fhbe7LQFpE9Q75ArAHjuhwsMZOIHSXJdjGtj1GM',
	access_token: '727147068-UP9MGGPrADquWsD6MU5pAh1WRRpKnlqFafTdGRGw',
	access_token_secret: 'GkNdipt0FmjpVqEu2GWhVSlmeQswxikV9jACDD2bEXXtZ',
}

const TwitterClient = new Twit(_.extend({}, TWITTER_AUTH, {
	// Additional args for Twit
	// https://www.npmjs.com/package/twit
}));

/**
 * Utility method to filter tweets after we get them from Twitter but before we save in DB.
 * Most tweets are garbage so we don't want to save them for analysis.
 * @param {Object} tweet from Twitter API
 */
const FILTER_TWEETS = function(tweet) {
	if (tweet.truncated) {
		// console.log("Truncated")
		return false;
	}
	const FORBIDDEN_STRINGS = ['RT'];
	if (_.any(FORBIDDEN_STRINGS, s => tweet.full_text.indexOf(s) > -1)) {
		// console.log("Forbidden")
		return false;
	}
	if (tweet.in_reply_to_status_id || tweet.is_quote_status) {
		// console.log("Reply");
		return false;
	}
	return true;
}

module.exports = {
	getTweets: async function(keyword) {
		let TweetModel = mongoose.model('Tweet', TweetSchema);

		let query = keyword + ' since:' + (moment().subtract(1, 'd')).format("YYYY-MM-DD");
		let queryData = {
			q: query,
			count: 100,
			tweet_mode: 'extended',
		}
		// See if there is a latest tweet in our database
		let result = await TweetModel.findOne().sort('-created').exec();
		if (result) {
			queryData.since_id = result.tweet_id_str;
		}
		// We get the tweets, store them in our DB and then return them
		return TwitterClient.get('search/tweets', queryData).then((response) => {
			let tweets = response.data.statuses;
			// Filter then save Tweets in our database
			let filteredTweets = _.filter(tweets, FILTER_TWEETS);
			console.log("Filtered Tweets adding to DB: ", filteredTweets.length, " of ", tweets.length);
			TweetModel.insertMany(_.map(filteredTweets, (tweet) => {
				return {
					tweet_id_str: tweet.id_str,
					username: tweet.user.screen_name,
					text: tweet.full_text,
					user_id_str: tweet.user.id_str,
					verified: tweet.user.verified,
					followers_count: tweet.user.followers_count,
					favorite_count: tweet.favorite_count,
					retweet_count: tweet.retweet_count,
					created: Date(tweet.created_at),
					search_keyword: keyword,
				}
			}), (err) => {
				if (err) {
					console.log("Error saving tweets", err);
				}
			});
			return tweets;
		})
	},
}