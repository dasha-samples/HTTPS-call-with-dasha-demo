A simple app illustrating how you can make HTTPS calls from your Dasha app. 

To run this app, first register your Dasha API key: 
You’ll need the latest Node.js, NPM and Visual Studio Code. Open VSCode and in terminal run the following commands.

```bash
code --install-extension dasha-ai.dashastudio
npm i -g "@dasha.ai/cli@latest"
dasha account login
dasha account info
```

This installs Dasha Studio extension, Dasha CLI, registers your account, and returns your activated API key.

*What's next? Run a test call!*

```bash
git clone https://github.com/dasha-samples/https-call-with-dasha-demo
cd https-call-with-dasha-demo
npm install
npm start 12223334455
```

Where 12223334455 is your phone number in international format.
