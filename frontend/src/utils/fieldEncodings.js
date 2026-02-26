// ============================================
// FIELD ENCODINGS - Updated to match model parameters exactly
// 28 input fields (0-27) + 2 calculated fields (28-29) = 30 total
// ============================================

export const FIELD_ENCODINGS = {
  // Field 0 - Marital Status
  field0: {
    fieldName: 'Marital Status',
    type: 'categorical',
    encoding: {
      'Single': 1,
      'Married': 2,
      'Widower': 3,
      'Divorced': 4,
      'Facto union': 5,
      'Legally separated': 6
    },
    decoding: {
      1: 'Single',
      2: 'Married',
      3: 'Widower',
      4: 'Divorced',
      5: 'Facto union',
      6: 'Legally separated'
    }
  },

  // Field 1 - Application mode
  field1: {
    fieldName: 'Application mode',
    type: 'categorical',
    encoding: {
      'Merit': 1,
      'Quota': 2,
      'Lateral': 3,
      'Transfer': 4,
      'Mature': 5,
      'Ordinance': 6
    },
    decoding: {
      1: 'Merit',
      2: 'Quota',
      3: 'Lateral',
      4: 'Transfer',
      5: 'Mature',
      6: 'Ordinance'
    }
  },

  // Field 2 - Choice of this college (Application Order 1-9)
  field2: {
    fieldName: 'Choice of this college (1-9)',
    type: 'numerical'
  },

  // Field 3 - Course
  field3: {
    fieldName: 'Course',
    type: 'categorical',
    encoding: {
      'Biofuel Production Technologies': 1,
      'Animation and Multimedia Design': 2,
      'Social Service': 3,
      'Agronomy': 4,
      'Communication Design': 5,
      'Veterinary Nursing': 6,
      'Informatics Engineering': 7,
      'Equiniculture': 8,
      'Management': 9,
      'Social Service (evening)': 10,
      'Tourism': 11,
      'Nursing': 12,
      'Oral Hygiene': 13,
      'Advertising and Marketing Management': 14,
      'Journalism and Communication': 15,
      'Basic Education': 16,
      'Management (evening)': 17
    },
    decoding: {
      1: 'Biofuel Production Technologies',
      2: 'Animation and Multimedia Design',
      3: 'Social Service',
      4: 'Agronomy',
      5: 'Communication Design',
      6: 'Veterinary Nursing',
      7: 'Informatics Engineering',
      8: 'Equiniculture',
      9: 'Management',
      10: 'Social Service (evening)',
      11: 'Tourism',
      12: 'Nursing',
      13: 'Oral Hygiene',
      14: 'Advertising and Marketing Management',
      15: 'Journalism and Communication',
      16: 'Basic Education',
      17: 'Management (evening)'
    }
  },

  // Field 4 - Daytime/evening attendance
  field4: {
    fieldName: 'Daytime/evening attendance',
    type: 'categorical',
    encoding: {
      'Daytime': 1,
      'Evening': 0
    },
    decoding: {
      1: 'Daytime',
      0: 'Evening'
    }
  },

  // Field 5 - Previous qualification
  field5: {
    fieldName: 'Previous qualification',
    type: 'categorical',
    encoding: {
      'Secondary Education': 1,
      '12th grade': 2,
      'Bachelor\'s Degree': 3,
      'Master\'s Degree': 4,
      'Other': 5
    },
    decoding: {
      1: 'Secondary Education',
      2: '12th grade',
      3: 'Bachelor\'s Degree',
      4: 'Master\'s Degree',
      5: 'Other'
    }
  },

  // Field 6 - Mother's qualification
  field6: {
    fieldName: "Mother's qualification",
    type: 'categorical',
    encoding: {
      'Secondary Education - 12th Grade': 1,
      'Higher Education - Bachelor\'s': 2,
      'Higher Education - Master\'s': 3,
      'Higher Education - Doctorate': 4,
      'Vocational Course': 5,
      '11th Grade': 6,
      '10th Grade': 7,
      'Basic Education': 8
    },
    decoding: {
      1: 'Secondary Education - 12th Grade',
      2: 'Higher Education - Bachelor\'s',
      3: 'Higher Education - Master\'s',
      4: 'Higher Education - Doctorate',
      5: 'Vocational Course',
      6: '11th Grade',
      7: '10th Grade',
      8: 'Basic Education'
    }
  },

  // Field 7 - Father's qualification
  field7: {
    fieldName: "Father's qualification",
    type: 'categorical',
    encoding: {
      'Secondary Education - 12th Grade': 1,
      'Higher Education - Bachelor\'s': 2,
      'Higher Education - Master\'s': 3,
      'Higher Education - Doctorate': 4,
      'Vocational Course': 5,
      '11th Grade': 6,
      '10th Grade': 7,
      'Basic Education': 8
    },
    decoding: {
      1: 'Secondary Education - 12th Grade',
      2: 'Higher Education - Bachelor\'s',
      3: 'Higher Education - Master\'s',
      4: 'Higher Education - Doctorate',
      5: 'Vocational Course',
      6: '11th Grade',
      7: '10th Grade',
      8: 'Basic Education'
    }
  },

  // Field 8 - Mother's occupation
  field8: {
    fieldName: "Mother's occupation",
    type: 'categorical',
    encoding: {
      'Student': 0,
      'Professionals': 1,
      'Technicians': 2,
      'Clerks': 3,
      'Service/Sales': 4,
      'Skilled Agriculture': 5,
      'Craft Workers': 6,
      'Machine Operators': 7,
      'Elementary Occupations': 8,
      'Armed Forces': 9,
      'Other': 10
    },
    decoding: {
      0: 'Student',
      1: 'Professionals',
      2: 'Technicians',
      3: 'Clerks',
      4: 'Service/Sales',
      5: 'Skilled Agriculture',
      6: 'Craft Workers',
      7: 'Machine Operators',
      8: 'Elementary Occupations',
      9: 'Armed Forces',
      10: 'Other'
    }
  },

  // Field 9 - Father's occupation
  field9: {
    fieldName: "Father's occupation",
    type: 'categorical',
    encoding: {
      'Student': 0,
      'Professionals': 1,
      'Technicians': 2,
      'Clerks': 3,
      'Service/Sales': 4,
      'Skilled Agriculture': 5,
      'Craft Workers': 6,
      'Machine Operators': 7,
      'Elementary Occupations': 8,
      'Armed Forces': 9,
      'Other': 10
    },
    decoding: {
      0: 'Student',
      1: 'Professionals',
      2: 'Technicians',
      3: 'Clerks',
      4: 'Service/Sales',
      5: 'Skilled Agriculture',
      6: 'Craft Workers',
      7: 'Machine Operators',
      8: 'Elementary Occupations',
      9: 'Armed Forces',
      10: 'Other'
    }
  },

  // Field 10 - Displaced
  field10: {
    fieldName: 'Displaced',
    type: 'categorical',
    encoding: {
      'Yes': 1,
      'No': 0
    },
    decoding: {
      1: 'Yes',
      0: 'No'
    }
  },

  // Field 11 - Debtor
  field11: {
    fieldName: 'Debtor',
    type: 'categorical',
    encoding: {
      'Yes': 1,
      'No': 0
    },
    decoding: {
      1: 'Yes',
      0: 'No'
    }
  },

  // Field 12 - Tuition fees up to date
  field12: {
    fieldName: 'Tuition fees up to date',
    type: 'categorical',
    encoding: {
      'Yes': 1,
      'No': 0
    },
    decoding: {
      1: 'Yes',
      0: 'No'
    }
  },

  // Field 13 - Gender
  field13: {
    fieldName: 'Gender',
    type: 'categorical',
    encoding: {
      'Male': 1,
      'Female': 0
    },
    decoding: {
      1: 'Male',
      0: 'Female'
    }
  },

  // Field 14 - Scholarship holder
  field14: {
    fieldName: 'Scholarship holder',
    type: 'categorical',
    encoding: {
      'Yes': 1,
      'No': 0
    },
    decoding: {
      1: 'Yes',
      0: 'No'
    }
  },

  // Field 15 - Age at enrollment
  field15: {
    fieldName: 'Age at enrollment',
    type: 'numerical'
  },

  // Field 16 - International
  field16: {
    fieldName: 'International',
    type: 'categorical',
    encoding: {
      'Yes': 1,
      'No': 0
    },
    decoding: {
      1: 'Yes',
      0: 'No'
    }
  },

  // Field 17 - Curricular units 1st sem (enrolled)
  field17: {
    fieldName: 'Curricular units 1st sem (enrolled)',
    type: 'numerical'
  },

  // Field 18 - Curricular units 1st sem (evaluations)
  field18: {
    fieldName: 'Curricular units 1st sem (evaluations)',
    type: 'numerical'
  },

  // Field 19 - Curricular units 1st sem (approved)
  field19: {
    fieldName: 'Curricular units 1st sem (approved)',
    type: 'numerical'
  },

  // Field 20 - Curricular units 1st sem (grade)
  field20: {
    fieldName: 'Curricular units 1st sem (grade)',
    type: 'numerical'
  },

  // Field 21 - Curricular units 2nd sem (enrolled)
  field21: {
    fieldName: 'Curricular units 2nd sem (enrolled)',
    type: 'numerical'
  },

  // Field 22 - Curricular units 2nd sem (evaluations)
  field22: {
    fieldName: 'Curricular units 2nd sem (evaluations)',
    type: 'numerical'
  },

  // Field 23 - Curricular units 2nd sem (approved)
  field23: {
    fieldName: 'Curricular units 2nd sem (approved)',
    type: 'numerical'
  },

  // Field 24 - Curricular units 2nd sem (grade)
  field24: {
    fieldName: 'Curricular units 2nd sem (grade)',
    type: 'numerical'
  },

  // Field 25 - Unemployment rate
  field25: {
    fieldName: 'Unemployment rate',
    type: 'numerical'
  },

  // Field 26 - Inflation rate
  field26: {
    fieldName: 'Inflation rate',
    type: 'numerical'
  },

  // Field 27 - GDP
  field27: {
    fieldName: 'GDP',
    type: 'numerical'
  }
};

