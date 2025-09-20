-- Query A: certificates per matter in last 30 days (PostgreSQL)
SELECT o.matter_id, COUNT(c.id) AS certificates_count
FROM orders o
JOIN certificates c ON c.order_id = o.id
WHERE c.created_at >= NOW() - INTERVAL '30 days'
GROUP BY o.matter_id;

-- Query A (SQL Server)
SELECT o.matter_id, COUNT(c.id) AS certificates_count
FROM orders o
JOIN certificates c ON c.order_id = o.id
WHERE c.created_at >= DATEADD(day, -30, GETUTCDATE())
GROUP BY o.matter_id;

-- Query B: matters without a Title certificate in last 30 days (PostgreSQL)
SELECT DISTINCT o.matter_id
FROM orders o
WHERE NOT EXISTS (
  SELECT 1 FROM certificates c
  WHERE c.order_id = o.id
    AND c.type = 'Title'
    AND c.created_at >= NOW() - INTERVAL '30 days'
);

-- Query B (SQL Server)
SELECT DISTINCT o.matter_id
FROM orders o
WHERE NOT EXISTS (
  SELECT 1 FROM certificates c
  WHERE c.order_id = o.id
    AND c.type = 'Title'
    AND c.created_at >= DATEADD(day, -30, GETUTCDATE())
);

-- Index recommendation (PostgreSQL example)
-- Speeds up Query B by allowing an index-only scan on filtered range and type.
-- Includes order_id to satisfy NOT EXISTS predicate without extra heap lookups.
--
-- CREATE INDEX idx_cert_type_created_order ON certificates(type, created_at, order_id);
