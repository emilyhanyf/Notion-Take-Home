# Notion-Take-Home

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
npm run
```

## References
Here are the sources I used from Notion to set up the Notion API:
- [Notion database API basics](https://developers.notion.com/docs/working-with-databases#adding-pages-to-a-database)
- [How to filter, retrieve database](https://developers.notion.com/reference/post-database-query-filter)
- [How to create, retrieve, trash a page](https://developers.notion.com/reference/post-page)
- [Notion SDK Js examples](https://github.com/makenotion/notion-sdk-js/tree/main/examples/database-email-update)
- [Notion property values](https://developers.notion.com/reference/property-value-object#title-property-values)
- [Notion database object](https://developers.notion.com/reference/database)