// Encode: Convert user input (string) to number for model
export const encodeFieldValue = (fieldId, value) => {
  // If field is defined
  if (FIELD_ENCODINGS[fieldId]) {
    // If it's a categorical field with encodings
    if (FIELD_ENCODINGS[fieldId].type === 'categorical' && FIELD_ENCODINGS[fieldId].encoding) {
      const encoding = FIELD_ENCODINGS[fieldId].encoding;
      
      // Try exact match first
      if (encoding.hasOwnProperty(value)) {
        return encoding[value];
      }
      
      // Try case-insensitive match
      const lowerValue = String(value).toLowerCase();
      for (let key in encoding) {
        if (key.toLowerCase() === lowerValue) {
          return encoding[key];
        }
      }
      
      // If string not found, return 0 as default
      return 0;
    }
  }
  
  // For numerical fields, just parse as number
  const numValue = parseFloat(value);
  return isNaN(numValue) ? 0 : numValue;
};

// Decode: Convert model output (number) to string for display
export const decodeFieldValue = (fieldId, value) => {
  if (FIELD_ENCODINGS[fieldId] && FIELD_ENCODINGS[fieldId].decoding) {
    const decoding = FIELD_ENCODINGS[fieldId].decoding;
    return decoding[value] || value;
  }
  return value;
};

// Encode all student data for model input
export const encodeStudentData = (studentData) => {
  const encoded = {};
  
  for (let fieldId in studentData) {
    encoded[fieldId] = encodeFieldValue(fieldId, studentData[fieldId]);
  }
  
  return encoded;
};

// Get field input type (for rendering dropdowns vs text inputs)
export const getFieldInputType = (fieldId) => {
  if (FIELD_ENCODINGS[fieldId] && FIELD_ENCODINGS[fieldId].type === 'categorical') {
    return {
      type: 'select',
      options: Object.keys(FIELD_ENCODINGS[fieldId].encoding)
    };
  }
  return { type: 'number' };
};
