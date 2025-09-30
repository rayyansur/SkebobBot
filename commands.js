import 'dotenv/config';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Simple test command
const TEST_COMMAND = {
    name: 'test',
    description: 'Basic command',
    type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2],
};

const COINFLIP = {
    name: 'coinflip',
    description: 'Skebob flips coins',
    type: 1,
    options: [
        {
            name: "amount",
            description: "From 2 to 5",
            type: 4,
            required: false,
            min_value: 2,
            max_value: 5
        }
    ]
}

const ALL_COMMANDS = [TEST_COMMAND, COINFLIP];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
