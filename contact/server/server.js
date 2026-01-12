const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const FILE_PATH = path.resolve(__dirname, '..', 'contact-form-data.csv');

app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false });
  }

  const exists = fs.existsSync(FILE_PATH);

  const row = `"${name}","${email}","${phone || ''}","${subject || ''}","${message}","${new Date().toISOString()}"\n`;

  if (!exists) {
    const header = 'Name,Email,Phone,Subject,Message,Submitted At\n';
    fs.writeFileSync(FILE_PATH, header + row);
  } else {
    fs.appendFileSync(FILE_PATH, row);
  }

  res.json({ success: true });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
