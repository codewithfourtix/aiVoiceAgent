# AI Voice Agent

This project implements a basic AI Voice Agent using Node.js, Express, and Twilio. It allows for automated phone calls, gathers user input via DTMF tones, and provides responses based on the input.

## Features

- Initiate outbound calls using Twilio.
- Play custom messages to the caller.
- Gather single-digit input from the caller.
- Handle different user inputs to trigger specific actions (e.g., order confirmation/rejection).

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (LTS version recommended)
- npm (Node Package Manager)
- A Twilio Account (with a trial account or upgraded account)
- An ngrok account (or similar tunneling service) for local development

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd aiVoiceAgent
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**

    Create a `.env` file in the root directory of the project with the following variables:

    ```
    TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
    ```

    -   `TWILIO_ACCOUNT_SID`: Your Twilio Account SID.
    -   `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token.
    -   `TWILIO_PHONE_NUMBER`: Your Twilio phone number (e.g., `+1234567890`).

4.  **Start ngrok (or your tunneling service):**

    Twilio needs a publicly accessible URL to send webhooks to your local server. Use ngrok to expose your local server:

    ```bash
    ngrok http 3000
    ```

    Note the `https` forwarding URL provided by ngrok (e.g., `https://abcdef123456.ngrok.io`). You will need to update the `url` in `server.js` for `client.calls.create` and the `action` in `twiml.gather` with your ngrok URL.

    **Important:** The ngrok URL changes every time you restart ngrok unless you have a paid ngrok account. Remember to update your `server.js` file accordingly.

5.  **Run the application:**

    ```bash
    npm start
    ```

    (Assuming your `package.json` has a `start` script like `node server.js` or `nodemon server.js`)

## Usage

Once the server is running and ngrok is forwarding requests, you can initiate a call by sending a `POST` request to the `/phone-call` endpoint. For example, using `curl` or Postman:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"to":"+1234567890"}' http://localhost:3000/phone-call
```

Replace `+1234567890` with the phone number you wish to call.

### Call Flow

1.  A call is initiated to the specified `to` number.
2.  Twilio makes a `POST` request to `/voice-response`.
3.  The agent says, "Hello! This is Ali Zulfiqar. Did you place an order recently? Please press 1 for Yes, 2 for No."
4.  The system waits for 1 digit input for 5 seconds.
5.  If `1` is pressed, the agent says, "Thank you. Your order is confirmed!"
6.  If `2` is pressed, the agent says, "Thank you. We have noted that you did not place the order."
7.  For any other input or no input, the agent says, "Invalid input. Goodbye!" or "We didn't receive any input. Goodbye!" respectively.

## Project Structure

```
.gitignore
package-lock.json
package.json
server.js
README.md
.env (not committed)
```

-   `server.js`: The main application file containing the Express server and Twilio logic.
-   `package.json`: Defines project metadata and dependencies.
-   `.env`: Stores environment variables (not committed to version control).

## Important Considerations

-   **Twilio Trial Account Limitations:** If you are using a Twilio trial account, you will encounter a pre-recorded message at the beginning of calls and a limited call duration. To remove these limitations, upgrade your Twilio account.
-   **Ngrok URL:** The ngrok URL in `server.js` (`https://027d-154-80-54-106.ngrok-free.app`) is hardcoded. For production or persistent development, consider using a dynamic way to update this, or use a static ngrok domain (paid feature), or deploy your application to a public server.
-   **Error Handling:** Basic error handling is in place for Twilio API calls. Consider adding more robust error handling and logging for production environments.
-   **Database Integration:** The comments in `handle-key` suggest database updates. Implement actual database logic as needed for your application.

## License

This project is open-source and available under the MIT License.