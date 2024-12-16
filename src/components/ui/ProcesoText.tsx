import React from 'react';

const ProcesoText = ({ data }) => {
  // Split the original text into sections
  const sections = data.split('###').filter(section => section.trim());

  // Función para renderizar texto con negrita
  const renderBoldText = (text) => {
    const boldRegex = /\*\*(.*?)\*\*/g; // Detectar **texto**
    const parts = text.split(boldRegex);

    return parts.map((part, index) =>
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 p-4 rounded-lg text-white overflow-auto h-[20rem] border border-slate-400 border-opacity-30">
      {sections.map((section, index) => {
        const lines = section.split('\n').filter(line => line.trim());
        const title = lines[0].trim();
        const content = lines.slice(1);

        return (
          <div key={index} className="mb-6">
            <h2 className="text-2xl font-bold text- mb-4">{title}</h2>
            {content.map((paragraph, pIndex) => {
              if (paragraph.trim().startsWith('-')) {
                return (
                  <ul key={pIndex} className="list-disc pl-6 mb-4">
                    {paragraph
                      .split('-')
                      .filter(item => item.trim())
                      .map((item, liIndex) => (
                        <li key={liIndex} className="mb-2">
                          {renderBoldText(item.trim())}
                        </li>
                      ))}
                  </ul>
                );
              }

              // Regular paragraphs
              return (
                <p key={pIndex} className="mb-4">
                  {renderBoldText(paragraph.trim())}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ProcesoText;
