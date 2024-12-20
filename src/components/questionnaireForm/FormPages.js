export const formPages = [
  {
    id: 'basicInfo',
    title: 'Basic Information',
    required: true,
    fields: [
      {
        name: 'age',
        label: 'Your Age',
        type: 'select',
        required: true,
        options: Array.from({length: 8}, (_, i) => String(18 + i)) // 18-25
      },
      {
        name: 'gender',
        label: 'Your Gender',
        type: 'select',
        required: true,
        options: ['Male', 'Female', 'Other']
      },
      {
        name: 'interestedIn',
        label: 'Interested In',
        type: 'select',
        required: true,
        options: ['Male', 'Female', 'Both']
      },
      {
        name: 'lookingFor',
        label: 'What are you looking for?',
        type: 'select',
        required: true,
        options: ['Serious Relationship', 'Casual Dating', 'Friendship', 'Let\'s see where it goes']
      },
      {
        name: 'religion',
        label: 'Religion',
        type: 'select',
        required: true,
        options: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other', 'Prefer not to say']
      }
    ]
  },
  {
    id: 'personalityLifestyle',
    title: 'Personality & Lifestyle',
    fields: [
      {
        name: 'personality',
        label: 'Your Personality Type',
        type: 'select',
        options: ['Introverted', 'Extroverted', 'Ambivert']
      },
      {
        name: 'lifestyle',
        label: 'Lifestyle',
        type: 'select',
        options: ['Active', 'Relaxed', 'Busy', 'Balanced']
      }
    ]
  },
  {
    id: 'education',
    title: 'Education',
    fields: [
      {
        name: 'course',
        label: 'Course',
        type: 'select',
        required: true,
        options: [
          'B.Tech', 'BCA', 'BBA', 'BSc', 
          'B.Com', 'BA', 'M.Tech', 'MCA', 
          'MBA', 'MSc', 'M.Com', 'MA',
          'Other'
        ]
      },
      {
        name: 'branch',
        label: 'Branch/Specialization',
        type: 'select',
        required: true,
        options: [
          'Computer Science', 'Information Technology', 'Electronics',
          'Electrical', 'Mechanical', 'Civil', 'Chemical',
          'Business Administration', 'Commerce', 'Arts',
          'Physics', 'Chemistry', 'Mathematics',
          'Other'
        ]
      },
      {
        name: 'year',
        label: 'Year of Study',
        type: 'select',
        required: true,
        options: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year']
      }
    ]
  },
  {
    id: 'interestsValues',
    title: 'Interests & Values',
    fields: [
      {
        name: 'values',
        label: 'Core Values',
        type: 'multiselect',
        options: [
          'Honesty', 'Family', 'Career', 'Adventure', 
          'Spirituality', 'Personal Growth', 'Creativity',
          'Social Impact'
        ]
      },
      {
        name: 'dealBreakers',
        label: 'Deal Breakers',
        type: 'multiselect',
        options: [
          'Smoking', 'Drinking', 'Different Religious Views',
          'Different Political Views', 'Long Distance', 'No Goals'
        ]
      },
      {
        name: 'interests',
        label: 'Interests & Hobbies',
        type: 'multiselect',
        options: [
          'Reading', 'Travel', 'Music', 'Sports', 
          'Cooking', 'Art', 'Gaming', 'Fitness',
          'Photography', 'Dancing', 'Writing', 'Technology'
        ]
      }
    ]
  },
  {
    id: 'entertainment',
    title: 'Entertainment Preferences',
    fields: [
      {
        name: 'musicPreference',
        label: 'Music Taste',
        type: 'multiselect',
        options: [
          'Bollywood', 'Classical Indian', 'Pop', 'Rock',
          'Hip Hop', 'Electronic', 'Jazz', 'Folk',
          'Indie', 'Metal', 'Regional', 'All types'
        ]
      },
      {
        name: 'movieGenres',
        label: 'Favorite Movie Genres',
        type: 'multiselect',
        options: [
          'Action', 'Comedy', 'Drama', 'Horror',
          'Romance', 'Sci-Fi', 'Documentary', 'Thriller'
        ]
      }
    ]
  },
  {
    id: 'languages',
    title: 'Languages',
    fields: [
      {
        name: 'languages',
        label: 'Languages Known',
        type: 'multiselect',
        options: [
          'Oriya', 'Hindi', 'English', 'Bengali',
          'Telugu', 'Tamil', 'Kannada', 'Malayalam',
          'Marathi', 'Gujarati', 'Punjabi', 'Urdu',
          'Spanish','French', 'Other'
        ]
      }
    ]
  },
  {
    id: 'aboutYou',
    title: 'About You',
    fields: [
      {
        name: 'aboutMe',
        label: 'About Me',
        type: 'textarea',
        placeholder: 'Tell us about yourself...'
      }
    ]
  }
];