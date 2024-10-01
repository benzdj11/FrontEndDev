import React, { useState, useEffect } from 'react';
import './DataForm.css';

const DataForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    phone: '',
    address: '',
    course: '',
    semester: '',
    favoriteColor: '',
    favoriteFood: '',
    interestingFact: '',
  });

  const [errors, setErrors] = useState({});
  const [userDataId, setUserDataId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:5000/api/user/data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const userDataArray = await response.json();
        if (userDataArray.length > 0) {
          setFormData(userDataArray[0]); // Set the first entry in the array
          setUserDataId(userDataArray[0]._id); // Set the user data ID for updates and deletion
        }
      } else {
        console.error('Error fetching user data:', await response.json());
      }
    };
  
    // Only fetch data if the user is logged in
    if (localStorage.getItem('token')) {
      fetchData();
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.age || isNaN(formData.age) || formData.age < 0) {
      newErrors.age = 'Please enter a valid age';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.address) {
      newErrors.address = 'Address is required';
    }
    if (!formData.course) {
      newErrors.course = 'Course is required';
    }
    if (!formData.semester) {
      newErrors.semester = 'Semester is required';
    }
    if (!formData.favoriteColor) {
      newErrors.favoriteColor = 'Favorite color is required';
    }
    if (!formData.favoriteFood) {
      newErrors.favoriteFood = 'Favorite food is required';
    }
    if (!formData.interestingFact) { 
      newErrors.interestingFact = 'Please share an interesting fact about yourself';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const method = userDataId ? 'PUT' : 'POST';
        const response = await fetch(`http://localhost:5000/api/user/data${userDataId ? `/${userDataId}` : ''}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          const result = await response.json();
          alert('Data saved successfully!');
          if (!userDataId) setUserDataId(result.data._id); // Update ID if new entry
        } else {
          const error = await response.json();
          alert('Error: ' + error.message);
          console.error('Error submitting form:', error);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your data?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/user/data/${userDataId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          alert('User data deleted successfully!');
          setFormData({
            age: '',
            phone: '',
            address: '',
            course: '',
            semester: '',
            favoriteColor: '',
            favoriteFood: '',
            interestingFact: '',
          });
          setUserDataId(null); // Clear ID after deletion
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error deleting user data:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    window.location.href = '/'; // Redirect to the login screen
  };

  return (
    <form onSubmit={handleSubmit} className="data-form">
      <h2>Data Submission Form</h2>
      {Object.keys(formData).map((key) => (
        <div key={key}>
          <label>
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
            />
          </label>
          {errors[key] && <span className="error">{errors[key]}</span>}
        </div>
      ))}
      <button type="submit">Submit</button>
      <button type="button" onClick={handleDelete}>Delete Data</button>
      <button type="button" onClick={handleLogout}>Return to Login</button>
    </form>
  );
};

export default DataForm;
