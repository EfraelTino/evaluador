import React, { Dispatch, SetStateAction } from 'react';
import { PlusIcon } from 'lucide-react';
import { Button } from './button';

interface Props {
  data: string;
  setData: Dispatch<SetStateAction<string>>;
}

const ProcesoText: React.FC<Props> = ({ data, setData }) => {
  const sections = data.split('###').filter(section => section.trim());
  
  const handleCleanUp = () => {
    setData("");
  };

  const renderBoldText = (text: string): React.ReactNode => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = text.split(boldRegex);

    return parts.map((part, index) =>
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
  };

  return (
    <div className="w-full  mt-12 p-8 inline-block rounded-[16px] bg-text-item border shadow-sm fade-in">
      <div className='flex justify-end items-center'>
        <Button onClick={handleCleanUp} className="w-full md:w-auto px-6 py-6 flex justify-center items-center gap-2 text-lg text-white bg-terracotta hover:bg-terracotta-600 border-[0.5px] border-terracotta-500 rounded-lg transition duration-200 ease-in-out fade-in">
          Nuevo <PlusIcon />
        </Button>
      </div>

      {sections.map((section, index) => {
        const lines = section.split('\n').filter(line => line.trim());
        const title = lines[0].trim();
        const content = lines.slice(1);

        return (
          <div key={index} className="mb-6 fade-in">
            <h2 className={`text-2xl font-bold mb-4 `} style={{ animationDelay: `${index * 0.3}s` }}>
              {title}
            </h2>
            {content.map((paragraph, pIndex) => {
              const delay = (index + pIndex) * 0.3; // Añadir un retraso progresivo

              if (paragraph.trim().startsWith('-')) {
                return (
                  <ul key={pIndex} className="list-disc pl-6 mb-4">
                    {paragraph
                      .split('-')
                      .filter(item => item.trim())
                      .map((item, liIndex) => (
                        <li key={liIndex} className={`mb-2`} style={{ animationDelay: `${delay}s` }}>
                          {renderBoldText(item.trim())}
                        </li>
                      ))}
                  </ul>
                );
              }

              // Regular paragraphs
              return (
                <p key={pIndex} className={`mb-4 `} style={{ animationDelay: `${delay}s`, color: "rgb(51, 51, 51)" }}>
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
