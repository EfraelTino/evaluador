import React, { Dispatch, SetStateAction } from 'react';
import { PlusIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from './button';

interface Props {
  data: string;
  setData: Dispatch<SetStateAction<string>>;
  language:string;
}

const ProcesoText: React.FC<Props> = ({ data, setData, language }) => {
  const handleCleanUp = () => {
    setData("");
  };

  return (
    <div className="w-full mt-4  p-8 inline-block rounded-[16px] bg-text-item transition-opacity border shadow-sm fade-in">
      <div className="flex justify-end items-center mb-6">
        <Button 
          onClick={handleCleanUp} 
          className="text-white bg-blue-600 p-1 text-[10px] md:text-sm md:px-3"
        >
          {language  === 'en'? 'New' : 'Nuevo'}
           <PlusIcon />
        </Button>
      </div>
      
      <div className="prose prose-slate max-w-none">
        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <h2 className="text-xl md:text-2xl font-bold mt-6 mb-4">{children}</h2>
            ),
            strong: ({ children }) => (
              <strong className="font-bold">{children}</strong>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-6 mb-4">{children}</ul>
            ),
            li: ({ children }) => (
              <li className="mb-2">{children}</li>
            ),
            p: ({ children }) => (
              <p className="mb-4">{children}</p>
            )
          }}
        >
          {data}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ProcesoText;