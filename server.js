const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/send-emails", async (req, res) => {
  const { name, email, password, recipients, subject, message } = req.body;

  try {
    // Gmail connection
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: password,
      },
    });

    // Recipients ko line-by-line split karenge
    const recipientList = recipients.split("\n").map(r => r.trim()).filter(r => r.length > 0);

    let results = [];

    // Har ek email bhejna
    for (let recipient of recipientList) {
      let info = await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: recipient,
        subject: subject,
        text: message,
      });
      results.push({ recipient, messageId: info.messageId });
    }

    res.status(200).send({
      success: true,
      sent: results.length,
      details: results
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: error.message });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
