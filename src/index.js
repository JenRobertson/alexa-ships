/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/

'use strict';

const Alexa = require('alexa-sdk');
const stations = require('./responses/stations');

const APP_ID = 'amzn1.ask.skill.1a184836-9acf-46bd-9e7b-0b6b9cc730c3';


const messages = {
    SKILL_NAME: 'Puzzle Ship',
    WELCOME_MESSAGE: "Welcome to %s. You can ask a question like, how many bilge stations are there on a sloop?",
    WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
    DISPLAY_CARD_TITLE: '%s  - Info about %s.',
    HELP_MESSAGE: "You can ask questions such as, how many bilge stations are there on a sloop? or, you can say exit...Now, what can I help you with?",
    HELP_REPROMT: "You can say things like, how many bilge stations are there on a sloop?, or you can say exit...Now, what can I help you with?",
    STOP_MESSAGE: 'Goodbye!',

    STATIONS: stations.stations,
    STATIONS_REPEAT_MESSAGE: 'Try saying repeat.',
    STATIONS_NOT_FOUND_MESSAGE: "I\'m sorry, I dont know about ",
    STATIONS_NOT_FOUND_WITH_ITEM_NAME: '%s ',
    STATIONS_NOT_FOUND_WITHOUT_ITEM_NAME: 'that',
    STATIONS_NOT_FOUND_REPROMPT: '. What else can I help with?'
}

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = messages.WELCOME_MESSAGE, messages.SKILL_NAME;
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = messages.WELCOME_REPROMT;
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'HomeIntent': genericIntentTwoSlots('stations'),

    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = messages.HELP_MESSAGE;
        this.attributes.repromptSpeech = messages.HELP_REPROMT;
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', messages.STOP_MESSAGE);
    },
    'Unhandled': function () {
        this.attributes.speechOutput = messages.HELP_MESSAGE;
        this.attributes.repromptSpeech = messages.HELP_REPROMPT;
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function genericIntentTwoSlots(responseFileName){
    return function () {
        const responseName = responseFileName.toUpperCase();

        const shipSlot = this.event.request.intent.slots.Ship;
        const stationSlot = this.event.request.intent.slots.Station;

        let shipName;
        let stationName;
        if (shipSlot && shipSlot.value) {
            shipName = shipSlot.value.toLowerCase();
        }

        if (stationSlot && stationSlot.value) {
            stationName = stationSlot.value.toLowerCase();
        }

        const cardTitle = messages.DISPLAY_CARD_TITLE(messages.SKILL_NAME, shipName);//needs s
        const responses = messages.responseName;
        const response = responses[shipName][stationName];

        if (response) {
            this.attributes.speechOutput = response;
            this.attributes.repromptSpeech = messages[`${responseName}_REPEAT_MESSAGE`];
            //this.emit(':tellWithCard', response, this.attributes.repromptSpeech, cardTitle, response);
            this.emit(':tellWithCard', response, cardTitle, response);
        } else {
            let speechOutput = messages[`${responseName}_NOT_FOUND_MESSAGE`];
            const repromptSpeech = messages[`${responseName}_NOT_FOUND_REPROMPT`];
            if (shipName) {
                speechOutput += messages[`${responseName}_NOT_FOUND_WITH_ITEM_NAME`](shipName);
            } else {
                speechOutput += messages[`${responseName}_NOT_FOUND_WITHOUT_ITEM_NAME`];
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    }
}
