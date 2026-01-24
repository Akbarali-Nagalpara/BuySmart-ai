# Fix for Duplicate Product Raw Data Cache Records

## Problem
The `product_raw_data_cache` table was showing multiple records for the same product, when it should only have ONE record per product with all data (including reviews) stored in the `raw_json` JSONB field.

## Root Cause
- While the code was designed to update existing records, there may have been:
  1. Existing duplicate data from before the unique constraint was enforced
  2. Potential race conditions during concurrent requests
  3. Database unique constraint not being enforced properly

## Solution Applied

### 1. Code Improvements
**File:** `Backend/src/main/java/com/example/backend/serviceImp/ProductServiceImpl.java`

✅ Enhanced `saveRawCache()` method with:
- **Better logging** to track when records are created vs updated
- **Race condition handling** with try-catch for `DataIntegrityViolationException`
- **Retry logic** if a duplicate key error occurs
- **Clear documentation** that reviews are stored in the `rawJson` field as part of complete product data

### 2. Database Cleanup Script
**File:** `Backend/fix_duplicate_raw_cache.sql`

This script will:
1. **Identify duplicates** - Shows all products with multiple cache entries
2. **Remove old duplicates** - Keeps only the most recent entry per product
3. **Enforce unique constraint** - Ensures `external_product_id` is unique
4. **Verify cleanup** - Confirms no duplicates remain

## How to Fix Your Database

### Step 1: Backup Your Data (IMPORTANT!)
```bash
# Create a backup before running any cleanup
pg_dump -U your_username -h your_host -d your_database > backup_before_cleanup.sql
```

### Step 2: Run the Cleanup Script
```bash
# Connect to your database
psql -U your_username -h your_host -d your_database

# Run the cleanup script
\i Backend/fix_duplicate_raw_cache.sql
```

**OR** if using a database GUI (pgAdmin, DBeaver, etc.):
- Open the `fix_duplicate_raw_cache.sql` file
- Execute it step by step to see the results

### Step 3: Restart Your Backend Application
The updated code will now prevent future duplicates.

## Understanding the Data Structure

### Current Design (Correct)
```
product_raw_data_cache table:
├── id (Primary Key)
├── external_product_id (Unique) ← ONE per product
├── raw_json (JSONB) ← Contains EVERYTHING
│   ├── product details
│   ├── top_reviews[] ← ALL reviews here
│   ├── rating_distribution
│   └── ... all other data
├── cached_at
├── expiry_at
└── product_ref_id (Foreign Key to product table)
```

### What's Stored in raw_json
The `raw_json` field stores the complete product data as JSONB, including:
- Product information (title, price, brand, etc.)
- **All reviews** (typically top 10-15 reviews from the API)
- Rating distribution
- Images, videos, specifications
- Category information
- And everything else from the API response

### Reviews Are NOT Separate Records
Reviews are stored **within** the `raw_json` JSONB field as an array:
```json
{
  "asin": "B0D35V6J6N",
  "title": "realme P1 5G",
  "top_reviews": [
    {"review_id": "R1KNN44D4GD2Y9", "review_comment": "Best phone...", ...},
    {"review_id": "R3BTGDKD034161", "review_comment": "Camera decent...", ...},
    ...
  ],
  ...
}
```

## Verification

After running the cleanup, verify:

```sql
-- Check for any remaining duplicates (should return 0 rows)
SELECT external_product_id, COUNT(*) 
FROM product_raw_data_cache 
GROUP BY external_product_id 
HAVING COUNT(*) > 1;

-- View summary
SELECT 
    COUNT(*) as total_records,
    COUNT(DISTINCT external_product_id) as unique_products
FROM product_raw_data_cache;
-- These two numbers should be equal!
```

## Prevention
The updated code now:
1. ✅ Always checks for existing records before creating new ones
2. ✅ Updates existing records instead of creating duplicates
3. ✅ Handles race conditions with retry logic
4. ✅ Enforces unique constraint at database level
5. ✅ Provides clear logging for debugging

## Testing
After applying the fix:
1. Analyze a product multiple times
2. Check the database - should see only ONE record per product ID
3. Each update should refresh the `cached_at` timestamp
4. The `raw_json` should be updated with the latest data

## Need Help?
If you encounter issues:
1. Check the application logs for error messages
2. Verify the unique constraint exists: 
   ```sql
   SELECT conname, contype 
   FROM pg_constraint 
   WHERE conrelid = 'product_raw_data_cache'::regclass;
   ```
3. Ensure transactions are working properly
