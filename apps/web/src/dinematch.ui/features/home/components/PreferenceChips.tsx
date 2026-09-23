import { Check } from "lucide-react";
import type {
  PreferenceChip,
  PreferenceKey,
} from "../../../../dinematch.application/recommendations/contracts";

interface PreferenceChipsProps {
  options: PreferenceChip[];
  selectedKeys: ReadonlySet<PreferenceKey>;
  onToggle: (key: PreferenceKey) => void;
}

export function PreferenceChips({
  options,
  selectedKeys,
  onToggle,
}: PreferenceChipsProps) {
  return (
    <section className="preferences" aria-labelledby="preference-heading">
      <div className="section-kicker">Shape your shortlist</div>
      <h2 id="preference-heading">What matters for this meal?</h2>
      <p className="preferences__description">
        Choose or remove any of the six signals DineMatch weighs. Common phrases
        in your request—such as “under $45” or “within 15 minutes”—update them too.
      </p>
      <div className="chip-list" aria-label="Restaurant preference filters">
        {options.map((option) => {
          const isSelected = selectedKeys.has(option.key);

          return (
            <button
              aria-pressed={isSelected}
              className={`preference-chip ${isSelected ? "preference-chip--selected" : ""}`}
              key={option.key}
              onClick={() => onToggle(option.key)}
              type="button"
            >
              {isSelected && <Check aria-hidden="true" size={15} strokeWidth={2.6} />}
              <span>{option.label}</span>
              <strong>{option.value}</strong>
            </button>
          );
        })}
      </div>
    </section>
  );
}
