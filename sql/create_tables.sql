--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-2.pgdg110+2)
-- Dumped by pg_dump version 16.2

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: MRKIOpostgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO "MRKIOpostgres";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: MRKIOpostgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    title character varying(512),
    description text,
    technology_stack text NOT NULL,
    status character varying(10) NOT NULL,
    category character varying(10) NOT NULL,
    image character varying(255),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.projects OWNER TO "MRKIOpostgres";

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: MRKIOpostgres
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO "MRKIOpostgres";

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: MRKIOpostgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: projects_skills; Type: TABLE; Schema: public; Owner: MRKIOpostgres
--

CREATE TABLE public.projects_skills (
    id integer NOT NULL,
    project_id integer,
    skill_id integer
);


ALTER TABLE public.projects_skills OWNER TO "MRKIOpostgres";

--
-- Name: projects_skills_id_seq; Type: SEQUENCE; Schema: public; Owner: MRKIOpostgres
--

CREATE SEQUENCE public.projects_skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_skills_id_seq OWNER TO "MRKIOpostgres";

--
-- Name: projects_skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: MRKIOpostgres
--

ALTER SEQUENCE public.projects_skills_id_seq OWNED BY public.projects_skills.id;


--
-- Name: skills; Type: TABLE; Schema: public; Owner: MRKIOpostgres
--

CREATE TABLE public.skills (
    id integer NOT NULL,
    skill_name character varying(255) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.skills OWNER TO "MRKIOpostgres";

--
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: MRKIOpostgres
--

CREATE SEQUENCE public.skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skills_id_seq OWNER TO "MRKIOpostgres";

--
-- Name: skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: MRKIOpostgres
--

ALTER SEQUENCE public.skills_id_seq OWNED BY public.skills.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: MRKIOpostgres
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


ALTER TABLE public.users OWNER TO "MRKIOpostgres";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: MRKIOpostgres
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
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: MRKIOpostgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: projects_skills id; Type: DEFAULT; Schema: public; Owner: MRKIOpostgres
--

ALTER TABLE ONLY public.projects_skills ALTER COLUMN id SET DEFAULT nextval('public.projects_skills_id_seq'::regclass);


--
-- Name: skills id; Type: DEFAULT; Schema: public; Owner: MRKIOpostgres
--

ALTER TABLE ONLY public.skills ALTER COLUMN id SET DEFAULT nextval('public.skills_id_seq'::regclass);


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: MRKIOpostgres
--

COPY public.projects (id, title, description, technology_stack, status, category, image, created_at, updated_at) FROM stdin;
3	Tower Defense	game	allegro5	completed	college	upload.cc/i1/2024/03/23/lHQaZc.jpg	2024-03-23 15:08:49.900397	2024-03-23 15:08:49.900397
4	WebPage	web page	fullstack	ongoing	personal	https://upload.cc/i1/2024/03/23/HjGORS.jpg	2024-03-23 15:21:13.506792	2024-03-23 15:26:41.068649
2	Undergraduate seminar	research	research	completed	college	https://upload.cc/i1/2024/03/23/HjGORS.jpg	2024-03-17 15:21:42.410757	2024-03-23 15:27:51.378867
1	Pac-Man	game	coming soon	completed	college	0	2024-03-15 23:52:19.077545	2024-03-23 15:28:17.728922
5	CocosGame	COCOS	TS	completed	college	https://upload.cc/i1/2024/03/23/tWL2cs.jpg	2024-03-23 15:29:29.341459	2024-03-23 15:29:29.341459
\.


--
-- Data for Name: projects_skills; Type: TABLE DATA; Schema: public; Owner: MRKIOpostgres
--

COPY public.projects_skills (id, project_id, skill_id) FROM stdin;
24	3	3
30	4	1
31	4	11
32	4	6
33	4	13
34	2	12
35	1	2
36	5	6
\.


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: MRKIOpostgres
--

COPY public.skills (id, skill_name, created_at, updated_at) FROM stdin;
1	Go	2024-03-15 23:38:16.137837	2024-03-15 23:38:16.137837
2	C	2024-03-15 23:38:38.549364	2024-03-15 23:38:38.549364
3	C++	2024-03-15 23:39:02.839622	2024-03-15 23:39:02.839622
6	React.js	2024-03-18 00:23:34.392371	2024-03-18 00:23:34.392371
11	Docker	2024-03-18 01:47:18.89575	2024-03-18 01:47:18.89575
12	Research	2024-03-23 15:25:52.086778	2024-03-23 15:25:52.086778
13	CICD	2024-03-23 15:26:19.338193	2024-03-23 15:26:19.338193
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: MRKIOpostgres
--

COPY public.users (id, first_name, last_name, email, password, created_at, updated_at) FROM stdin;
1	Admin	User	admin@example.com	$2a$14$wVsaPvJnJJsomWArouWCtusem6S/.Gauq/GjOIEHpyh2DAMmso1wy	2022-09-23 00:00:00	2022-09-23 00:00:00
\.


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: MRKIOpostgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 5, true);


--
-- Name: projects_skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: MRKIOpostgres
--

SELECT pg_catalog.setval('public.projects_skills_id_seq', 36, true);


--
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: MRKIOpostgres
--

SELECT pg_catalog.setval('public.skills_id_seq', 13, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: MRKIOpostgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: MRKIOpostgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: projects_skills projects_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: MRKIOpostgres
--

ALTER TABLE ONLY public.projects_skills
    ADD CONSTRAINT projects_skills_pkey PRIMARY KEY (id);


--
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: MRKIOpostgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: MRKIOpostgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: projects_skills projects_skills_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: MRKIOpostgres
--

ALTER TABLE ONLY public.projects_skills
    ADD CONSTRAINT projects_skills_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: projects_skills projects_skills_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: MRKIOpostgres
--

ALTER TABLE ONLY public.projects_skills
    ADD CONSTRAINT projects_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: MRKIOpostgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

