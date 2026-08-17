insert into public.shows (
  title,
  slug,
  meta,
  description,
  mux_playback_id,
  featured,
  tags,
  cast,
  director
)
values
  (
    'Lead Program Title',
    'lead-program-title',
    'Documentary • 1h 45m • 2026',
    'An exclusive look into the creative process of independent voices. This feature presentation takes you behind the scenes of community-driven storytelling, raw stand-up, and underground music scenes.',
    'DS00Spx1CV902MCtPj5WknGlR102V5HFkDe',
    true,
    array['Indie', 'Exclusive', 'Culture'],
    array['Host Name', 'Featured Guest 1', 'Featured Guest 2'],
    'Word of Mouth Productions'
  ),
  (
    'Night Signal',
    'night-signal',
    'Drama • 45 min',
    'A tense, late-night story about the edges of a city and the people who refuse to disappear.',
    'DS00Spx1CV902MCtPj5WknGlR102V5HFkDe',
    true,
    array['Drama', 'City', 'Indie'],
    array['Ava Quinn', 'Milo Hart'],
    'Lena Hart'
  ),
  (
    'The Last Echo',
    'the-last-echo',
    'Documentary • 38 min',
    'A reflective documentary tracing the memory and momentum of local artists rebuilding culture in real time.',
    'DS00Spx1CV902MCtPj5WknGlR102V5HFkDe',
    true,
    array['Documentary', 'Culture', 'Local'],
    array['Arlo Mendez', 'Sana River'],
    'Theo Vale'
  ),
  (
    'Open Frame',
    'open-frame',
    'Indie • 52 min',
    'A conversation-driven showcase of emerging directors, photographers, and filmmakers from overlooked communities.',
    'DS00Spx1CV902MCtPj5WknGlR102V5HFkDe',
    true,
    array['Indie', 'Film', 'Creator'],
    array['Nia Moore', 'Jules Park'],
    'Mara Fields'
  ),
  (
    'City Noise',
    'city-noise',
    'Comedy • 31 min',
    'A fast-paced comedy special built around the chaos, rhythm, and absurdity of everyday city life.',
    'DS00Spx1CV902MCtPj5WknGlR102V5HFkDe',
    true,
    array['Comedy', 'Standup', 'Local'],
    array['Rae Solomon', 'Mason Lee'],
    'Jules Park'
  )
on conflict (slug) do update set
  title = excluded.title,
  meta = excluded.meta,
  description = excluded.description,
  mux_playback_id = excluded.mux_playback_id,
  featured = excluded.featured,
  tags = excluded.tags,
  cast = excluded.cast,
  director = excluded.director,
  updated_at = now();
