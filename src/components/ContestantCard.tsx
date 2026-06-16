import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SignedImage } from "./SignedImage";
import { formatNumber } from "@/lib/format";

export type Contestant = {
  id: string;
  contestant_number: number;
  full_name: string;
  faculty: string | null;
  image: string | null;
  top_rank?: number | null;
  total_votes: number;
};

export function ContestantCard({ c, rank }: { c: Contestant; rank?: number }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-luxe">
      <div className="relative aspect-[3/4] overflow-hidden">
        <SignedImage
          bucket="contestant-photos"
          path={c.image}
          alt={c.full_name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          fallbackClassName="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/85 via-onyx/10 to-transparent" />
        <Badge className="absolute left-3 top-3 gradient-gold text-onyx border-0 font-semibold">
          #{c.contestant_number}
        </Badge>
        {rank && rank <= 3 && (
          <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-onyx/80 text-gold backdrop-blur">
            <Star className="h-4 w-4 fill-gold" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 text-pearl">
          <h3 className="font-display text-lg leading-tight">{c.full_name}</h3>
          {c.faculty && <p className="mt-0.5 text-xs text-pearl/70">{c.faculty}</p>}
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <Heart className="h-3.5 w-3.5 fill-rose text-rose" />
            <span className="font-medium">{formatNumber(c.total_votes)} votes</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 p-3">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link to="/contestants/$id" params={{ id: c.id }}>Profile</Link>
        </Button>
        <Button asChild size="sm" className="flex-1 gradient-gold text-onyx">
          <Link to="/vote/$id" params={{ id: c.id }}>Vote</Link>
        </Button>
      </div>
    </article>
  );
}
