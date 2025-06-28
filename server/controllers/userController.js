const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const twilio = require('twilio');
const uploadFileToDrive = require('../utils/googleDrive');

exports.createUser = async (req, res) => {
  try {
    const { fullName, firstName, secondName, nic, phone, email } = req.body;
    const files = req.files;

    if (!files || !files.nicPdf || !files.licensePdf) {
      return res.status(400).json({ message: 'Both NIC and Driving License PDFs are required.' });
    }

    const existingUser = await User.findOne({ $or: [{ nic }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'NIC or phone number already registered.' });
    }

    const referenceId = uuidv4().split('-')[0];

    const nicPdfUrl = await uploadFileToDrive(files.nicPdf[0].path, files.nicPdf[0].originalname);
    const licensePdfUrl = await uploadFileToDrive(files.licensePdf[0].path, files.licensePdf[0].originalname);

    const newUser = new User({
      fullName,
      firstName,
      secondName,
      nic,
      phone,
      email,
      nicPdfPath: nicPdfUrl,
      licensePdfPath: licensePdfUrl,
      referenceId,
    });

    await newUser.save();

    const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const toNumber = phone.startsWith('+') ? phone : `+94${phone}`;

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${toNumber}`,
      body: `Your registration is successful.\nYour Reference ID: ${referenceId}`,
    });

    res.status(201).json({ message: 'Registered! WhatsApp message sent with reference ID.' });
  } catch (err) {
    console.error('Error sending WhatsApp:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};
