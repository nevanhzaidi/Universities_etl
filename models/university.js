const Joi = require('joi');
const logger = require('../config/logger');

// Validation schema for a single university
const universitySchema = Joi.object({
  name: Joi.string()
    .required()
    .trim()
    .min(1)
    .max(200)
    .messages({
      'string.empty': 'University name cannot be empty',
      'string.min': 'University name must be at least 1 character long',
      'string.max': 'University name cannot exceed 200 characters',
      'any.required': 'University name is required'
    }),

  country: Joi.string()
    .required()
    .trim()
    .valid('United States')
    .messages({
      'any.only': 'Country must be United States',
      'any.required': 'Country is required'
    }),

  'state-province': Joi.string()
    .allow(null, '')
    .trim()
    .max(100)
    .messages({
      'string.max': 'State/province cannot exceed 100 characters'
    }),

  domains: Joi.array()
    .items(Joi.string().domain())
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one domain is required',
      'array.base': 'Domains must be an array',
      'string.domain': 'Invalid domain format'
    }),

  web_pages: Joi.array()
    .items(Joi.string().uri())
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one web page is required',
      'array.base': 'Web pages must be an array',
      'string.uri': 'Invalid URL format'
    }),

  alpha_two_code: Joi.string()
    .required()
    .trim()
    .valid('US')
    .messages({
      'any.only': 'Alpha two code must be US',
      'any.required': 'Alpha two code is required'
    })
});

const validateUniversitySchema = (data) => {
  try {
    const { error } = universitySchema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      logger.warn('University validation failed:', { errors });
      return {
        isValid: false,
        errors
      };
    }
    
    return {
      isValid: true,
      errors: []
    };
  } catch (error) {
    logger.error('Validation error:', error);
    return {
      isValid: false,
      errors: [{ message: 'Internal validation error' }]
    };
  }
};

const transformUniversity = (university) => {
  // First validate the input data
  const validation = validateUniversitySchema(university);
  if (!validation.isValid) {
    logger.warn('Skipping invalid university data:', { 
      name: university.name,
      errors: validation.errors 
    });
    return null;
  }

  // Transform only valid data
  return {
    name: university.name || '',
    country: university.country || '',
    state: university['state-province'] || '',
    domain: Array.isArray(university.domains) ? university.domains[0] : '',
    website: Array.isArray(university.web_pages) ? university.web_pages[0] : '',
    countryCode: university.alpha_two_code || '',
    lastUpdated: new Date().toISOString()
  };
};

const transformUniversities = (universities) => {
  return universities
    .map(transformUniversity)
    .filter(university => university !== null); // Remove invalid entries
};

// Helper function to validate entire dataset
const validateDataset = (universities) => {
  if (!Array.isArray(universities)) {
    return {
      isValid: false,
      errors: [{ message: 'Input must be an array of universities' }]
    };
  }

  if (universities.length === 0) {
    return {
      isValid: false,
      errors: [{ message: 'University array cannot be empty' }]
    };
  }

  const validations = universities.map((university, index) => {
    const validation = validateUniversitySchema(university);
    if (!validation.isValid) {
      return {
        index,
        ...validation
      };
    }
    return null;
  }).filter(Boolean);

  return {
    isValid: validations.length === 0,
    errors: validations
  };
};

module.exports = {
  transformUniversity,
  transformUniversities,
  validateUniversitySchema,
  validateDataset
};