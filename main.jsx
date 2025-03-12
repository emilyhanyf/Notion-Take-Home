/*
This file starts the command line Notion Mail application
*/

const { main_loop } = require("./mail.jsx");

function main() {
    console.log();
    console.log("Welcome to NotionMail!");
    console.log("-----------------------");
    main_loop();
}

main();