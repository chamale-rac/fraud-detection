import React, { useState } from 'react'
import axios from 'axios'

const CreateBank = () => {
  // Setting initial state for the bank details
  const [bankDetails, setBankDetails] = useState({
    name: '',
    country: '',
    estimated_value: '',
    established: '',
    category: '',
    legal_entity: '',
  })

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target
    setBankDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post('/bank/create', bankDetails)
      alert('Bank created successfully!') // Show success message or handle as per your UX
      console.log(response.data)
    } catch (error) {
      console.error('Error creating bank:', error)
      alert('Failed to create bank.') // Show error message or handle as per your UX
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type='text'
          name='name'
          value={bankDetails.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Country:
        <input
          type='text'
          name='country'
          value={bankDetails.country}
          onChange={handleChange}
        />
      </label>
      <label>
        Estimated Value:
        <input
          type='number'
          name='estimated_value'
          value={bankDetails.estimated_value}
          onChange={handleChange}
        />
      </label>
      <label>
        Established Year:
        <input
          type='number'
          name='established'
          value={bankDetails.established}
          onChange={handleChange}
        />
      </label>
      <label>
        Category:
        <input
          type='text'
          name='category'
          value={bankDetails.category}
          onChange={handleChange}
        />
      </label>
      <label>
        Legal Entity:
        <input
          type='text'
          name='legal_entity'
          value={bankDetails.legal_entity}
          onChange={handleChange}
        />
      </label>
      <button type='submit'>Create Bank</button>
    </form>
  )
}

export default CreateBank
