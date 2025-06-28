import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) navigate('/admin');
    fetchUsers();
  }, [navigate]);

  useEffect(() => {
    // Filter users when searchTerm changes
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.nic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.referenceId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      alert('Failed to fetch users');
    }
  };

  const handleExport = () => {
    window.open('http://localhost:5000/api/admin/users/export', '_blank');
  };

  const handleAddUser = () => {
    navigate('/');
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
        fetchUsers(); // Refresh the list
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="controls-container">
        <div className="button-group">
          <button className="add-button" onClick={handleAddUser}>
            Add User
          </button>
          <button className="export-button" onClick={handleExport}>
            Export as Excel
          </button>
        </div>

        <div className="search-container">
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search by NIC or Reference ID..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button className="clear-search" onClick={clearSearch}>
                ×
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="search-results-info">
              Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>First Name</th>
              <th>Second Name</th>
              <th>NIC</th>
              <th>Phone</th>
              <th>Email</th>
              <th>NIC PDF</th>
              <th>License PDF</th>
              <th>Reference ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td data-label="Full Name">{u.fullName}</td>
                  <td data-label="First Name">{u.firstName}</td>
                  <td data-label="Second Name">{u.secondName}</td>
                  <td data-label="NIC">{u.nic}</td>
                  <td data-label="Phone">{u.phone}</td>
                  <td data-label="Email">{u.email}</td>

                  <td data-label="NIC PDF">
                    {u.nicPdfPath ? (
                      <a
                        href={u.nicPdfPath}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>

                  <td data-label="License PDF">
                    {u.licensePdfPath ? (
                      <a
                        href={u.licensePdfPath}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>

                  <td data-label="Reference ID">{u.referenceId}</td>
                  <td data-label="Actions">
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteUser(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-results">
                  {searchTerm ? 'No users found matching your search.' : 'No users available.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;