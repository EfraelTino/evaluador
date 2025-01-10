import React from 'react';
{/**import { Button } from './button';
import { DownloadIcon, PlusIcon } from 'lucide-react'; */}

interface Props {
  data: string;
}

const ProcesoText: React.FC<Props> = ({ data }) => {
  // Split the original text into sections
  //console.log(JSON.parse(data))

  const sections = data.split('###').filter(section => section.trim());
{/**  const handleCleanUp = () => {
    setData("");
  } */}
  // Función para renderizar texto con negrita
  const renderBoldText = (text: string): React.ReactNode => {
    const boldRegex = /\*\*(.*?)\*\*/g; // Detectar **texto**
    const parts = text.split(boldRegex);

    return parts.map((part, index) =>
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
  };

  return (
    <div className="w-full py-[10px] mt-12 px-[20px] inline-block rounded-[16px] bg-text-item border shadow-sm">
      <div className='flex justify-between items-center'>
       {/* <Button onClick={handleCleanUp} className="w-full md:w-auto px-6 py-6 flex justify-center items-center gap-2 text-lg text-white bg-terracotta hover:bg-terracotta-600 border-[0.5px] border-terracotta-500 rounded-lg transition duration-200 ease-in-out">Nuevo <PlusIcon /> </Button>
        <Button className="w-full md:w-auto px-6 py-6 flex justify-center items-center gap-2 text-lg text-white bg-terracotta hover:bg-terracotta-600 border-[0.5px] border-terracotta-500 rounded-lg transition duration-200 ease-in-out"><DownloadIcon /> JSON  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0C5.372 0 0 5.372 0 12c0 6.626 5.372 12 12 12s12-5.372 12-12c0-6.626-5.372-12-12-12M9 17H7V7h2Zm8 0h-6v-2h6Zm0-4h-6v-2h6Zm0-4h-6V7h6Z" /></svg></Button> */}
      </div>
      {sections.map((section, index) => {
        const lines = section.split('\n').filter(line => line.trim());
        const title = lines[0].trim();
        const content = lines.slice(1);

        return (



          <div key={index} className="mb-6">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
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
                <p key={pIndex} className="mb-4" style={{ color: "rgb(51, 51, 51)" }}>
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
