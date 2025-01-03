'use client'

import { useParams } from 'next/navigation';

export default function DetailTextPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Proyecto con ID: {id}</h1>
    </div>
  );
}
