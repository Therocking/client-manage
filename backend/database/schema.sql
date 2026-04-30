CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    photo TEXT
);

CREATE TABLE IF NOT EXISTS addresses (
    id TEXT PRIMARY KEY,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    zip TEXT NOT NULL,
    user_id TEXT NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Usuarios
INSERT INTO users (id, first_name, last_name, email, photo) VALUES
('u1', 'Juan', 'Pérez', 'juan.perez@email.com', 'https://api.dicebear.com/9.x/pixel-art/svg?seed=John'),
('u2', 'María', 'Gómez', 'maria.gomez@email.com', 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Maria'),
('u3', 'Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Carlos');

-- Direcciones (relacionadas por user_id)
INSERT INTO addresses (id, street, city, country, zip, user_id) VALUES
('a1', 'Calle 1 #123', 'Santo Domingo', 'República Dominicana', '10101', 'u1'),
('a2', 'Av. Duarte #456', 'Santiago', 'República Dominicana', '51000', 'u1'),
('a3', 'Calle 8 #789', 'La Vega', 'República Dominicana', '41000', 'u2'),
('a4', 'Av. Las Américas #321', 'Santo Domingo Este', 'República Dominicana', '11501', 'u3');