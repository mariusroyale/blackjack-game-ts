DROP TABLE IF EXISTS leaderboards;

-- Create leaderboard table
CREATE TABLE leaderboards (
    id SERIAL PRIMARY KEY,
    player_game_session_id UUID UNIQUE NOT NULL,
    player_id VARCHAR(255) NOT NULL,
    player_name VARCHAR(255) NOT NULL,
    total_games INT DEFAULT 0,
    total_win_points INT DEFAULT 0,
    total_wins INT DEFAULT 0,
    total_losses INT DEFAULT 0,
    highest_win_streak INT DEFAULT 0,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index on date_created column for optimization
CREATE INDEX idx_player_id ON leaderboards(player_id);
CREATE INDEX idx_date_created ON leaderboards(date_created);

DROP VIEW IF EXISTS leaderboards_view_day, leaderboards_view_week, leaderboards_view_month;
-- Create 7 days view
CREATE VIEW leaderboards_view_week AS
SELECT 
    player_id,
    player_name,
    SUM(total_games) AS total_games,
    SUM(total_win_points) AS total_win_points,
    SUM(total_wins) AS total_wins,
    SUM(total_losses) AS total_losses,
    MAX(highest_win_streak) AS highest_win_streak,
    ROUND((SUM(total_wins)::numeric / NULLIF(SUM(total_games), 0)) * 100, 2) AS win_percentage,
    MIN(date_created) AS date_created
FROM leaderboards
WHERE date_created >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY player_id, player_name;

-- Create 30 days view
CREATE VIEW leaderboards_view_month AS
SELECT 
    player_id,
    player_name,
    SUM(total_games) AS total_games,
    SUM(total_win_points) AS total_win_points,
    SUM(total_wins) AS total_wins,
    SUM(total_losses) AS total_losses,
    MAX(highest_win_streak) AS highest_win_streak,
    ROUND((SUM(total_wins)::numeric / NULLIF(SUM(total_games), 0)) * 100, 2) AS win_percentage,
    MIN(date_created) AS date_created
FROM leaderboards
WHERE date_created >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY player_id, player_name;