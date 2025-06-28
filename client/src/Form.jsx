import React, { useState } from 'react';
import './Form.css';
import axios from 'axios';

const Form = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    firstName: '',
    secondName: '',
    nic: '',
    phone: '',
    email: '',
    nicPdf: null,
    licensePdf: null,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'nicPdf' || name === 'licensePdf') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/register',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setSuccessMessage(res.data.message);
      if (typeof onSuccess === 'function') onSuccess(); // close modal / refresh list
    } catch (err) {
      const msg =
        err?.response?.data?.message || 'Registration failed. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Register via QR</h2>

        {errorMessage && <p className="error">{errorMessage}</p>}
        {successMessage && <p className="success">{successMessage}</p>}

        <input
          type="text"
          name="fullName"
          placeholder="Full Name with Initials"
          value={formData.fullName}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <input
          type="text"
          name="secondName"
          placeholder="Second Name"
          value={formData.secondName}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <input
          type="text"
          name="nic"
          placeholder="NIC Number"
          value={formData.nic}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          required
        />

        <label>Upload NIC PDF:</label>
        <input
          type="file"
          name="nicPdf"
          accept="application/pdf"
          onChange={handleChange}
          disabled={isLoading}
          required
        />

        <label>Upload Driving License PDF:</label>
        <input
          type="file"
          name="licensePdf"
          accept="application/pdf"
          onChange={handleChange}
          disabled={isLoading}
          required
        />

        <button type="submit" disabled={isLoading} className={isLoading ? 'loading' : ''}>
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              <span>Processing...</span>
            </>
          ) : (
            'Submit'
          )}
        </button>
      </form>
    </div>
  );
};

export default Form;