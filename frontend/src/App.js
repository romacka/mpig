import React, { useState, useRef, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import UploadForm from "./components/UploadForm";
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import background from './images/background.jpg';

function App() {
  const [token, setToken] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      {!token ? (
        <>
          <section className="hero-section" data-aos="fade-up">
            <div className="content-box">
              <h1>Создавайте идеальные карточки товаров для маркетплейсов за считанные минуты</h1>
              <p>
                Представьте себе инструмент, который берет на себя всю рутину по созданию и оформлению карточек товаров
                для интернет-магазинов. Вам больше не нужно тратить часы на подбор изображений, форматирование описания
                и вручную заполнять характеристики.
              </p>
              <button className="cta-button" onClick={scrollToForm}>
                Перейти к генерации
              </button>
            </div>
          </section>

          <div ref={formRef} className="auth-section" data-aos="fade-up">
            <div className="form-container">
              {isRegister ? (
                <Register />
              ) : (
                <Login setToken={setToken} />
              )}
              <div className="auth-buttons">
                <button
                  className="toggle-button"
                  onClick={() => setIsRegister(!isRegister)}
                >
                  {isRegister ? "Перейти ко входу" : "Перейти к регистрации"}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="upload-container">
          <UploadForm token={token} />
        </div>
      )}
    </div>
  );
}

export default App;
