import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FAQ = () => {
  const questions = [
    {
      question: "Как зарегистрироваться в системе?",
      answer: "Для регистрации необходимо заполнить форму на странице входа, указав свои данные и выбрав роль (студент или преподаватель)."
    },
    {
      question: "Как восстановить пароль?",
      answer: "На странице входа нажмите кнопку 'Забыли пароль?' и следуйте инструкциям для его восстановления."
    },
    {
      question: "Как просмотреть свою успеваемость?",
      answer: "После входа в систему перейдите в раздел 'Успеваемость', где вы увидите все свои оценки и средний балл."
    },
    {
      question: "Как работает расчет стипендии?",
      answer: "Система автоматически рассчитывает стипендию на основе вашей успеваемости и посещаемости."
    },
    {
      question: "Как связаться с технической поддержкой?",
      answer: "Вы можете написать нам на email mudarisov345@gmail.com или воспользоваться формой обратной связи в разделе 'Контакты'."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 gradient-text">Часто задаваемые вопросы</h1>
            
            <div className="space-y-4">
              {questions.map((item, index) => (
                <div key={index} className="glass-effect p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold mb-2 gradient-text">{item.question}</h3>
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ; 