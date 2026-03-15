'use client';

import { useEffect } from 'react';

export default function SecurityLayer() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Bloquear Ctrl+P (Imprimir), Ctrl+S (Guardar), F12 (DevTools), PrintScreen
      if (
        (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'c' || e.key === 'u')) ||
        e.key === 'PrintScreen' ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))
      ) {
        e.preventDefault();
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    // Aplicar a todo el documento
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCopy);

    // Evitar arrastrar imágenes
    const handleDragStart = (e: DragEvent) => e.preventDefault();
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCopy);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return null;
}
