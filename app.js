import 'dotenv/config';
import express from 'express';
import {
    ButtonStyleTypes,
    InteractionResponseFlags,
    InteractionResponseType,
    InteractionType,
    MessageComponentTypes,
    verifyKeyMiddleware,
} from 'discord-interactions';
import { getRandomEmoji, DiscordRequest, getHeadTail} from './utils.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// To keep track of our active games
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
    // Interaction id, type and data
    const { id, type, data } = req.body;

    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data;

        // "test" command
        if (name === 'test') {
            // Send a message into the channel where command was triggered from
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    flags: InteractionResponseFlags.IS_COMPONENTS_V2,
                    components: [
                        {
                            type: MessageComponentTypes.TEXT_DISPLAY,
                            // Fetches a random emoji to send from a helper function
                            content: `hello world2 ${getRandomEmoji()}`
                        }
                    ]
                },
            });
        }

        if (name === 'coinflip') {
            return res.send({
                type: InteractionResponseType.MODAL,
                data: {
                    custom_id: 'bobFlip',
                    title: 'PICK RN',
                    components: [
                        {
                            type: MessageComponentTypes.ACTION_ROW,
                            components: [
                                {
                                    type: MessageComponentTypes.INPUT_TEXT,
                                    style: 1,
                                    label: 'Heads option',
                                    custom_id: 'tail',
                                }
                            ]
                        }, {
                            type: MessageComponentTypes.ACTION_ROW,
                            components: [
                                {
                                    type: MessageComponentTypes.INPUT_TEXT,
                                    style: 1,
                                    label: 'Tails option',
                                    custom_id: 'head',
                                }
                            ]
                        }
                    ]
                }
            })
        }

        console.error(`unknown command: ${name}`);
        return res.status(400).json({ error: 'unknown command' });
    }

    if (type === InteractionType.MODAL_SUBMIT) {
        const modalID = data.custom_id;

        if (modalID === "bobFlip") {
            let inputString = [];
            for (let inputs of data.components) {
                inputString.push(inputs.components[0].value);
            }
            for (let string of inputString) {
                console.log(string);
            }
            console.log(inputString.length)


            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `${getHeadTail(inputString)} wins`
                }
            });
        }
    }

    console.error('unknown interaction type', type);
    return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});
