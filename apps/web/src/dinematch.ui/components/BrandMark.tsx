import { Sparkles } from "lucide-react";

export function BrandMark() {
  return (
    <a className="brand" href="#top" aria-label="DineMatch home">
      <span className="brand__mark" aria-hidden="true">
        <Sparkles size={19} strokeWidth={2.3} />
      </span>
      <span>DineMatch</span>
    </a>
  );
}
