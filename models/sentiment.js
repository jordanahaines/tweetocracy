/**
 * A Sentiment document defines topic and sentiment metadata for a tweet. Tweets can have multiple sentiment
 * documents, as sentiment can come from different sources (i.e. AWS vs Watson)
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SENTIMENT_SOURCES = {
	// Amazon's Comprehend
	comprehend: 'comprehend',
	// Watson NLU
	nlu: 'nlu',
}

const SENTIMENT_REGEX = '/^(' + Object.keys(SENTIMENT_SOURCES).join('|') + ')$/';

module.exports = new Schema({
	source: {
		type: String,
		match: SENTIMENT_REGEX,
	},
	// MongooseMap where keys are topics (hashtags) and values are relevance scores (Number)
	relevance: {
		type: Map,
		of: Number
	},
	created: Date,
});