# Excitel countries app

This is a tiny React/Node Rest application implementing the Excitel countries API.
It features only public endpoints so you dont need any registration or API keys.

## Features

Search functionlity
Navigate search
Debouced search suggestions
Pagination functionality
Sorting functinality
Muative and reversed sorting
Modal with React Portal
Responsive table

## Installation

Npm install in the root directory
```bash
npm install
```

Use the provided scripts:
"start": starting the frontend
```bash
npm start
```
in addition to
"server": starting the backend
```bash
npm run server
```
or the combined script "dev": to do both
```bash
npm run dev
```

## Usage

The main page of the application displays a table with countries information and is the only page of the application, it is SPA after all :D.
By using either dropdown the user can control the country rows displayed per page or the visible categories.
By typing in the search field user can get a suggestion on sontries by name. Tapping enter will apply the search.
Clicking on suggestion will copy the suggested county name in the search field.
Navigatong to a '/' followed by any country name will apply search with that country name.
User can navigate through pages via the provided page buttons below
On clicking and holding for a secound and a half on any row field user will open a window.
with detailed information about clicked country and receive visual input  for the progress beforehand.
By clicking on the buttons diwplayin the category name on the columns the user can sort the said column alphabetically.
Sorting in reversed order and mutative sorting is available.
Table adapts with window size and hides last column if necessary.

## Technologies

React.js   ReactRouter
Node.js Express.js

## License

Have fun :P