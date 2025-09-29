
import React, { useState } from "react";

const UserDetails = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Ali", email: "ali@example.com", password: "123456", role: "Admin" },
    { id: 2, name: "John", email: "john@example.com", password: "abcdef", role: "Student" },
  ]);

  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "" });
  const [editingId, setEditingId] = useState(null);

  // Add or Update User
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      alert("Please fill all fields");
      return;
    }

    if (editingId) {
      // Update user
      setUsers(
        users.map((u) =>
          u.id === editingId ? { ...u, ...newUser } : u
        )
      );
      setEditingId(null);
    } else {
      // Add new user
      const newId = users.length ? users[users.length - 1].id + 1 : 1;
      setUsers([...users, { id: newId, ...newUser }]);
    }

    setNewUser({ name: "", email: "", password: "", role: "" });
  };

  // Delete User
  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  // Edit User
  const handleEdit = (user) => {
    setNewUser(user);
    setEditingId(user.id);
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
          className="p-3 border border-gray-300 rounded-lg"
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Teacher">Teacher</option>
          <option value="Student">Student</option>
        </select>
        <button
          onClick={handleAddUser}
          className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 border text-left">ID</th>
              <th className="px-4 py-3 border text-left">Name</th>
              <th className="px-4 py-3 border text-left">Email</th>
              <th className="px-4 py-3 border text-left">Password</th>
              <th className="px-4 py-3 border text-left">Role</th>
              <th className="px-4 py-3 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="px-4 py-3 border">{user.id}</td>
                <td className="px-4 py-3 border">{user.name}</td>
                <td className="px-4 py-3 border">{user.email}</td>
                <td className="px-4 py-3 border">{user.password}</td>
                <td className="px-4 py-3 border">{user.role}</td>
                <td className="px-4 py-3 border flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
    </div>
  );
};

export default UserDetails;

