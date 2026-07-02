--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

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

ALTER TABLE IF EXISTS ONLY public.produto DROP CONSTRAINT IF EXISTS produto_pkey;
ALTER TABLE IF EXISTS ONLY public.pedido DROP CONSTRAINT IF EXISTS pedido_pkey;
ALTER TABLE IF EXISTS ONLY public.item_pedido DROP CONSTRAINT IF EXISTS item_pedido_pkey;
ALTER TABLE IF EXISTS ONLY public.fornecedor DROP CONSTRAINT IF EXISTS fornecedor_pkey;
ALTER TABLE IF EXISTS ONLY public.custo_produto DROP CONSTRAINT IF EXISTS custo_produto_pkey;
ALTER TABLE IF EXISTS ONLY public.cliente DROP CONSTRAINT IF EXISTS cliente_pkey;
DROP TABLE IF EXISTS public.produto;
DROP TABLE IF EXISTS public.pedido;
DROP TABLE IF EXISTS public.item_pedido;
DROP TABLE IF EXISTS public.fornecedor;
DROP TABLE IF EXISTS public.custo_produto;
DROP TABLE IF EXISTS public.cliente;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cliente; Type: TABLE; Schema: public; Owner: local_user
--

CREATE TABLE public.cliente (
    id integer NOT NULL,
    nome character varying(100),
    email character varying(100),
    cidade character varying(50),
    data_cadastro date
);


ALTER TABLE public.cliente OWNER TO local_user;

--
-- Name: cliente_id_seq; Type: SEQUENCE; Schema: public; Owner: local_user
--

ALTER TABLE public.cliente ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cliente_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: custo_produto; Type: TABLE; Schema: public; Owner: local_user
--

CREATE TABLE public.custo_produto (
    id integer NOT NULL,
    id_produto integer,
    custo numeric(10,2),
    data_atualizacao date
);


ALTER TABLE public.custo_produto OWNER TO local_user;

--
-- Name: custo_produto_id_seq; Type: SEQUENCE; Schema: public; Owner: local_user
--

ALTER TABLE public.custo_produto ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.custo_produto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: fornecedor; Type: TABLE; Schema: public; Owner: local_user
--

CREATE TABLE public.fornecedor (
    id integer NOT NULL,
    nome character varying(100),
    cnpj character varying(20),
    cidade character varying(50)
);


ALTER TABLE public.fornecedor OWNER TO local_user;

--
-- Name: fornecedor_id_seq; Type: SEQUENCE; Schema: public; Owner: local_user
--

ALTER TABLE public.fornecedor ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.fornecedor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: item_pedido; Type: TABLE; Schema: public; Owner: local_user
--

CREATE TABLE public.item_pedido (
    id integer NOT NULL,
    id_pedido integer,
    id_produto integer,
    quantidade integer,
    preco_unitario numeric(10,2)
);


ALTER TABLE public.item_pedido OWNER TO local_user;

--
-- Name: item_pedido_id_seq; Type: SEQUENCE; Schema: public; Owner: local_user
--

ALTER TABLE public.item_pedido ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.item_pedido_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pedido; Type: TABLE; Schema: public; Owner: local_user
--

CREATE TABLE public.pedido (
    id integer NOT NULL,
    id_cliente integer,
    data date,
    total numeric(10,2)
);


ALTER TABLE public.pedido OWNER TO local_user;

--
-- Name: pedido_id_seq; Type: SEQUENCE; Schema: public; Owner: local_user
--

ALTER TABLE public.pedido ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.pedido_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: produto; Type: TABLE; Schema: public; Owner: local_user
--

CREATE TABLE public.produto (
    id integer NOT NULL,
    nome character varying(100),
    preco numeric(10,2),
    id_fornecedor integer
);


ALTER TABLE public.produto OWNER TO local_user;

--
-- Name: produto_id_seq; Type: SEQUENCE; Schema: public; Owner: local_user
--

ALTER TABLE public.produto ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.produto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: local_user
--

COPY public.cliente (id, nome, email, cidade, data_cadastro) FROM stdin;
1	João Silva	joao@email.com	Lages	2025-01-10
2	Maria Souza	maria@email.com	Florianópolis	2026-05-13
3	Carlos	carlos@email.com	Lages	2026-05-13
4	Ana	ana@email.com	Blumenau	2026-05-13
\.


