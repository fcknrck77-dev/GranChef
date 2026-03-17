-- SQL para insertar los primeros cursos del Día 1 automáticamente
-- Copia esto y pégalo en el SQL Editor de Supabase
INSERT INTO
    public.courses (
        title,
        description,
        instructor,
        category,
        tier,
        days_required,
        reading_time,
        modules
    )
VALUES
    (
        'Introducción a la Esferificación Básica',
        'Aprende los conceptos fundamentales de la cocina molecular con la técnica que lo cambió todo.',
        'Grand Chef',
        'Técnicas',
        'FREE',
        1,
        '',
        '[{"id": 1, "title": "Bases de la Esferificación Directa", "content": "La esferificación consiste en la gelificación controlada de un líquido... requiere Alginato de Sodio y Cloruro de Calcio."}]'
    ),
    (
        'Soportes Estructurales y Gelificación Avanzada',
        'Dominio de hidrocoloides y texturizantes para crear estructuras imposibles.',
        'Grand Chef',
        'Técnicas',
        'PRO',
        1,
        '',
        '[
        {"id": 1, "title": "Termorreversibilidad del Agar-Agar", "content": "El Agar-Agar permite crear geles que soportan hasta 85-90ºC..."},
        {"id": 2, "title": "Sifonados y Espumas Estables", "content": "Uso de la Lecitina de Soja y Proespuma para texturas etéreas."}
    ]'
    ),
    (
        'Arquitectura del Sabor: Cromatografía Gastronómica',
        'MasterClass sobre la composición química de los aromas y su maridaje molecular.',
        'Grand Chef',
        'Creatividad',
        'PREMIUM',
        1,
        '',
        '[
        {"id": 1, "title": "La Ciencia de las Moléculas Aromáticas", "content": "Entender los terpenos y pirazinas para crear maridajes perfectos..."},
        {"id": 2, "title": "Cromatografía en el Plato", "content": "Cómo visualizar el sabor a través de las familias moleculares."},
        {"id": 3, "title": "Estudio del Sotolón y Umami", "content": "Profundización en ingredientes de alta complejidad química."},
        {"id": 4, "title": "Diseño de Menú Basado en Ciencia", "content": "Metodología para la creación de platos disruptivos."}
    ]'
    );
