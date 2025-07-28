import React, { useState } from 'react';
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

const CreateBookClub = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
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
    { value: 'bi-weekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const handleFormSubmit = async (data) => {
    setLoading(true);
    setApiError(null);
    
    const formData = new FormData();

    // Handle form data conversion for API
    Object.keys(data).forEach((key) => {
      if (key === 'image' && data.image?.[0]) {
        formData.append(key, data.image[0]);
      } else if (key === 'maxMembers') {
        // Convert back to snake_case for API
        formData.append('max_members', data[key] || '');
      } else if (key === 'readingSchedule') {
        formData.append('reading_schedule', data[key] || '');
      } else if (key === 'meetingFrequency') {
        formData.append('meeting_frequency', data[key]);
      } else if (key === 'isPrivate') {
        formData.append('is_private', data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      const response = await bookClubAPI.createBookClub(formData);
      navigate(`/bookclubs/${response.id}`);
    } catch (error) {
      console.error('Error creating book club:', error);
      setApiError(error.response?.data?.message || 'Failed to create book club. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <Helmet>
        <title>Create New Book Club - BookClub</title>
        <meta name="description" content="Create a new book club and start building your reading community." />
      </Helmet>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-2xl"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Create a New Book Club
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Start your reading community and connect with fellow book lovers.
            </p>
          </div>

          {apiError && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6"
            >
              {apiError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              name="name"
              label="Book Club Name"
              register={register}
              errors={errors}
              required
              placeholder="Enter book club name"
            />

            <FormField
              name="description"
              label="Description"
              type="textarea"
              register={register}
              errors={errors}
              required
              placeholder="Describe your book club, what types of books you'll read, the atmosphere you want to create..."
            />

            <FormField
              name="category"
              label="Category"
              type="select"
              register={register}
              errors={errors}
              required
              options={categories.map((category) => ({ value: category, label: category }))}
              placeholder="Select a category"
            />

            <FormField
              name="maxMembers"
              label="Maximum Members (Optional)"
              type="number"
              register={register}
              errors={errors}
              placeholder="Leave empty for unlimited"
            />

            <FormField
              name="meetingFrequency"
              label="Meeting Frequency"
              type="select"
              register={register}
              errors={errors}
              options={meetingFrequencies}
            />

            <FormField
              name="readingSchedule"
              label="Reading Schedule (Optional)"
              type="textarea"
              register={register}
              errors={errors}
              placeholder="Describe your reading schedule, pace, or any specific guidelines..."
            />

            <FormField
              name="location"
              label="Location (Optional)"
              register={register}
              errors={errors}
              placeholder="e.g., Online, Local Library, Coffee Shop, etc."
            />

            <div>
              <FormField
                name="image"
                label="Book Club Image (Optional)"
                type="file"
                register={register}
                errors={errors}
              />
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Upload an image to represent your book club (max 5MB)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPrivate"
                {...register('isPrivate')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPrivate" className="text-sm text-gray-700 dark:text-gray-300">
                Make this a private book club (invite-only)
              </label>
            </div>

            <motion.div 
              className="flex justify-end space-x-4 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button 
                variant="outline" 
                onClick={() => navigate('/bookclubs')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                loading={loading} 
                disabled={loading}
              >
                Create Book Club
              </Button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </ErrorBoundary>
  );
};

export default CreateBookClub;
