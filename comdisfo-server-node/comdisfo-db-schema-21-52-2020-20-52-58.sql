CREATE SCHEMA "comdisfo_demo" AUTHORIZATION postgres;

CREATE OR REPLACE FUNCTION "comdisfo_demo".u_date() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    NEW.u_date = now();
    RETURN NEW;
  END;
$$;

CREATE TABLE "comdisfo_demo"."topics"(
id serial primary key,
 "title" text not null,
 "tag_id" integer,
 "description" text,
c_date timestamp without time zone DEFAULT timezone('utc'::text, now()),
u_date timestamp without time zone DEFAULT timezone('utc'::text, now()),
c_uid integer,
u_uid integer,
nb_comments integer DEFAULT 0,
nb_votings integer DEFAULT 0);
CREATE INDEX idx_topics_tag_id ON "comdisfo_demo"."topics" USING btree ("tag_id");

CREATE TRIGGER tr_u_topics BEFORE UPDATE ON "comdisfo_demo".topics FOR EACH ROW EXECUTE PROCEDURE "comdisfo_demo".u_date();
CREATE TABLE IF NOT EXISTS "comdisfo_demo"."topic_tag"(id serial NOT NULL, name text NOT NULL,icon text, CONSTRAINT topics_tag_pkey PRIMARY KEY (id));

INSERT INTO "comdisfo_demo"."topic_tag"(id, name, icon) VALUES (1,'Generic',''),
(2,'Technology',''),
(3,'Sales',''),
(4,'Marketing',''),
(5,'Misc.','');

CREATE TABLE "comdisfo_demo"."comments"(
id serial primary key,
 "topic_id" integer,
 "comment" text not null,
c_date timestamp without time zone DEFAULT timezone('utc'::text, now()),
c_uid integer);

CREATE TRIGGER tr_u_comments BEFORE UPDATE ON "comdisfo_demo".comments FOR EACH ROW EXECUTE PROCEDURE "comdisfo_demo".u_date();
