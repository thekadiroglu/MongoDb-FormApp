import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const App = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    tel: '',
  });
  const [savedData, setSavedData] = useState([]);

  useEffect(() => {
    fetchSavedData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await axios.put(`http://localhost:5000/submit-form/${formData._id}`, formData);
      } else {
        await axios.post('http://localhost:5000/submit-form', formData);
      }
      setFormData({
        firstName: '',
        lastName: '',
        tel: '',
      });
      fetchSavedData();
    } catch (error) {
      console.error('Form gönderme hatası:', error);
    }
  };

  const fetchSavedData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/submit-form');
      setSavedData(response.data);
    } catch (error) {
      console.error('Kayıtlı verileri alma hatası:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/submit-form/${id}`);
      fetchSavedData();
      console.log(`ID'si ${id} olan kayıt başarıyla silindi.`);
    } catch (error) {
      console.error('Kayıt silme hatası:', error);
    }
  };

  const handleEdit = (data) => {
    setFormData(data);
  };

  return (
    <div className="container">
      <h1>Form Örneği</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">Ad:</label><br />
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        /><br />

        <label htmlFor="lastName">Soyad:</label><br />
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        /><br />

        <label htmlFor="tel">Telefon:</label><br />
        <input
          type="tel"
          id="tel"
          name="tel"
          value={formData.tel}
          onChange={handleChange}
        /><br />

        <button type="submit">{formData._id ? 'Güncelle' : 'Gönder'}</button>
      </form>
      <h1>Kayıtlı Veriler</h1>
      <ul id="saved-data-container">
        {savedData.map((data, index) => (
          <li key={data._id}>
            Ad: {data.firstName}, Soyad: {data.lastName}, Telefon: {data.tel}
            <button onClick={() => handleEdit(data)}>Düzenle</button>
            <button onClick={() => handleDelete(data._id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
