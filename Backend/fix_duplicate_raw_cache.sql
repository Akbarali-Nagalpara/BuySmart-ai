-- Fix Duplicate ProductRawDataCache Records
-- This script removes duplicate entries and keeps only the most recent one per product

-- Step 1: Identify and display duplicates (for review)
SELECT 
    external_product_id, 
    COUNT(*) as count,
    STRING_AGG(id::text, ', ') as duplicate_ids
FROM product_raw_data_cache
GROUP BY external_product_id
HAVING COUNT(*) > 1;

-- Step 2: Delete older duplicate entries, keeping only the most recent one
DELETE FROM product_raw_data_cache
WHERE id IN (
    SELECT id
    FROM (
        SELECT 
            id,
            external_product_id,
            ROW_NUMBER() OVER (
                PARTITION BY external_product_id 
                ORDER BY cached_at DESC
            ) as row_num
        FROM product_raw_data_cache
    ) ranked
    WHERE row_num > 1
);

-- Step 3: Ensure unique constraint exists on external_product_id
-- (This should already exist from the entity definition, but we'll make sure)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'uk_external_product_id'
    ) THEN
        ALTER TABLE product_raw_data_cache 
        ADD CONSTRAINT uk_external_product_id 
        UNIQUE (external_product_id);
    END IF;
END $$;

-- Step 4: Verify no more duplicates exist
SELECT 
    external_product_id, 
    COUNT(*) as count
FROM product_raw_data_cache
GROUP BY external_product_id
HAVING COUNT(*) > 1;

-- Step 5: Show summary of remaining cache entries
SELECT 
    COUNT(*) as total_cache_entries,
    COUNT(DISTINCT external_product_id) as unique_products
FROM product_raw_data_cache;
