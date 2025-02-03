import React, { Dispatch, SetStateAction } from 'react';
import { PlusIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from './button';

interface Props {
  data: string;
  setData: Dispatch<SetStateAction<string>>;
}

const ProcesoText: React.FC<Props> = ({ data, setData }) => {
  const handleCleanUp = () => {
    setData("");
  };

  return (
    <div className="w-full mt-4  p-8 inline-block rounded-[16px] bg-text-item transition-opacity border shadow-sm fade-in">
      <div className="flex justify-end items-center mb-6">
        <Button 
          onClick={handleCleanUp} 
          className="w-full md:w-auto px-6 md:py-6 flex justify-center items-center gap-2 text-lg text-white bg-terracotta hover:bg-terracotta-600 border-[0.5px] border-terracotta-500 rounded-lg transition duration-200 ease-in-out fade-in"
        >
          Nuevo <PlusIcon />
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