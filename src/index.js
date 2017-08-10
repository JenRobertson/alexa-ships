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
const stations_ships_responses_file = require('./responses/stations_ships');

const APP_ID = 'amzn1.ask.skill.2e4ac15a-094b-4049-ae91-f08d166086b5';


const messages = {
    SKILL_NAME: 'Puzzle Ship',
    WELCOME_MESSAGE: "Welcome to Puzzle Ship. You can ask a question like, how many bilge stations are there on a sloop?",
    WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
    DISPLAY_CARD_TITLE: 'Puzzle Ship',
    HELP_MESSAGE: "You can ask questions such as, how many bilge stations are there on a sloop? or, you can say exit...Now, what can I help you with?",
    HELP_REPROMT: "You can say things like, how many bilge stations are there on a sloop?, or you can say exit...Now, what can I help you with?",
    STOP_MESSAGE: 'Goodbye!',

    STATIONS_SHIPS: stations_ships_responses_file.RESPONSES,
};

const handlers = {
    'LaunchRequest': function () {
        this.attributes.speechOutput = messages.WELCOME_MESSAGE, messages.SKILL_NAME;
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = messages.WELCOME_REPROMT;
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'StationsIntent': stations_ships(),
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
    // alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function stations_ships(){
    return function () {


        // const shipSlot = this.event.request.intent.slots.ship.value.toLowerCase();
        // const stationSlot = this.event.request.intent.slots.station.value.toLowerCase();



// shipSlot.value + stationSlot.value
        //this.emit(':ask', messages.STATIONS_SHIPS[shipSlot][stationSlot]);
        //this.emit(':tellWithCard', messages.STATIONS_SHIPS[shipSlot][stationSlot], 'hello', 'tets');

        const shipSlot = this.event.request.intent.slots.ship;
        const stationSlot = this.event.request.intent.slots.station;

        let shipName;
        let stationName;

        if (shipSlot && shipSlot.value) {
            shipName = shipSlot.value.toLowerCase();
        }

        if (stationSlot && stationSlot.value) {
            const stationValue = stationSlot.value.toLowerCase();

            if(stationValue.match(/bilg/)){
                stationName='bilge';
            }
            else if(stationValue.match(/carp/)){
                stationName='carpentry';
            }
            else if(stationValue.match(/nav/)){
                stationName='navigation';
            }
            else if(stationValue.match(/gun/)){
                stationName='gunning';
            }
            else if(stationValue.match(/sail/)){
                stationName='sailing';
            }
            else{
                stationName = 'poo';
            }
        }

        if (messages.STATIONS_SHIPS[shipName] && messages.STATIONS_SHIPS[shipName][stationName]){

            const number = messages.STATIONS_SHIPS[shipName][stationName];
            const cardTitle = `${messages.SKILL_NAME} - info about ${shipName}s`;
            const response = `A ${shipName} has ${number} ${stationName} stations.`;
            this.emit(':tellWithCard', response, cardTitle, response);
        }

        else {
            let response;
            const repromptSpeech = ' What else can I help you with?';
            if(!shipName){
                response = 'I\'m sorry, you didn\'t give me a ship name. ' + messages.HELP_REPROMT;
            }
            else if(!stationSlot && shipName){
                response = 'I\'m sorry, you didn\'t give me a station name.' + repromptSpeech;
            }
            else if(!messages.STATIONS_SHIPS[shipName]){
                response = `There is no such ship as a ${shipName} on PuzzlePirates.` + repromptSpeech;
            }
            else if(messages.STATIONS_SHIPS[shipName] && !messages.STATIONS_SHIPS[shipName][stationName]){
                response = `There is no such station as a ${stationName} on a ${shipName} on PuzzlePirates.` + repromptSpeech;
            }
            else{
                response = messages.HELP_REPROMT;
            }

            this.emit(':askWithCard', response);

        }







        // if (response) {
        //     this.attributes.speechOutput = response;
        //     this.attributes.repromptSpeech = messages[`${responseName}_REPEAT_MESSAGE`];
        //     //this.emit(':tellWithCard', response, this.attributes.repromptSpeech, cardTitle, response);
        //     this.emit(':tellWithCard', response, cardTitle, response);
        // } else {
        //     let speechOutput = messages[`${responseName}_NOT_FOUND_MESSAGE`];
        //     const repromptSpeech = messages[`${responseName}_NOT_FOUND_REPROMPT`];
        //     if (shipName) {
        //         speechOutput += messages[`${responseName}_NOT_FOUND_WITH_ITEM_NAME`](shipName);
        //     } else {
        //         speechOutput += messages[`${responseName}_NOT_FOUND_WITHOUT_ITEM_NAME`];
        //     }
        //     speechOutput += repromptSpeech;

        //     this.attributes.speechOutput = speechOutput;
        //     this.attributes.repromptSpeech = repromptSpeech;

        //     this.emit(':ask', speechOutput, repromptSpeech);
        // }
    }
}
