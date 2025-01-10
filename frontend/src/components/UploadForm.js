import React, { useState } from "react";
import axios from "axios";

function UploadForm({ token }) {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState([]); // Для нескольких файлов
  const [resultUrls, setResultUrls] = useState([]); // Массив ссылок на результаты
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(""); // Для выбранного промпта

  const handleFilesChange = (e) => {
    setFiles([...e.target.files]); // Сохраняем выбранные файлы в массив
  };

  const handlePresetChange = (e) => {
    const selectedPrompt = e.target.value;
    setSelectedPreset(selectedPrompt); // Устанавливаем выбранный промпт
    setPrompt(selectedPrompt); // Синхронизируем с полем ввода
  };

  const handleCustomPromptChange = (e) => {
    setSelectedPreset(""); // Сбрасываем preset, если пользователь вводит свой текст
    setPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    if (files.length === 0 || !prompt) {
      alert("Please provide at least one image and a prompt.");
      return;
    }

    setIsGenerating(true); // Устанавливаем состояние генерации
    setResultUrls([]); // Сбрасываем предыдущие результаты
    const formData = new FormData();
    formData.append("prompt", prompt);
    files.forEach((file) => {
      formData.append("files", file); // Добавляем каждый файл в FormData
    });

    try {
      const response = await axios.post("http://localhost:8000/process-multiple-images/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Передаём токен для авторизации
        },
      });

      // Устанавливаем массив URL результатов после успешного запроса
      setResultUrls(response.data.image_urls.map((url) => `http://localhost:8000${url}`));
    } catch (error) {
      console.error("Error processing images:", error);
      alert("Failed to process the images.");
    } finally {
      setIsGenerating(false); // Сбрасываем состояние генерации
    }
  };

  const handleReset = () => {
    // Сбрасываем состояние для новой генерации
    setPrompt("");
    setFiles([]);
    setResultUrls([]);
    setIsGenerating(false);
    setSelectedPreset(""); // Сбрасываем выбранный preset
  };

  return (
    <div>
      {!isGenerating && resultUrls.length === 0 ? ( // Отображаем форму, если не идёт генерация и нет результатов
        <div>
          <div>
            <label>Choose a Prompt:</label>
            <select
              value={selectedPreset}
              onChange={handlePresetChange}
              disabled={isGenerating}
            >
              <option value="">Choose a preset...</option>
              <option value="A clean and modern studio background, soft lighting, 8k, ultra realistic, highly detailed">Modern Studio Background</option>
              <option value="Luxurious white marble surface with soft shadows, elegant texture, 8k, ultra quality, photorealistic">Luxury Marble Surface</option>
              <option value="Natural wooden tabletop with soft light reflections, minimalist style, ultra realistic, 8k resolution">Minimalist Wooden Table</option>
              <option value="A sunny outdoor background with blurred greenery, depth of field, ultra high quality, 8k resolution, photorealistic">Bright Outdoor Scene</option>
              <option value="Soft draped silk fabric in pastel colors, smooth shadows, highly detailed, ultra realistic, 8k quality">Elegant Fabric Drapes</option>
              <option value="An abstract gradient with soft pastel tones, smooth transitions, ultra high definition, 8k quality">Abstract Gradient Background</option>
              <option value="A professional product photography background, gradient grey tones, soft light, 8k resolution, ultra sharp details">Professional Product Display</option>
              <option value="A dark and moody background with soft vignette, professional lighting, 8k ultra detailed, hyper realistic">Dark Mood Aesthetic</option>
              <option value="Natural stone surface with subtle texture, soft light reflections, ultra realistic, 8k quality">Natural Stone Texture</option>
              <option value="Blurry cityscape lights in the background, shallow depth of field, bokeh effect, ultra quality, 8k resolution">Blurry City Lights</option>
            </select>
          </div>
          <div>
            <label>Or Enter a Prompt:</label>
            <textarea
              value={prompt}
              onChange={handleCustomPromptChange}
              disabled={isGenerating}
              placeholder="Enter your custom prompt here..."
            />
          </div>
          <div>
            <label>Upload Images:</label>
            <input
              type="file"
              multiple // Позволяем выбирать несколько файлов
              onChange={handleFilesChange}
              disabled={isGenerating}
            />
          </div>
          <button onClick={handleSubmit} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </div>
      ) : isGenerating ? ( // Отображаем сообщение, если идёт генерация
        <div>
          <h3>Generating Images...</h3>
        </div>
      ) : ( // Отображаем результаты
        <div>
          <h3>Generated Images:</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {resultUrls.map((url, index) => (
              <div key={index}>
                <img src={url} alt={`Generated ${index}`} style={{ maxWidth: "200px", maxHeight: "200px" }} />
              </div>
            ))}
          </div>
          <button onClick={handleReset}>Generate Again</button>
        </div>
      )}
    </div>
  );
}

export default UploadForm;
