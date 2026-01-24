-- ================================================================
-- Fix Duplicate Cache Entries in product_raw_data_cache
-- ================================================================

-- Step 1: Keep only the LATEST cache entry for each external_product_id
-- Delete older duplicates

DELETE FROM product_raw_data_cache
WHERE id NOT IN (
    SELECT MAX(id)
    FROM product_raw_data_cache
    GROUP BY external_product_id
);

-- Step 2: Add unique constraint to prevent future duplicates
ALTER TABLE product_raw_data_cache 
ADD CONSTRAINT uk_external_product_id UNIQUE (external_product_id);

-- Step 3: Verify the fix
SELECT 
    external_product_id,
    COUNT(*) as record_count
FROM product_raw_data_cache
GROUP BY external_product_id
HAVING COUNT(*) > 1;

-- If the above query returns 0 rows, duplicates are fixed ✓

-- Step 4: Check total cache entries after cleanup
SELECT COUNT(*) as total_cache_entries FROM product_raw_data_cache;
