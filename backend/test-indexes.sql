-- Performance Index Testing
-- Run with: sqlite3 gr_attitude.sqlite < test-indexes.sql

.mode column
.headers on

-- Test 1: Missions filtered by category (uses IDX_missions_category)
.print "\n=== Test 1: Filter missions by category ==="
EXPLAIN QUERY PLAN 
SELECT * FROM missions 
WHERE category = 'demenagement' 
ORDER BY createdAt DESC;

-- Test 2: Missions filtered by status and sorted (uses composite index)
.print "\n=== Test 2: Filter by status + sort by createdAt ==="
EXPLAIN QUERY PLAN 
SELECT * FROM missions 
WHERE status = 'ouverte' 
ORDER BY createdAt DESC 
LIMIT 10;

-- Test 3: Missions filtered by urgency (uses IDX_missions_urgency)
.print "\n=== Test 3: Filter by urgency ==="
EXPLAIN QUERY PLAN 
SELECT * FROM missions 
WHERE urgency = 'urgent';

-- Test 4: Offers filtered by category (uses IDX_offers_category)
.print "\n=== Test 4: Filter offers by category ==="
EXPLAIN QUERY PLAN 
SELECT * FROM offers 
WHERE category = 'numerique' 
ORDER BY createdAt DESC;

-- Test 5: Contributions for a mission (uses IDX_contributions_missionId)
.print "\n=== Test 5: Fetch contributions for a mission ==="
EXPLAIN QUERY PLAN 
SELECT * FROM contributions 
WHERE missionId = 1;

-- Test 6: Correlations for a mission sorted by score (uses multiple indexes)
.print "\n=== Test 6: Fetch correlations sorted by score ==="
EXPLAIN QUERY PLAN 
SELECT * FROM correlations 
WHERE missionId = 1 
ORDER BY score DESC;

-- Index list
.print "\n=== Active Indexes ==="
SELECT name, tbl_name 
FROM sqlite_master 
WHERE type = 'index' 
  AND tbl_name IN ('missions', 'offers', 'contributions', 'correlations')
  AND name LIKE 'IDX_%'
ORDER BY tbl_name, name;
