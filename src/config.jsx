// src/config.js
const config = {
    SPRING_API_BASE_URL: import.meta.env.VITE_SPRING_API_BASE_URL,
    ENV: import.meta.env.MODE || 'development',  // Provides current mode ('development' or 'production')
  };
  console.log(import.meta.env);
  console.log(config.SPRING_API_BASE_URL);
  export default config;
  