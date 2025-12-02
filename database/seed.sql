-- VG Tracker Seed Data
-- Sample data for testing the application
-- Last updated: 2025-11-28

-- Reset sequences to ensure consistent IDs
ALTER SEQUENCE user_userid_seq RESTART WITH 1;
ALTER SEQUENCE game_gameid_seq RESTART WITH 1;
ALTER SEQUENCE libraryentry_entryid_seq RESTART WITH 1;
ALTER SEQUENCE review_reviewid_seq RESTART WITH 1;

-- Insert Users (17 users, akchaud5 is admin)
-- Note: Using explicit userids to match existing DB state
INSERT INTO public."User" (userid, username, email, password, isadmin)
VALUES
    (1, 'vibhavkhare_admin', 'vibhav@example.com', 'vkhare3', FALSE),
    (2, 'isn_employee', 'emp@ign.com', 'ign420', FALSE),
    (3, 'toriel', 'toriel@example.com', 'toriel1', FALSE),
    (4, 'BlazeRaven', 'blaze@example.com', 'blazepass', FALSE),
    (5, 'JarGman', 'jar@example.com', 'jarpass', FALSE),
    (6, 'PrimeDagger', 'prime@example.com', 'primepass', FALSE),
    (7, 'okrueg', 'opkruege@asu.edu', '4321', TRUE),
    (8, 'akchaud5', 'akchaud5@asu.edu', 'password123', TRUE),
    (9, 'GhostCaptain', 'ghost@example.com', 'ghostpass', TRUE),
    (10, 'FrlNovaCmt10', 'frl@example.com', 'frlpass', FALSE),
    (11, 'GuardianNova', 'guardian@example.com', 'guardianpass', FALSE),
    (12, 'GhstSnpr101', 'ghst@example.com', 'ghstpass', FALSE),
    (13, 'BanditShadow', 'bandit@example.com', 'banditpass', FALSE),
    (14, 'ArrowLunar', 'arrow@example.com', 'arrow123', FALSE),
    (15, 'WildNomad', 'wild@example.com', 'wildpass', FALSE),
    (16, 'DarkPhnxOP99', 'dark@example.com', 'darkpass', FALSE),
    (17, 'NightOwlGamer', 'nightowl@example.com', 'nightpass', FALSE),
    (18, 'SteelWolf', 'steelwolf@example.com', 'steelpass', FALSE);

-- Reset user sequence to continue from max userid
SELECT setval('user_userid_seq', (SELECT MAX(userid) FROM public."User"));

