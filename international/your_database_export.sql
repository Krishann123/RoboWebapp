--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: pgsodium; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA pgsodium;


ALTER SCHEMA pgsodium OWNER TO supabase_admin;

--
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgsodium WITH SCHEMA pgsodium;


--
-- Name: EXTENSION pgsodium; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgsodium IS 'Pgsodium is a modern cryptography library for Postgres.';


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;


--
-- Name: EXTENSION pgjwt; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      PERFORM pg_notify(
          'realtime:system',
          jsonb_build_object(
              'error', SQLERRM,
              'function', 'realtime.send',
              'event', event,
              'topic', topic,
              'private', private
          )::text
      );
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

--
-- Name: secrets_encrypt_secret_secret(); Type: FUNCTION; Schema: vault; Owner: supabase_admin
--

CREATE FUNCTION vault.secrets_encrypt_secret_secret() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
		BEGIN
		        new.secret = CASE WHEN new.secret IS NULL THEN NULL ELSE
			CASE WHEN new.key_id IS NULL THEN NULL ELSE pg_catalog.encode(
			  pgsodium.crypto_aead_det_encrypt(
				pg_catalog.convert_to(new.secret, 'utf8'),
				pg_catalog.convert_to((new.id::text || new.description::text || new.created_at::text || new.updated_at::text)::text, 'utf8'),
				new.key_id::uuid,
				new.nonce
			  ),
				'base64') END END;
		RETURN new;
		END;
		$$;


ALTER FUNCTION vault.secrets_encrypt_secret_secret() OWNER TO supabase_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: Address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Address" (
    address text,
    region text,
    country text,
    "addressID" uuid NOT NULL
);


ALTER TABLE public."Address" OWNER TO postgres;

--
-- Name: TABLE "Address"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."Address" IS 'contains address information of all nomination entries';


--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    category_name text,
    "categoryID" uuid NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: TABLE "Category"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."Category" IS 'contains role category information of nomination entries.';


--
-- Name: Designation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Designation" (
    role_name text,
    "designationID" uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE public."Designation" OWNER TO postgres;

--
-- Name: TABLE "Designation"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."Designation" IS 'dontain the role category of nominated info';


--
-- Name: Person; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Person" (
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    firstname text NOT NULL,
    surname text NOT NULL,
    contact_number text NOT NULL,
    if_shortlisted boolean NOT NULL,
    social text NOT NULL,
    email text NOT NULL,
    id uuid NOT NULL,
    "designationID" uuid NOT NULL,
    "categoryID" uuid NOT NULL,
    "qnaID" uuid NOT NULL,
    "addressID" uuid NOT NULL,
    "schoolID" uuid NOT NULL,
    CONSTRAINT nomination_data_contact_check CHECK (((length(contact_number) >= 7) AND (length(contact_number) <= 15))),
    CONSTRAINT nomination_data_first_name_check CHECK (((length(firstname) >= 2) AND (length(firstname) <= 50))),
    CONSTRAINT nomination_data_social_check CHECK (((length(social) >= 2) AND (length(social) <= 15))),
    CONSTRAINT nomination_data_surname_check CHECK (((length(surname) >= 2) AND (length(surname) <= 50)))
);


ALTER TABLE public."Person" OWNER TO postgres;

--
-- Name: TABLE "Person"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public."Person" IS 'contains personal information of nomination entries';


--
-- Name: COLUMN "Person".if_shortlisted; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Person".if_shortlisted IS 'contain boolean values, containing the user entry, whether they are available to travel if shortlisted';


--
-- Name: COLUMN "Person".id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Person".id IS 'unique identifier for nomination entry';


--
-- Name: COLUMN "Person"."designationID"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."Person"."designationID" IS 'unique identifier to access data from Designation table';


--
-- Name: QNA; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."QNA" (
    qna_1 text,
    qna_2 text,
    qna_3 text,
    "qnaID" uuid NOT NULL
);


ALTER TABLE public."QNA" OWNER TO postgres;

--
-- Name: School; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."School" (
    school_name text NOT NULL,
    school_weblink text NOT NULL,
    "schoolID" uuid NOT NULL
);


ALTER TABLE public."School" OWNER TO postgres;

--
-- Name: Templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Templates" (
    id bigint NOT NULL,
    "Name" character varying NOT NULL,
    config json
);


ALTER TABLE public."Templates" OWNER TO postgres;

