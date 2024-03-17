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
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    first_name character varying(255),
    last_name character varying(255),
    email character varying(255),
    password character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (first_name, last_name, email, password, created_at, updated_at) FROM stdin;
Admin	User	admin@example.com	$2a$14$wVsaPvJnJJsomWArouWCtusem6S/.Gauq/GjOIEHpyh2DAMmso1wy	2022-09-23 00:00:00	2022-09-23 00:00:00
\.

--
-- Name: skills; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.skills (
    id SERIAL PRIMARY KEY,
    skill_name VARCHAR(255) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: -
--
COPY public.skills (skill_name, created_at, updated_at) FROM stdin;
Go  2022-09-23 00:00:00	2022-09-23 00:00:00
C   2022-09-23 00:00:00	2022-09-23 00:00:00
C++ 2022-09-23 00:00:00	2022-09-23 00:00:00
\.

--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.projects (
    id SERIAL PRIMARY KEY,
    title character varying(512),
    description text,
    technology_stack TEXT NOT NULL,
    status VARCHAR(10) NOT NULL,
    category VARCHAR(10) NOT NULL,
    image character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);

--
-- Name: projects_skills; Type: TABLE; Schema: public; Owner: -
--
CREATE TABLE public.projects_skills (
    id SERIAL PRIMARY KEY,
    project_id integer REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE,
    skill_id integer REFERENCES public.skills(id) ON UPDATE CASCADE ON DELETE CASCADE
);

--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--
COPY public.projects (title, description, technology_stack, status, category, image, created_at, updated_at) FROM stdin;
PJ1     He fought his first battle on the Scottish Highlands in 1536. He will fight his greatest battle on the streets of New York City in 1986. His name is Connor MacLeod. He is immortal.	    fullstack	    ongoing	    college	    media.themoviedb.org/t/p/w300_and_h450_bestv2/8Z8dptJEypuLoOQro1WugD855YE.jpg	    2022-09-23 00:00:00	    2022-09-23 00:00:00
\.

--
-- Data for Name: projects_skills; Type: TABLE DATA; Schema: public; Owner: -
--
COPY public.projects_skills (project_id, skill_id) FROM stdin;
1	1
1	2
\.

--
-- PostgreSQL database dump complete
--

