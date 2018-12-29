/**
 * Mongoose Schema representing us storing a Tweet. Includes relevant fields from tweet
 * along with metadata and results of our sentiment/topic analysis from Watson.
 */

const mongoose = require('mongoose');
const Sentiment = require('./sentiment');
const Schema = mongoose.Schema;

let tweetSchema = new Schema({
	tweet_id_str: { type: String, required: true, unique: true},
	username: { type: String, required: true },
	// Text of tweet
	text: String,
	user_id_str: String,
	// Metrics we use to determine relevance/matching
	verified: Boolean,
	followers_count: Number,
	favorite_count: Number,
	retweet_count: Number,
	paired_tweet_id_str: String,
	sentiments: [Sentiment],
	created: Date,
	// Keyword used when searching Twitter to get this tweet
	search_keyword: String,
});

module.exports = tweetSchema;