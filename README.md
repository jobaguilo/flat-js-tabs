# Title Changer

A simple JavaScript utility that changes the browser tab title when the user switches tabs or leaves the page. It works across multiple tabs using the BroadcastChannel API.

## Features

- Changes page title when user leaves the page
- Synchronizes behavior across multiple tabs
- Restores original title when user returns
- Uses localStorage to track page visibility state

## Setup

1. Include the script in your HTML file:

```html
<script src="titleChanger.js"></script>
```

2. To start a demo environment, run:
```
npm install
npm start
```