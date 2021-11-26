const dasha = require("@dasha.ai/sdk");
const fs = require("fs");
const axios = require("axios").default;


async function main() {
  const app = await dasha.deploy("./app");



  // external functions begin 
  // external functions are called from your Dasha conversation in the body of main.dsl file 
  // external functions can be used for calculations, data storage, in this case, to 
  // call external services with HTTPS requests. You can call an external function from DSL
  // in your node.js file and have it do literally anything you can do with Node.js.

  // External function confirm fave fruit 

  app.setExternal("confirm", async(args, conv) => {
      console.log("collected fruit is " + args.fruit);

      const res = await axios.post( "http://ptsv2.com/t/dasha-test/post");
      console.log(" JSON data from API ==>", res.data);

      const receivedFruit = res.data.favoriteFruit;
      console.log("fruit is  ==>", receivedFruit);

    if (args.fruit == receivedFruit)
      return true;
    else 
      return false; 
  });

  // External function check status 
  app.setExternal("status", async(args, conv) => {

    const res = await axios.post( "http://ptsv2.com/t/dasha-test/post");
    console.log(" JSON data from API ==>", res.data);

    const receivedFruit = res.data.favoriteFruit;
    console.log("status is  ==>", res.data.status);

    if (res.data.status = "approved")
    return("Congratulations Mr. Coyote. Your application is approved. You can now buy anything you like at the desert ACME shop by the big cactus."); 
    else 
    return("Apologies Mr. Coyote. Your application is not approved. ");
});

  await app.start();

  const conv = app.createConversation({ phone: process.argv[2] ?? "" });

  conv.audio.tts = "dasha";

   if (conv.input.phone === "chat") {
     await dasha.chat.createConsoleChat(conv);
   } else {
     conv.on("transcription", console.log);
   }

  const logFile = await fs.promises.open("./log.txt", "w");
  await logFile.appendFile("#".repeat(100) + "\n");

  conv.on("transcription", async (entry) => {
    await logFile.appendFile(`${entry.speaker}: ${entry.text}\n`);
  });

  conv.on("debugLog", async (event) => {
    if (event?.msg?.msgId === "RecognizedSpeechMessage") {
      const logEntry = event?.msg?.results[0]?.facts;
      await logFile.appendFile(JSON.stringify(logEntry, undefined, 2) + "\n");
    }
  });

  const result = await conv.execute({
     channel: conv.input.phone === "chat" ? "text" : "audio",
   });

  console.log(result.output);

  await app.stop();
  app.dispose();

  await logFile.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
