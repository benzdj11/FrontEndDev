// src/DataForm.js
import React, { useState } from 'react';
import './DataForm.css'; // Ensure you have the CSS imported

const DataForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    phone: '',
    address: '',
    course: '',
    semester: '',
    favoriteColor: '',
    favoriteFood: '',
    interestingFact: '', // New field
  });
  
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Handle successful form submission
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
      // Reset form
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
      setErrors({});
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    </form>
  );
};

export default DataForm;
