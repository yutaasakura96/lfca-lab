-- #48: a migration that always fails, to observe that a failed migration rolls
-- back whole, skips the seed, and leaves the site serving. Removed in the next commit.
SELECT 1/0;
