-- Add user_id column to analysis_result table
ALTER TABLE analysis_result ADD COLUMN IF NOT EXISTS user_id BIGINT;
ALTER TABLE analysis_result ADD CONSTRAINT fk_analysis_result_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    email_notifications BOOLEAN DEFAULT true,
    price_alerts BOOLEAN DEFAULT true,
    weekly_digest BOOLEAN DEFAULT false,
    theme VARCHAR(20) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'en',
    CONSTRAINT fk_user_settings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS wishlist_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    price_at_addition DOUBLE PRECISION,
    notify_on_price_drop BOOLEAN DEFAULT true,
    CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analysis_result_user_id ON analysis_result(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_result_created_at ON analysis_result(created_at);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product_id ON wishlist_items(product_id);
