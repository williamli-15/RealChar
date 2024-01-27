// utils/translate.js

// Import necessary libraries or APIs
// Assuming axios is used for HTTP requests
import axios from 'axios';

const translateText = async (text, targetLanguage) => {
  try {
    // Replace with the actual API endpoint and your API key
    const endpoint =
      'https://translation.googleapis.com/language/translate/v2?key=AIzaSyAH5suy35PuFwHs0QbDz9u4P_Cw3UeYFz8';

    const response = await axios.post(endpoint, {
      q: text,
      target: targetLanguage,
    });

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Error during translation:', error);
    return '';
  }
};

export default translateText;
