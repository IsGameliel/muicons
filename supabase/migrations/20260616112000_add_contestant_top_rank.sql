ALTER TABLE public.contestants
ADD COLUMN IF NOT EXISTS top_rank INT CHECK (top_rank BETWEEN 1 AND 3);

CREATE UNIQUE INDEX IF NOT EXISTS contestants_top_rank_unique
ON public.contestants (top_rank)
WHERE top_rank IS NOT NULL;
