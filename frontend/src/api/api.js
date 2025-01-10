import axios from "axios";

const API_URL = "http://localhost:8000/images";

export const processImage = async (prompt, file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("prompt", prompt);

  try {
    const response = await axios.post(`${API_URL}/process-image/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.image_url; // URL обработанного изображения
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
};
