const User = require('../models/User');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

/* ----------------------------- GET JSON ----------------------------- */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

/* --------------------------- EXPORT EXCEL --------------------------- */
const exportUsersExcel = async (req, res) => {
  try {
    const users = await User.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    worksheet.columns = [
      { header: 'Full Name', key: 'fullName' },
      { header: 'First Name', key: 'firstName' },
      { header: 'Second Name', key: 'secondName' },
      { header: 'NIC', key: 'nic' },
      { header: 'Phone', key: 'phone' },
      { header: 'Email', key: 'email' },
      { header: 'NIC PDF', key: 'nicPdfPath' },
      { header: 'License PDF', key: 'licensePdfPath' },
      { header: 'Reference ID', key: 'referenceId' },
    ];

    users.forEach((u) =>
      worksheet.addRow({
        fullName: u.fullName,
        firstName: u.firstName,
        secondName: u.secondName,
        nic: u.nic,
        phone: u.phone,
        email: u.email,
        nicPdfPath: u.nicPdfPath,
        licensePdfPath: u.licensePdfPath,
        referenceId: u.referenceId,
      })
    );

    const fileName = 'All_Users.xlsx';
    const filePath = path.join(__dirname, '..', 'exports', fileName);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, fileName);
  } catch (err) {
    res.status(500).json({ message: 'Export failed' });
  }
};

/* -------------------------- DELETE USER -------------------------- */
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

module.exports = { getAllUsers, exportUsersExcel, deleteUser };
