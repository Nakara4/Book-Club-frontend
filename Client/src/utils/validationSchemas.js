import * as yup from 'yup';

// Book Club Creation/Edit Schema
export const bookClubSchema = yup.object().shape({
  name: yup
    .string()
    .required('Book club name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  
  category: yup
    .string()
    .required('Please select a category'),
  
  maxMembers: yup
    .number()
    .positive('Maximum members must be a positive number')
    .integer('Maximum members must be a whole number')
    .min(2, 'Minimum 2 members required')
    .max(1000, 'Maximum 1000 members allowed')
    .nullable()
    .transform((value, originalValue) => 
      originalValue === '' ? null : value
    ),
  
  meetingFrequency: yup
    .string()
    .oneOf(['weekly', 'biweekly', 'monthly', 'quarterly'], 'Invalid meeting frequency'),
  
  location: yup
    .string()
    .max(200, 'Location must be less than 200 characters'),
  
  readingSchedule: yup
    .string()
    .max(300, 'Reading schedule must be less than 300 characters'),
  
  isPrivate: yup.boolean(),
  
  image: yup
    .mixed()
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value || !value[0]) return true;
      return value[0].size <= 5 * 1024 * 1024; // 5MB
    })
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value || !value[0]) return true;
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(
        value[0].type
      );
    }),
});

// Login Schema
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

// Registration Schema
export const registrationSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .matches(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    ),
  
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

// Profile Update Schema
export const profileUpdateSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  
  bio: yup
    .string()
    .max(500, 'Bio must be less than 500 characters'),
});

// Comment Schema
export const commentSchema = yup.object().shape({
  content: yup
    .string()
    .required('Comment cannot be empty')
    .min(1, 'Comment must contain at least 1 character')
    .max(1000, 'Comment must be less than 1000 characters'),
});

// Search Schema
export const searchSchema = yup.object().shape({
  query: yup
    .string()
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query must be less than 100 characters'),
  
  category: yup.string(),
  
  location: yup.string(),
});

// Contact Form Schema
export const contactSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  
  subject: yup
    .string()
    .required('Subject is required')
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters'),
  
  message: yup
    .string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
});

// Book Rating Schema
export const bookRatingSchema = yup.object().shape({
  rating: yup
    .number()
    .required('Please select a rating')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  
  review: yup
    .string()
    .max(500, 'Review must be less than 500 characters'),
});

// Invite Member Schema
export const inviteMemberSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  
  message: yup
    .string()
    .max(300, 'Message must be less than 300 characters'),
});
