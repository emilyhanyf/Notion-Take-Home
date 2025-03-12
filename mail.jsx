/*
This file contains functions that allow users to send Notion mail to database directly in their terminal:

-- convertTimeStamp(timestamp): extracts date and time from an ISO timestamp
-- send(sender, recipient, message): sends a message from sender to recipient (case sensitive)
-- read(sender, recipient): prints out all messages from sender to recipient (case sensitive)
-- deleteAll(sender, recipient): deletes all messages from sender to recipient (case sensitive)
-- main_loop(): keeps prompting user for commands until users call 'quit'
*/

const { Client } = require("@notionhq/client");
const readline = require("readline");
require("dotenv").config();

// Set up API keys and connect to database 
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY) {
    console.error("Missing Notion API Key. Please edit .env to add the key.\n");
    process.exit(1);
}
if (!DATABASE_ID) {
    console.error("Missing Notion Database ID. Please edit .env to add the ID.\n");
    process.exit(1);
}

const notion = new Client({ auth: NOTION_API_KEY });

// Set up command line interface 
const cli = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Convert timestamp into time for printing
function convertTimestamp(timestamp) {
    const obj = new Date(timestamp);
    if (!obj) {
        return "Date: Unknown, Time: Unknown";
    }
    const date = obj.toISOString().split('T')[0]; 
    const time = obj.toISOString().split('T')[1].split('.')[0];
    return `Date: ${date}, Time: ${time}`;
}

// Send message to database from sender to recipient
async function send(sender, recipient, message) {
    const timestamp = new Date().toISOString(); 
    //console.log(timestamp);
    try {
        // Use notion API to add page to database
        await notion.pages.create({
            parent: { database_id: DATABASE_ID },
            properties: {
                "Message": {
                    "title": [
                        {
                            "text": {
                                "content": message
                            }
                        }
                    ]
                },
                "Sender": { 
                    "rich_text": [
                        { 
                            "text": { 
                                "content": sender
                            } 
                        }
                    ] 
                },
                "Recipient": { 
                    "rich_text": [
                        { 
                            "text": { 
                                "content": recipient
                            } 
                        }
                    ] 
                },
                "Timestamp": { 
                    "date": { 
                        "start": timestamp
                    } 
                }
            }
        });
        console.log(`Message from ${sender} to ${recipient} sent successfully.\n`);
    } catch (error) {
        console.error("Error while sending message: ", error.message);
        console.log();
    }
}

// Read message from database for a given user
async function read(user) {
    try {
        // Use notion API to retrieve database
        const filtered = await notion.databases.query({
            database_id: DATABASE_ID,
            filter: { 
                property: "Recipient",
                rich_text: {
                    equals: user
                }
            }
        });
        if (filtered.results.length === 0) {
            console.log(`There are currently no messages for ${user}.\n`);
            return;
        }

        // Print out each message received by recipient
        const messages = filtered.results;
        console.log(`Messages ${user} (count: ${messages.length}): `);
        console.log(`-------------------------------------------------`);
        messages.forEach (message => {
            console.log(`From: ${message.properties.Sender?.rich_text[0]?.text.content}`);
            console.log(`${convertTimestamp(message.properties.Timestamp?.date.start)}`);
            console.log(`${message.properties.Message?.title[0]?.text.content}`);
            console.log(`-------------------------------------------------`);
        });
    } catch (error) {
        console.error("Error while reading messages: ", error.message);
        console.log();
    }
}

async function deleteAll(sender, recipient) {
    try {
        const filtered = await notion.databases.query({
            database_id: DATABASE_ID,
            filter: { 
                and: [ 
                    {
                        "property": "Sender",
                        "rich_text": {
                            "equals": sender
                        }
                    },
                    {
                        "property": "Recipient",
                        "rich_text": {
                            "equals": recipient
                        }
                    }
                ]
            }
        });

        const messages = filtered.results;
        if (messages.length === 0) {
            console.log(`There are currently no messages that ${sender} send to ${recipient}.\n`);
            return;
        }

        for (const message of messages) {
            await notion.pages.update({
                page_id: message.id,
                in_trash: true,
            });
        }
        console.log(`Finished deleting all messages ${sender} send to ${recipient}.\n`);
    } catch (error) {
        console.error("Error while deleting messages: ", error.message);
        console.log();
    }
}

// Main function for client interaction
function main_loop() {
    console.log("Please select an option: ");
    console.log("- send: Send mail to a user.");
    console.log("- read: Check a user's mail.");
    console.log("- quit: Quit NotionMail.");
    console.log("- delete: Delete all messages from a sender to a recipient.\n");

    cli.question("Enter a command: ", command => {
        console.log()
        if (command === "send") {
            cli.question("Sender: ", sender => {
                if (sender.length === 0) {
                    sender = "Unknown sender";
                }
                cli.question("Recipient: ", recipient => {
                    if (recipient.length === 0) {
                        recipient = "Unknown recipient";
                    }
                    cli.question("Message: ", message => {
                        send(sender, recipient, message).then(() => main_loop());
                    });
                });
            });
        } else if (command === "read") {
            cli.question("Recipient: ", user => {
                read(user).then(() => main_loop());
            });
        } else if (command === "quit") {
            console.log("Quit NotionMail.\n");
            cli.close();
        } else if (command === "delete") {
            cli.question("Sender: ", sender => {
                if (sender.length === 0) {
                    sender = "Unknown sender";
                }
                cli.question("Recipient: ", recipient => {
                    if (recipient.length === 0) {
                        recipient = "Unknown recipient";
                    }
                    deleteAll(sender, recipient).then(() => main_loop());
                });
            });
        } else {
            console.log("Invalid command.\n");
            main_loop();
        }
    });
}

module.exports = { main_loop };
