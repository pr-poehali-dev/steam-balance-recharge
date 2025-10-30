ALTER TABLE orders ADD COLUMN game_type VARCHAR(100) DEFAULT 'steam';
ALTER TABLE orders ADD COLUMN game_user_id VARCHAR(255);
ALTER TABLE orders RENAME COLUMN steam_login TO game_login;

CREATE INDEX idx_orders_game_type ON orders(game_type);