import dotenv from "dotenv";
import express from "express";
import twilio from "twilio";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
