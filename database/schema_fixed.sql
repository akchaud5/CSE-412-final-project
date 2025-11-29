-- VG Tracker Database Schema
-- CSE 412 - Phase 3
-- Group 4: Vibhav Khare, Swar Mahesh Khatav, Owen Krueger

-- Drop existing tables if they exist
DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS libraryentry CASCADE;
DROP TABLE IF EXISTS game CASCADE;
DROP TABLE IF EXISTS public."User" CASCADE;

-- Drop sequences if they exist
DROP SEQUENCE IF EXISTS "User_userid_seq" CASCADE;
DROP SEQUENCE IF EXISTS game_gameid_seq CASCADE;
DROP SEQUENCE IF EXISTS libraryentry_entryid_seq CASCADE;
DROP SEQUENCE IF EXISTS review_reviewid_seq CASCADE;

-- Create sequences first
CREATE SEQUENCE "User_userid_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE SEQUENCE game_gameid_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE SEQUENCE libraryentry_entryid_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE SEQUENCE review_reviewid_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

-- Create User table
CREATE TABLE public."User"
(
    userid integer NOT NULL DEFAULT nextval('"User_userid_seq"'::regclass),
    username character varying(50) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    isadmin boolean DEFAULT false,
    CONSTRAINT "User_pkey" PRIMARY KEY (userid),
    CONSTRAINT "User_email_key" UNIQUE (email),
    CONSTRAINT "User_username_key" UNIQUE (username)
);

ALTER TABLE public."User" OWNER to postgres;

-- Create Game table
CREATE TABLE public.game
(
    gameid integer NOT NULL DEFAULT nextval('game_gameid_seq'::regclass),
    title character varying(100) COLLATE pg_catalog."default" NOT NULL,
    platform character varying(50) COLLATE pg_catalog."default" NOT NULL,
    genre character varying(50) COLLATE pg_catalog."default",
    developer character varying(100) COLLATE pg_catalog."default",
    releasedate date,
    CONSTRAINT game_pkey PRIMARY KEY (gameid)
);

ALTER TABLE public.game OWNER to postgres;

-- Create LibraryEntry table
CREATE TABLE public.libraryentry
(
    entryid integer NOT NULL DEFAULT nextval('libraryentry_entryid_seq'::regclass),
    userid integer NOT NULL,
    gameid integer NOT NULL,
    status character varying(20) COLLATE pg_catalog."default",
    userrating integer,
    notes text COLLATE pg_catalog."default",
    CONSTRAINT libraryentry_pkey PRIMARY KEY (entryid),
    CONSTRAINT libraryentry_gameid_fkey FOREIGN KEY (gameid)
        REFERENCES public.game (gameid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT libraryentry_userid_fkey FOREIGN KEY (userid)
        REFERENCES public."User" (userid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT libraryentry_status_check CHECK (status::text = ANY (ARRAY['Playing'::character varying, 'Completed'::character varying, 'Wishlist'::character varying, 'Backlog'::character varying, 'Dropped'::character varying]::text[])),
    CONSTRAINT libraryentry_userrating_check CHECK (userrating >= 1 AND userrating <= 5)
);

ALTER TABLE public.libraryentry OWNER to postgres;

-- Create Review table
CREATE TABLE public.review
(
    reviewid integer NOT NULL DEFAULT nextval('review_reviewid_seq'::regclass),
    userid integer NOT NULL,
    gameid integer NOT NULL,
    rating integer NOT NULL,
    comment text COLLATE pg_catalog."default",
    reviewdate date DEFAULT CURRENT_DATE,
    CONSTRAINT review_pkey PRIMARY KEY (reviewid),
    CONSTRAINT review_gameid_fkey FOREIGN KEY (gameid)
        REFERENCES public.game (gameid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT review_userid_fkey FOREIGN KEY (userid)
        REFERENCES public."User" (userid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT review_rating_check CHECK (rating >= 1 AND rating <= 5)
);

ALTER TABLE public.review OWNER to postgres;

-- Create indexes for better query performance
CREATE INDEX idx_libraryentry_userid ON public.libraryentry(userid);
CREATE INDEX idx_libraryentry_gameid ON public.libraryentry(gameid);
CREATE INDEX idx_review_userid ON public.review(userid);
CREATE INDEX idx_review_gameid ON public.review(gameid);
CREATE INDEX idx_game_platform ON public.game(platform);
CREATE INDEX idx_game_genre ON public.game(genre);

COMMENT ON TABLE public."User" IS 'User accounts for the VG Tracker application';
COMMENT ON TABLE public.game IS 'Video game catalog';
COMMENT ON TABLE public.libraryentry IS 'User game libraries and tracking';
COMMENT ON TABLE public.review IS 'User reviews for games';
