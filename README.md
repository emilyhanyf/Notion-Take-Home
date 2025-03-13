# Notion-Take-Home

### Description
This project allows users to send messages directly through command line, which are directly reflected in their Notion database in real time. Users can choose who the sender or recipient is, as well as the message content. 

### Improvements
I implemented the following improvements:
- Print out timestamps for when messages was sent (part of the `read` function)
- Add functionality to delete messages (`deleteAll` function)

### Technical/Product Choices
I made a few product choices that help users navigate the message-sending process in their command line, which includes
- Printing out line breaks in between each message read to make messages more readable
- Printing out line breaks between commands or error messages improve readaibility
- Adding confirmation messages after each command is executed to ensure user is aware of updates to the database

Some technical choices I made include:
- Using Javascript since it is the official Notion SDK
- Using `Node.js readline` in order to allow users to use command lines to interact with the Notion database
- Storing API keys in `.env` and use `.gitignore` to protect users' private API keys and database ID
- Using `await` or `async` when working with Notion API to ensure proper POST/GET requests

### Future Improvments
There are many more functionalities and improvements I would like to add to this project. Specifically, I could add more functionalities such as:
- Allowing users to delete single messages rather than all messages from a specific sender to a specific recipient
- Implementing an authentication process that requires senders to verify their identity before sending a message
- Improve case-sensitivity and make recipients/senders not case-sensitive
- Allow multiple senders/recipients with the same first name and distinguish them through an ID (goes hand in hand with the authentication process)
- Allowing users to create database rather than manually inputting the database ID for an existing database

From a product perspective, I would like to improve users' experience by:
- Add more creative command line components (ie. emojis or line arts) to make the command line experiment more "notion-like"

From a technical perpsective:
- It would make sense to create a class or file for each command (ie. read, send, delete), which makes the overall program more modular

## Usage
### 1. Acquire Notion API Key
Here are the instructions on how to [set up Notion API Key](https://developers.notion.com/docs/create-a-notion-integration#getting-started).

After you set up your API key, rename `example.env` to `.env` in this directory and add the following fields:
```
NOTION_KEY=<your-notion-api-key>
```

### 2. Acquire Notion database ID
Here are the instructions on how to [integrate page permission and obtain database ID](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions):

After you integrate page permission and get database ID, add the following fields to `.env`:
```
NOTION_DATABASE_ID=<your-notion-database-internal-integration-secret-id>
```

### 3. Set up database
Make sure you set up your databse so that there are four fields: 
- "Message" should be the “Title” property
- "Sender" and “Recipient” should be “Text” property types, not “Person” property types
- "Timestamp" should be "Date" property type

### 4. Run commands
Install dependencies by running:
```
npm install 
```
Run the program in your terminal:
```
npm start
```
This will automatically run `node mail.jsx `, which will start the program in your command line. 

## References
Here are the sources I used from Notion to set up the Notion API:
- [Notion database API basics](https://developers.notion.com/docs/working-with-databases#adding-pages-to-a-database)
- [How to filter, retrieve database](https://developers.notion.com/reference/post-database-query-filter)
- [How to create, retrieve, trash a page](https://developers.notion.com/reference/post-page)
- [Notion SDK Js examples](https://github.com/makenotion/notion-sdk-js/tree/main/examples/database-email-update)
- [Notion property values](https://developers.notion.com/reference/property-value-object#title-property-values)
- [Notion database object](https://developers.notion.com/reference/database)

Here are some online references that helped me build this project:
- [Documentation on readline](https://nodejs.org/api/readline.html)
- [Working with Notion API](https://stackoverflow.com/questions/69150120/how-to-insert-data-in-database-via-notion-api)
- [Stack Overflow resource on async/await](https://stackoverflow.com/questions/46515764/how-can-i-use-async-await-at-the-top-level)