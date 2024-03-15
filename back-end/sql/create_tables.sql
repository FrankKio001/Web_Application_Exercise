--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-1.pgdg110+1)
-- Dumped by pg_dump version 14.5 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: skills; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE skills (
    id SERIAL PRIMARY KEY, 
    skill_name VARCHAR(255) NOT NULL 
);
--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE projects (
    id integer NOT NULL,
    title character varying(512),
    description text,
    technology_stack TEXT NOT NULL, -- Technologies used in the project
    status INTEGER NOT NULL, -- Status of the project (e.g., ongoing, completed)
    category VARCHAR(10) NOT NULL -- Category of the project (e.g., personal, professional)
    image character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

--
-- Name: projects_skills; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE projects_skills (
    project_id INTEGER REFERENCES projects(id), -- ID of the project
    skill_id INTEGER REFERENCES skills(id), -- ID of the skill
    PRIMARY KEY (project_id, skill_id) -- Composite primary key to ensure unique pairs
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    email character varying(255),
    password character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, first_name, last_name, email, password, created_at, updated_at) FROM stdin;
1	Admin	User	admin@example.com	$2a$14$wVsaPvJnJJsomWArouWCtusem6S/.Gauq/GjOIEHpyh2DAMmso1wy	2024-03-16 00:00:00	2022-03-16 00:00:00
\.

--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
--
-- PostgreSQL database dump complete
--

