import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./AddUser.css";

const AddUser = () => {
    const [users, setUsers] = useState([]);
    //const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]); // <-- Add this line

    const [formData, setFormData] = useState({
        admissionNumber: "",
        name: "",
        email: "",
        role: "Alumni", // Default role
    });
    const [editingUserId, setEditingUserId] = useState(null); 
    const [searchQuery, setSearchQuery] = useState("");
    const [filterRole, setFilterRole] = useState(""); // Empty means show all


    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, filterRole, users]);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/admin/users");
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const applyFilters = () => {
        let filtered = users;

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.admissionNumber.includes(searchQuery)
            );
        }

        // Apply role filter
        if (filterRole) {
            filtered = filtered.filter(user => user.role === filterRole);
        }

        setFilteredUsers(filtered);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUserId) {
                // Edit existing user
                await axios.put(`http://localhost:5000/api/admin/edit-user/${editingUserId}`, formData);
                alert("User updated successfully");
                setEditingUserId(null); // Reset edit mode
            } else {
                // Add new user
                await axios.post("http://localhost:5000/api/admin/add-user", formData);
                alert("User added successfully");
            }
    
            // Reset the form after submission
            setFormData({ admissionNumber: "", name: "", email: "", role: "Alumni" });
            fetchUsers(); // Refresh list
        } catch (error) {
            alert(error.response?.data?.message || "Error processing request");
        }
    };
    

    const handleEdit = (user) => {
        setEditingUserId(user._id);
        setFormData({
            admissionNumber: user.admissionNumber,
            name: user.name,
            email: user.email,
            role: user.role, // Ensure role is set
        });
    };
    

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/delete-user/${id}`);
                alert("User deleted successfully");
                fetchUsers(); // Refresh list
            } catch (error) {
                alert("Error deleting user");
            }
        }
    };

    return (
        <div className="container">
            <h2>{editingUserId ? "Edit User" : "Add User"}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="admissionNumber" placeholder="Admission Number" value={formData.admissionNumber} onChange={handleChange} required disabled={!!editingUserId} />
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="Student">Student</option>
                    <option value="Alumni">Alumni</option>
                </select>
                <button type="submit">{editingUserId ? "Update User" : "Add User"}</button>
            </form>

            {/* Search Bar and Filter Dropdown */}
            <div className="filters">
                <input type="text" placeholder="Search by name or admission number" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                    <option value="">All</option>
                    <option value="Student">Students</option>
                    <option value="Alumni">Alumni</option>
                </select>
            </div>

            <h3>Existing Users</h3>
            <table>
                <thead>
                    <tr>
                        <th>Admission Number</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {filteredUsers.map((user) => (

                        <tr key={user._id}>
                            <td>{user.admissionNumber}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button className="icon-button edit" onClick={() => handleEdit(user)}>
                                    <FaEdit />
                                </button>
                                <button className="icon-button delete" onClick={() => handleDelete(user._id)}>
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AddUser;
