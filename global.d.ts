// global.d.ts
declare global {
    namespace JSX {
      interface IntrinsicElements {
        'formester-standard-form': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      }
    }
  }
  
  export {}; // Esto asegura que el archivo sea tratado como un módulo.
  