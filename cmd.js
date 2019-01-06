#!/usr/bin/env node

/**
 * Command line interface for interacting with Tweetocracy. Runs process that gets tweets
 */
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");

// Load our environmental variables
const dotenv = require('dotenv');
dotenv.config();

const TwitterClient = require('./utils/twitter');

const KEYWORDS = [
	'#TrumpShutdown',
	'#SchumerShutdown',
	'#MAGA',
	'#Kavanaugh',
	'#wall',
	'#border',
	'@AOC',
	'#GreenNewDeal',
	'#Mueller',
	'#treason',
	'#DACA',
	'#ACA',
	'#RBG',
]

const run = async () => {
	let getTweets = function() {
		let keyword = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
		console.log("Keyword: ", keyword);
		TwitterClient.getTweets(keyword).then((response) => {
			console.log("Done");
		})
	}
	let interval = setInterval(getTweets, 5000);
	getTweets();
}

run();