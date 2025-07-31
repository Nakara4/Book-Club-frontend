import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { bookClubAPI } from '../../services/api';
import { bookClubSchema } from '../../utils/validationSchemas';
import Button from '../ui/Button';
import FormField from '../ui/Form/FormField';
import ErrorBoundary from '../common/ErrorBoundary';
import LoadingSpinner from '../ui/LoadingSpinner';
import apiService from '../../services/api';
import tokenService from '../../utils/tokenService';

const CreateBookClub = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(apiService.isAuthenticated());

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(bookClubSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      maxMembers: '',
      readingSchedule: '',
      meetingFrequency: 'weekly',
      location: '',
      isPrivate: false,
    },
  });

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Mystery',
    'Romance',
    'Science Fiction',
    'Fantasy',
    'Biography',
    'History',
    'Self-Help',
    'Young Adult'
  ];

  const meetingFrequencies = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const onSubmitHandler = async (data) => {
    setLoading(true);
    setApiError(null);

    try {
      console.log('Form data received:', data);
      const submitData = new FormData();
      
      // Append all form fields, but only include non-empty values
      Object.keys(data).forEach((key) => {
        if (key === 'image') {
          // Only append image if a file was actually selected
          if (data[key] && data[key][0] && data[key][0] instanceof File) {
            submitData.append(key, data[key][0]);
            console.log(`Added ${key}:`, data[key][0]);
          } else {
            console.log(`Skipping ${key}: no file selected`);
          }
        } else if (key === 'maxMembers') {
          // Convert to snake_case for API, only append if not empty
          if (data[key] && data[key] !== '') {
            submitData.append('max_members', data[key]);
            console.log(`Added max_members: ${data[key]}`);
          }
        } else if (key === 'readingSchedule') {
          // Only append if not empty
          if (data[key] && data[key] !== '') {
            submitData.append('reading_schedule', data[key]);
            console.log(`Added reading_schedule: ${data[key]}`);
          }
        } else if (key === 'meetingFrequency') {
          submitData.append('meeting_frequency', data[key]);
          console.log(`Added meeting_frequency: ${data[key]}`);
        } else if (key === 'isPrivate') {
          submitData.append('is_private', data[key]);
          console.log(`Added is_private: ${data[key]}`);
        } else if (key === 'location') {
          // Only append if not empty
          if (data[key] && data[key] !== '') {
            submitData.append(key, data[key]);
            console.log(`Added ${key}: ${data[key]}`);
          }
        } else {
          // For required fields like name, description, category
          if (data[key] && data[key] !== '') {
            submitData.append(key, data[key]);
            console.log(`Added ${key}: ${data[key]}`);
          }
        }
      });
      
      // Log all FormData entries
      console.log('FormData entries:');
      for (let [key, value] of submitData.entries()) {
        console.log(`${key}: ${value}`);
      }
      
      const response = await bookClubAPI.createBookClub(submitData);
      console.log('Book club created successfully:', response);
      
      // Navigate to the book clubs list instead of the detail page
      // This avoids the undefined ID issue and lets the user see all clubs
      navigate('/bookclubs');
    } catch (err) {
      console.error('Error creating book club:', err);
      
      // Show the actual error message from the API
      setApiError(err.message || 'Failed to create book club. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create a New Book Club</h1>

        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
          {/* Book Club Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Book Club Name *
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter book club name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe your book club, what types of books you'll read, the atmosphere you want to create..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              {...register('category')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Max Members */}
          <div>
            <label htmlFor="maxMembers" className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Members (Optional)
            </label>
            <input
              type="number"
              id="maxMembers"
              {...register('maxMembers')}
              min="2"
              max="1000"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.maxMembers ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Leave empty for unlimited"
            />
            {errors.maxMembers && (
              <p className="text-red-500 text-sm mt-1">{errors.maxMembers.message}</p>
            )}
          </div>

          {/* Meeting Frequency */}
          <div>
            <label htmlFor="meetingFrequency" className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Frequency
            </label>
            <select
              id="meetingFrequency"
              {...register('meetingFrequency')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {meetingFrequencies.map((freq) => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reading Schedule */}
          <div>
            <label htmlFor="readingSchedule" className="block text-sm font-medium text-gray-700 mb-2">
              Reading Schedule (Optional)
            </label>
            <textarea
              id="readingSchedule"
              {...register('readingSchedule')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your reading schedule, pace, or any specific guidelines..."
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location (Optional)
            </label>
            <input
              type="text"
              id="location"
              {...register('location')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Online, Local Library, Coffee Shop, etc."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Book Club Image (Optional)
            </label>
            <input
              type="file"
              id="image"
              {...register('image')}
              accept="image/*"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.image ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
            )}
            <p className="text-gray-500 text-sm mt-1">
              Upload an image to represent your book club (max 5MB)
            </p>
          </div>

          {/* Private Club */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPrivate"
              {...register('isPrivate')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
              Make this a private book club (invite-only)
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/bookclubs')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Book Club'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBookClub;