--
-- Name: Templates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."Templates" ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."Templates_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: Trainings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Trainings" (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    hero json,
    introduction json,
    content_1 json,
    content_2 json,
    content_3 json,
    content_4 json,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."Trainings" OWNER TO postgres;

--
-- Name: persons_data; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.persons_data AS
 SELECT concat(p.firstname, ' ', p.surname) AS "Full Name",
    p.contact_number AS "Contact Number",
    p.if_shortlisted AS "is Shortlisted",
    p.social,
    p.email,
    d.role_name AS "Role",
    c.category_name AS "Category",
    q.qna_1,
    q.qna_2,
    q.qna_3,
    concat(COALESCE(a.address, ''::text),
        CASE
            WHEN (a.address IS NOT NULL) THEN ', '::text
            ELSE ''::text
        END, COALESCE(a.region, ''::text),
        CASE
            WHEN (a.region IS NOT NULL) THEN ', '::text
            ELSE ''::text
        END, COALESCE(a.country, ''::text)) AS address,
    sc.school_name AS "School",
    sc.school_weblink AS "School Link"
   FROM (((((public."Person" p
     LEFT JOIN public."Designation" d ON ((p."designationID" = d."designationID")))
     LEFT JOIN public."Category" c ON ((p."categoryID" = c."categoryID")))
     LEFT JOIN public."QNA" q ON ((p."qnaID" = q."qnaID")))
     LEFT JOIN public."Address" a ON ((p."addressID" = a."addressID")))
     LEFT JOIN public."School" sc ON ((p."schoolID" = sc."schoolID")));


ALTER VIEW public.persons_data OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	da1e5e03-2422-447a-9e8f-1e2d1340d827	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"eroadmin@gmail.com","user_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","user_phone":""}}	2025-05-06 16:09:08.794152+00	
00000000-0000-0000-0000-000000000000	0344aff9-d9de-4fef-a2d5-b28207d12b51	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 16:50:02.647328+00	
00000000-0000-0000-0000-000000000000	f6f511f9-f606-45ad-be60-d0281b63bb72	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 16:50:27.632606+00	
00000000-0000-0000-0000-000000000000	7dff081f-7246-49e5-b7ea-2c625361a969	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 16:51:29.498958+00	
00000000-0000-0000-0000-000000000000	5ede3331-b275-4841-8557-fdef61549b19	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 16:52:54.027912+00	
00000000-0000-0000-0000-000000000000	e1474516-8e92-4746-8bae-a319006208d6	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 16:57:24.139874+00	
00000000-0000-0000-0000-000000000000	52daf136-68d0-4dc9-b34a-a83efeb11b98	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 17:00:34.336065+00	
00000000-0000-0000-0000-000000000000	bd84182c-ba30-450b-b58c-a2dc6c7f2850	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 17:05:04.835805+00	
00000000-0000-0000-0000-000000000000	c4bc8e72-40db-4d41-89c0-b4676f57bbbe	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 17:05:12.548496+00	
00000000-0000-0000-0000-000000000000	a436692c-dadf-4bb3-a361-0220f1888cbd	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 17:06:29.200006+00	
00000000-0000-0000-0000-000000000000	50e463f4-ebfd-41b0-a7b3-8ef10fb32897	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 17:11:05.097353+00	
00000000-0000-0000-0000-000000000000	a43f0d62-84de-4556-869b-b909c733f9a3	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 17:17:22.896112+00	
00000000-0000-0000-0000-000000000000	a9c65f4c-b1f7-4ee8-aa15-265a234de0de	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 17:21:26.472843+00	
00000000-0000-0000-0000-000000000000	5ef4772d-300c-4ce2-a8d5-f1f3608a30ef	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 17:22:01.711036+00	
00000000-0000-0000-0000-000000000000	eab6442d-40e5-4468-a948-b50ec89fb099	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 17:41:55.731942+00	
00000000-0000-0000-0000-000000000000	36c28df2-dac0-4d36-9b80-9040fed9ab79	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 17:44:29.092142+00	
00000000-0000-0000-0000-000000000000	b88abdf7-9ce7-4a19-a9bf-38afa58e3ca2	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 17:49:17.012646+00	
00000000-0000-0000-0000-000000000000	1af9ec72-ffe8-467c-8077-8e4481ff2bbc	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 17:53:12.860385+00	
00000000-0000-0000-0000-000000000000	bb211c84-ac89-41cd-b9b2-583d66a8b9ee	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 17:53:25.720485+00	
00000000-0000-0000-0000-000000000000	2e3ad26f-1dde-4f01-b061-82664ea03f5d	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-06 20:16:56.490231+00	
00000000-0000-0000-0000-000000000000	ff87a5c6-bf1e-4cfe-9a5a-24219715ed3c	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-07 03:00:37.286517+00	
00000000-0000-0000-0000-000000000000	a0a26557-4159-4f75-bab3-ac2413e89861	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 04:49:08.091322+00	
00000000-0000-0000-0000-000000000000	6a93d743-c818-4f0d-8a96-856691035455	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 04:49:08.098662+00	
00000000-0000-0000-0000-000000000000	c47dba2a-e657-49fb-b8a6-b00043dcbe5e	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-07 06:06:13.346152+00	
00000000-0000-0000-0000-000000000000	0f649ac4-491a-47b0-80d5-8616fea2ff04	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 06:56:00.851341+00	
00000000-0000-0000-0000-000000000000	1c4305e4-1a57-4dfc-bf1b-2d8c2cba5346	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 06:56:00.854545+00	
00000000-0000-0000-0000-000000000000	7ca3efa9-c773-4fbc-a0e6-6f8345fa0755	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-07 07:01:53.575443+00	
00000000-0000-0000-0000-000000000000	5f68e38f-e1e5-4367-addb-4cff2235e669	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 07:04:40.549672+00	
00000000-0000-0000-0000-000000000000	591582ad-ed56-49ee-9201-49658523b789	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 07:04:40.552491+00	
00000000-0000-0000-0000-000000000000	6ce16426-c7e5-4808-b48d-a008c189ccc8	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-07 07:14:28.170995+00	
00000000-0000-0000-0000-000000000000	acd0f7e9-0015-4bc5-bf47-ba09cdec4a10	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 08:03:10.79845+00	
00000000-0000-0000-0000-000000000000	3a2efe8f-9013-4a5a-a051-dae099db3fa1	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 08:03:10.801081+00	
00000000-0000-0000-0000-000000000000	959864cb-48eb-4a08-89e4-7679a6297a1d	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 09:01:11.819559+00	
00000000-0000-0000-0000-000000000000	32a0cd92-825f-4485-9424-b36cb1881b18	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 09:01:11.820822+00	
00000000-0000-0000-0000-000000000000	7b9b2aa4-1b64-40d3-88c8-ba1603170f68	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 09:59:12.457502+00	
00000000-0000-0000-0000-000000000000	5fa9a6fc-5428-42ae-ba1e-663743c19cb2	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 09:59:12.458984+00	
00000000-0000-0000-0000-000000000000	1bbd977a-2af5-421c-9fc3-b63f96064939	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 10:14:00.488503+00	
00000000-0000-0000-0000-000000000000	db54901d-1a81-4cc7-ba31-14cc3775272d	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 10:14:00.489917+00	
00000000-0000-0000-0000-000000000000	25f657cb-fc8e-4ab9-a043-19897875f86a	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 10:57:12.890312+00	
00000000-0000-0000-0000-000000000000	dd95acae-1c10-4c80-8cd5-78c524aa84de	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 10:57:12.891975+00	
00000000-0000-0000-0000-000000000000	9f004248-2b93-4bbd-a698-410dfb01b0b3	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 11:12:27.948887+00	
00000000-0000-0000-0000-000000000000	5192b4f6-6e01-4c1c-a74b-9cca02a10791	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 11:12:27.95113+00	
00000000-0000-0000-0000-000000000000	bc2cc465-eac5-444e-ac10-2d061a414d37	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 11:55:14.266532+00	
00000000-0000-0000-0000-000000000000	5f77c215-ce94-4753-b53f-a4484c00f885	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-07 11:55:14.267414+00	
00000000-0000-0000-0000-000000000000	42d914b8-26b4-4e0a-8832-69db74ca7cc3	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-07 12:28:00.476143+00	
00000000-0000-0000-0000-000000000000	5977a00f-1db4-4d57-80a8-4d6160c20e90	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-08 01:17:25.1692+00	
00000000-0000-0000-0000-000000000000	3d6d178f-42b0-45b6-9143-671b490692ae	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-08 01:59:41.067292+00	
00000000-0000-0000-0000-000000000000	359c4b98-fb07-467d-b154-ed2f1cef691d	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-08 02:15:32.96801+00	
00000000-0000-0000-0000-000000000000	82afbeba-452b-431f-8824-111aa844b7bf	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-08 02:15:32.968947+00	
00000000-0000-0000-0000-000000000000	b43f0035-e68e-4314-9edf-e12317fa53da	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-08 02:58:03.4922+00	
00000000-0000-0000-0000-000000000000	e5836a36-1074-4119-a23b-fc1c141b6854	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-08 02:58:03.493927+00	
00000000-0000-0000-0000-000000000000	eded23b9-cfdb-450f-bdba-db20c6276aa1	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-08 03:01:23.06332+00	
00000000-0000-0000-0000-000000000000	39c7421b-5dd5-4ddd-8b9c-78a9507827bf	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-08 03:03:14.134462+00	
00000000-0000-0000-0000-000000000000	b830fb30-0471-49e8-bbe9-23c36b0ec6ae	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-08 03:13:35.951826+00	
00000000-0000-0000-0000-000000000000	aa76b8a2-ea0b-4140-bf95-fe74f9f53c31	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-08 03:13:35.9534+00	
00000000-0000-0000-0000-000000000000	4a204a6f-2622-4403-84de-755815f38215	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-08 03:22:36.581656+00	
00000000-0000-0000-0000-000000000000	bd78f5da-ef00-406d-9315-0a18e1c4dfc8	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-08 03:26:48.577559+00	
00000000-0000-0000-0000-000000000000	5bf6a80d-687e-41a9-baed-82f0a4cb4aa7	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-08 04:25:17.647004+00	
00000000-0000-0000-0000-000000000000	195b175b-61a5-4614-9f86-deb1ca26119f	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-08 04:25:17.659519+00	
00000000-0000-0000-0000-000000000000	0c3197dc-5bb8-4bbd-9069-c12d0472cbb9	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-08 05:23:17.94384+00	
00000000-0000-0000-0000-000000000000	84f44ac8-dbac-4130-8c47-611aff823200	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-08 05:23:17.94785+00	
00000000-0000-0000-0000-000000000000	808770e0-cf7c-4828-96a6-36e9698aa639	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-08 05:27:31.822761+00	
00000000-0000-0000-0000-000000000000	45b4fc34-2314-41bc-b00c-9c72a16261af	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-08 06:25:49.415371+00	
00000000-0000-0000-0000-000000000000	34bc5506-e63b-4377-8b13-db8d1846fe5f	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-08 06:25:49.418866+00	
00000000-0000-0000-0000-000000000000	7cf7e5ca-fab7-4714-9484-ab96d83ed1ed	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-08 10:28:21.380004+00	
00000000-0000-0000-0000-000000000000	c880a1fc-1806-4bfc-be75-e769557043a5	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-08 10:28:21.391225+00	
00000000-0000-0000-0000-000000000000	798729af-ddeb-42f0-b1c7-9f10338080c9	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-12 17:06:09.479864+00	
00000000-0000-0000-0000-000000000000	e22a1c39-cb23-4258-8729-31d6c7f9980b	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-12 17:25:46.158314+00	
00000000-0000-0000-0000-000000000000	be30bb07-7450-4c85-9d71-a34619f527fd	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-12 18:24:05.101753+00	
00000000-0000-0000-0000-000000000000	f70b01d2-181e-4a6c-bd69-c11e0b01ddea	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-12 18:24:05.103824+00	
00000000-0000-0000-0000-000000000000	96ea1e11-6d2d-49bf-9d3a-e04ee330d9db	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-12 19:22:04.574589+00	
00000000-0000-0000-0000-000000000000	b09c5fc2-7489-45f9-aaab-5f26ab738bbc	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-12 19:22:04.57609+00	
00000000-0000-0000-0000-000000000000	50144f2d-4438-4d4e-8349-6223d9f7d017	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-12 20:20:06.026794+00	
00000000-0000-0000-0000-000000000000	dffd48f9-472c-4423-8a21-2d045c28c9e9	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-12 20:20:06.029319+00	
00000000-0000-0000-0000-000000000000	dfe0d9be-5db0-405e-8b2f-5ee8b7db3da1	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-12 20:43:07.531524+00	
00000000-0000-0000-0000-000000000000	5ec5b9d9-9857-4608-810d-cea9bc16bf3e	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-12 20:44:59.968549+00	
00000000-0000-0000-0000-000000000000	cc2bd2f8-2fe1-4af2-b68e-8fe31c77462c	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-12 20:48:00.815825+00	
00000000-0000-0000-0000-000000000000	9ed0f9c3-3ccd-4c72-9507-da057ecb0760	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-13 01:15:01.377176+00	
00000000-0000-0000-0000-000000000000	ac90e32f-79b1-4e0f-aa2d-644ed2205b19	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-13 01:15:01.379385+00	
00000000-0000-0000-0000-000000000000	1fe89eda-f8fa-47ec-b8ca-eb06a5e32434	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-13 01:15:03.770793+00	
00000000-0000-0000-0000-000000000000	9f70975e-01f8-4e9d-8922-f0acec8d728f	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-13 01:15:44.312383+00	
00000000-0000-0000-0000-000000000000	e36173bd-1ba4-49d0-b293-35fa9fa3de40	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-13 01:16:05.397308+00	
00000000-0000-0000-0000-000000000000	953fcf80-9ef4-4e6b-aa55-665a5f60969d	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-13 01:16:25.086576+00	
00000000-0000-0000-0000-000000000000	40299d8b-70bf-47b5-90f6-837930ee266a	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-15 16:36:00.622588+00	
00000000-0000-0000-0000-000000000000	85310831-a503-4008-937f-b59820a8b60a	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-15 17:34:21.136666+00	
00000000-0000-0000-0000-000000000000	d6d6300d-e1ae-44d5-8aa3-422ca05e033b	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-15 17:34:21.139119+00	
00000000-0000-0000-0000-000000000000	2caec605-e467-4d66-af00-e0b9016dc4ec	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-15 18:32:22.023004+00	
00000000-0000-0000-0000-000000000000	e61f65e8-a110-4581-8690-17b4da7b837a	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-15 18:32:22.024595+00	
00000000-0000-0000-0000-000000000000	23bd2915-5819-46e2-8fff-49b07b392af2	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-15 19:30:47.187365+00	
00000000-0000-0000-0000-000000000000	64a6a32d-8082-4c38-b584-4b65ba2dab17	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-15 19:30:47.190218+00	
00000000-0000-0000-0000-000000000000	e0704663-2e92-4f91-9c2c-142613c7bf52	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-15 20:28:48.251333+00	
00000000-0000-0000-0000-000000000000	6ae70674-b2d6-4f60-9fb8-cdab3e14304f	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-15 20:28:48.254121+00	
00000000-0000-0000-0000-000000000000	3ce51be6-9f6f-4c99-a8d6-808e90d30634	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-15 21:30:00.353288+00	
00000000-0000-0000-0000-000000000000	366f5821-d725-4ab4-8203-e9976110aa04	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-15 21:30:00.356328+00	
00000000-0000-0000-0000-000000000000	0bcd4864-b08c-4154-950a-c1ea401d700e	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-16 01:35:07.22804+00	
00000000-0000-0000-0000-000000000000	aa4e07fd-19f2-4507-ac9b-6adba86265c0	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-16 01:35:07.231529+00	
00000000-0000-0000-0000-000000000000	814678bf-96f4-4ebb-b89d-bda98a5d9359	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-16 02:57:36.413329+00	
00000000-0000-0000-0000-000000000000	6436ba78-c662-4eff-826d-9af4076b477a	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-16 05:29:02.081371+00	
00000000-0000-0000-0000-000000000000	764488e3-2d71-476d-bc5b-5a443b3aaf41	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-16 05:29:02.087095+00	
00000000-0000-0000-0000-000000000000	7648dbc4-1c1d-4c6e-a41d-e7c8c6d3f4d0	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-16 05:35:35.847904+00	
00000000-0000-0000-0000-000000000000	7ce95c54-3fb0-44eb-a709-4ab694ccf75c	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-16 05:39:04.995601+00	
00000000-0000-0000-0000-000000000000	3df06f23-7cb2-401c-9317-6a56d6f1c7ac	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-16 05:47:56.312365+00	
00000000-0000-0000-0000-000000000000	7efc6de0-b9aa-4aa8-b345-1c324e6fb813	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-16 05:49:42.536108+00	
00000000-0000-0000-0000-000000000000	8e660251-9e18-495c-8fa9-35fdf3e5941b	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-16 05:50:00.41123+00	
00000000-0000-0000-0000-000000000000	0b52c811-66a0-4133-a227-f51c3e887ee0	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-16 05:51:12.027601+00	
00000000-0000-0000-0000-000000000000	0ef52a59-0f1d-46ca-ae8c-2309552fc839	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 02:15:28.134963+00	
00000000-0000-0000-0000-000000000000	f3bd1889-f762-46d4-a81c-c5a96ff0e98f	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 02:15:28.140104+00	
00000000-0000-0000-0000-000000000000	5b966540-745e-4cc2-a278-ad9554fcb7a6	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-27 02:17:09.529471+00	
00000000-0000-0000-0000-000000000000	214a7cfa-4d45-4295-abf0-9901bc208431	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 03:15:16.710991+00	
00000000-0000-0000-0000-000000000000	a820ea9e-fdbb-4c23-9fa2-740ade475a92	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 03:15:16.711823+00	
00000000-0000-0000-0000-000000000000	8c76378d-a2c8-4c2b-bee2-8851908f4ed4	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 04:13:17.685463+00	
00000000-0000-0000-0000-000000000000	57d46343-acf2-44b8-a8b6-e3b4c674a00c	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 04:13:17.689297+00	
00000000-0000-0000-0000-000000000000	e0e3a971-a12e-4475-afc8-a65ca56649fb	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 05:17:59.01173+00	
00000000-0000-0000-0000-000000000000	3aeb74b4-a0e1-4581-a903-b7eb8164b22a	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 05:17:59.012533+00	
00000000-0000-0000-0000-000000000000	9f2f28a6-9b23-4a82-aac3-d8cfa327c61b	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 08:33:52.317469+00	
00000000-0000-0000-0000-000000000000	83176cd1-1242-465e-88ef-ab661fcee8ca	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 08:33:52.318307+00	
00000000-0000-0000-0000-000000000000	615725a0-e729-4afd-bd92-998521f62086	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 09:32:19.070814+00	
00000000-0000-0000-0000-000000000000	61a70e0b-ff7b-4931-aa2f-876edceef4c4	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 09:32:19.071616+00	
00000000-0000-0000-0000-000000000000	aad6fe76-1231-48c3-9fc0-708a6c3c8c52	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 10:30:20.034992+00	
00000000-0000-0000-0000-000000000000	52f5fc13-c209-4dcc-b10e-49efad9453e4	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 10:30:20.035844+00	
00000000-0000-0000-0000-000000000000	3f21d645-b7b4-484d-a4f2-16a793fa3c86	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 11:28:21.477738+00	
00000000-0000-0000-0000-000000000000	5171abad-d5e3-4e84-b1a7-84cf39d9ba80	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 11:28:21.482878+00	
00000000-0000-0000-0000-000000000000	8f34cef7-ee0c-4d83-bf25-8bbd6a325d36	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 12:26:22.921954+00	
00000000-0000-0000-0000-000000000000	41d4d25d-66e7-4165-8cf7-5bf8e03827ad	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 12:26:22.925752+00	
00000000-0000-0000-0000-000000000000	3b2946e6-299f-49f0-bc2b-0d7d5d055aa4	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 13:24:22.902119+00	
00000000-0000-0000-0000-000000000000	9e87af21-a8f5-4055-b716-36f3c05018f1	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 13:24:22.904496+00	
00000000-0000-0000-0000-000000000000	ffa85759-67f1-447c-8216-bad6ee003969	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 14:22:23.77966+00	
00000000-0000-0000-0000-000000000000	70f40ebd-7247-452f-9f1f-c9bcdcce3a07	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 14:22:23.781883+00	
00000000-0000-0000-0000-000000000000	1a5ac85d-4336-4630-9a3b-9a494ab3a156	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 15:20:24.682231+00	
00000000-0000-0000-0000-000000000000	9fe36bb8-c208-4100-8c85-444e14e8f27f	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 15:20:24.684542+00	
00000000-0000-0000-0000-000000000000	2bd1a331-d0df-4733-9224-770192ed4016	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 16:18:25.535978+00	
00000000-0000-0000-0000-000000000000	91ef5f6d-da68-471e-ae43-dcbc4c390d10	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 16:18:25.538854+00	
00000000-0000-0000-0000-000000000000	292ffbab-83f1-4d98-9e04-f8c65b19509a	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 17:16:26.45696+00	
00000000-0000-0000-0000-000000000000	85b0e621-b6ec-446c-8920-ca2dba2c622b	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-27 17:16:26.458428+00	
00000000-0000-0000-0000-000000000000	3d873243-a95a-45f8-9de7-3108c8ae6572	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 00:55:16.490814+00	
00000000-0000-0000-0000-000000000000	418ff46c-6da8-4415-82fa-1f14845cd864	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 00:55:16.498646+00	
00000000-0000-0000-0000-000000000000	4ecf8b68-523a-497d-bcca-530b91c188f6	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 01:53:14.024908+00	
00000000-0000-0000-0000-000000000000	72aba1c9-7488-41d8-a059-4ebf5ab5b239	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 01:53:14.026938+00	
00000000-0000-0000-0000-000000000000	a8fe81b8-6873-4fda-b084-2abb1fb27c8a	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 05:25:26.069836+00	
00000000-0000-0000-0000-000000000000	41869146-e25d-46ab-8b9b-9b66ca3e7e1a	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 05:25:26.071905+00	
00000000-0000-0000-0000-000000000000	b7c0dca0-5cf3-497d-9e6b-d2b928eb3292	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 06:23:53.710518+00	
00000000-0000-0000-0000-000000000000	dc846e2c-8425-4687-9a38-3aae06f179a1	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 06:23:53.71802+00	
00000000-0000-0000-0000-000000000000	014fff8c-da22-4785-9780-b150733a7a81	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 07:21:54.276946+00	
00000000-0000-0000-0000-000000000000	1016c2f8-9200-4475-92d8-223843293e35	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 07:21:54.278974+00	
00000000-0000-0000-0000-000000000000	ae6c2f9c-0672-4b12-b7c3-55d2ba5ea976	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 08:19:55.264604+00	
00000000-0000-0000-0000-000000000000	a1f8d102-197f-4644-9b3d-61efd5d8afd0	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 08:19:55.266506+00	
00000000-0000-0000-0000-000000000000	7fb4b3a3-5946-4fc4-94f2-09cbaf907a56	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 09:17:56.135243+00	
00000000-0000-0000-0000-000000000000	f5fd4949-7f1b-49e2-b159-17c2775bdd0a	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 09:17:56.137434+00	
00000000-0000-0000-0000-000000000000	413bba9c-4dcf-4599-9be3-67e52da9fa68	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 10:15:57.707258+00	
00000000-0000-0000-0000-000000000000	5dd0c842-9493-4b94-b578-e35fa56a2b53	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 10:15:57.711524+00	
00000000-0000-0000-0000-000000000000	60b2f2be-c27e-407b-8099-84229c33de00	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 11:13:58.10368+00	
00000000-0000-0000-0000-000000000000	c5b557c1-652b-4f4a-af92-47b3dcbe70e5	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 11:13:58.106205+00	
00000000-0000-0000-0000-000000000000	7dee5aaf-5994-42a2-b9c3-bc0da06f90ec	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 12:11:58.954503+00	
00000000-0000-0000-0000-000000000000	a8a707da-d64a-40f5-b0bb-14623e587e29	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 12:11:58.956576+00	
00000000-0000-0000-0000-000000000000	8d58331e-6e6a-44d0-8074-4bc67b872e73	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 13:09:59.883222+00	
00000000-0000-0000-0000-000000000000	6158d3a9-f7a6-4d33-9caf-7fb008642d21	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 13:09:59.88468+00	
00000000-0000-0000-0000-000000000000	cfd1e0e0-5139-4bce-aa0b-f36ee67b2a7a	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 14:08:00.849176+00	
00000000-0000-0000-0000-000000000000	472fba0d-760c-415c-b03c-ac015b5e6410	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 14:08:00.85061+00	
00000000-0000-0000-0000-000000000000	0c5c3da4-dceb-4eb1-ba61-5ea3a0b1f624	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 15:06:02.479279+00	
00000000-0000-0000-0000-000000000000	bcf66d3e-5bf1-4b60-b196-23d0941eb5e5	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 15:06:02.480636+00	
00000000-0000-0000-0000-000000000000	2c66e648-fd7f-42c8-b110-7a2ea263657b	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 16:04:19.499869+00	
00000000-0000-0000-0000-000000000000	7f81c7a4-7849-4450-b319-6ec3afc65d49	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-28 16:04:19.502418+00	
00000000-0000-0000-0000-000000000000	687248d8-e3f3-48b8-ac32-713ad75ebe73	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-29 01:33:07.067002+00	
00000000-0000-0000-0000-000000000000	7df0e473-2ea8-4fae-a108-da9482c04193	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-29 01:33:07.071573+00	
00000000-0000-0000-0000-000000000000	caff90df-d521-4eed-bac2-dc8d171d1a7e	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-29 02:31:34.912815+00	
00000000-0000-0000-0000-000000000000	3c5e529c-e3cd-49b7-aa87-39c3683a106a	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-29 02:31:34.916138+00	
00000000-0000-0000-0000-000000000000	08f3f7e1-ed41-4fe7-9a68-741155dcac9d	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-29 03:29:35.747554+00	
00000000-0000-0000-0000-000000000000	7e992885-c983-4458-8dc6-000c1303a46a	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-29 03:29:35.752353+00	
00000000-0000-0000-0000-000000000000	700e6d21-fb4a-4c19-9be9-f568ce1b1dc2	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-29 04:27:36.333015+00	
00000000-0000-0000-0000-000000000000	98928713-ce97-4a19-afb7-3e35ebd831fa	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-29 04:27:36.334331+00	
00000000-0000-0000-0000-000000000000	7172cf52-197d-4c6d-870b-fdcd3a360d95	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-29 05:25:37.24833+00	
00000000-0000-0000-0000-000000000000	2d3f47c2-7aef-41e8-9f9d-346df9bfe95e	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-29 05:25:37.250213+00	
00000000-0000-0000-0000-000000000000	6eb78c9a-58a9-4fd9-9cf2-44bb1d5cd6ca	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-29 06:23:38.6179+00	
00000000-0000-0000-0000-000000000000	de26d3cc-c479-43cb-bd47-f0200535c48a	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-29 06:23:38.628691+00	
00000000-0000-0000-0000-000000000000	9504f44f-a73f-4820-9806-2034d8f2374f	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-29 09:25:31.642272+00	
00000000-0000-0000-0000-000000000000	6d04a8d0-7d13-4ca3-9a90-118e014c34fc	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-29 09:25:31.644104+00	
00000000-0000-0000-0000-000000000000	2d5ac9cc-3db5-4f4d-bea9-9e172a7fd4e4	{"action":"login","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-06-09 17:07:50.332708+00	
00000000-0000-0000-0000-000000000000	a57c22c7-dccf-4708-a5b9-5212e85fcd89	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:06:06.236933+00	
00000000-0000-0000-0000-000000000000	8d92c8bf-130b-4552-ba34-3bdb53359312	{"action":"token_revoked","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:06:06.240353+00	
00000000-0000-0000-0000-000000000000	2224d402-3903-40e5-80d4-37b6e33b488e	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:06:36.227028+00	
00000000-0000-0000-0000-000000000000	cac1c25a-3658-485f-9040-5856be435c88	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:11:07.510622+00	
00000000-0000-0000-0000-000000000000	47ecfc4a-f92d-4ce7-8dcf-2ef335beb626	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:14:22.88963+00	
00000000-0000-0000-0000-000000000000	2e1cc8cc-e265-4701-bea7-d7fa9f4c821b	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:17:28.492837+00	
00000000-0000-0000-0000-000000000000	375d5d04-c529-482b-9cc6-c36e345cb95e	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:17:32.03469+00	
00000000-0000-0000-0000-000000000000	1b8e4cd6-cafb-4376-bd76-9b56c0f01e39	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:17:35.025584+00	
00000000-0000-0000-0000-000000000000	bee1f9e1-877e-48f0-8630-9481f9c6a806	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:18:16.975179+00	
00000000-0000-0000-0000-000000000000	ecd9981f-e677-4618-90b9-2bf2b9bb9586	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:18:31.077116+00	
00000000-0000-0000-0000-000000000000	6d64ba35-1414-4b6d-a238-a40bbf995a74	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:18:32.041457+00	
00000000-0000-0000-0000-000000000000	5d72239c-1c30-4a42-b4e3-34a2b79ee114	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:18:36.021957+00	
00000000-0000-0000-0000-000000000000	9b874646-57e7-4eb1-86dc-948c445112d6	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:18:46.045333+00	
00000000-0000-0000-0000-000000000000	b95caa0d-67be-4fbb-b20d-e12be0c7719f	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:18:53.038872+00	
00000000-0000-0000-0000-000000000000	f0b9d2a1-fbca-43a8-aa88-b49fe3b9fa9c	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:19:07.047861+00	
00000000-0000-0000-0000-000000000000	762c5b7a-3d2e-4228-99e1-dd731b474048	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:19:10.027196+00	
00000000-0000-0000-0000-000000000000	6b2d04cb-0138-407d-a441-95df8f2daa19	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:19:17.430475+00	
00000000-0000-0000-0000-000000000000	562b0685-cbc4-4085-a2d0-f67701162e48	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:19:23.03535+00	
00000000-0000-0000-0000-000000000000	6741327f-dcad-4937-8777-27790218fa28	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:19:26.015547+00	
00000000-0000-0000-0000-000000000000	3476b113-5e1e-4584-8d80-b9a4d71bd3ee	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:19:32.041231+00	
00000000-0000-0000-0000-000000000000	aa8f37e3-f4cd-4c6c-8c94-517cc67fce2c	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:19:35.012259+00	
00000000-0000-0000-0000-000000000000	3daaadd2-4cde-4ecd-aa33-449a293bfa1b	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:20:03.088218+00	
00000000-0000-0000-0000-000000000000	015423a4-52ae-4ab4-a95d-4343ef7be3b7	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:20:04.05037+00	
00000000-0000-0000-0000-000000000000	376f833d-eb2b-4967-9dd7-0da5f1fae6e7	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:20:07.045228+00	
00000000-0000-0000-0000-000000000000	5a7f92c5-1702-48d2-99b0-ddfa92e89502	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:20:15.046603+00	
00000000-0000-0000-0000-000000000000	0494f9c3-2d74-40fa-855f-3ebd4ac6a692	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:20:44.043737+00	
00000000-0000-0000-0000-000000000000	57b31840-da37-4b9b-82bb-2fcfd55aa8f8	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:21:05.45949+00	
00000000-0000-0000-0000-000000000000	0375ad73-5fb8-41ac-9d6c-054e1e44e3bf	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:21:14.052892+00	
00000000-0000-0000-0000-000000000000	ae243b34-5508-40c4-bd23-f47a5d15d414	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:21:23.120213+00	
00000000-0000-0000-0000-000000000000	b8c775d0-2e9d-4daf-a8e6-77404c8a8562	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:21:25.0241+00	
00000000-0000-0000-0000-000000000000	32d55ac5-848d-4313-85f3-d774e496c96a	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:21:31.036293+00	
00000000-0000-0000-0000-000000000000	11507725-8b13-4f62-a18b-abfafd232eea	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:21:49.526498+00	
00000000-0000-0000-0000-000000000000	5426f9b6-09b4-4ae1-b0bc-81843d283738	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:25:26.670688+00	
00000000-0000-0000-0000-000000000000	29e533e5-247e-4d6d-961d-3b6ea59dc628	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:25:44.188919+00	
00000000-0000-0000-0000-000000000000	50fd58f4-00b8-41f8-8efd-c7f921fede42	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:25:48.148348+00	
00000000-0000-0000-0000-000000000000	13309983-58a7-448b-9c70-5ae48ebe5468	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:25:51.131901+00	
00000000-0000-0000-0000-000000000000	0bbc0014-ff61-4c1c-b5c8-b2a40340bb3c	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:26:12.03446+00	
00000000-0000-0000-0000-000000000000	6d168104-cb55-404d-8cc9-cab90dc0fb0f	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:26:30.069999+00	
00000000-0000-0000-0000-000000000000	ab7ad7c2-962e-4e9a-9018-2196826696ef	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:26:35.043051+00	
00000000-0000-0000-0000-000000000000	a88d8ca9-1583-43a6-b1d1-9fbb1993f19b	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:26:38.592664+00	
00000000-0000-0000-0000-000000000000	962e7424-a483-4702-9d3a-083d068bfbf6	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:26:42.171056+00	
00000000-0000-0000-0000-000000000000	271f33e8-4c80-4924-b507-0859e931d415	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:27:21.495503+00	
00000000-0000-0000-0000-000000000000	87e042c8-ef54-40a8-a471-897c720fdf29	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:27:30.444191+00	
00000000-0000-0000-0000-000000000000	5c6948cb-8aff-4ac8-a8ac-81fbe4bfe750	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:27:34.413873+00	
00000000-0000-0000-0000-000000000000	7644a064-548f-490f-ba70-ec9f4fcdba43	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:28:06.23632+00	
00000000-0000-0000-0000-000000000000	10758302-524a-4f22-b632-d31cb10afc42	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:28:11.197753+00	
00000000-0000-0000-0000-000000000000	ceea15d7-4891-48cf-98aa-bfab2c5aef1f	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:28:22.185008+00	
00000000-0000-0000-0000-000000000000	d13f40ef-b373-4de1-b329-209bd5e7aa1f	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:28:25.175127+00	
00000000-0000-0000-0000-000000000000	a0fb0ff6-b6a1-4830-904f-cf2691a88142	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:28:26.167183+00	
00000000-0000-0000-0000-000000000000	ac9d1819-833e-4268-bac9-5e86e96a662c	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:28:30.172686+00	
00000000-0000-0000-0000-000000000000	825f2c48-2784-42e6-a4dc-1edea729de27	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:28:40.189983+00	
00000000-0000-0000-0000-000000000000	9f9e0c17-e55a-4242-891a-a19e183b3268	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:28:54.191876+00	
00000000-0000-0000-0000-000000000000	052a665b-fb87-41ed-8ea9-5655f325ba72	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:29:06.599031+00	
00000000-0000-0000-0000-000000000000	81028530-ff8a-432e-9b3c-6c05ebc9110c	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:29:50.057327+00	
00000000-0000-0000-0000-000000000000	85fa8a21-019b-409e-9b17-b2b44355ee35	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:29:52.023234+00	
00000000-0000-0000-0000-000000000000	311d271f-00e9-4c85-89b9-53abbaac2d21	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:29:57.211611+00	
00000000-0000-0000-0000-000000000000	4bf5a16b-8fc0-4348-9aa9-ef6c6072ef7f	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:30:01.018029+00	
00000000-0000-0000-0000-000000000000	e46c4870-dcb7-4d4f-9512-7c6baa0fce0c	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:30:31.084939+00	
00000000-0000-0000-0000-000000000000	9a1305d5-8333-4ef9-9c55-bfb6be1be29d	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:30:45.063915+00	
00000000-0000-0000-0000-000000000000	1c15f71e-2d9e-4c66-a507-81ee26b819a3	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:30:47.005321+00	
00000000-0000-0000-0000-000000000000	fb2d7a41-28e5-485e-868e-cb4816103493	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:30:48.038133+00	
00000000-0000-0000-0000-000000000000	f128d679-3aa9-46f0-8d13-9ea32bc83c2e	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:30:53.422135+00	
00000000-0000-0000-0000-000000000000	4d1eefb3-8918-4540-b65e-7353238276b2	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:30:58.034164+00	
00000000-0000-0000-0000-000000000000	756bdf98-b91d-4f88-bcad-65b595ffb01c	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:31:03.044283+00	
00000000-0000-0000-0000-000000000000	23f8cbbd-1505-4b4b-b8f7-254a61c32e99	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:32:26.053771+00	
00000000-0000-0000-0000-000000000000	679f257b-88c9-4ae1-b993-2e88f4087fa8	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:32:31.06834+00	
00000000-0000-0000-0000-000000000000	c57c48c7-dfba-40fe-8325-8a6daa7aab98	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:32:45.116181+00	
00000000-0000-0000-0000-000000000000	5d227f07-0404-4035-bc5a-40c639542168	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:33:03.07708+00	
00000000-0000-0000-0000-000000000000	8e539497-44a9-46da-ac04-e32cd11536b4	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:33:13.654131+00	
00000000-0000-0000-0000-000000000000	ffc28bf6-d0a2-4bdb-9c48-e8b7d98fbcae	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:33:15.977535+00	
00000000-0000-0000-0000-000000000000	c0633d20-fdc8-4acf-9a15-a51b198dc33f	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:33:16.701241+00	
00000000-0000-0000-0000-000000000000	71679a2d-adfa-4cba-b6af-73f7a849b055	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:33:53.072605+00	
00000000-0000-0000-0000-000000000000	a1158002-42b8-4baa-99b7-01eec321c6be	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:34:00.091132+00	
00000000-0000-0000-0000-000000000000	1ca27c94-7783-46a7-aca9-00c02e1b7732	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:34:02.654559+00	
00000000-0000-0000-0000-000000000000	39a2e87c-0487-4ea4-8a12-1892b707637e	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:34:07.230846+00	
00000000-0000-0000-0000-000000000000	c0962602-14c0-4129-8635-3ef776d88925	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:34:30.458754+00	
00000000-0000-0000-0000-000000000000	18f1ea0e-c47a-4d85-b9be-33d76e10f1c9	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:34:32.024987+00	
00000000-0000-0000-0000-000000000000	c9f06843-06c4-44de-87cd-f65df7241ac3	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:36:17.49188+00	
00000000-0000-0000-0000-000000000000	83605f55-b225-4286-88dc-caf7381979a2	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:36:20.021635+00	
00000000-0000-0000-0000-000000000000	399b2b97-6c0c-40a0-9fc2-b48eab2fac2e	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:36:24.948949+00	
00000000-0000-0000-0000-000000000000	7273062a-45f5-4149-a202-d2dc93939a87	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:36:27.516691+00	
00000000-0000-0000-0000-000000000000	a92a4fd8-5f36-45a6-88f1-35cce4e09280	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:36:52.048359+00	
00000000-0000-0000-0000-000000000000	3507b71f-ae6e-4594-86f4-83a433874e19	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:37:00.039719+00	
00000000-0000-0000-0000-000000000000	4ebfbfb0-ab82-4624-b208-19ffeaaea0d8	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:37:10.042296+00	
00000000-0000-0000-0000-000000000000	1c7c63e4-a069-4a33-97d0-6669621be23d	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:37:16.239062+00	
00000000-0000-0000-0000-000000000000	310a2c8b-425d-418e-a4b0-86b35dfe118e	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:38:44.461928+00	
00000000-0000-0000-0000-000000000000	490dfb4a-8750-4448-9ac2-271801b8b98d	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:39:46.064788+00	
00000000-0000-0000-0000-000000000000	5cb6a971-6b25-4ce3-b199-322dd427fd73	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:40:15.047278+00	
00000000-0000-0000-0000-000000000000	3a041c79-7c6e-47f8-966e-cbad62b35452	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:40:20.248817+00	
00000000-0000-0000-0000-000000000000	3779e767-9588-479e-a2fa-8d8ef17df27c	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:41:17.452979+00	
00000000-0000-0000-0000-000000000000	184958e5-7e7d-481c-9053-c093085b0251	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:42:36.774887+00	
00000000-0000-0000-0000-000000000000	04b7d8ad-ce66-4a17-903c-f0db210f3281	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:42:39.79649+00	
00000000-0000-0000-0000-000000000000	884f14fe-c0a5-4b85-8837-288d5ed9b9b7	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:43:52.489974+00	
00000000-0000-0000-0000-000000000000	c00c4942-8a81-4ece-90fd-3ec1dcd7d062	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:44:08.043527+00	
00000000-0000-0000-0000-000000000000	bb21c34d-246f-4d0f-b93d-a0dd876abeb0	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:44:15.013797+00	
00000000-0000-0000-0000-000000000000	6123108b-8a4e-4f70-a10e-9796826dae92	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:44:17.006815+00	
00000000-0000-0000-0000-000000000000	8f804b15-8d04-4427-bdfc-b1f801f3e62d	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:44:47.032199+00	
00000000-0000-0000-0000-000000000000	b4a2e0e7-8a97-453f-8489-616d26d41cd0	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:45:02.162654+00	
00000000-0000-0000-0000-000000000000	963155ff-4cb4-4f41-949f-eea0f1553737	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:45:06.005678+00	
00000000-0000-0000-0000-000000000000	848ff6bd-f7b1-4596-b325-556705ad8c34	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:45:21.051391+00	
00000000-0000-0000-0000-000000000000	62fe6fd8-7a26-423b-899f-85c051a17a48	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:46:51.647514+00	
00000000-0000-0000-0000-000000000000	ee1ec543-0ddd-46a3-b74d-beca59db8190	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:46:56.050666+00	
00000000-0000-0000-0000-000000000000	6d74d19b-cfbd-4629-9264-91738a65461b	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:46:58.898744+00	
00000000-0000-0000-0000-000000000000	70662284-ce62-4950-8389-ee250bcb9545	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:47:00.26626+00	
00000000-0000-0000-0000-000000000000	af199c66-9ee0-4ba8-bc0d-3dcd30eec99f	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:47:01.344679+00	
00000000-0000-0000-0000-000000000000	5c705ad9-ce51-45a4-b164-d7b3ce05dd94	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:47:02.498885+00	
00000000-0000-0000-0000-000000000000	dae512e5-3649-4ede-aa7d-223bbdbdeaf0	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:48:57.505341+00	
00000000-0000-0000-0000-000000000000	e5ec2cea-2856-40a4-b3d7-03df528f4d73	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:49:01.026044+00	
00000000-0000-0000-0000-000000000000	fc26d15c-4b64-44e4-b82d-cf737f53a709	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:49:03.034831+00	
00000000-0000-0000-0000-000000000000	8e1b835d-4f8d-4874-92a0-0f68e865f22d	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:49:59.195303+00	
00000000-0000-0000-0000-000000000000	c45d90c4-6f99-4217-8069-f4e62d116502	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:50:03.54908+00	
00000000-0000-0000-0000-000000000000	2b67d1a9-8271-463e-9f28-4a2c4dbe718e	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:50:04.597124+00	
00000000-0000-0000-0000-000000000000	8dd74b72-aa74-48b4-af67-b484dc01859c	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:50:06.310602+00	
00000000-0000-0000-0000-000000000000	4ce29cf8-91ac-4227-8a51-20182970a039	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:50:07.275318+00	
00000000-0000-0000-0000-000000000000	8dfee735-4217-4e74-9eab-d7614933509a	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-09 18:50:32.934325+00	
00000000-0000-0000-0000-000000000000	07a044e2-2133-41a4-98e7-d4d1020eb6b1	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:49:54.670726+00	
00000000-0000-0000-0000-000000000000	d35d62a1-c2aa-470c-99da-57e77a29142b	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:50:17.467213+00	
00000000-0000-0000-0000-000000000000	c6382e69-1126-4b4b-8220-13c9407047f6	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:50:49.11463+00	
00000000-0000-0000-0000-000000000000	5061be64-6097-4877-b6c2-c77343134120	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:50:51.054658+00	
00000000-0000-0000-0000-000000000000	f724f6d5-d53b-4c5c-8423-8a89e8979787	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:50:58.014498+00	
00000000-0000-0000-0000-000000000000	72d803d5-5383-4a49-adf8-d60a7b5074b5	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:51:34.280627+00	
00000000-0000-0000-0000-000000000000	9fa2754f-1392-4b1c-a43e-339912dcb105	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:51:40.663057+00	
00000000-0000-0000-0000-000000000000	ab0ecadb-229d-4b7a-a958-d15e9c2e5663	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:51:58.488984+00	
00000000-0000-0000-0000-000000000000	9b34738e-09d9-4415-ad81-98273457c4ce	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:53:24.996374+00	
00000000-0000-0000-0000-000000000000	e61786cb-f502-4d34-8f0c-bf7d9645bdc2	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:53:29.83743+00	
00000000-0000-0000-0000-000000000000	7740c322-8a21-4ef0-b145-a73ac5145209	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:53:30.384667+00	
00000000-0000-0000-0000-000000000000	06881774-3f72-4309-bb69-f86c6c32ca92	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:53:30.897396+00	
00000000-0000-0000-0000-000000000000	540cd2f5-32d8-4fdb-bde3-757cd28fa4f1	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:53:34.567136+00	
00000000-0000-0000-0000-000000000000	468889a0-be16-492f-984c-6e14ec33a4e9	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:53:49.467349+00	
00000000-0000-0000-0000-000000000000	0defcc89-6f09-4120-b2cb-7dcec5611de7	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:53:49.562618+00	
00000000-0000-0000-0000-000000000000	64861d2b-1f40-4fb6-ac21-c0ceec0c3344	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:53:49.667648+00	
00000000-0000-0000-0000-000000000000	595ea94c-4ad5-4d3b-969f-5570e4c6250a	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:53:51.016026+00	
00000000-0000-0000-0000-000000000000	6ce361ef-f029-4c27-8719-2c23cbc9bdb2	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:53:51.123739+00	
00000000-0000-0000-0000-000000000000	6c99ef2c-65ea-4d11-b2cb-5188fd1a7cc8	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:53:51.224596+00	
00000000-0000-0000-0000-000000000000	b8bb3bc2-b950-4aea-baeb-4c45798a3aea	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:53:53.011828+00	
00000000-0000-0000-0000-000000000000	55c77af5-bfbd-49a1-a966-aff392c09cba	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:53:53.121016+00	
00000000-0000-0000-0000-000000000000	b9388a5a-37fe-4134-b74e-d99940574523	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:53:53.215753+00	
00000000-0000-0000-0000-000000000000	a2e552a7-707f-4af3-a79d-b8f5774473a9	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:53:53.957473+00	
00000000-0000-0000-0000-000000000000	e015cf5b-f17d-43bd-91ec-597d4f24e42a	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:53:54.054963+00	
00000000-0000-0000-0000-000000000000	686e8bc1-6e22-4b41-849d-73fae489d09a	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:53:54.146475+00	
00000000-0000-0000-0000-000000000000	8e72bdce-6ee7-419b-b7c2-dcd5b549935d	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:54:37.164872+00	
00000000-0000-0000-0000-000000000000	32f545df-5849-4184-b89a-ab2f704c9422	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:55:30.142279+00	
00000000-0000-0000-0000-000000000000	01fe4988-53bf-4a68-b1f5-0710f95d9314	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:55:30.259839+00	
00000000-0000-0000-0000-000000000000	d152b2dc-5a4f-437e-be23-e56f7f9f9cb0	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:55:30.351948+00	
00000000-0000-0000-0000-000000000000	b16a1e1d-6306-4f0c-97c4-5a553936a9d5	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:56:36.809666+00	
00000000-0000-0000-0000-000000000000	49cf335d-8ff0-45de-9941-3c5323716ab8	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:56:36.915397+00	
00000000-0000-0000-0000-000000000000	8fa22717-050e-4d57-9185-e61c1213d2bf	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:57:01.888495+00	
00000000-0000-0000-0000-000000000000	3aefe2bc-84b7-4024-9c13-e6f5982d4e88	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:57:02.838072+00	
00000000-0000-0000-0000-000000000000	d22818e6-49d0-4680-9115-d3724f600d8f	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:58:08.999508+00	
00000000-0000-0000-0000-000000000000	a5a2d79b-dc15-4f2b-bd1a-f840cc4e808d	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:58:11.049019+00	
00000000-0000-0000-0000-000000000000	b8bcee04-29f2-4348-a098-287106bec60c	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:58:12.931819+00	
00000000-0000-0000-0000-000000000000	5555f965-1601-4b18-b4e3-37bfce43ffdc	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:58:14.904055+00	
00000000-0000-0000-0000-000000000000	b1f3f8e9-b04b-47ff-9012-0154b7682790	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:58:24.472122+00	
00000000-0000-0000-0000-000000000000	6b964fa3-25ed-458c-b91c-1fb093a74be8	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:58:26.895704+00	
00000000-0000-0000-0000-000000000000	588dc178-9905-495e-9471-b2af3d59f2f8	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:58:28.707011+00	
00000000-0000-0000-0000-000000000000	03974760-2393-4ec6-8c46-419771cae319	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:58:30.222413+00	
00000000-0000-0000-0000-000000000000	c4bf3120-f701-4e26-bb94-7057a69460a7	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 03:58:56.734408+00	
00000000-0000-0000-0000-000000000000	b38494ec-cbb7-486a-8045-f026bfb84e95	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 04:04:44.488821+00	
00000000-0000-0000-0000-000000000000	b1237e90-caf7-4265-95d5-33c3aef5a853	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 04:04:44.56823+00	
00000000-0000-0000-0000-000000000000	c6caae49-af83-416b-90b5-76ae870cdeff	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 04:04:44.646849+00	
00000000-0000-0000-0000-000000000000	8d5478b9-97db-49c5-9a0d-e95cc46c4c2c	{"action":"token_refreshed","actor_id":"7f1900fb-7b11-416c-8d85-f8a488ef7f63","actor_username":"eroadmin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-06-10 04:05:44.062487+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
7f1900fb-7b11-416c-8d85-f8a488ef7f63	7f1900fb-7b11-416c-8d85-f8a488ef7f63	{"sub": "7f1900fb-7b11-416c-8d85-f8a488ef7f63", "email": "eroadmin@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-05-06 16:09:08.783711+00	2025-05-06 16:09:08.783779+00	2025-05-06 16:09:08.783779+00	4268c980-9f1b-43bc-bad3-7a0d496a78a0
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
0de2f864-9318-48c7-8962-00aaef5970ac	2025-05-06 16:50:02.672861+00	2025-05-06 16:50:02.672861+00	password	d7f30dd5-a0d6-47c3-b1c1-9c0a6c080fb4
71961102-7bbf-4d73-bffa-0ab637b00440	2025-05-06 16:50:27.638284+00	2025-05-06 16:50:27.638284+00	password	60371001-6d5b-47d7-b0cb-19d5fd8cd672
f3425d3d-5d47-4a22-9eb8-8a3334e4a600	2025-05-06 16:51:29.50664+00	2025-05-06 16:51:29.50664+00	password	b6e6af08-f4e5-4b9c-90fc-864152767028
a236da4c-e81e-4f1c-a35b-2800620fd596	2025-05-06 16:52:54.032376+00	2025-05-06 16:52:54.032376+00	password	06923a42-8acc-4220-a9aa-739f98668bcc
7411b11e-c856-44e2-8e04-8368308d19e2	2025-05-06 16:57:24.14621+00	2025-05-06 16:57:24.14621+00	password	561152c9-7502-428e-9f55-6a62205dde98
81e4c006-79e0-4c29-805b-1ce3ddfd4867	2025-05-06 17:00:34.340355+00	2025-05-06 17:00:34.340355+00	password	54f77f1f-3b24-4233-a0aa-689186e7339c
769723cd-302f-49f2-92ef-ac540d130d76	2025-05-06 17:05:04.841962+00	2025-05-06 17:05:04.841962+00	password	f4d83687-9d96-4609-ad07-5de0e9a701be
9ee03779-7afa-4dc3-99a1-096ca0239e6b	2025-05-06 17:05:12.55134+00	2025-05-06 17:05:12.55134+00	password	22111607-b205-4c72-8be0-bec61cce590d
e81dba4a-d23c-44a6-acce-7f6fba55d6d4	2025-05-06 17:06:29.205224+00	2025-05-06 17:06:29.205224+00	password	706e625e-9328-458e-b249-7f23d027942f
7e7cdb09-0eab-46da-ab86-df31104df292	2025-05-06 17:11:05.104155+00	2025-05-06 17:11:05.104155+00	password	d1047a56-e6ab-42df-90fe-2aa035f15b46
716effe4-1d4a-4df1-9080-9bdb875fb372	2025-05-06 17:17:22.904767+00	2025-05-06 17:17:22.904767+00	password	38687e39-6e80-401d-a3a4-b61c1b0d7200
740ab57e-d296-4f67-9310-528312f2c185	2025-05-06 17:21:26.477397+00	2025-05-06 17:21:26.477397+00	password	53cbffcf-db53-42c6-908d-6e8a85b57a67
696951c5-d7a8-4c41-b3ea-245c06746fb3	2025-05-06 17:22:01.71718+00	2025-05-06 17:22:01.71718+00	password	d8a8edbd-af60-49a4-b843-1d66b57e8629
00795e37-8d91-41cd-b997-9f8cd6d962c6	2025-05-06 17:41:55.736374+00	2025-05-06 17:41:55.736374+00	password	a8bed584-b166-49a5-b994-00e178982c64
237e922f-8e52-4f97-b89c-6e18201f3d42	2025-05-06 17:44:29.099882+00	2025-05-06 17:44:29.099882+00	password	0138506e-6cfc-431f-80a5-34e574d6f43a
b9d665ae-f35c-4d86-a0c3-65b772e839bb	2025-05-06 17:49:17.019667+00	2025-05-06 17:49:17.019667+00	password	9f6617e1-62fe-4a1b-9b65-2772bfec6966
cf57fe91-feb4-473e-9322-240aceb685e3	2025-05-06 17:53:12.867451+00	2025-05-06 17:53:12.867451+00	password	192e984f-1f30-4946-812a-2c2c0d578851
1a2bcda6-2ac4-481c-b910-5afdeeafc4f5	2025-05-06 17:53:25.723392+00	2025-05-06 17:53:25.723392+00	password	eafec1a7-720c-4d87-8f13-35eab17a2db9
a40de704-e57c-4165-871b-89eb3901f692	2025-05-06 20:16:56.500588+00	2025-05-06 20:16:56.500588+00	password	416047ae-5b64-4f38-81ba-2c44d54fb8b5
75c71ce0-e83b-4c90-8834-82f5d9684553	2025-05-07 03:00:37.304642+00	2025-05-07 03:00:37.304642+00	password	2054d0fd-f43d-4eda-a1a8-dc62bcec539a
337e06b7-be60-4256-80b4-45624727be07	2025-05-07 06:06:13.42845+00	2025-05-07 06:06:13.42845+00	password	5ffeec01-4f23-4b60-aace-a648f806d5f7
55612b33-b2e1-41ac-b626-ebc8b26fa92d	2025-05-07 07:01:53.585642+00	2025-05-07 07:01:53.585642+00	password	f33057cd-2d26-4d6d-8954-38a4499aa6d5
6d91b0a2-8ec2-4a22-8d04-e433b32ad8a3	2025-05-07 07:14:28.179466+00	2025-05-07 07:14:28.179466+00	password	b0c0558b-d5c6-4bb6-ac80-151046d42646
185c183a-9a7c-45b9-aa44-83d98ba5a671	2025-05-07 12:28:00.494936+00	2025-05-07 12:28:00.494936+00	password	e51d4a51-28d1-49c6-a539-0ac5d7c9245d
520d8a6e-6afe-41f8-b564-a95c8113bbd3	2025-05-08 01:17:25.194262+00	2025-05-08 01:17:25.194262+00	password	9ebdc78b-9a09-49aa-9c76-98c906da8356
1b733ca5-52e5-4098-bc8e-f6a452d070d9	2025-05-08 01:59:41.07993+00	2025-05-08 01:59:41.07993+00	password	585603b6-c11f-4971-a2e8-d642238261e9
e1210389-0e17-451d-854a-abed500d14a6	2025-05-08 03:22:36.593382+00	2025-05-08 03:22:36.593382+00	password	225ccbb1-48ee-44b6-b4c9-da73255583d6
d73284d1-9c29-4312-8096-840f56fdfa2a	2025-05-08 03:26:48.581967+00	2025-05-08 03:26:48.581967+00	password	34d85acf-b9d1-4cb9-b46a-29a3caf8ff8f
6e8d8eca-f563-439f-8759-3c465e933b91	2025-05-08 05:27:31.833643+00	2025-05-08 05:27:31.833643+00	password	5b7ace5e-aa68-435d-8770-05de5db1613b
96d9caff-6c26-4d21-8f8c-122bb215cc54	2025-05-12 17:06:09.498075+00	2025-05-12 17:06:09.498075+00	password	0e0861a3-0805-473f-bd22-05533ef68286
2907ad92-b350-4aa8-846a-99b40ff82a6f	2025-05-12 17:25:46.169206+00	2025-05-12 17:25:46.169206+00	password	05a554bc-bd66-4ab0-a37d-00317b238721
c78a19af-3057-4063-96da-416640ab757a	2025-05-12 20:43:07.544925+00	2025-05-12 20:43:07.544925+00	password	19af4908-0a57-45d5-beba-78a81220479d
de54dc48-a196-4026-baf0-7dbbdfa594dc	2025-05-12 20:44:59.985843+00	2025-05-12 20:44:59.985843+00	password	66438f22-0484-4d64-a362-bd4d7452728b
099de9dd-a107-4160-9db5-81a825f05336	2025-05-12 20:48:00.818809+00	2025-05-12 20:48:00.818809+00	password	d5303af7-5311-488c-9009-8308c6b324a1
38a7a3ca-25ad-46d3-8231-892b41de9b01	2025-05-16 02:57:36.433617+00	2025-05-16 02:57:36.433617+00	password	5841fec1-8895-424c-92ee-4413476c04b2
643964fb-d4ad-414a-af90-af3f228d2f08	2025-05-27 02:17:09.536018+00	2025-05-27 02:17:09.536018+00	password	a9e3f505-3249-48c1-8543-fc4bfb4646b3
d7d8e05e-505b-4a4f-8d71-66fe5e90ad4c	2025-06-09 17:07:50.359419+00	2025-06-09 17:07:50.359419+00	password	a130a661-ea03-427d-9b3d-e8bfd324141c
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	1	jkp2nhqttxj4	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-06 16:50:02.660523+00	2025-05-06 16:50:02.660523+00	\N	0de2f864-9318-48c7-8962-00aaef5970ac
00000000-0000-0000-0000-000000000000	2	yabjt3yfjl7c	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-06 16:50:27.634866+00	2025-05-06 16:50:27.634866+00	\N	71961102-7bbf-4d73-bffa-0ab637b00440
00000000-0000-0000-0000-000000000000	3	g45pa2f3sljy	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-06 16:51:29.502167+00	2025-05-06 16:51:29.502167+00	\N	f3425d3d-5d47-4a22-9eb8-8a3334e4a600
00000000-0000-0000-0000-000000000000	4	3jex3iftix34	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-06 16:52:54.030347+00	2025-05-06 16:52:54.030347+00	\N	a236da4c-e81e-4f1c-a35b-2800620fd596
00000000-0000-0000-0000-000000000000	5	6qkv55dqjvav	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-06 16:57:24.143484+00	2025-05-06 16:57:24.143484+00	\N	7411b11e-c856-44e2-8e04-8368308d19e2
00000000-0000-0000-0000-000000000000	6	25vh5ik5jxy2	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-06 17:00:34.338287+00	2025-05-06 17:00:34.338287+00	\N	81e4c006-79e0-4c29-805b-1ce3ddfd4867
00000000-0000-0000-0000-000000000000	7	ob7b3jugkuzo	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-06 17:05:04.839152+00	2025-05-06 17:05:04.839152+00	\N	769723cd-302f-49f2-92ef-ac540d130d76
00000000-0000-0000-0000-000000000000	8	4nxqkchwrifs	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-06 17:05:12.550102+00	2025-05-06 17:05:12.550102+00	\N	9ee03779-7afa-4dc3-99a1-096ca0239e6b
00000000-0000-0000-0000-000000000000	9	izeg4jqtesth	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-06 17:06:29.202186+00	2025-05-06 17:06:29.202186+00	\N	e81dba4a-d23c-44a6-acce-7f6fba55d6d4
00000000-0000-0000-0000-000000000000	10	shezbt2eh32g	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-06 17:11:05.100572+00	2025-05-06 17:11:05.100572+00	\N	7e7cdb09-0eab-46da-ab86-df31104df292
00000000-0000-0000-0000-000000000000	11	oeft6zcq5pra	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-06 17:17:22.901336+00	2025-05-06 17:17:22.901336+00	\N	716effe4-1d4a-4df1-9080-9bdb875fb372
00000000-0000-0000-0000-000000000000	12	mzdmopzqs5wl	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-06 17:21:26.475317+00	2025-05-06 17:21:26.475317+00	\N	740ab57e-d296-4f67-9310-528312f2c185
00000000-0000-0000-0000-000000000000	13	qfgewl6medd2	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-06 17:22:01.714827+00	2025-05-06 17:22:01.714827+00	\N	696951c5-d7a8-4c41-b3ea-245c06746fb3
00000000-0000-0000-0000-000000000000	14	fvvgroo2wa4d	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-06 17:41:55.734239+00	2025-05-06 17:41:55.734239+00	\N	00795e37-8d91-41cd-b997-9f8cd6d962c6
00000000-0000-0000-0000-000000000000	15	a2nedqgqbd55	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-06 17:44:29.096251+00	2025-05-06 17:44:29.096251+00	\N	237e922f-8e52-4f97-b89c-6e18201f3d42
00000000-0000-0000-0000-000000000000	16	sco5fgo25ggt	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-06 17:49:17.017277+00	2025-05-06 17:49:17.017277+00	\N	b9d665ae-f35c-4d86-a0c3-65b772e839bb
00000000-0000-0000-0000-000000000000	17	cant7s3tlzpi	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-06 17:53:12.86401+00	2025-05-06 17:53:12.86401+00	\N	cf57fe91-feb4-473e-9322-240aceb685e3
00000000-0000-0000-0000-000000000000	18	we2i2rid7ofy	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-06 17:53:25.722101+00	2025-05-06 17:53:25.722101+00	\N	1a2bcda6-2ac4-481c-b910-5afdeeafc4f5
00000000-0000-0000-0000-000000000000	20	gszm5drfntul	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-07 03:00:37.296022+00	2025-05-07 04:49:08.099415+00	\N	75c71ce0-e83b-4c90-8834-82f5d9684553
00000000-0000-0000-0000-000000000000	19	6clrqlehmyca	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-06 20:16:56.495839+00	2025-05-07 06:56:00.855319+00	\N	a40de704-e57c-4165-871b-89eb3901f692
00000000-0000-0000-0000-000000000000	23	e3kodeczuplx	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-07 06:56:00.8703+00	2025-05-07 06:56:00.8703+00	6clrqlehmyca	a40de704-e57c-4165-871b-89eb3901f692
00000000-0000-0000-0000-000000000000	24	vjkmg3kf7xcg	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-07 07:01:53.581252+00	2025-05-07 07:01:53.581252+00	\N	55612b33-b2e1-41ac-b626-ebc8b26fa92d
00000000-0000-0000-0000-000000000000	22	cbmzhjfodkv6	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-07 06:06:13.389073+00	2025-05-07 07:04:40.553061+00	\N	337e06b7-be60-4256-80b4-45624727be07
00000000-0000-0000-0000-000000000000	25	ubjznefvxmsc	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-07 07:04:40.555532+00	2025-05-07 08:03:10.806598+00	cbmzhjfodkv6	337e06b7-be60-4256-80b4-45624727be07
00000000-0000-0000-0000-000000000000	27	aixygyfnpgxq	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-07 08:03:10.808776+00	2025-05-07 09:01:11.821356+00	ubjznefvxmsc	337e06b7-be60-4256-80b4-45624727be07
00000000-0000-0000-0000-000000000000	28	sakrk7pg74h7	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-07 09:01:11.823157+00	2025-05-07 09:59:12.459554+00	aixygyfnpgxq	337e06b7-be60-4256-80b4-45624727be07
00000000-0000-0000-0000-000000000000	26	wj3sgm3gmo45	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-07 07:14:28.175374+00	2025-05-07 10:14:00.490471+00	\N	6d91b0a2-8ec2-4a22-8d04-e433b32ad8a3
00000000-0000-0000-0000-000000000000	29	jiagwsbgk6rp	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-07 09:59:12.4616+00	2025-05-07 10:57:12.896546+00	sakrk7pg74h7	337e06b7-be60-4256-80b4-45624727be07
00000000-0000-0000-0000-000000000000	30	lnsesnsotmim	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-07 10:14:00.492212+00	2025-05-07 11:12:27.951657+00	wj3sgm3gmo45	6d91b0a2-8ec2-4a22-8d04-e433b32ad8a3
00000000-0000-0000-0000-000000000000	31	dzgddmw3nhha	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-07 10:57:12.899473+00	2025-05-07 11:55:14.268591+00	jiagwsbgk6rp	337e06b7-be60-4256-80b4-45624727be07
00000000-0000-0000-0000-000000000000	33	3lmzg6c7dsxb	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-07 11:55:14.269217+00	2025-05-07 11:55:14.269217+00	dzgddmw3nhha	337e06b7-be60-4256-80b4-45624727be07
00000000-0000-0000-0000-000000000000	34	oijut6x4bi5l	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-07 12:28:00.490322+00	2025-05-07 12:28:00.490322+00	\N	185c183a-9a7c-45b9-aa44-83d98ba5a671
00000000-0000-0000-0000-000000000000	32	5py6bwj7divh	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-07 11:12:27.953545+00	2025-05-08 01:17:08.851926+00	lnsesnsotmim	6d91b0a2-8ec2-4a22-8d04-e433b32ad8a3
00000000-0000-0000-0000-000000000000	35	jgv7hyyctqpf	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-08 01:17:25.189672+00	2025-05-08 02:15:32.96948+00	\N	520d8a6e-6afe-41f8-b564-a95c8113bbd3
00000000-0000-0000-0000-000000000000	36	o7psvwm7i3fr	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-08 01:59:41.072345+00	2025-05-08 02:58:03.494555+00	\N	1b733ca5-52e5-4098-bc8e-f6a452d070d9
00000000-0000-0000-0000-000000000000	38	eyuqj7xpc2jq	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-08 02:58:03.496552+00	2025-05-08 02:58:03.496552+00	o7psvwm7i3fr	1b733ca5-52e5-4098-bc8e-f6a452d070d9
00000000-0000-0000-0000-000000000000	37	oevttaiyy6ou	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-08 02:15:32.972772+00	2025-05-08 03:13:35.953933+00	jgv7hyyctqpf	520d8a6e-6afe-41f8-b564-a95c8113bbd3
00000000-0000-0000-0000-000000000000	39	boh4bbqm7fjn	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-08 03:13:35.954699+00	2025-05-08 03:22:04.560775+00	oevttaiyy6ou	520d8a6e-6afe-41f8-b564-a95c8113bbd3
00000000-0000-0000-0000-000000000000	40	gitck6quyjbb	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-08 03:22:36.588609+00	2025-05-08 03:22:36.588609+00	\N	e1210389-0e17-451d-854a-abed500d14a6
00000000-0000-0000-0000-000000000000	41	asbkmqkk7zlm	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-08 03:26:48.579856+00	2025-05-08 04:25:17.660124+00	\N	d73284d1-9c29-4312-8096-840f56fdfa2a
00000000-0000-0000-0000-000000000000	42	emgkmbz7hq5x	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-08 04:25:17.677616+00	2025-05-08 05:23:17.94903+00	asbkmqkk7zlm	d73284d1-9c29-4312-8096-840f56fdfa2a
00000000-0000-0000-0000-000000000000	43	s4ix6pmq2m2x	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-08 05:23:17.95318+00	2025-05-08 05:27:04.890911+00	emgkmbz7hq5x	d73284d1-9c29-4312-8096-840f56fdfa2a
00000000-0000-0000-0000-000000000000	44	doy7z5h4e5xl	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-08 05:27:31.831503+00	2025-05-08 06:25:49.419473+00	\N	6e8d8eca-f563-439f-8759-3c465e933b91
00000000-0000-0000-0000-000000000000	45	b2gtyh4ttped	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-08 06:25:49.424375+00	2025-05-08 10:28:21.391968+00	doy7z5h4e5xl	6e8d8eca-f563-439f-8759-3c465e933b91
00000000-0000-0000-0000-000000000000	46	5uxlpty6fpdm	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-08 10:28:21.400794+00	2025-05-12 17:05:59.798305+00	b2gtyh4ttped	6e8d8eca-f563-439f-8759-3c465e933b91
00000000-0000-0000-0000-000000000000	47	vdsiejgv42zo	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-12 17:06:09.494694+00	2025-05-12 17:06:09.494694+00	\N	96d9caff-6c26-4d21-8f8c-122bb215cc54
00000000-0000-0000-0000-000000000000	48	5bpqntchvfsb	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-12 17:25:46.163584+00	2025-05-12 18:24:05.104355+00	\N	2907ad92-b350-4aa8-846a-99b40ff82a6f
00000000-0000-0000-0000-000000000000	49	vybkr3ihdu64	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-12 18:24:05.107936+00	2025-05-12 19:22:04.57663+00	5bpqntchvfsb	2907ad92-b350-4aa8-846a-99b40ff82a6f
00000000-0000-0000-0000-000000000000	50	ooaiecwih5fr	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-12 19:22:04.579734+00	2025-05-12 20:20:06.030554+00	vybkr3ihdu64	2907ad92-b350-4aa8-846a-99b40ff82a6f
00000000-0000-0000-0000-000000000000	51	jwa3odvzepmn	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-12 20:20:06.034558+00	2025-05-12 20:20:06.034558+00	ooaiecwih5fr	2907ad92-b350-4aa8-846a-99b40ff82a6f
00000000-0000-0000-0000-000000000000	52	r67jmy6iowx4	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-12 20:43:07.538557+00	2025-05-12 20:43:07.538557+00	\N	c78a19af-3057-4063-96da-416640ab757a
00000000-0000-0000-0000-000000000000	21	25uw5zxrcbqu	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-07 04:49:08.10578+00	2025-05-16 01:35:07.232752+00	gszm5drfntul	75c71ce0-e83b-4c90-8834-82f5d9684553
00000000-0000-0000-0000-000000000000	53	kjbrmr6vrr6j	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-12 20:44:59.973643+00	2025-05-12 20:44:59.973643+00	\N	de54dc48-a196-4026-baf0-7dbbdfa594dc
00000000-0000-0000-0000-000000000000	54	yg73yzdtfnic	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-12 20:48:00.817493+00	2025-05-13 01:15:01.380052+00	\N	099de9dd-a107-4160-9db5-81a825f05336
00000000-0000-0000-0000-000000000000	55	d3dfgp5s73jp	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-13 01:15:01.384061+00	2025-05-15 17:34:21.140221+00	yg73yzdtfnic	099de9dd-a107-4160-9db5-81a825f05336
00000000-0000-0000-0000-000000000000	56	xchlps74ybnw	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-15 17:34:21.147772+00	2025-05-15 18:32:22.025561+00	d3dfgp5s73jp	099de9dd-a107-4160-9db5-81a825f05336
00000000-0000-0000-0000-000000000000	57	pr3tmqfa7ym5	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-15 18:32:22.028861+00	2025-05-15 19:30:47.19078+00	xchlps74ybnw	099de9dd-a107-4160-9db5-81a825f05336
00000000-0000-0000-0000-000000000000	58	uesawefcjawx	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-15 19:30:47.194608+00	2025-05-15 20:28:48.254711+00	pr3tmqfa7ym5	099de9dd-a107-4160-9db5-81a825f05336
00000000-0000-0000-0000-000000000000	59	m6tirif3cruc	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-15 20:28:48.257984+00	2025-05-15 21:30:00.357087+00	uesawefcjawx	099de9dd-a107-4160-9db5-81a825f05336
00000000-0000-0000-0000-000000000000	60	kzly5ytbosmo	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-15 21:30:00.360642+00	2025-05-15 21:30:00.360642+00	m6tirif3cruc	099de9dd-a107-4160-9db5-81a825f05336
00000000-0000-0000-0000-000000000000	61	z6uylskux4iq	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-16 01:35:07.235906+00	2025-05-16 02:55:56.098397+00	25uw5zxrcbqu	75c71ce0-e83b-4c90-8834-82f5d9684553
00000000-0000-0000-0000-000000000000	62	n5gelqdbei2i	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-16 02:57:36.431551+00	2025-05-16 05:29:02.08775+00	\N	38a7a3ca-25ad-46d3-8231-892b41de9b01
00000000-0000-0000-0000-000000000000	63	j2hd5zntq5fx	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-16 05:29:02.092354+00	2025-05-27 02:15:28.140715+00	n5gelqdbei2i	38a7a3ca-25ad-46d3-8231-892b41de9b01
00000000-0000-0000-0000-000000000000	65	gdvxvkmfy2eo	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-27 02:17:09.532509+00	2025-05-27 03:15:16.712315+00	\N	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	66	uryt4m2qmzt3	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-27 03:15:16.712921+00	2025-05-27 04:13:17.689881+00	gdvxvkmfy2eo	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	64	iccjervuyxly	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-27 02:15:28.148792+00	2025-05-27 05:17:59.013094+00	j2hd5zntq5fx	38a7a3ca-25ad-46d3-8231-892b41de9b01
00000000-0000-0000-0000-000000000000	68	tdmgkgbtknkz	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-27 05:17:59.013746+00	2025-05-27 05:17:59.013746+00	iccjervuyxly	38a7a3ca-25ad-46d3-8231-892b41de9b01
00000000-0000-0000-0000-000000000000	67	os3lioyz65m3	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-27 04:13:17.690517+00	2025-05-27 08:33:52.318815+00	uryt4m2qmzt3	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	69	rltmersbtsto	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-27 08:33:52.319434+00	2025-05-27 09:32:19.07212+00	os3lioyz65m3	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	70	zgro6l4npimh	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-27 09:32:19.072773+00	2025-05-27 10:30:20.036328+00	rltmersbtsto	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	71	7bkkqlctxuzm	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-27 10:30:20.036954+00	2025-05-27 11:28:21.483533+00	zgro6l4npimh	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	72	nltjt537jrwg	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-27 11:28:21.488998+00	2025-05-27 12:26:22.926255+00	7bkkqlctxuzm	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	73	amg3jp2e56ut	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-27 12:26:22.930754+00	2025-05-27 13:24:22.906061+00	nltjt537jrwg	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	74	ecvt7zzuoqmw	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-27 13:24:22.908519+00	2025-05-27 14:22:23.782392+00	amg3jp2e56ut	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	75	hizkwfx3mww2	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-27 14:22:23.784188+00	2025-05-27 15:20:24.687473+00	ecvt7zzuoqmw	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	76	tv5vgcb5wufo	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-27 15:20:24.688914+00	2025-05-27 16:18:25.539421+00	hizkwfx3mww2	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	77	jbrqsicyqyip	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-27 16:18:25.540882+00	2025-05-27 17:16:26.458982+00	tv5vgcb5wufo	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	78	b57yx5p4dmud	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-27 17:16:26.461241+00	2025-05-28 00:55:16.499927+00	jbrqsicyqyip	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	79	w53wot5wnclr	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-28 00:55:16.509993+00	2025-05-28 01:53:14.027479+00	b57yx5p4dmud	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	80	vajdemhanomx	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-28 01:53:14.030189+00	2025-05-28 05:25:26.072431+00	w53wot5wnclr	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	81	gao6lnfmx5rc	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-28 05:25:26.073753+00	2025-05-28 06:23:53.718576+00	vajdemhanomx	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	82	byzcaltnyghi	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-28 06:23:53.726728+00	2025-05-28 07:21:54.279526+00	gao6lnfmx5rc	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	83	psxd5spggwj6	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-28 07:21:54.281922+00	2025-05-28 08:19:55.267597+00	byzcaltnyghi	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	84	wwhesaxs23yx	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-28 08:19:55.268898+00	2025-05-28 09:17:56.137935+00	psxd5spggwj6	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	85	i7wvaiwr6xdy	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-28 09:17:56.140025+00	2025-05-28 10:15:57.7121+00	wwhesaxs23yx	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	86	2zv5a2owrb3r	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-28 10:15:57.715334+00	2025-05-28 11:13:58.106737+00	i7wvaiwr6xdy	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	87	3ofy5227rlye	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-28 11:13:58.110213+00	2025-05-28 12:11:58.957096+00	2zv5a2owrb3r	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	88	mwgk7umchbgc	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-28 12:11:58.96044+00	2025-05-28 13:09:59.885191+00	3ofy5227rlye	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	89	f4k4haiwd3ho	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-28 13:09:59.887581+00	2025-05-28 14:08:00.851133+00	mwgk7umchbgc	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	90	3kdvis4gfrmv	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-28 14:08:00.853511+00	2025-05-28 15:06:02.481122+00	f4k4haiwd3ho	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	91	3hba3gnv4ewe	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-28 15:06:02.483349+00	2025-05-28 16:04:19.502906+00	3kdvis4gfrmv	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	92	opngo2xpense	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-28 16:04:19.505157+00	2025-05-29 01:33:07.072187+00	3hba3gnv4ewe	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	93	fhkp5yqfxyan	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-29 01:33:07.078039+00	2025-05-29 02:31:34.916705+00	opngo2xpense	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	94	klbr4yqnxikk	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-29 02:31:34.92179+00	2025-05-29 03:29:35.752891+00	fhkp5yqfxyan	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	95	hysntkdfexlh	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-29 03:29:35.75956+00	2025-05-29 04:27:36.334858+00	klbr4yqnxikk	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	96	cdgpkvcj6zmd	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-29 04:27:36.339151+00	2025-05-29 05:25:37.250707+00	hysntkdfexlh	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	97	z5u7qhna7cdr	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-29 05:25:37.254112+00	2025-05-29 06:23:38.629363+00	cdgpkvcj6zmd	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	98	y7tuifetan3k	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-05-29 06:23:38.63674+00	2025-05-29 09:25:31.644583+00	z5u7qhna7cdr	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	99	qdbdbdmtzwsz	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-05-29 09:25:31.647635+00	2025-05-29 09:25:31.647635+00	y7tuifetan3k	643964fb-d4ad-414a-af90-af3f228d2f08
00000000-0000-0000-0000-000000000000	100	hyotykpxjd6o	7f1900fb-7b11-416c-8d85-f8a488ef7f63	t	2025-06-09 17:07:50.349784+00	2025-06-09 18:06:06.240904+00	\N	d7d8e05e-505b-4a4f-8d71-66fe5e90ad4c
00000000-0000-0000-0000-000000000000	101	e6peccuhr5rm	7f1900fb-7b11-416c-8d85-f8a488ef7f63	f	2025-06-09 18:06:06.243724+00	2025-06-09 18:06:06.243724+00	hyotykpxjd6o	d7d8e05e-505b-4a4f-8d71-66fe5e90ad4c
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
0de2f864-9318-48c7-8962-00aaef5970ac	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 16:50:02.649766+00	2025-05-06 16:50:02.649766+00	\N	aal1	\N	\N	node	136.158.58.185	\N
71961102-7bbf-4d73-bffa-0ab637b00440	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 16:50:27.63409+00	2025-05-06 16:50:27.63409+00	\N	aal1	\N	\N	node	136.158.58.185	\N
f3425d3d-5d47-4a22-9eb8-8a3334e4a600	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 16:51:29.500108+00	2025-05-06 16:51:29.500108+00	\N	aal1	\N	\N	node	136.158.58.185	\N
a236da4c-e81e-4f1c-a35b-2800620fd596	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 16:52:54.028893+00	2025-05-06 16:52:54.028893+00	\N	aal1	\N	\N	node	136.158.58.185	\N
7411b11e-c856-44e2-8e04-8368308d19e2	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 16:57:24.141601+00	2025-05-06 16:57:24.141601+00	\N	aal1	\N	\N	node	136.158.58.185	\N
81e4c006-79e0-4c29-805b-1ce3ddfd4867	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 17:00:34.337162+00	2025-05-06 17:00:34.337162+00	\N	aal1	\N	\N	node	136.158.58.185	\N
769723cd-302f-49f2-92ef-ac540d130d76	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 17:05:04.837513+00	2025-05-06 17:05:04.837513+00	\N	aal1	\N	\N	node	136.158.58.185	\N
9ee03779-7afa-4dc3-99a1-096ca0239e6b	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 17:05:12.549286+00	2025-05-06 17:05:12.549286+00	\N	aal1	\N	\N	node	136.158.58.185	\N
e81dba4a-d23c-44a6-acce-7f6fba55d6d4	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 17:06:29.201164+00	2025-05-06 17:06:29.201164+00	\N	aal1	\N	\N	node	136.158.58.185	\N
7e7cdb09-0eab-46da-ab86-df31104df292	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 17:11:05.098531+00	2025-05-06 17:11:05.098531+00	\N	aal1	\N	\N	node	136.158.58.185	\N
716effe4-1d4a-4df1-9080-9bdb875fb372	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 17:17:22.89786+00	2025-05-06 17:17:22.89786+00	\N	aal1	\N	\N	node	136.158.58.185	\N
740ab57e-d296-4f67-9310-528312f2c185	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 17:21:26.474171+00	2025-05-06 17:21:26.474171+00	\N	aal1	\N	\N	node	136.158.58.185	\N
696951c5-d7a8-4c41-b3ea-245c06746fb3	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 17:22:01.712655+00	2025-05-06 17:22:01.712655+00	\N	aal1	\N	\N	node	136.158.58.185	\N
00795e37-8d91-41cd-b997-9f8cd6d962c6	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 17:41:55.733049+00	2025-05-06 17:41:55.733049+00	\N	aal1	\N	\N	node	136.158.58.185	\N
237e922f-8e52-4f97-b89c-6e18201f3d42	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 17:44:29.093869+00	2025-05-06 17:44:29.093869+00	\N	aal1	\N	\N	node	136.158.58.185	\N
b9d665ae-f35c-4d86-a0c3-65b772e839bb	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 17:49:17.014671+00	2025-05-06 17:49:17.014671+00	\N	aal1	\N	\N	node	136.158.58.185	\N
cf57fe91-feb4-473e-9322-240aceb685e3	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 17:53:12.862301+00	2025-05-06 17:53:12.862301+00	\N	aal1	\N	\N	node	136.158.58.185	\N
1a2bcda6-2ac4-481c-b910-5afdeeafc4f5	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 17:53:25.721328+00	2025-05-06 17:53:25.721328+00	\N	aal1	\N	\N	node	136.158.58.185	\N
a40de704-e57c-4165-871b-89eb3901f692	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-06 20:16:56.492135+00	2025-05-07 06:56:00.875099+00	\N	aal1	\N	2025-05-07 06:56:00.875018	node	136.158.58.185	\N
55612b33-b2e1-41ac-b626-ebc8b26fa92d	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-07 07:01:53.578218+00	2025-05-07 07:01:53.578218+00	\N	aal1	\N	\N	node	136.158.58.185	\N
6d91b0a2-8ec2-4a22-8d04-e433b32ad8a3	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-07 07:14:28.173221+00	2025-05-07 11:12:27.957654+00	\N	aal1	\N	2025-05-07 11:12:27.957542	node	136.158.58.185	\N
337e06b7-be60-4256-80b4-45624727be07	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-07 06:06:13.368177+00	2025-05-07 11:55:14.272074+00	\N	aal1	\N	2025-05-07 11:55:14.272004	node	112.198.255.73	\N
185c183a-9a7c-45b9-aa44-83d98ba5a671	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-07 12:28:00.484893+00	2025-05-07 12:28:00.484893+00	\N	aal1	\N	\N	node	112.198.255.73	\N
1b733ca5-52e5-4098-bc8e-f6a452d070d9	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-08 01:59:41.069211+00	2025-05-08 03:03:14.137065+00	\N	aal1	\N	2025-05-08 03:03:14.136981	node	152.32.104.57	\N
520d8a6e-6afe-41f8-b564-a95c8113bbd3	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-08 01:17:25.180051+00	2025-05-08 03:13:35.957904+00	\N	aal1	\N	2025-05-08 03:13:35.957826	node	136.158.58.185	\N
e1210389-0e17-451d-854a-abed500d14a6	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-08 03:22:36.582857+00	2025-05-08 03:22:36.582857+00	\N	aal1	\N	\N	node	136.158.58.185	\N
d73284d1-9c29-4312-8096-840f56fdfa2a	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-08 03:26:48.578751+00	2025-05-08 05:23:17.957548+00	\N	aal1	\N	2025-05-08 05:23:17.957476	node	136.158.58.185	\N
6e8d8eca-f563-439f-8759-3c465e933b91	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-08 05:27:31.82828+00	2025-05-08 10:28:21.40901+00	\N	aal1	\N	2025-05-08 10:28:21.408912	node	136.158.58.185	\N
96d9caff-6c26-4d21-8f8c-122bb215cc54	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-12 17:06:09.489149+00	2025-05-12 17:06:09.489149+00	\N	aal1	\N	\N	node	136.158.58.185	\N
2907ad92-b350-4aa8-846a-99b40ff82a6f	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-12 17:25:46.160648+00	2025-05-12 20:20:06.037764+00	\N	aal1	\N	2025-05-12 20:20:06.03769	node	136.158.58.185	\N
c78a19af-3057-4063-96da-416640ab757a	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-12 20:43:07.53391+00	2025-05-12 20:43:07.53391+00	\N	aal1	\N	\N	node	136.158.58.185	\N
de54dc48-a196-4026-baf0-7dbbdfa594dc	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-12 20:44:59.970213+00	2025-05-12 20:44:59.970213+00	\N	aal1	\N	\N	node	136.158.58.185	\N
099de9dd-a107-4160-9db5-81a825f05336	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-12 20:48:00.816758+00	2025-05-15 21:30:00.364395+00	\N	aal1	\N	2025-05-15 21:30:00.364322	node	136.158.58.185	\N
75c71ce0-e83b-4c90-8834-82f5d9684553	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-07 03:00:37.293934+00	2025-05-16 01:35:07.240082+00	\N	aal1	\N	2025-05-16 01:35:07.240004	node	152.32.104.57	\N
38a7a3ca-25ad-46d3-8231-892b41de9b01	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-16 02:57:36.423239+00	2025-05-27 05:17:59.016185+00	\N	aal1	\N	2025-05-27 05:17:59.016115	node	136.158.58.185	\N
643964fb-d4ad-414a-af90-af3f228d2f08	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-05-27 02:17:09.531284+00	2025-05-29 09:25:31.650768+00	\N	aal1	\N	2025-05-29 09:25:31.650672	node	136.158.58.185	\N
d7d8e05e-505b-4a4f-8d71-66fe5e90ad4c	7f1900fb-7b11-416c-8d85-f8a488ef7f63	2025-06-09 17:07:50.343415+00	2025-06-10 04:05:44.063697+00	\N	aal1	\N	2025-06-10 04:05:44.063619	node	136.158.58.185	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	7f1900fb-7b11-416c-8d85-f8a488ef7f63	authenticated	authenticated	eroadmin@gmail.com	$2a$10$EYMNNp7wi1Z8hZhlcwkpTezviBcMMOsZWOY0Eqed/QwEm1HF4k41C	2025-05-06 16:09:08.815406+00	\N		\N		\N			\N	2025-06-09 17:07:50.342682+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-05-06 16:09:08.742936+00	2025-06-09 18:06:06.245456+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--

COPY pgsodium.key (id, status, created, expires, key_type, key_id, key_context, name, associated_data, raw_key, raw_key_nonce, parent_key, comment, user_data) FROM stdin;
\.


--
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Address" (address, region, country, "addressID") FROM stdin;
E. Hermosa	Metro Manila	USA	cf172946-d26a-4b7b-b166-9166551196d1
E. Hermosa	Metro Manila	UK	68e4ffba-18d9-42b1-b081-f9b87129e808
dd	dd	India	a342a7a3-3cf2-45d9-9ea2-3d0704678a05
1555 p santos st	NCR	USA	de38f24a-03bb-49dc-ba67-807cdecbbb0a
1555 p santos st	NCR	USA	d863969f-7998-4b16-8fef-93829e39aa8c
dd	dd	UK	696361e5-9934-4b15-8660-c34c33d0f109
asdasd	manila	India	828e02f1-1fce-4827-8ca2-218b222b5347
asdasd	manila	India	2bd0eac7-0840-407b-bb4d-294c3d4c46aa
1555 p santos st	NCR	USA	84a026fa-25d5-4454-80ac-33e72df765f3
1555 p santos st	NCR	India	d61ff75b-fab0-41c5-89c1-7d91c3550330
ADSA	ASDAS	India	392bfbad-fffd-481f-ae5c-c2ecbf21a4b4
asdlkasjdasl	asdkjasjdalkj	USA	940dee18-8e6f-4521-8731-393be9360d3a
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (category_name, "categoryID") FROM stdin;
Best Coach	43fdf718-8ed7-4a63-bb27-1650c590f571
Best Player	aeead4a9-54bd-4ea9-9e37-0c56f15c6daf
Best Player	8d045b68-4483-439a-a45f-c8af4da9a31f
Best Player	520e472c-8677-47aa-9011-ab60c718f219
Best Player	6e7b5fcb-f4a0-456d-8a20-eeb2fdd1d7f7
Best Team	e64337f1-bf5d-4bed-ba06-5de85a8a334f
Best Team	cf85f667-bb4d-4927-b41a-9d1d23788b9e
Best Team	b05dc1db-b6f4-42ee-9ef3-2017fc2cc05e
Best Team	9dafa164-1c78-45f3-9e5f-4c9762003944
Best Player	42be7aa8-463e-4fe1-93fe-d180ab58d8ec
Best Coach	d08e71ee-3902-4df3-9763-3a006b6a9ea6
Best Player	b1ae9b38-a05f-48a2-83db-0f9c2b0fc7e9
\.


--
-- Data for Name: Designation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Designation" (role_name, "designationID") FROM stdin;
Manager	bc7c7c09-5d5a-437a-a0fb-b9586d7c0c15
Player	682a1161-4e9e-4e0d-b87f-e088c7c4226f
Player	f515276f-fc61-4a98-bc05-c1ef51d21fd6
Coach	3231fb59-bb01-476e-b467-de4958cf805a
Coach	fd2ff9b3-3d53-4499-9b01-0b8da8bedcc3
Player	065088ee-22d1-40c3-b504-51613db7a859
Manager	3d6e117d-a66f-45b1-93de-c3f245090c74
Manager	18f70b06-b0c3-4a45-a033-746be306a377
Player	79e0d3ef-a1bb-4d4d-88da-62b19b427bcb
Player	7ac39aa4-f333-42e8-b8be-31bbafca566a
Player	a14e941a-877a-4292-ad11-224fb4ce32a7
Player	2f59a541-f924-4f37-8b64-fe0dbe6a0e65
\.


--
-- Data for Name: Person; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Person" (created_at, firstname, surname, contact_number, if_shortlisted, social, email, id, "designationID", "categoryID", "qnaID", "addressID", "schoolID") FROM stdin;
2025-04-30 09:55:30.992082+00	kai	Bartolome	09388596440	f	Facebook, na	kaibartolome17@gmail.com	35704746-6746-4bb2-aa2f-b0b13153d95d	bc7c7c09-5d5a-437a-a0fb-b9586d7c0c15	43fdf718-8ed7-4a63-bb27-1650c590f571	acde566e-86f6-463b-a3af-fe36d1d97ba4	cf172946-d26a-4b7b-b166-9166551196d1	e493b32f-a844-4f8c-ba1f-b412bdb653f6
2025-04-30 10:38:48.255556+00	Jonas Kaile	Bartolome	12345678910	t	Facebook	jbartolome.k11935485@umak.edu.ph	6c420053-daa3-4772-be42-22f5e36943d0	682a1161-4e9e-4e0d-b87f-e088c7c4226f	aeead4a9-54bd-4ea9-9e37-0c56f15c6daf	0946c278-5947-4995-ae87-3b76484a2001	68e4ffba-18d9-42b1-b081-f9b87129e808	a8a613fd-4613-406a-93cf-aeea4716d2de
2025-05-07 04:12:22.34615+00	jonas	amp	12345678901	t	Facebook	kai8bartolome@gmail.com	dbebf5e9-0442-4c03-8f3e-2a5f1da6048c	f515276f-fc61-4a98-bc05-c1ef51d21fd6	8d045b68-4483-439a-a45f-c8af4da9a31f	dc0443d1-7e63-4c7e-a3f9-224d0a942b6b	a342a7a3-3cf2-45d9-9ea2-3d0704678a05	51459b75-df15-4ec9-a50b-d8295743f201
2025-05-07 04:19:32.220097+00	klods	gayapa	09364122955	t	Facebook	klodynj@gmail.com	e85d6199-6cb3-482f-8de5-80ad8ef94fe5	3231fb59-bb01-476e-b467-de4958cf805a	520e472c-8677-47aa-9011-ab60c718f219	25523e94-0be1-484d-951c-f5133a3438a3	de38f24a-03bb-49dc-ba67-807cdecbbb0a	2fc5ee8a-99c5-45f8-b47d-eb4699b96b52
2025-05-07 04:57:04.159017+00	erovoutika	corp	12345678	t	Instagram	klodynj@gmail.com	0cdfeb0b-32b4-4854-8955-cf6302abd63f	fd2ff9b3-3d53-4499-9b01-0b8da8bedcc3	6e7b5fcb-f4a0-456d-8a20-eeb2fdd1d7f7	1ddd232f-a516-43d8-ba9d-32dc95f27da3	d863969f-7998-4b16-8fef-93829e39aa8c	3174409e-72c7-410e-a802-8ee1f89b7bb3
2025-05-07 05:52:12.694365+00	jonas	later	12345678901	t	Facebook	kai8bartolome@gmail.com	b32e9ca3-3011-4924-9175-516c7fba0936	065088ee-22d1-40c3-b504-51613db7a859	e64337f1-bf5d-4bed-ba06-5de85a8a334f	7f2b40cb-ae40-4da4-bb3f-a50dc78baa39	696361e5-9934-4b15-8660-c34c33d0f109	a6c8ffbd-80bb-4a6f-ae95-83e8ff5740a3
2025-05-07 07:20:00.202722+00	Arnold	qwoeiuwqeoqw	0923123	t	Facebook	ASRAR@gmail.com	611efd6f-f054-4223-a6ba-7e828d1d8a40	18f70b06-b0c3-4a45-a033-746be306a377	b05dc1db-b6f4-42ee-9ef3-2017fc2cc05e	b5e42a48-8a34-4276-b7f9-b6d53fb3965b	2bd0eac7-0840-407b-bb4d-294c3d4c46aa	7ae4f3d6-fded-4cd3-9b93-02ceda006b4f
2025-05-08 02:00:50.971244+00	klodyn	Gayapa	09364122955	t	Instagram	klodynj@gmail.com	9ed1c553-fcae-4381-8fe3-c536329f4f1e	79e0d3ef-a1bb-4d4d-88da-62b19b427bcb	9dafa164-1c78-45f3-9e5f-4c9762003944	70467962-9659-4cfd-b51d-262aba59b565	84a026fa-25d5-4454-80ac-33e72df765f3	b0e0cd0e-7ffa-44d2-ab97-e755cb2203c7
2025-05-08 02:59:59.003239+00	klodyn	Gayapa	09364122955	f	Facebook	klodynj@gmail.com	c87e0a16-4fdd-448c-8097-e658d415c82f	7ac39aa4-f333-42e8-b8be-31bbafca566a	42be7aa8-463e-4fe1-93fe-d180ab58d8ec	d5317326-dcc0-419c-9fcc-ffd680a558db	d61ff75b-fab0-41c5-89c1-7d91c3550330	10b751eb-8f68-4211-960c-58d4a3a3a4cc
2025-05-08 05:50:15.854986+00	kai	asdsad	213123213	t	Facebook, AS	test@gmail.com	98c587e4-b8ee-4498-a289-8baa628f2628	a14e941a-877a-4292-ad11-224fb4ce32a7	d08e71ee-3902-4df3-9763-3a006b6a9ea6	ca3feabd-2284-479f-89bc-dd9165dfcae6	392bfbad-fffd-481f-ae5c-c2ecbf21a4b4	44559ff4-b0b2-4b1a-9fa5-7d1b08268b68
2025-05-16 05:38:51.852143+00	James	Melchor	09999999999	t	Facebook	jamesmelchor@gmail.com	f2971376-bff8-4c7d-8d1b-2c3d7685b696	2f59a541-f924-4f37-8b64-fe0dbe6a0e65	b1ae9b38-a05f-48a2-83db-0f9c2b0fc7e9	d2ff912f-f6c3-426e-9cb0-12b657831825	940dee18-8e6f-4521-8731-393be9360d3a	a2e3efd0-0aa2-41aa-b321-e4f62e9b4ade
\.


--
-- Data for Name: QNA; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."QNA" (qna_1, qna_2, qna_3, "qnaID") FROM stdin;
me me	meme	mememe	acde566e-86f6-463b-a3af-fe36d1d97ba4
my award	winning	tldr	0946c278-5947-4995-ae87-3b76484a2001
ddddd	dddd	meme	dc0443d1-7e63-4c7e-a3f9-224d0a942b6b
hello it is me	great	none	25523e94-0be1-484d-951c-f5133a3438a3
hello	good	wala po	1ddd232f-a516-43d8-ba9d-32dc95f27da3
ddddd	dddd	meme	7f2b40cb-ae40-4da4-bb3f-a50dc78baa39
SADSA	ASDSADasdsa	asdsad	229b15d7-d143-4277-a56b-a2cb55e47125
SADSA	ASDSADasdsa	asdsad	b5e42a48-8a34-4276-b7f9-b6d53fb3965b
hello	good	wala po	70467962-9659-4cfd-b51d-262aba59b565
hello	good	wala po	d5317326-dcc0-419c-9fcc-ffd680a558db
ASDASD	ASDSA	DASDSAASD	ca3feabd-2284-479f-89bc-dd9165dfcae6
asdksakdasjdlk	asdlksajdlkasjdlks	Dancer Champion	d2ff912f-f6c3-426e-9cb0-12b657831825
\.


--
-- Data for Name: School; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."School" (school_name, school_weblink, "schoolID") FROM stdin;
University of Makati	https://umak.edu.ph	e493b32f-a844-4f8c-ba1f-b412bdb653f6
University of Makati	https://umak.edu.ph	a8a613fd-4613-406a-93cf-aeea4716d2de
umak	https://umak.edu.ph	51459b75-df15-4ec9-a50b-d8295743f201
umak	https://umak.edu.ph	2fc5ee8a-99c5-45f8-b47d-eb4699b96b52
erovoutika	https://umak.edu.ph	3174409e-72c7-410e-a802-8ee1f89b7bb3
umak	https://umak.edu.ph	a6c8ffbd-80bb-4a6f-ae95-83e8ff5740a3
AS	https://supabase.com/dashboard.com	904e797e-b9a8-4516-ab60-32b99118bc73
AS	https://supabase.com/dashboard.com	7ae4f3d6-fded-4cd3-9b93-02ceda006b4f
umak	https://umak.edu.ph	b0e0cd0e-7ffa-44d2-ab97-e755cb2203c7
umak	https://umak.edu.ph	10b751eb-8f68-4211-960c-58d4a3a3a4cc
dsad	https://stackoverflow.com/	44559ff4-b0b2-4b1a-9fa5-7d1b08268b68
San Beda University	https://erovoutika.ph/	a2e3efd0-0aa2-41aa-b321-e4f62e9b4ade
\.


--
-- Data for Name: Templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Templates" (id, "Name", config) FROM stdin;
7	Default	{"Contents":{"Banner":{"bannerContent":{"backgroundColor":"#FFB366","message":"Nominate the Bright Minds of Tomorrow!","buttonText":"NOMINATE NOW","buttonHref":"/Nominations_Tab","buttonBackground":"#0075FF","buttonHover":"#0060CC"}},"Navbar":{"Content":{"links":[{"name":"Home","path":"/"},{"name":"News","path":"/News"},{"name":"Trainings","path":"/Trainings"},{"name":"Tournaments","path":"/Tournament"},{"name":"Awards","path":"/Awards"}],"button":{"image":"/src/assets/images/Erovoutika Dubai logo.png","buttonText":"Register Now","buttonLink":"https://docs.google.com/forms/d/e/1FAIpQLSeA3hMoa5hTtlIxKPBtUNVeHtplqIaXtiNPcvIkIAlTgnFmEQ/viewform?usp=preview"}}},"Nomination":{"NominationContent":{"hero_title":"RECOGNIZE EXCELLENCE IN INNOVATION","hero_subtitle":"Nominate outstanding individuals and teams who are shaping the future of technology with Erovoutika.","hero_background":"/backgrounds/Nomination-Banner.jpg","hero_buttonText":"Nominate Now"}},"Home":{"hero":{"mainText":"Welcome to Erovoutika Dubai","subText":"JOIN US FOR AN INTERNATIONAL TRAINING & TOURNAMENT CAMP IN ROBOTICS & AUTOMATION AND CYBERSECURITY WITH CERTIFICATION!","buttonText":"Learn More","videoDirectory":"/src/assets/images/backgrounds/hero.mp4"},"Robolution":{"title1":{"textColor1":"black","intro1":"What is ROBOLUTION DUBAI 2025?","textColor2":"black","sub1":"Robolution, Erovoutika’s premier robotics competition, fosters global innovation in robotics, cybersecurity, and automation. Established in 2019, it now spans regional to international levels. Robolution Dubai 2025 features competitions, training, awards, and networking.","image1":"./bot1.jpg","containerColor1":"#FFFFFF"},"title2":{"textColor1":"black","intro2":"Join Our Community!","textColor2":"black","sub2":"Robolution Dubai 2025 is open to teachers, faculty, robotics coaches, government employees, students, industry partners, and awardees from around the world.","image2":"./joinus.jpg","containerColor2":"#FFFFFF"}},"package":[{"title":"What’s Included?"},{"package":{"name":"Competition","titleColor":"#6AAAFF","description":"Full Training Camp & Tournament Package – Includes hotel accommodation for five (5) nights, daily breakfast, coffee breaks, lunch, and an exclusive Dubai tour","buttonText":"learn more","buttonLink":"/Tournament","color":"#F3F3F3","containerColor":"#FFFFFF","image":"/src/assets/images/package/Competition.png","display":""}},{"package":{"name":"Trainings","titleColor":"#F3F3F3","description":"Erovoutika provides hands-on training, certifications, and competitions, equipping students, educators, and professionals with cutting-edge skills in robotics and automation systems.","buttonText":"learn more","buttonLink":"/Trainings","color":"#FFB366","image":"/src/assets/images/package/Training.jpg","display":""}},{"package":{"name":"Conference","titleColor":"#F3F3F3","description":"Join experts and innovators for discussions, panels, and networking on robotics, automation, cybersecurity, and R&D, shaping the future of technology.","buttonText":"learn more","buttonLink":"#","color":"#6AAAFF","containerColor":"#FFFFFF","image":"/src/assets/images/package/Conference.jpg","display":""}},{"package":{"name":"Awards","titleColor":"#FFB366","description":"Erovoutika will recognize excellence with Robotics Coach of the Year, Robotics Club of the Year, Global Young Innovator Award, and Special Awards for outstanding achievements.","buttonText":"learn more","buttonLink":"/Awards","color":"#F3F3F3","image":"/src/assets/images/package/Awards.jpg","display":""}},{"package":{"image1":"https://images.unsplash.com/photo-1518684079-3c830dcef090?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8fDA%3D","image2":"https://images.unsplash.com/photo-1528702748617-c64d49f918af?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image3":"https://images.unsplash.com/photo-1526495124232-a04e1849168c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image4":"https://images.unsplash.com/photo-1634148551170-d37d021e0cc9?q=80&w=2084&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image5":"https://images.unsplash.com/photo-1494675595046-ae42af7dc2ce?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image6":"https://plus.unsplash.com/premium_photo-1697729798591-8b7e1b271515?q=80&w=1968&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image7":"https://images.unsplash.com/photo-1628859017536-c2f1d69f3c84?q=80&w=2137&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image8":"https://plus.unsplash.com/premium_photo-1661947673080-a2bb1f4d328a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image9":"https://images.unsplash.com/photo-1512632578888-169bbbc64f33?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image10":"https://images.unsplash.com/photo-1612409578638-b890d0fa9364?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image11":"https://images.unsplash.com/photo-1562595410-4859d718375e?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image12":"https://images.unsplash.com/photo-1641765606160-a1381c652846?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image13":"https://images.unsplash.com/photo-1641765214243-7946e3e57aad?q=80&w=1986&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image14":"https://plus.unsplash.com/premium_photo-1697730197947-f19e92f0035b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image15":"https://plus.unsplash.com/premium_photo-1661964298224-7747aa0ac10c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image16":"https://images.unsplash.com/photo-1722502831765-e11188565aad?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","containerColor":"#FFFFFF","display":""}}],"Highlights":{"Title":"KEY HIGHLIGHTS","Highlight1":{"Icon1":"./highlights/trophy.png","Highlight1":"International Awards","description1":"Recognizing outstanding educators and Erovoutika partners in academia and industry."},"Highlight2":{"Icon2":"./highlights/tournament.png","Highlight2":"Tournament","description2":"After expert-led training on robotics, research and development, and cybersecurity."},"Highlight3":{"Icon3":"./highlights/workshop.png","Highlight3":"Hands-on Workshops","description3":"To enhance technical and research skills in journal publication and patenting guidance."},"Highlight4":{"Icon4":"./highlights/showcase.png","Highlight4":"Showcase","description4":"The research and innovation projects."},"Highlight5":{"Icon5":"./highlights/network.png","Highlight5":"Global Networking","description5":"With professionals, educators, and industry leaders."}},"joinContent":{"title":"Join the ROBOLUTION!","body":"Be part of Robolution Dubai 2025, a global event uniting innovators from multiple countries in robotics, automation, and cybersecurity. Connect, compete, and collaborate with a diverse international community!","button":"Register Now","buttonLink":"https://docs.google.com/forms/d/e/1FAIpQLSeA3hMoa5hTtlIxKPBtUNVeHtplqIaXtiNPcvIkIAlTgnFmEQ/viewform?usp=preview"},"newsContent":{"sectionTitle":"News and Updates","moreNewsLink":{"text":"More News →","href":"/News"}},"Partners":{"src":[{"image":"/src/assets/images/partners/1.png"},{"image":"/src/assets/images/partners/3.png"},{"image":"/src/assets/images/partners/4.png"},{"image":"/src/assets/images/partners/5.png"},{"image":"/src/assets/images/partners/6.png"},{"image":"/src/assets/images/partners/7.png"}]},"FrequentlyAsk":{"Title":"FREQUENTLY ASKED QUESTIONS","description1":"Need Help? Check Out Our Most Common Queries","Question1":"WHAT WILL BE THE OUTLINE OF THE EVENT?","Answer1":"Most of the outlines of the event of Erovoutika will be posted weeks prior to the said event, so stay tuned! Additional info shall also be given to your respective email once successfully registered.","Question2":"WHO CAN PARTICIPATE?","Answer2":"Anyone. If you have interest in one of our events no need to hesitate to join us!","Question3":"WHAT TO EXPECT?","Answer3":" Enhance your knowledge, experience and connect with people who have the same interest as you! Join us in our ROBOLUTION!"},"footerContent":{"links":[{"name":"Home","href":"/"},{"name":"News","href":"/News"},{"name":"Trainings","href":"/Trainings"},{"name":"Tournaments","href":"/Tournament"},{"name":"Awards","href":"/Awards"}],"contact":{"email":"erovoutika@gmail.com","qrCode":"/src/assets/images/footer-images/telephone-qr-code.png"},"social1":{"name":"LinkedIn","href":"https://ph.linkedin.com/company/erovoutika","icon":"/src/assets/images/footer-images/Linkedin.png","size":"w-5 h-5"},"social2":{"name":"Facebook","href":"https://www.facebook.com/erovoutika","icon":"/src/assets/images/footer-images/Facebook.png","size":"w-6 h-6"},"social3":{"name":"Instagram","href":"https://www.instagram.com/erovoutikainternational/","icon":"/src/assets/images/footer-images/Instagram.png","size":"w-6 h-6"}}},"News":{"Hero":{"title":"News and Updates"},"NewsCard":{"title":"News and Updates"},"latest-news":[{"NewsCard":{"title":"Latest News","subtitle":"ROBOLUTION DUBAI 2025","date":"December 15- 18, 2025","image":"public/image 143.png","link":"https://web.facebook.com/share/p/18k7L7gcKt/","alt":"Robolution"}},{"NewsCard":{"title":"Erovoutika Expansion","description":"Erovoutika is now officially in Dubai!","date":"Feb 16, 2025","image":"public/image 99.png","link":"https://web.facebook.com/share/p/18k7L7gcKt/","alt":"Robolution"}},{"NewsCard":{"title":"ROBOLUTION Dubai 2025","subtitle":"ROBOLUTION: Robotics & Automation Competition 2025 – DUBAI","date":"Dec. 15–18, 2025","image":"public/image 144.png","link":"https://web.facebook.com/share/p/1AEJKkTnU9/","alt":"Robolution Competition"}}],"latest-events":[{"NewsCard":{"events":"Events","title":"Murata Robolution: Erovouthon 2.0 Competition 2025","description":"Successfully concluded on March 14, 2025 at FPIP.","date":"March 13, 2025","image":"public/image (2).png","link":"https://web.facebook.com/share/p/193EG7LNdH/","alt":"Erovouthon"}},{"NewsCard":{"title":"Murata Robolution: E-Robot Mobile Controlled Competition 2025","description":"Congratulations to all winners and participants for their outstanding performance in advancing robotics and innovation!","date":"March 17, 2025","image":"public/image (3).png","link":"https://web.facebook.com/share/p/18pB4HdkYZ/","alt":"Erovouthon"}},{"NewsCard":{"title":"Enroll in Mathematics and Robotics Class","description":"Prepare for International Competitions with our training sessions.","date":"Jan 10, 2025","image":"public/image (4).png","link":"https://web.facebook.com/share/p/1RqQ7QDppZ/","alt":"Math"}}],"latest-webinar":[{"NewsCard":{"name":"Webinar","title":"Beginner’s Guide to Logic Circuits","description":"Learn about logic gates, truth tables, and build circuits in our live demo.","date":"Mar 17, 2025","image":"public/image (5).png","link":"https://web.facebook.com/share/p/15YJaFG4UV/","alt":"Logic Circuit"}},{"NewsCard":{"title":"AI and IoT Convergence","description":"Explore the limitless possibilities of AIoT.","date":"Mar 11, 2025","image":"public/image (6).png","link":"https://web.facebook.com/share/p/16cZpmiNzc/","alt":"IOT"}},{"NewsCard":{"title":"GearsBot Robotics Demo","description":"Watch code turn into motion with a live demonstration of GearsBot.","date":"Feb 24, 2025","image":"public/image (7).png","link":"https://web.facebook.com/share/p/1HZERfBUyu/","alt":"Gearbots"}},{"NewsCard":{"title":"Feeding The Mind Of AI","description":"Understanding Neural Networks and CNNs in real-world AI development.","date":"Mar 24, 2025","image":"public/image 146.png","link":"https://web.facebook.com/share/p/1AeJfiB5Cd/","alt":"AI"}}],"latest-cards":[{"title":"News 1","subtitle":"The 𝐌𝐮𝐫𝐚𝐭𝐚 𝐑𝐨𝐛𝐨𝐥𝐮𝐭𝐢𝐨𝐧: 𝐄𝐫𝐨𝐯𝐨𝐮𝐭𝐡𝐨𝐧 𝟐.𝟎 𝐂𝐨𝐦𝐩𝐞𝐭𝐢𝐭𝐢𝐨𝐧 𝟐𝟎𝟐𝟓","date":"May 8, 2025","image":"public/image (2).png","link":"https://web.facebook.com/share/p/193EG7LNdH/","alt":"Erovouthon","description":"Congratulations to all the winners and participants of 𝐌𝐮𝐫𝐚𝐭𝐚 𝐑𝐨𝐛𝐨𝐥𝐮𝐭𝐢𝐨𝐧: 𝐄-𝐑𝐨𝐛𝐨𝐭 𝐌𝐨𝐛𝐢𝐥𝐞 𝐂𝐨𝐧𝐭𝐫𝐨𝐥𝐥𝐞𝐝 𝐂𝐨𝐦𝐩𝐞𝐭𝐢𝐭𝐢𝐨𝐧 𝟐𝟎𝟐𝟓!  🏆Champion: DepEd Tayo Batangas City Integrated High School🥇1st Runner-up: De La Salle University-Dasmariñas🥈2nd Runner-up: OK sa DepEd Lutucan Integrated National High SchoolUniversity Participants:• FAITH Catholic School• Batangas City Integrated High School• Lipa City Science Integrated National High School "},{"title":"News 2","subtitle":"Murata Robolution: E-Robot Mobile Controlled Competition 2025","date":"March 17, 2025","image":"public/image (3).png","link":"https://web.facebook.com/share/p/18pB4HdkYZ/","alt":"Erovouthon","description":"Batangas City Integrated High School secured the championship title in the 𝐌𝐮𝐫𝐚𝐭𝐚 𝐑𝐨𝐛𝐨𝐥𝐮𝐭𝐢𝐨𝐧: 𝐄-𝐑𝐨𝐛𝐨𝐭 𝐌𝐨𝐛𝐢𝐥𝐞 𝐂𝐨𝐧𝐭𝐫𝐨𝐥𝐥𝐞𝐝 𝐂𝐨𝐦𝐩𝐞𝐭𝐢𝐭𝐢𝐨𝐧 𝟐𝟎𝟐𝟓, held to showcase the innovation and technical skills of young robotics enthusiasts on March 13, 2025 at the Philippine Manufacturing Co. of Murata, Inc., First Philippine Industrial Park (FPIP), Tanauan City, Batangas.🏆 Winners:🥇 Champion – Batangas City Integrated High School (The Volcano)🥈 1st Runner-up – De La Salle University-Dasmariñas (Anemo Spear)🥉 2nd Runner-up – Lutucan Integrated National High School ( Roboteam)The competition gathered talented students from various schools, with university participants including FAITH Catholic School and Lipa City Science Integrated National High School.Congratulations to all winners and participants for their outstanding performance in advancing robotics and innovation! 🚀"},{"title":"News 3","subtitle":"Enroll in our Mathematics and Robotics Class! Prepare for International Competitions.","date":"Jan 10, 2025","image":"public/image (4).png","link":"https://web.facebook.com/share/p/1RqQ7QDppZ/","alt":"Math","description":"🌟 Enroll in our Mathematics and Robotics Class! Prepare for International Competitions.👩‍🏫 Erovoutika Mathematics ProgramCATEGORIES: ELEMENTARY - SENIOR HIGHSCHOOL📅 World Championship 🇺🇸 USA - University of Minnesota🇮🇹 Italy - Roma Uninettuno University 🇹🇷 Turkey - Antalya Boğaziçi University🏆 Grand Reward:The champions of the International Fibonacci Olympiad in Italy, Turkey, and USA will be awarded an international scholarship and exchange program, giving them a chance to pursue their academic and career dreams on a global stage! 🌎✨🚀Enrollment link: https://bit.ly/EroMathClass👩‍🏫 Robotics & Automation ProgramLevel 1 to Level 5Level 6 to Level 10🌟 Robotics Competition: ASIA & EUROPE 🇹🇩🇦🇮🇹🇭🇹🇷🇺🇸🇪🇭🇻🇳🇻🇳🇭🇰🇨🇳"}]},"Training":{"Hero":{"title":"BE PART OF THE<br><span class='underline'>FUTURE!</span>","subtitle":"Join us for an International Training & Tournament Camp!","background":"https://zrwokrbdolhwjwabonwk.supabase.co/storage/v1/object/public/training-section//Trainings.png","buttonText":"Learn More"},"Introduction":{"title":"Get Better Everyday In","subtitle":"Robolution Dubai 2025 challenges you to grow in robotics, automation, and cybersecurity. By competing, learning, and networking with experts worldwide, you'll enhance your technical skills, problem-solving abilities, and innovation mindset—preparing you for future success!"},"Content_1":{"title":"Robotics & Automation","subtitle":"Erovoutika provides hands-on training, certifications, and competitions, equipping students, educators, and professionals with cutting-edge skills in robotics and automation systems.","ImageDirectory":"https://zrwokrbdolhwjwabonwk.supabase.co/storage/v1/object/public/training-section//erobot.png"},"Content_2":{"title":"Cybersecurity","subtitle":"Erovoutika promotes cybersecurity education and training by integrating network security, ethical hacking, and data protection into its programs. Through hands-on workshops, certifications, and competitions, participants gain expertise in threat detection, encryption, and cybersecurity best practices.","ImageDirectory":"https://zrwokrbdolhwjwabonwk.supabase.co/storage/v1/object/public/training-section//cybersecurity.png"},"Content_3":{"title":"Research & Development","subtitle":"Erovoutika is dedicated to advancing innovation through Research & Development (R&D), with a strong emphasis on robotics, automation, cybersecurity, and AI-powered solutions. Additionally, it explores technical writing for journal publications and patenting, fostering knowledge sharing and technological advancements.","ImageDirectory":"https://zrwokrbdolhwjwabonwk.supabase.co/storage/v1/object/public/training-section//rnd.png"},"Content_4":{"title":"Join Us","minititle":"START BUILDING IDEAS","subtitle":"Be part of Robolution Dubai 2025, a global event uniting innovators from multiple countries in robotics, automation, and cybersecurity. Connect, compete, and collaborate with a diverse international community!","buttonText":"Register Now","buttonLink":"https://docs.google.com/forms/d/e/1FAIpQLSeA3hMoa5hTtlIxKPBtUNVeHtplqIaXtiNPcvIkIAlTgnFmEQ/viewform?usp=preview"}},"Tournament":{"Hero":{"title":"BE PART OF THE<br><span class='underline decoration-[#C084FC]'>FUTURE!</span>","subtitle":"Join us for an International Training & Tournament Camp!","background":"/src/assets/images/backgrounds/Herobg.png","buttonText":"Learn More"},"Overview":{"subheadings":"Overview","Headings":"Tournament","info":"Robolution Dubai 2025 features three dynamic tracks designed to challenge participants in innovation, problem-solving, and technical expertise. Compete against global talents, collaborate with experts, and push the boundaries of technology in the following <span class='text-sky-500'>categories:</span>"},"Pictures":{"erobot":"/src/assets/images/tournament/erobot.png","eromath":"/src/assets/images/tournament/eromath.png","freestyle":"/src/assets/images/tournament/freestyle.png","cybersecurity":"/src/assets/images/tournament/cybersecurity.png"},"Teachers":{"title":"Who can Participate?","image":"./ParticipateImages/teachers.png","header":"Teachers","subtext":"Teachers and industry practitioners can form teams of <span class='text-[#8B5CF6]'> 2 to 5 members </span> to represent their school or company. Using Erobot kits, teams will compete in Robotics & Automation, R&D, and Cybersecurity. The tournament showcases skills gained from a two-day training camp."},"Students":{"image":"./ParticipateImages/students.png","header":"Students","subtext":"High school or college teams up to <span class='text-[#8B5CF6]'> 2 to 5 members </span> present their projects in a five-minute pitch, showcasing an innovative, functional prototype. They must also prepare a roll-up poster detailing the title, objectives, methodology, key features, and real-world applications."},"Compete":{"header":"Ready to <span class='text-transparent bg-clip-text bg-gradient-to-r from-BlueStart via-purple-600 to-PinkEnd'> Compete?</span>","subtext":"Be part of Robolution Dubai 2025, a global event uniting innovators from multiple countries in robotics, automation, and cybersecurity. Connect, compete, and collaborate with a diverse international community!","buttonText":"Register Now","buttonLink":"https://docs.google.com/forms/d/e/1FAIpQLSeA3hMoa5hTtlIxKPBtUNVeHtplqIaXtiNPcvIkIAlTgnFmEQ/viewform?usp=preview"}},"Awards":{"hero":{"mainHeading":"CALLING ALL ROBOTICS COACHES AND CLUBS AROUND THE WORLD!","openNominations":"Open for Nominations!","para1":"The International Outstanding Robotics Club of the Year Award honors the robotics club that has demonstrated exceptional performance, innovation, and dedication in the field of robotics. This prestigious accolade is awarded to a club that has not only excelled in competitions but has also made significant contributions to the robotics community through outreach, education, and teamwork.","para2":"This global recognition celebrates clubs that go above and beyond in innovation, education, community service, and collaborative spirit in the world of robotics.","learnMore":"Learn More"},"awards":{"heading":"Awards","award1":"International Robotics Coach of the Year","award2":"International Robotics Club of the Year","award3":"Global Excellence in Robotics & Automation Education Award","award4":"Global Young Innovator Award","specialAwardsHeading":"Special Awards","specialAward1":"Best Community Impact","specialAward2":"Most Innovative Project","specialAward3":"Outstanding Teamwork"},"process":{"heading":"PROCESS FOR APPLICATION","step":"Fill out the Google form using the button below.","deadline":"The deadline for submission is on or before November 25, 2025.","nominateNow":"Nominate Now"},"modal":{"heading":"Minimum Qualifications & Criteria","requiredDocs":"Required Documents","doc1":"Endorsement Letter from the Principal/Dean","doc2":"Accomplishment Report of programs and projects conducted with documentation and other attachments as proof.","doc2Note":"Include all approval letters/activity permits.","doc3":"Supporting Documents","doc3a":"Accomplished Application Form for Outstanding Robotics Club of the Year","doc3b":"Awards of Appreciation or Plaques identified and labeled and other proof of awards","doc3c":"Certificate of attendance/participation","doc3d":"Certificate of Accreditation issued by the school where the club is affiliated","doc3e":"Certificate of Membership and community organization (e.g., International Robotics Club)","doc3eNote":"If none, any representative of the group may join the International Robotics Club for students:","doc3eLinkText":"Registration link: https://bit.ly/IRCregistration","doc3f":"Office Order for Regional to International Events (if a partnership, Memorandum of Agreement)","doc3g":"Other documents to support the claims."},"criteria":{"heading":"Criteria","criteria1":"Relevant / Accomplished Activities","criteria2":"Awards / Commendation / Additional Activities","criteria3":"Certificate of Membership","criteria4":"Robolution Participation","total":"TOTAL","percentage1":"40%","percentage2":"30%","percentage3":"10%","percentage4":"20%","percentageTotal":"100%"}}}}
11	test	{"Contents":{"Home":{"hero":{"subText":"JOIN US FOR AN INTERNATIONAL TRAINING & TOURNAMENT CAMP IN ROBOTICS & AUTOMATION AND CYBERSECURITY WITH CERTIFICATION!","mainText":"Welcome to Erovoutika Dubai","buttonText":"Learn More","videoDirectory":"/src/assets/images/backgrounds/hero.mp4"},"package":[{"title":"What’s Included?"},{"package":{"name":"Competition","color":"#F3F3F3","image":"/src/assets/images/package/Competition.png","display":"","buttonLink":"/Tournament","buttonText":"learn more","titleColor":"#6AAAFF","description":"Full Training Camp & Tournament Package – Includes hotel accommodation for five (5) nights, daily breakfast, coffee breaks, lunch, and an exclusive Dubai tour","containerColor":"#FFFFFF"}},{"package":{"name":"Trainings","color":"#FFB366","image":"/src/assets/images/package/Training.jpg","display":"","buttonLink":"/Trainings","buttonText":"learn more","titleColor":"#F3F3F3","description":"Erovoutika provides hands-on training, certifications, and competitions, equipping students, educators, and professionals with cutting-edge skills in robotics and automation systems."}},{"package":{"name":"Conference","color":"#6AAAFF","image":"/src/assets/images/package/Conference.jpg","display":"","buttonLink":"#","buttonText":"learn more","titleColor":"#F3F3F3","description":"Join experts and innovators for discussions, panels, and networking on robotics, automation, cybersecurity, and R&D, shaping the future of technology.","containerColor":"#FFFFFF"}},{"package":{"name":"Awards","color":"#F3F3F3","image":"/src/assets/images/package/Awards.jpg","display":"","buttonLink":"/Awards","buttonText":"learn more","titleColor":"#FFB366","description":"Erovoutika will recognize excellence with Robotics Coach of the Year, Robotics Club of the Year, Global Young Innovator Award, and Special Awards for outstanding achievements."}},{"package":{"image1":"https://images.unsplash.com/photo-1518684079-3c830dcef090?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8fDA%3D","image2":"https://images.unsplash.com/photo-1528702748617-c64d49f918af?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image3":"https://images.unsplash.com/photo-1526495124232-a04e1849168c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image4":"https://images.unsplash.com/photo-1634148551170-d37d021e0cc9?q=80&w=2084&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image5":"https://images.unsplash.com/photo-1494675595046-ae42af7dc2ce?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image6":"https://plus.unsplash.com/premium_photo-1697729798591-8b7e1b271515?q=80&w=1968&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image7":"https://images.unsplash.com/photo-1628859017536-c2f1d69f3c84?q=80&w=2137&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image8":"https://plus.unsplash.com/premium_photo-1661947673080-a2bb1f4d328a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image9":"https://images.unsplash.com/photo-1512632578888-169bbbc64f33?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","display":"","image10":"https://images.unsplash.com/photo-1612409578638-b890d0fa9364?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image11":"https://images.unsplash.com/photo-1562595410-4859d718375e?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image12":"https://images.unsplash.com/photo-1641765606160-a1381c652846?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image13":"https://images.unsplash.com/photo-1641765214243-7946e3e57aad?q=80&w=1986&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image14":"https://plus.unsplash.com/premium_photo-1697730197947-f19e92f0035b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image15":"https://plus.unsplash.com/premium_photo-1661964298224-7747aa0ac10c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","image16":"https://images.unsplash.com/photo-1722502831765-e11188565aad?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","containerColor":"#FFFFFF"}}],"Partners":{"src":[{"image":"/src/assets/images/partners/1.png"},{"image":"/src/assets/images/partners/3.png"},{"image":"/src/assets/images/partners/4.png"},{"image":"/src/assets/images/partners/5.png"},{"image":"/src/assets/images/partners/6.png"},{"image":"/src/assets/images/partners/7.png"}]},"Highlights":{"Title":"KEY HIGHLIGHTS","Highlight1":{"Icon1":"./highlights/trophy.png","Highlight1":"International Awards","description1":"Recognizing outstanding educators and Erovoutika partners in academia and industry."},"Highlight2":{"Icon2":"./highlights/tournament.png","Highlight2":"Tournament","description2":"After expert-led training on robotics, research and development, and cybersecurity."},"Highlight3":{"Icon3":"./highlights/workshop.png","Highlight3":"Hands-on Workshops","description3":"To enhance technical and research skills in journal publication and patenting guidance."},"Highlight4":{"Icon4":"./highlights/showcase.png","Highlight4":"Showcase","description4":"The research and innovation projects."},"Highlight5":{"Icon5":"./highlights/network.png","Highlight5":"Global Networking","description5":"With professionals, educators, and industry leaders."}},"Robolution":{"title1":{"sub1":"Robolution, Erovoutika’s premier robotics competition, fosters global innovation in robotics, cybersecurity, and automation. Established in 2019, it now spans regional to international levels. Robolution Dubai 2025 features competitions, training, awards, and networking.","image1":"./bot1.jpg","intro1":"What is ROBOLUTION DUBAI 2025?","textColor1":"black","textColor2":"black","containerColor1":"#FFFFFF"},"title2":{"sub2":"Robolution Dubai 2025 is open to teachers, faculty, robotics coaches, government employees, students, industry partners, and awardees from around the world.","image2":"./joinus.jpg","intro2":"Join Our Community!","textColor1":"black","textColor2":"black","containerColor2":"#FFFFFF"}},"joinContent":{"body":"Be part of Robolution Dubai 2025, a global event uniting innovators from multiple countries in robotics, automation, and cybersecurity. Connect, compete, and collaborate with a diverse international community!","title":"Join the ROBOLUTION!","button":"Register Now","buttonLink":"https://docs.google.com/forms/d/e/1FAIpQLSeA3hMoa5hTtlIxKPBtUNVeHtplqIaXtiNPcvIkIAlTgnFmEQ/viewform?usp=preview"},"newsContent":{"moreNewsLink":{"href":"/News","text":"More News →"},"sectionTitle":"News and Updates"},"FrequentlyAsk":{"Title":"FREQUENTLY ASKED QUESTIONS","Answer1":"Most of the outlines of the event of Erovoutika will be posted weeks prior to the said event, so stay tuned! Additional info shall also be given to your respective email once successfully registered.","Answer2":"Anyone. If you have interest in one of our events no need to hesitate to join us!","Answer3":" Enhance your knowledge, experience and connect with people who have the same interest as you! Join us in our ROBOLUTION!","Question1":"WHAT WILL BE THE OUTLINE OF THE EVENT?","Question2":"WHO CAN PARTICIPATE?","Question3":"WHAT TO EXPECT?","description1":"Need Help? Check Out Our Most Common Queries"},"footerContent":{"links":[{"href":"/","name":"Home"},{"href":"/News","name":"News"},{"href":"/Trainings","name":"Trainings"},{"href":"/Tournament","name":"Tournaments"},{"href":"/Awards","name":"Awards"}],"contact":{"email":"erovoutika@gmail.com","qrCode":"/src/assets/images/footer-images/telephone-qr-code.png"},"social1":{"href":"https://ph.linkedin.com/company/erovoutika","icon":"/src/assets/images/footer-images/Linkedin.png","name":"LinkedIn","size":"w-5 h-5"},"social2":{"href":"https://www.facebook.com/erovoutika","icon":"/src/assets/images/footer-images/Facebook.png","name":"Facebook","size":"w-6 h-6"},"social3":{"href":"https://www.instagram.com/erovoutikainternational/","icon":"/src/assets/images/footer-images/Instagram.png","name":"Instagram","size":"w-6 h-6"}}},"News":{"latest-news":[{"NewsCard":{"alt":"ROBOlution Dubai","date":"December 15-18, 2025","link":"https://www.facebook.com/share/p/1FjVj8sWys/","image":"/src/assets/images/NewsUpdateImages/Poster.png","title":"ROBOLUTION DUBAI 2025","description":"Join us for an International Training & Tournament Camp in Robotics & Automation and Cybersecurity with Certification!"}},{"NewsCard":{"alt":"RobolutionDubai","date":"April 28, 2025","link":"https://www.facebook.com/share/p/16UfvX7ZW1/","image":"/src/assets/images/NewsUpdateImages/RobolutionDubai.jpg","title":"Calling All Robotics Coaches Around the Globe!","description":"Whether you’re coaching in a local school or guiding international champions — this is your MOMENT."}},{"NewsCard":{"alt":"Outstanding","date":"April 26, 2025","link":"https://www.facebook.com/share/p/16MmGyfeGb/","image":"/src/assets/images/NewsUpdateImages/Outstanding.jpg","title":"Erovoutika Honored as Outstanding Partner by St. Dominic College of Asia","description":"ERovoutika Electronics Robotics Automation has been awarded and recognized as an outstanding partner by St. Dominic College of Asia (SDCA) for its remarkable and invaluable contribution toward the institution’s mission of providing holistic education for all towards a better quality of life."}}],"latest-events":[{"NewsCard":{"alt":"ROBOlution Dubai","date":"December 15-18, 2025","link":"https://www.facebook.com/share/p/1FjVj8sWys/","image":"/src/assets/images/NewsUpdateImages/Poster.png","title":"ROBOLUTION DUBAI 2025","description":"Join us for an International Training & Tournament Camp in Robotics & Automation and Cybersecurity with Certification!"}},{"NewsCard":{"alt":"RobolutionDubai","date":"April 28, 2025","link":"https://www.facebook.com/share/p/16UfvX7ZW1/","image":"/src/assets/images/NewsUpdateImages/RobolutionDubai.jpg","title":"Calling All Robotics Coaches Around the Globe!","description":"Whether you’re coaching in a local school or guiding international champions — this is your MOMENT."}},{"NewsCard":{"alt":"Outstanding","date":"April 26, 2025","link":"https://www.facebook.com/share/p/16MmGyfeGb/","image":"/src/assets/images/NewsUpdateImages/Outstanding.jpg","title":"Erovoutika Honored as Outstanding Partner by St. Dominic College of Asia","description":"ERovoutika Electronics Robotics Automation has been awarded and recognized as an outstanding partner by St. Dominic College of Asia (SDCA) for its remarkable and invaluable contribution toward the institution’s mission of providing holistic education for all towards a better quality of life."}}],"latest-webinar":[{"NewsCard":{"alt":"ROBOlution Dubai","date":"December 15-18, 2025","link":"https://www.facebook.com/share/p/1FjVj8sWys/","image":"/src/assets/images/NewsUpdateImages/Poster.png","title":"ROBOLUTION DUBAI 2025","description":"Join us for an International Training & Tournament Camp in Robotics & Automation and Cybersecurity with Certification!"}},{"NewsCard":{"alt":"RobolutionDubai","date":"April 28, 2025","link":"https://www.facebook.com/share/p/16UfvX7ZW1/","image":"/src/assets/images/NewsUpdateImages/RobolutionDubai.jpg","title":"Calling All Robotics Coaches Around the Globe!","description":"Whether you’re coaching in a local school or guiding international champions — this is your MOMENT."}},{"NewsCard":{"alt":"Outstanding","date":"April 26, 2025","link":"https://www.facebook.com/share/p/16MmGyfeGb/","image":"/src/assets/images/NewsUpdateImages/Outstanding.jpg","title":"Erovoutika Honored as Outstanding Partner by St. Dominic College of Asia","description":"ERovoutika Electronics Robotics Automation has been awarded and recognized as an outstanding partner by St. Dominic College of Asia (SDCA) for its remarkable and invaluable contribution toward the institution’s mission of providing holistic education for all towards a better quality of life."}}]},"Awards":{"hero":{"para1":"The International Outstanding Robotics Club of the Year Award honors the robotics club that has demonstrated exceptional performance, innovation, and dedication in the field of robotics. This prestigious accolade is awarded to a club that has not only excelled in competitions but has also made significant contributions to the robotics community through outreach, education, and teamwork.","para2":"This global recognition celebrates clubs that go above and beyond in innovation, education, community service, and collaborative spirit in the world of robotics.","learnMore":"Learn More","mainHeading":"CALLING ALL ROBOTICS COACHES AND CLUBS AROUND THE WORLD!","openNominations":"Open for Nominations!"},"modal":{"doc1":"Endorsement Letter from the Principal/Dean","doc2":"Accomplishment Report of programs and projects conducted with documentation and other attachments as proof.","doc3":"Supporting Documents","doc3a":"Accomplished Application Form for Outstanding Robotics Club of the Year","doc3b":"Awards of Appreciation or Plaques identified and labeled and other proof of awards","doc3c":"Certificate of attendance/participation","doc3d":"Certificate of Accreditation issued by the school where the club is affiliated","doc3e":"Certificate of Membership and community organization (e.g., International Robotics Club)","doc3f":"Office Order for Regional to International Events (if a partnership, Memorandum of Agreement)","doc3g":"Other documents to support the claims.","heading":"Minimum Qualifications & Criteria","doc2Note":"Include all approval letters/activity permits.","doc3eNote":"If none, any representative of the group may join the International Robotics Club for students:","requiredDocs":"Required Documents","doc3eLinkText":"Registration link: https://bit.ly/IRCregistration"},"awards":{"award1":"International Robotics Coach of the Year","award2":"International Robotics Club of the Year","award3":"Global Excellence in Robotics & Automation Education Award","award4":"Global Young Innovator Award","heading":"Awards","specialAward1":"Best Community Impact","specialAward2":"Most Innovative Project","specialAward3":"Outstanding Teamwork","specialAwardsHeading":"Special Awards"},"process":{"step":"Fill out the Google form using the button below.","heading":"PROCESS FOR APPLICATION","deadline":"The deadline for submission is on or before November 25, 2025.","nominateNow":"Nominate Now"},"criteria":{"total":"TOTAL","heading":"Criteria","criteria1":"Relevant / Accomplished Activities","criteria2":"Awards / Commendation / Additional Activities","criteria3":"Certificate of Membership","criteria4":"Robolution Participation","percentage1":"40%","percentage2":"30%","percentage3":"10%","percentage4":"20%","percentageTotal":"100%"}},"Banner":{"bannerContent":{"message":"Nominate the Bright Minds of Tomorrow!","buttonHref":"/Nominations_Tab","buttonText":"NOMINATE NOW","buttonHover":"#0060CC","backgroundColor":"#FFB366","buttonBackground":"#0075FF"}},"Navbar":{"Content":{"links":[{"name":"Home","path":"/"},{"name":"News","path":"/News"},{"name":"Trainings","path":"/Trainings"},{"name":"Tournaments","path":"/Tournament"},{"name":"Awards","path":"/Awards"}],"button":{"image":"/src/assets/images/Erovoutika Dubai logo.png","buttonLink":"https://docs.google.com/forms/d/e/1FAIpQLSeA3hMoa5hTtlIxKPBtUNVeHtplqIaXtiNPcvIkIAlTgnFmEQ/viewform?usp=preview","buttonText":"Register Now"}}},"Training":{"Hero":{"title":"BE PART OF THE<br><span class='underline'>FUTURE!</span>","subtitle":"Join us for an International Training & Tournament Camp!","background":"https://zrwokrbdolhwjwabonwk.supabase.co/storage/v1/object/public/training-section//Trainings.png","buttonText":"Learn More"},"Content_1":{"title":"Robotics & Automation","subtitle":"Erovoutika provides hands-on training, certifications, and competitions, equipping students, educators, and professionals with cutting-edge skills in robotics and automation systems.","ImageDirectory":"https://zrwokrbdolhwjwabonwk.supabase.co/storage/v1/object/public/training-section//erobot.png"},"Content_2":{"title":"Cybersecurity","subtitle":"Erovoutika promotes cybersecurity education and training by integrating network security, ethical hacking, and data protection into its programs. Through hands-on workshops, certifications, and competitions, participants gain expertise in threat detection, encryption, and cybersecurity best practices.","ImageDirectory":"https://zrwokrbdolhwjwabonwk.supabase.co/storage/v1/object/public/training-section//cybersecurity.png"},"Content_3":{"title":"Research & Development","subtitle":"Erovoutika is dedicated to advancing innovation through Research & Development (R&D), with a strong emphasis on robotics, automation, cybersecurity, and AI-powered solutions. Additionally, it explores technical writing for journal publications and patenting, fostering knowledge sharing and technological advancements.","ImageDirectory":"https://zrwokrbdolhwjwabonwk.supabase.co/storage/v1/object/public/training-section//rnd.png"},"Content_4":{"title":"Join Us","subtitle":"Be part of Robolution Dubai 2025, a global event uniting innovators from multiple countries in robotics, automation, and cybersecurity. Connect, compete, and collaborate with a diverse international community!","minititle":"START BUILDING IDEAS","buttonLink":"https://docs.google.com/forms/d/e/1FAIpQLSeA3hMoa5hTtlIxKPBtUNVeHtplqIaXtiNPcvIkIAlTgnFmEQ/viewform?usp=preview","buttonText":"Register Now"},"Introduction":{"title":"Get Better Everyday In","subtitle":"Robolution Dubai 2025 challenges you to grow in robotics, automation, and cybersecurity. By competing, learning, and networking with experts worldwide, you'll enhance your technical skills, problem-solving abilities, and innovation mindset—preparing you for future success!"}},"Nomination":{"NominationContent":{"hero_title":"RECOGNIZE EXCELLENCE IN INNOVATION","hero_subtitle":"Nominate outstanding individuals and teams who are shaping the future of technology with Erovoutika.","hero_background":"/backgrounds/Nomination-Banner.jpg","hero_buttonText":"Nominate Now"}},"Tournament":{"Hero":{"title":"BE PART OF THE<br><span class='underline decoration-[#C084FC]'>FUTURE!</span>","subtitle":"Join us for an International Training & Tournament Camp!","background":"/src/assets/images/backgrounds/Herobg.png","buttonText":"Learn More"},"Compete":{"header":"Ready to <span class='text-transparent bg-clip-text bg-gradient-to-r from-BlueStart via-purple-600 to-PinkEnd'> Compete?</span>","subtext":"Be part of Robolution Dubai 2025, a global event uniting innovators from multiple countries in robotics, automation, and cybersecurity. Connect, compete, and collaborate with a diverse international community!","buttonLink":"https://docs.google.com/forms/d/e/1FAIpQLSeA3hMoa5hTtlIxKPBtUNVeHtplqIaXtiNPcvIkIAlTgnFmEQ/viewform?usp=preview","buttonText":"Register Now"},"Overview":{"info":"Robolution Dubai 2025 features three dynamic tracks designed to challenge participants in innovation, problem-solving, and technical expertise. Compete against global talents, collaborate with experts, and push the boundaries of technology in the following <span class='text-sky-500'>categories:</span>","Headings":"Tournament","subheadings":"Overview"},"Pictures":{"erobot":"/src/assets/images/tournament/erobot.png","eromath":"/src/assets/images/tournament/eromath.png","freestyle":"/src/assets/images/tournament/freestyle.png","cybersecurity":"/src/assets/images/tournament/cybersecurity.png"},"Students":{"image":"./ParticipateImages/students.png","header":"Students","subtext":"High school or college teams up to <span class='text-[#8B5CF6]'> 2 to 5 members </span> present their projects in a five-minute pitch, showcasing an innovative, functional prototype. They must also prepare a roll-up poster detailing the title, objectives, methodology, key features, and real-world applications."},"Teachers":{"image":"./ParticipateImages/teachers.png","title":"Who can Participate?","header":"Teachers","subtext":"Teachers and industry practitioners can form teams of <span class='text-[#8B5CF6]'> 2 to 5 members </span> to represent their school or company. Using Erobot kits, teams will compete in Robotics & Automation, R&D, and Cybersecurity. The tournament showcases skills gained from a two-day training camp."}}}}
\.


--
-- Data for Name: Trainings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Trainings" (id, hero, introduction, content_1, content_2, content_3, content_4, created_at) FROM stdin;
a1a3f1de-bb27-411d-9d9c-3053decca5dd	{"title":"BE PART OF THE<br><span class='underline'>FUTURE!</span>","subtitle":"Join us for an International Training & Tournament Camp!","background":"https://zrwokrbdolhwjwabonwk.supabase.co/storage/v1/object/public/training-section//Trainings.png","buttonText":"Learn More"}	{"title":"Get Better Everyday In","subtitle":"Robolution Dubai 2025 challenges you to grow in robotics, automation, and cybersecurity. By competing, learning, and networking with experts worldwide, you'll enhance your technical skills, problem-solving abilities, and innovation mindset—preparing you for future success!"}	{"title":"Robotics & Automation","subtitle":"Erovoutika provides hands-on training, certifications, and competitions, equipping students, educators, and professionals with cutting-edge skills in robotics and automation systems.","ImageDirectory":"https://zrwokrbdolhwjwabonwk.supabase.co/storage/v1/object/public/training-section//erobot.png"}	{"title":"Cybersecurity","subtitle":"Erovoutika promotes cybersecurity education and training by integrating network security, ethical hacking, and data protection into its programs. Through hands-on workshops, certifications, and competitions, participants gain expertise in threat detection, encryption, and cybersecurity best practices.","ImageDirectory":"https://zrwokrbdolhwjwabonwk.supabase.co/storage/v1/object/public/training-section//cybersecurity.png"}	{"title":"Research & Development","subtitle":"Erovoutika is dedicated to advancing innovation through Research & Development (R&D), with a strong emphasis on robotics, automation, cybersecurity, and AI-powered solutions. Additionally, it explores technical writing for journal publications and patenting, fostering knowledge sharing and technological advancements.","ImageDirectory":"https://zrwokrbdolhwjwabonwk.supabase.co/storage/v1/object/public/training-section//rnd.png"}	{"title":"Join Us","minititle":"START BUILDING IDEAS","subtitle":"Be part of Robolution Dubai 2025, a global event uniting innovators from multiple countries in robotics, automation, and cybersecurity. Connect, compete, and collaborate with a diverse international community!","buttonText":"Register Now"}	2025-04-05 08:19:24.906265+00
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-04-04 01:16:09
20211116045059	2025-04-04 01:16:09
20211116050929	2025-04-04 01:16:09
20211116051442	2025-04-04 01:16:09
20211116212300	2025-04-04 01:16:09
20211116213355	2025-04-04 01:16:09
20211116213934	2025-04-04 01:16:09
20211116214523	2025-04-04 01:16:09
20211122062447	2025-04-04 01:16:09
20211124070109	2025-04-04 01:16:09
20211202204204	2025-04-04 01:16:09
20211202204605	2025-04-04 01:16:09
20211210212804	2025-04-04 01:16:09
20211228014915	2025-04-04 01:16:09
20220107221237	2025-04-04 01:16:09
20220228202821	2025-04-04 01:16:09
20220312004840	2025-04-04 01:16:09
20220603231003	2025-04-04 01:16:09
20220603232444	2025-04-04 01:16:09
20220615214548	2025-04-04 01:16:09
20220712093339	2025-04-04 01:16:09
20220908172859	2025-04-04 01:16:09
20220916233421	2025-04-04 01:16:09
20230119133233	2025-04-04 01:16:09
20230128025114	2025-04-04 01:16:09
20230128025212	2025-04-04 01:16:09
20230227211149	2025-04-04 01:16:09
20230228184745	2025-04-04 01:16:09
20230308225145	2025-04-04 01:16:09
20230328144023	2025-04-04 01:16:09
20231018144023	2025-04-04 01:16:09
20231204144023	2025-04-04 01:16:09
20231204144024	2025-04-04 01:16:10
20231204144025	2025-04-04 01:16:10
20240108234812	2025-04-04 01:16:10
20240109165339	2025-04-04 01:16:10
20240227174441	2025-04-04 01:16:10
20240311171622	2025-04-04 01:16:10
20240321100241	2025-04-04 01:16:10
20240401105812	2025-04-04 01:16:10
20240418121054	2025-04-04 01:16:10
20240523004032	2025-04-04 01:16:10
20240618124746	2025-04-04 01:16:10
20240801235015	2025-04-04 01:16:10
20240805133720	2025-04-04 01:16:10
20240827160934	2025-04-04 01:16:10
20240919163303	2025-04-04 01:16:10
20240919163305	2025-04-04 01:16:10
20241019105805	2025-04-04 01:16:10
20241030150047	2025-04-04 01:16:10
20241108114728	2025-04-04 01:16:10
20241121104152	2025-04-04 01:16:10
20241130184212	2025-04-04 01:16:10
20241220035512	2025-04-04 01:16:10
20241220123912	2025-04-04 01:16:10
20241224161212	2025-04-04 01:16:10
20250107150512	2025-04-04 01:16:10
20250110162412	2025-04-04 01:16:10
20250123174212	2025-04-04 01:16:10
20250128220012	2025-04-04 01:16:10
20250506224012	2025-05-27 00:09:22
20250523164012	2025-06-09 16:47:55
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) FROM stdin;
training-section	training-section	\N	2025-04-04 11:45:06.657206+00	2025-04-04 11:45:06.657206+00	t	f	\N	\N	\N
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-04-04 00:57:22.164486
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-04-04 00:57:22.183447
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-04-04 00:57:22.189287
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-04-04 00:57:22.22851
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-04-04 00:57:22.268864
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-04-04 00:57:22.275501
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-04-04 00:57:22.28236
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-04-04 00:57:22.289378
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-04-04 00:57:22.296131
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-04-04 00:57:22.303033
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-04-04 00:57:22.309488
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-04-04 00:57:22.315869
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-04-04 00:57:22.326399
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-04-04 00:57:22.332751
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-04-04 00:57:22.339972
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-04-04 00:57:22.372317
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-04-04 00:57:22.378853
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-04-04 00:57:22.385175
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-04-04 00:57:22.394267
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-04-04 00:57:22.407913
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-04-04 00:57:22.414621
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-04-04 00:57:22.427204
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-04-04 00:57:22.460424
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-04-04 00:57:22.488615
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-04-04 00:57:22.499862
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-04-04 00:57:22.505889
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
ee80bf1f-a297-4974-a36d-b3d1934cf1f4	training-section	rnd.png	\N	2025-04-04 11:45:28.427417+00	2025-04-04 11:45:28.427417+00	2025-04-04 11:45:28.427417+00	{"eTag": "\\"792b25644c9b01dddf274d20fbc00a73-1\\"", "size": 93059, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-04-04T11:45:28.000Z", "contentLength": 93059, "httpStatusCode": 200}	b690bbdb-ed07-4e83-b076-30540bd15ba9	\N	\N
aefa4f3a-0c15-4cbb-bcc1-05efe23047c0	training-section	cybersecurity.png	\N	2025-04-04 11:45:28.535268+00	2025-04-04 11:45:28.535268+00	2025-04-04 11:45:28.535268+00	{"eTag": "\\"5dabae61c27790e552dc46510406b049-1\\"", "size": 200047, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-04-04T11:45:28.000Z", "contentLength": 200047, "httpStatusCode": 200}	95462aa0-5a44-4df2-b546-a4cdf87e90d7	\N	\N
abd36098-b712-4a50-9fde-ee82b8cd58d6	training-section	erobot.png	\N	2025-04-04 11:45:45.443182+00	2025-04-04 11:45:45.443182+00	2025-04-04 11:45:45.443182+00	{"eTag": "\\"de7f96d0826016d389266629840b4ce0-1\\"", "size": 85676, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-04-04T11:45:45.000Z", "contentLength": 85676, "httpStatusCode": 200}	370134f2-ecb7-480e-a286-e2301df6b232	\N	\N
78069ec2-b2a5-44bf-a7ba-2d3e128ce2a9	training-section	Trainings.png	\N	2025-04-04 11:57:34.954827+00	2025-04-04 11:57:43.463757+00	2025-04-04 11:57:34.954827+00	{"eTag": "\\"7ec0a01a204cb76f56cea94965bfa9ba\\"", "size": 115366, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-04-04T11:57:44.000Z", "contentLength": 115366, "httpStatusCode": 200}	df82c337-8d52-4d83-969f-e656fa79f47b	\N	\N
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 101, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('pgsodium.key_key_id_seq', 1, false);


--
-- Name: Templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Templates_id_seq"', 439, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: Address Address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_pkey" PRIMARY KEY ("addressID");


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryID");


--
-- Name: Designation Designation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Designation"
    ADD CONSTRAINT "Designation_pkey" PRIMARY KEY ("designationID");


--
-- Name: Person Person_addressID_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "Person_addressID_key" UNIQUE ("addressID");


--
-- Name: Person Person_categoryID_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "Person_categoryID_key" UNIQUE ("categoryID");


--
-- Name: Person Person_designationID_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "Person_designationID_key" UNIQUE ("designationID");


--
-- Name: Person Person_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "Person_id_key" UNIQUE (id);


--
-- Name: Person Person_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "Person_pkey" PRIMARY KEY (id);


--
-- Name: Person Person_qnaID_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "Person_qnaID_key" UNIQUE ("qnaID");


--
-- Name: Person Person_schoolID_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "Person_schoolID_key" UNIQUE ("schoolID");


--
-- Name: QNA QNA_addressID_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QNA"
    ADD CONSTRAINT "QNA_addressID_key" UNIQUE ("qnaID");


--
-- Name: QNA QNA_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QNA"
    ADD CONSTRAINT "QNA_pkey" PRIMARY KEY ("qnaID");


--
-- Name: School School_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_pkey" PRIMARY KEY ("schoolID");


--
-- Name: Templates Templates_Name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Templates"
    ADD CONSTRAINT "Templates_Name_key" UNIQUE ("Name");


--
-- Name: Templates Templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Templates"
    ADD CONSTRAINT "Templates_pkey" PRIMARY KEY (id);


--
-- Name: Trainings trainings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Trainings"
    ADD CONSTRAINT trainings_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: Person Person_addressID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "Person_addressID_fkey" FOREIGN KEY ("addressID") REFERENCES public."Address"("addressID");


--
-- Name: Person Person_categoryID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "Person_categoryID_fkey" FOREIGN KEY ("categoryID") REFERENCES public."Category"("categoryID");


--
-- Name: Person Person_designationID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "Person_designationID_fkey" FOREIGN KEY ("designationID") REFERENCES public."Designation"("designationID");


--
-- Name: Person Person_qnaID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "Person_qnaID_fkey" FOREIGN KEY ("qnaID") REFERENCES public."QNA"("qnaID");


--
-- Name: Person Person_schoolID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "Person_schoolID_fkey" FOREIGN KEY ("schoolID") REFERENCES public."School"("schoolID");


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: Address; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public."Address" ENABLE ROW LEVEL SECURITY;

--
-- Name: Templates Allow update; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow update" ON public."Templates" FOR UPDATE TO anon USING (true) WITH CHECK (true);


--
-- Name: Category; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public."Category" ENABLE ROW LEVEL SECURITY;

--
-- Name: Designation; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public."Designation" ENABLE ROW LEVEL SECURITY;

--
-- Name: Address Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public."Address" FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: Category Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public."Category" FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: Designation Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public."Designation" FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: Person Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public."Person" FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: QNA Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public."QNA" FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: School Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public."School" FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: Templates Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for authenticated users only" ON public."Templates" FOR INSERT TO anon WITH CHECK (true);


--
-- Name: Address Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public."Address" FOR SELECT USING (true);


--
-- Name: Category Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public."Category" FOR SELECT TO anon USING (true);


--
-- Name: Designation Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public."Designation" FOR SELECT TO anon USING (true);


--
-- Name: Person Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public."Person" FOR SELECT TO anon USING (true);


--
-- Name: QNA Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public."QNA" FOR SELECT TO anon USING (true);


--
-- Name: School Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public."School" FOR SELECT TO anon USING (true);


--
-- Name: Templates Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public."Templates" FOR SELECT USING (true);


--
-- Name: Trainings Enable read access for all users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for all users" ON public."Trainings" FOR SELECT TO anon USING (true);


--
-- Name: Person; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public."Person" ENABLE ROW LEVEL SECURITY;

--
-- Name: QNA; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public."QNA" ENABLE ROW LEVEL SECURITY;

--
-- Name: School; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public."School" ENABLE ROW LEVEL SECURITY;

--
-- Name: Templates; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public."Templates" ENABLE ROW LEVEL SECURITY;

--
-- Name: Trainings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public."Trainings" ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: supabase_realtime Address; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public."Address";


--
-- Name: supabase_realtime Category; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public."Category";


--
-- Name: supabase_realtime Designation; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public."Designation";


--
-- Name: supabase_realtime Person; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public."Person";


--
-- Name: supabase_realtime QNA; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public."QNA";


--
-- Name: supabase_realtime School; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public."School";


--
-- Name: supabase_realtime Templates; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public."Templates";


--
-- Name: supabase_realtime Trainings; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public."Trainings";


--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;
GRANT ALL ON FUNCTION auth.email() TO postgres;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;
GRANT ALL ON FUNCTION auth.role() TO postgres;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;
GRANT ALL ON FUNCTION auth.uid() TO postgres;


--
-- Name: FUNCTION algorithm_sign(signables text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION sign(payload json, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION try_cast_double(inp text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.try_cast_double(inp text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.try_cast_double(inp text) TO dashboard_user;


--
-- Name: FUNCTION url_decode(data text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.url_decode(data text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.url_decode(data text) TO dashboard_user;


--
-- Name: FUNCTION url_encode(data bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION verify(token text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO postgres;


--
-- Name: FUNCTION crypto_aead_det_decrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea); Type: ACL; Schema: pgsodium; Owner: pgsodium_keymaker
--

GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_decrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea) TO service_role;


--
-- Name: FUNCTION crypto_aead_det_encrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea); Type: ACL; Schema: pgsodium; Owner: pgsodium_keymaker
--

GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_encrypt(message bytea, additional bytea, key_uuid uuid, nonce bytea) TO service_role;


--
-- Name: FUNCTION crypto_aead_det_keygen(); Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pgsodium.crypto_aead_det_keygen() TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION can_insert_object(bucketid text, name text, owner uuid, metadata jsonb); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) TO postgres;


--
-- Name: FUNCTION extension(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.extension(name text) TO postgres;


--
-- Name: FUNCTION filename(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.filename(name text) TO postgres;


--
-- Name: FUNCTION foldername(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.foldername(name text) TO postgres;


--
-- Name: FUNCTION get_size_by_bucket(); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.get_size_by_bucket() TO postgres;


--
-- Name: FUNCTION list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) TO postgres;


--
-- Name: FUNCTION list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) TO postgres;


--
-- Name: FUNCTION operation(); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.operation() TO postgres;


--
-- Name: FUNCTION search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) TO postgres;


--
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.update_updated_at_column() TO postgres;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE decrypted_key; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE pgsodium.decrypted_key TO pgsodium_keyholder;


--
-- Name: TABLE masking_rule; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE pgsodium.masking_rule TO pgsodium_keyholder;


--
-- Name: TABLE mask_columns; Type: ACL; Schema: pgsodium; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE pgsodium.mask_columns TO pgsodium_keyholder;


--
-- Name: TABLE "Address"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."Address" TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."Address" TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."Address" TO service_role;


--
-- Name: TABLE "Category"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."Category" TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."Category" TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."Category" TO service_role;


--
-- Name: TABLE "Designation"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."Designation" TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."Designation" TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."Designation" TO service_role;


--
-- Name: TABLE "Person"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."Person" TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."Person" TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."Person" TO service_role;


--
-- Name: TABLE "QNA"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."QNA" TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."QNA" TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."QNA" TO service_role;


--
-- Name: TABLE "School"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."School" TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."School" TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."School" TO service_role;


--
-- Name: TABLE "Templates"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."Templates" TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."Templates" TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."Templates" TO service_role;


--
-- Name: SEQUENCE "Templates_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public."Templates_id_seq" TO anon;
GRANT ALL ON SEQUENCE public."Templates_id_seq" TO authenticated;
GRANT ALL ON SEQUENCE public."Templates_id_seq" TO service_role;


--
-- Name: TABLE "Trainings"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."Trainings" TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."Trainings" TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."Trainings" TO service_role;


--
-- Name: TABLE persons_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.persons_data TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.persons_data TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.persons_data TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.schema_migrations TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.subscription TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.buckets TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.buckets TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.buckets TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.buckets TO postgres;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.objects TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.objects TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.objects TO service_role;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.objects TO postgres;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.s3_multipart_uploads TO postgres;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE storage.s3_multipart_uploads_parts TO postgres;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: pgsodium; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium GRANT ALL ON SEQUENCES TO pgsodium_keyholder;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: pgsodium; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO pgsodium_keyholder;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: pgsodium_masks; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT ALL ON SEQUENCES TO pgsodium_keyiduser;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: pgsodium_masks; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT ALL ON FUNCTIONS TO pgsodium_keyiduser;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: pgsodium_masks; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA pgsodium_masks GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO pgsodium_keyiduser;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

