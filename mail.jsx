/* Set up API keys and connect to database */ 
const { Client } = require("@notionhq/client");
const readline = require("readline");
require("dotenv").config();

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

        const messages = filtered.results;
        if (messages.length === 0) {
            console.log(`There are currently no messages for ${user}.\n`);
            return;
        }

        // Print out each message received by recipient
        console.log(`Messages ${user} (count: ${messages.length}): `);
        console.log(`-------------------------------------------------`);
        messages.forEach(message => {
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
    console.log("- quit: Quit NotionMail.\n");

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
            cli.question("User: ", user => {
                read(user).then(() => main_loop());
            });
        } else if (command === "quit") {
            console.log("Quit NotionMail.\n");
            cli.close();
        } else {
            console.log("Invalid command.\n");
            main_loop();
        }
    });
}

module.exports = { send, read, main_loop };