--
-- Data for Name: custo_produto; Type: TABLE DATA; Schema: public; Owner: local_user
--

COPY public.custo_produto (id, id_produto, custo, data_atualizacao) FROM stdin;
1	1	2500.00	2026-05-13
2	2	40.00	2026-05-13
3	3	90.00	2026-05-13
4	4	600.00	2026-05-13
5	5	120.00	2026-05-13
7	6	150.00	2020-01-01
6	6	160.00	2026-06-11
\.


--
-- Data for Name: fornecedor; Type: TABLE DATA; Schema: public; Owner: local_user
--

COPY public.fornecedor (id, nome, cnpj, cidade) FROM stdin;
1	Fornecedor A	12345678000100	São Paulo
2	Fornecedor B	98765432000199	Curitiba
3	Fornecedor C	11111111000111	Porto Alegre
4	Fornecedor D	22222222000122	Belém
\.


--
-- Data for Name: item_pedido; Type: TABLE DATA; Schema: public; Owner: local_user
--

COPY public.item_pedido (id, id_pedido, id_produto, quantidade, preco_unitario) FROM stdin;
1	1	1	1	3500.00
2	1	2	1	80.00
3	2	4	1	900.00
4	4	2	3	80.00
6	5	2	5	80.00
\.


--
-- Data for Name: pedido; Type: TABLE DATA; Schema: public; Owner: local_user
--

COPY public.pedido (id, id_cliente, data, total) FROM stdin;
1	1	2026-05-13	3580.00
2	2	2025-02-01	900.00
3	1	2026-06-11	0.00
5	2	2026-06-11	400.00
4	1	2026-06-11	240.00
\.


--
-- Data for Name: produto; Type: TABLE DATA; Schema: public; Owner: local_user
--

COPY public.produto (id, nome, preco, id_fornecedor) FROM stdin;
1	Notebook	3500.00	1
2	Mouse	80.00	1
3	Teclado	150.00	2
4	Monitor	900.00	2
5	Webcam	200.00	3
7	Headset	250.00	3
\.


--
-- Name: cliente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: local_user
--

SELECT pg_catalog.setval('public.cliente_id_seq', 10, true);


--
-- Name: custo_produto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: local_user
--

SELECT pg_catalog.setval('public.custo_produto_id_seq', 7, true);


--
-- Name: fornecedor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: local_user
--

SELECT pg_catalog.setval('public.fornecedor_id_seq', 4, true);


--
-- Name: item_pedido_id_seq; Type: SEQUENCE SET; Schema: public; Owner: local_user
--

SELECT pg_catalog.setval('public.item_pedido_id_seq', 6, true);


--
-- Name: pedido_id_seq; Type: SEQUENCE SET; Schema: public; Owner: local_user
--

SELECT pg_catalog.setval('public.pedido_id_seq', 5, true);


--
-- Name: produto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: local_user
--

SELECT pg_catalog.setval('public.produto_id_seq', 7, true);


--
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: local_user
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id);


--
-- Name: custo_produto custo_produto_pkey; Type: CONSTRAINT; Schema: public; Owner: local_user
--

ALTER TABLE ONLY public.custo_produto
    ADD CONSTRAINT custo_produto_pkey PRIMARY KEY (id);


--
-- Name: fornecedor fornecedor_pkey; Type: CONSTRAINT; Schema: public; Owner: local_user
--

ALTER TABLE ONLY public.fornecedor
    ADD CONSTRAINT fornecedor_pkey PRIMARY KEY (id);


--
-- Name: item_pedido item_pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: local_user
--

ALTER TABLE ONLY public.item_pedido
    ADD CONSTRAINT item_pedido_pkey PRIMARY KEY (id);


--
-- Name: pedido pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: local_user
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_pkey PRIMARY KEY (id);


--
-- Name: produto produto_pkey; Type: CONSTRAINT; Schema: public; Owner: local_user
--

ALTER TABLE ONLY public.produto
    ADD CONSTRAINT produto_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

