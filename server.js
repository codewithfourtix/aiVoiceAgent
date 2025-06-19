import express from "express";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.get("/", (req, res) => {
  res.send("Server is running fine!");
});

app.post("/phone-call", async (req, res) => {
  client.calls
    .create({
      url: "https://027d-154-80-54-106.ngrok-free.app/voice-response",
      to: req.body.to,
      from: process.env.TWILIO_PHONE_NUMBER,
    })
    .then((call) => console.log(`Call made: ${call.sid}`))
    .catch((err) => res.status(500).send(err));
});

app.post("/voice-response", (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();

  const gather = twiml.gather({
    numDigits: 1,
    timeout: 5,
    action: "https://027d-154-80-54-106.ngrok-free.app/handle-key",
    method: "POST",
  });

  gather.say(
    "Hello! This is Ali Zulfiqar. Did you place an order recently? Please press 1 for Yes, 2 for No."
  );

  twiml.say("We didn't receive any input. Goodbye!");

  res.type("text/xml");
  res.send(twiml.toString());
});

app.post("/handle-key", (req, res) => {
  const digit = req.body.Digits;
  const twiml = new twilio.twiml.VoiceResponse();

  if (digit === "1") {
    // Update DB for confirmation
    twiml.say("Thank you. Your order is confirmed!");
  } else if (digit === "2") {
    // Update DB for rejection
    twiml.say("Thank you. We have noted that you did not place the order.");
  } else {
    twiml.say("Invalid input. Goodbye!");
  }

  res.type("text/xml");
  res.send(twiml.toString());
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
