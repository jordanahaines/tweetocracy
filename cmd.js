#!/usr/bin/env node

/**
 * Command line interface for interacting with Tweetocracy.
 */
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");

const TwitterClient = require('./utils/twitter');

const run = async () => {
	let getTweets = function() {
		TwitterClient.getTweets('#TrumpShutdown').then((response) => {
			console.log("Done");
		})
	}
	let interval = setInterval(getTweets, 12000);
	getTweets();
}

run();