-- Insert Games (68 games - classics + modern titles)
INSERT INTO game (title, platform, genre, developer, releasedate)
VALUES
    -- Classic Games (1-28)
    ('The Legend of Zelda: Ocarina of Time', 'Nintendo 64', 'Action-Adventure', 'Nintendo', '1998-11-21'),
    ('Super Mario Bros.', 'NES', 'Platformer', 'Nintendo', '1985-09-13'),
    ('Tetris', 'Game Boy', 'Puzzle', 'Alexey Pajitnov', '1989-06-14'),
    ('Minecraft', 'PC', 'Sandbox', 'Mojang Studios', '2011-11-18'),
    ('The Witcher 3: Wild Hunt', 'PC', 'RPG', 'CD Projekt Red', '2015-05-19'),
    ('Grand Theft Auto V', 'PlayStation 3', 'Action-Adventure', 'Rockstar Games', '2013-09-17'),
    ('Half-Life 2', 'PC', 'FPS', 'Valve', '2004-11-16'),
    ('Red Dead Redemption 2', 'PlayStation 4', 'Action-Adventure', 'Rockstar Games', '2018-10-26'),
    ('Super Mario 64', 'Nintendo 64', 'Platformer', 'Nintendo', '1996-06-23'),
    ('The Last of Us', 'PlayStation 3', 'Action-Adventure', 'Naughty Dog', '2013-06-14'),
    ('Undertale', 'PC', 'RPG', 'Toby Fox', '2015-09-15'),
    ('Super Smash Bros. Ultimate', 'Nintendo Switch', 'Fighting', 'Nintendo', '2018-12-07'),
    ('Celeste', 'PC', 'Platformer', 'Matt Makes Games', '2018-01-25'),
    ('Hades', 'PC', 'Rogue-like', 'Supergiant Games', '2020-09-17'),
    ('God of War', 'PlayStation 4', 'Action-Adventure', 'Santa Monica Studio', '2018-04-20'),
    ('Spider-Man', 'PlayStation 4', 'Action-Adventure', 'Insomniac Games', '2018-09-07'),
    ('Bloodborne', 'PlayStation 4', 'RPG', 'FromSoftware', '2015-03-24'),
    ('Sekiro: Shadows Die Twice', 'PC', 'Action-Adventure', 'FromSoftware', '2019-03-22'),
    ('Dark Souls III', 'PC', 'RPG', 'FromSoftware', '2016-03-24'),
    ('Resident Evil 2', 'PC', 'Horror', 'Capcom', '2019-01-25'),
    ('Resident Evil 4', 'GameCube', 'Horror', 'Capcom', '2005-01-11'),
    ('Overwatch', 'PC', 'Shooter', 'Blizzard', '2016-05-24'),
    ('League of Legends', 'PC', 'MOBA', 'Riot Games', '2009-10-27'),
    ('Valorant', 'PC', 'Shooter', 'Riot Games', '2020-06-02'),
    ('Call of Duty: Modern Warfare', 'PC', 'FPS', 'Infinity Ward', '2019-10-25'),
    ('Fortnite', 'PC', 'Battle Royale', 'Epic Games', '2017-07-25'),
    ('Apex Legends', 'PC', 'Battle Royale', 'Respawn Entertainment', '2019-02-04'),
    ('Among Us', 'PC', 'Party', 'InnerSloth', '2018-06-15'),
    -- Modern Games (29-68)
    ('Elden Ring', 'PC', 'Action-RPG', 'FromSoftware', '2022-02-25'),
    ('Hogwarts Legacy', 'PlayStation 5', 'Action-RPG', 'Avalanche Software', '2023-02-10'),
    ('Baldurs Gate 3', 'PC', 'RPG', 'Larian Studios', '2023-08-03'),
    ('Starfield', 'Xbox Series X', 'RPG', 'Bethesda Game Studios', '2023-09-06'),
    ('Alan Wake 2', 'PlayStation 5', 'Survival Horror', 'Remedy Entertainment', '2023-10-27'),
    ('Final Fantasy XVI', 'PlayStation 5', 'Action-RPG', 'Square Enix', '2023-06-22'),
    ('Lies of P', 'PC', 'Action-RPG', 'Neowiz Games', '2023-09-19'),
    ('Armored Core VI', 'PC', 'Action', 'FromSoftware', '2023-08-25'),
    ('Street Fighter 6', 'PlayStation 5', 'Fighting', 'Capcom', '2023-06-02'),
    ('Diablo IV', 'PC', 'Action-RPG', 'Blizzard Entertainment', '2023-06-06'),
    ('The Legend of Zelda: Tears of the Kingdom', 'Nintendo Switch', 'Action-Adventure', 'Nintendo', '2023-05-12'),
    ('Persona 5 Royal', 'PlayStation 4', 'RPG', 'Atlus', '2020-03-31'),
    ('Ghost of Tsushima', 'PlayStation 4', 'Action-Adventure', 'Sucker Punch', '2020-07-17'),
    ('Horizon Forbidden West', 'PlayStation 5', 'Action-RPG', 'Guerrilla Games', '2022-02-18'),
    ('Cyberpunk 2077', 'PC', 'Action-RPG', 'CD Projekt Red', '2020-12-10'),
    ('Stardew Valley', 'PC', 'Simulation', 'ConcernedApe', '2016-02-26'),
    ('Hollow Knight', 'PC', 'Metroidvania', 'Team Cherry', '2017-02-24'),
    ('Dead Cells', 'Nintendo Switch', 'Roguelike', 'Motion Twin', '2018-08-07'),
    ('Disco Elysium', 'PC', 'RPG', 'ZA/UM', '2019-10-15'),
    ('Monster Hunter World', 'PC', 'Action-RPG', 'Capcom', '2018-08-09'),
    ('NieR: Automata', 'PlayStation 4', 'Action-RPG', 'PlatinumGames', '2017-02-23'),
    ('Doom Eternal', 'PC', 'FPS', 'id Software', '2020-03-20'),
    ('Control', 'PC', 'Action-Adventure', 'Remedy Entertainment', '2019-08-27'),
    ('Death Stranding', 'PlayStation 4', 'Action', 'Kojima Productions', '2019-11-08'),
    ('Slay the Spire', 'PC', 'Roguelike', 'MegaCrit', '2019-01-23'),
    ('Halo Infinite', 'Xbox Series X', 'FPS', 'id Software', '2021-12-08'),
    ('It Takes Two', 'PC', 'Co-op Adventure', 'Hazelight Studios', '2021-03-26'),
    ('Returnal', 'PlayStation 5', 'Roguelike', 'Housemarque', '2021-04-30'),
    ('Ratchet and Clank: Rift Apart', 'PlayStation 5', 'Action-Adventure', 'Insomniac Games', '2021-06-11'),
    ('Metroid Dread', 'Nintendo Switch', 'Metroidvania', 'MercurySteam', '2021-10-08'),
    ('Psychonauts 2', 'Xbox Series X', 'Platformer', 'Double Fine', '2021-08-25'),
    ('Inscryption', 'PC', 'Card Game', 'Daniel Mullins Games', '2021-10-19'),
    ('Sifu', 'PlayStation 5', 'Action', 'Sloclap', '2022-02-08'),
    ('Tunic', 'PC', 'Action-Adventure', 'Andrew Shouldice', '2022-03-16'),
    ('Cult of the Lamb', 'Nintendo Switch', 'Roguelike', 'Massive Monster', '2022-08-11'),
    ('Vampire Survivors', 'PC', 'Roguelike', 'poncle', '2022-10-20'),
    ('Hi-Fi Rush', 'Xbox Series X', 'Action', 'Tango Gameworks', '2023-01-25'),
    ('Pizza Tower', 'PC', 'Platformer', 'Tour De Pizza', '2023-01-26'),
    ('Sea of Stars', 'Nintendo Switch', 'RPG', 'Sabotage Studio', '2023-08-29'),
    ('Cocoon', 'PC', 'Puzzle', 'Geometric Interactive', '2023-09-29');

