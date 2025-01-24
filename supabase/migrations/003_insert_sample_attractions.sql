-- Insert sample zoo attractions
INSERT INTO attractions (
    user_id,
    name,
    short_description,
    long_description,
    address,
    city,
    country,
    opening_hours,
    status
) VALUES 
(
    '7fc3dc34-f36a-4fa0-9bb4-b5c021846244',
    'Lion Kingdom',
    'Experience the majesty of African lions in their natural habitat',
    'Get up close with our pride of lions in a specially designed enclosure that mimics their natural African savanna environment. Watch them during feeding times and learn about conservation efforts.',
    'Safari Road 123',
    'Amsterdam',
    'Netherlands',
    '{"monday": "09:00-18:00", "tuesday": "09:00-18:00", "wednesday": "09:00-18:00", "thursday": "09:00-18:00", "friday": "09:00-18:00", "saturday": "09:00-19:00", "sunday": "09:00-19:00"}',
    'approved'
),
(
    '7fc3dc34-f36a-4fa0-9bb4-b5c021846244',
    'Penguin Paradise',
    'Meet our adorable colony of Emperor and King penguins',
    'Step into our climate-controlled penguin habitat where you can observe these fascinating birds swimming, playing, and interacting. Daily feeding shows and educational presentations.',
    'Arctic Avenue 45',
    'Amsterdam',
    'Netherlands',
    '{"monday": "09:00-17:30", "tuesday": "09:00-17:30", "wednesday": "09:00-17:30", "thursday": "09:00-17:30", "friday": "09:00-17:30", "saturday": "09:00-18:30", "sunday": "09:00-18:30"}',
    'pending'
),
(
    '7fc3dc34-f36a-4fa0-9bb4-b5c021846244',
    'Tropical Butterfly Garden',
    'Walk among hundreds of free-flying butterflies',
    'Immerse yourself in our tropical greenhouse filled with exotic plants and hundreds of colorful butterflies from around the world. Watch the butterfly lifecycle unfold in our special breeding area.',
    'Butterfly Lane 78',
    'Amsterdam',
    'Netherlands',
    '{"monday": "10:00-17:00", "tuesday": "10:00-17:00", "wednesday": "10:00-17:00", "thursday": "10:00-17:00", "friday": "10:00-17:00", "saturday": "10:00-18:00", "sunday": "10:00-18:00"}',
    'declined'
),
(
    '7fc3dc34-f36a-4fa0-9bb4-b5c021846244',
    'Elephant Sanctuary',
    'Watch our gentle giants in their spacious habitat',
    'Our elephant sanctuary provides a natural environment for these intelligent creatures. Learn about their social behavior, conservation status, and participate in our elephant care programs.',
    'Elephant Way 234',
    'Amsterdam',
    'Netherlands',
    '{"monday": "09:30-17:00", "tuesday": "09:30-17:00", "wednesday": "09:30-17:00", "thursday": "09:30-17:00", "friday": "09:30-17:00", "saturday": "09:30-18:00", "sunday": "09:30-18:00"}',
    'approved'
),
(
    '7fc3dc34-f36a-4fa0-9bb4-b5c021846244',
    'Reptile House',
    'Discover fascinating reptiles from around the globe',
    'Home to various species of snakes, lizards, turtles, and crocodiles. Features a special nocturnal exhibit and regular handling sessions with our expert keepers.',
    'Reptile Road 56',
    'Amsterdam',
    'Netherlands',
    '{"monday": "10:00-16:30", "tuesday": "10:00-16:30", "wednesday": "10:00-16:30", "thursday": "10:00-16:30", "friday": "10:00-16:30", "saturday": "10:00-17:30", "sunday": "10:00-17:30"}',
    'pending'
); 