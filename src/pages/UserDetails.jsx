/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const UserDetails = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = () => {
    fetch(`${baseUrl}/users`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setTotalUsers(data.length);
        toast.success('User Data Loaded Successfully');
      })
      .catch((error) => {
        toast.error('Error loading user data');
        console.error('Error fetching users:', error);
      });
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '' });
  const [editingId, setEditingId] = useState(null);

  // Add or Update User
  const handleAddUser = () => {
    if (editingId) {
      // Update user
      fetch(`${baseUrl}/users/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success('User updated successfully');
          setEditingId(null);
          setNewUser({ name: '', email: '', password: '', role: '' });
          fetchUsers();
        })
        .catch((error) => {
          toast.error('Error updating user');
          console.error('Error updating user:', error);
        });
    } else {
      // Add new user -> require all fields
      if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
        alert('Please fill all fields');
        return;
      }

      fetch(`${baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success('User created successfully');
          setNewUser({ name: '', email: '', password: '', role: '' });
          fetchUsers();
          // Reset to first page when adding new user
          setCurrentPage(1);
        })
        .catch((error) => {
          toast.error('Error creating user');
          console.error('Error creating user:', error);
        });
    }
  };

  // Delete User
  const handleDelete = (id) => {
    fetch(`${baseUrl}/users/${id}`, {
      method: 'DELETE'
    }).then((res) => {
      if (res.ok) {
        fetchUsers();
        // Reset to first page if current page becomes empty
        if (currentPage > 1 && users.length % itemsPerPage === 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        console.error('Error deleting user');
      }
    });
  };

  // Edit User
  const handleEdit = (user) => {
    setNewUser(user);
    setEditingId(user.id);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Items per page change handler
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="w-full mt-10 bg-white shadow-sm border border-[#e6ebf1] rounded p-6 md:p-10">
      <h2 className="text-2xl font-semibold mb-6">User Management</h2>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg cursor-pointer"
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Staff">Staff</option>
        </select>
        <button 
          onClick={handleAddUser} 
          className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
        >
          {editingId ? 'Update' : 'Add'}
        </button>
      </div>

      {/* Items Per Page Selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
            Show:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="p-2 border border-gray-300 rounded text-sm cursor-pointer"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span className="text-sm text-gray-600">
            entries
          </span>
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, users.length)} of {users.length} entries
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 border text-left">ID</th>
              <th className="px-4 py-3 border text-left">Name</th>
              <th className="px-4 py-3 border text-left">Email</th>
              {/* <th className="px-4 py-3 border text-left">Password</th> */}
              <th className="px-4 py-3 border text-left">Role</th>
              <th className="px-4 py-3 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, idx) => (
              <tr key={user.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-3 border">{user.id}</td>
                <td className="px-4 py-3 border">{user.name}</td>
                <td className="px-4 py-3 border">{user.email}</td>
                {/* <td className="px-4 py-3 border">{user.password}</td> */}
                <td className="px-4 py-3 border">{user.role}</td>
                <td className="px-4 py-3 border flex gap-2">
                  <button 
                    onClick={() => handleEdit(user)} 
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)} 
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {users.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex gap-2">
            {/* Previous Button */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded border ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {pageNumbers.map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-2 rounded border ${
                  currentPage === number
                    ? 'bg-blue-500 text-white cursor-pointer'
                    : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                {number}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded border ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;