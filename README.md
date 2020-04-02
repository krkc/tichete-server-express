# tichete-server
Server for the tichete open source it ticketing system

### Current State / Change Log
Mar 28 2020 - v0.0.1
- Made repo public after rewrite and splitting client/server up.

### Instructions
 - Install MySQL
 - Clone this repo to your machine and cd into it
 - Copy the file .env.example to .env and customize
 - Copy the file config/database.example.json to config/database.json and customize
 - Create new database called 'tichete' (or change the name in the .env file)
 - run "yarn install
 - run "npx sequelize db:migrate"
 - run "yarn seed:prod"
 - run "yarn start" (or "yarn dev" for file-watching)"
 - client will be running on localhost:3000 by default

### Todos
 - Result pagination for tickets/users
 - IT ticket addressing, responding, resolving, rejecting, commenting, etc
 - Site-wide permissions
 - SSL used during authentication

---
### License

GPLv3