-- Insert Library Entries (37 entries across various users)
INSERT INTO libraryentry (userid, gameid, status, userrating, notes)
VALUES
    -- vibhavkhare_admin (userid 1)
    (1, 1, 'Completed', 5, 'An absolute classic.'),
    (1, 4, 'Completed', 5, 'So much to explore!'),
    (1, 5, 'Wishlist', NULL, 'Planning to buy soon.'),
    (1, 6, 'Backlog', NULL, 'Waiting for discount.'),
    (1, 11, 'Playing', 5, 'Super silly game, loving the music!'),
    -- isn_employee (userid 2)
    (2, 2, 'Completed', 5, 'Best platformer ever!'),
    (2, 5, 'Playing', 4, 'Relaxing farm sim.'),
    (2, 4, 'Dropped', 2, 'Not seeing the appeal.'),
    (2, 8, 'Wishlist', NULL, 'Looks amazing.'),
    -- BlazeRaven (userid 4)
    (4, 6, 'Playing', 4, 'Building crazy stuff, this game is a time sink.'),
    (4, 14, 'Wishlist', NULL, 'Hyped for this one, looks insane.'),
    -- okrueg (7)
    (7, 49, 'Completed', 5, 'Cool enough'),
    (7, 54, 'Playing', 4, 'Play more'),
    (7, 2, 'Playing', 4, 'Why is it so hard'),
    (7, 3, 'Dropped', 2, 'Meh'),
    -- akchaud5 (userid 8 - Admin)
    (8, 29, 'Playing', 5, 'Elden Ring is a masterpiece!'),
    (8, 31, 'Completed', 5, 'Best RPG I have ever played'),
    (8, 45, 'Completed', 5, 'Metroidvania perfection'),
    (8, 44, 'Playing', 4, 'Relaxing farm life'),
    (8, 43, 'Dropped', 2, 'Too buggy at launch'),
    (8, 40, 'Wishlist', NULL, 'Need to play this'),
    -- GhostCaptain (userid 9)
    (9, 29, 'Completed', 5, 'Died 1000 times but worth it'),
    (9, 35, 'Playing', 4, 'Souls-like done right'),
    -- FrlNovaCmt10 (userid 10)
    (10, 31, 'Playing', 5, 'So many choices!'),
    (10, 47, 'Completed', 5, 'Incredible writing'),
    -- GuardianNova (userid 11)
    (11, 39, 'Completed', 5, 'Best Zelda ever'),
    (11, 58, 'Completed', 4, 'Great return to form'),
    -- GhstSnpr101 (userid 12)
    (12, 50, 'Completed', 5, 'RIP AND TEAR'),
    (12, 54, 'Playing', 3, 'Campaign was short'),
    -- BanditShadow (userid 13)
    (13, 41, 'Completed', 5, 'Beautiful open world'),
    (13, 42, 'Playing', 4, 'Even better than the first'),
    -- ArrowLunar (userid 14)
    (14, 64, 'Completed', 5, 'Addictive gameplay loop'),
    (14, 63, 'Playing', 4, 'Cute but dark'),
    -- WildNomad (userid 15)
    (15, 55, 'Completed', 5, 'Best co-op game ever'),
    (15, 60, 'Completed', 5, 'Mind-bending card game'),
    -- DarkPhnxOP99 (userid 16)
    (16, 40, 'Completed', 5, 'Best JRPG of all time'),
    (16, 49, 'Completed', 5, '2B or not 2B'),
    -- NightOwlGamer (userid 17)
    (17, 65, 'Completed', 5, 'Rhythm action perfection'),
    (17, 66, 'Playing', 4, 'Pizza time!'),
    -- SteelWolf (userid 18)
    (18, 67, 'Playing', 4, 'Beautiful retro RPG'),
    (18, 68, 'Completed', 5, 'Puzzle genius');

-- Insert Reviews (41 reviews)
INSERT INTO review (userid, gameid, rating, comment, reviewdate)
VALUES
    -- Original reviews
    (1, 1, 5, 'Masterpiece!', '2025-11-04'),
    (2, 2, 5, 'Such a classic, deserves the love it gets.', '2025-11-04'),
    (4, 2, 4, 'Super Mario Bros. still holds up.', '2025-11-04'),
    (4, 3, 5, 'Tetris is addictive and timeless.', '2025-11-04'),
    (4, 4, 5, 'Minecraft lets you be creative endlessly.', '2025-11-04'),
    (4, 5, 4, 'The Witcher 3 has a fantastic story.', '2025-11-04'),
    (3, 6, 3, 'GTA V is fun but I prefer story-driven games.', '2025-11-04'),
    (3, 7, 5, 'Half-Life 2 is a legendary FPS.', '2025-11-04'),
    (3, 8, 4, 'Red Dead Redemption 2 is beautiful but long.', '2025-11-04'),
    (3, 9, 5, 'Super Mario 64 is pure nostalgia!', '2025-11-04'),
    (3, 10, 5, 'The Last of Us is emotional and gripping.', '2025-11-04'),
    (3, 11, 4, 'Undertale is clever and charming.', '2025-11-04'),
    (3, 12, 5, 'Super Smash Bros. Ultimate is perfect for multiplayer!', '2025-11-04'),
    (4, 1, 5, 'Ocarina of Time remains a pinnacle of adventure design.', '2025-07-15'),
    (4, 4, 4, 'Minecraft offers endless creative possibilities and engagement.', '2025-06-17'),
    -- New reviews for modern games
    (7, 29, 5, 'Open world Souls perfection. FromSoftware outdid themselves.', '2025-11-28'),
    (9, 29, 5, 'Challenging but fair. Every boss is memorable.', '2025-11-28'),
    (11, 29, 4, 'Great game but some late areas feel rushed.', '2025-11-28'),
    (7, 31, 5, 'The new gold standard for CRPGs.', '2025-11-28'),
    (10, 31, 5, 'Larian Studios created something special here.', '2025-11-28'),
    (16, 31, 5, 'D&D brought to life beautifully.', '2025-11-28'),
    (11, 39, 5, 'Nintendo magic at its finest.', '2025-11-28'),
    (14, 39, 5, 'Ultrahand is a game-changer.', '2025-11-28'),
    (7, 45, 5, 'Incredible atmosphere and tight controls.', '2025-11-28'),
    (15, 45, 5, 'Best value in gaming. Silksong when?', '2025-11-28'),
    (16, 40, 5, 'Style and substance in perfect harmony.', '2025-11-28'),
    (17, 40, 5, 'The definitive JRPG experience.', '2025-11-28'),
    (13, 41, 5, 'Gorgeous open world samurai game.', '2025-11-28'),
    (7, 41, 4, 'Combat is satisfying, story is emotional.', '2025-11-28'),
    (12, 50, 5, 'Fast, brutal, and incredibly fun.', '2025-11-28'),
    (14, 64, 5, 'Simple concept, endless replayability.', '2025-11-28'),
    (18, 68, 5, 'Puzzle design is genius.', '2025-11-28'),
    (17, 65, 5, 'Tango Gameworks surprise hit!', '2025-11-28'),
    (9, 35, 4, 'Great Pinocchio-themed soulslike.', '2025-11-28'),
    (10, 47, 5, 'One of the best written games ever.', '2025-11-28'),
    (15, 55, 5, 'Play this with someone you love.', '2025-11-28'),
    (13, 42, 4, 'Aloy continues to impress.', '2025-11-28'),
    (16, 49, 5, 'Existential crisis: the game. Beautiful.', '2025-11-28'),
    (18, 67, 4, 'Nostalgic RPG with modern polish.', '2025-11-28'),
    (12, 54, 3, 'Multiplayer is great, campaign needed more.', '2025-11-28'),
    (14, 63, 4, 'Cute on the surface, dark underneath.', '2025-11-28');

-- Verify data
SELECT 'Users inserted:' as info, COUNT(*) as count FROM public."User";
SELECT 'Games inserted:' as info, COUNT(*) as count FROM game;
SELECT 'Library entries inserted:' as info, COUNT(*) as count FROM libraryentry;
SELECT 'Reviews inserted:' as info, COUNT(*) as count FROM review;
