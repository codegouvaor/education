"use client";

import * as React from "react";
import { useRouter } from "@/i18n/navigation";
import { educationHome } from "@/lib/home-content";

/**
 * Search interface of the future national catalogue of programmes.
 *
 * No catalogue backend exists yet, so the component is the seam where it plugs
 * in: the visitor chooses a level and a field, and the submit routes to the
 * catalogue section (the URL plan of the header navigation). When the
 * catalogue service ships, only the submit handler changes — the accessible
 * form, its labels and its layout stay the same.
 *
 * The markup follows the ADS form primitives (`fr-label`, `fr-select`,
 * `fr-input`, `fr-btn`); it is a real, keyboard-operable form.
 */
export function FormationSearch({
  legend,
  levelLabel,
  levelPlaceholder,
  fieldLabel,
  fieldPlaceholder,
  submitLabel,
  hint,
  levels,
}: {
  legend: string;
  levelLabel: string;
  levelPlaceholder: string;
  fieldLabel: string;
  fieldPlaceholder: string;
  submitLabel: string;
  hint: string;
  levels: ReadonlyArray<{ key: string; label: string }>;
}) {
  const router = useRouter();
  const [level, setLevel] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(educationHome.formation.href);
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset
        style={{
          border: "1px solid var(--ads-color-border)",
          background: "var(--ads-color-background)",
          padding: "1.25rem",
        }}
      >
        <legend className="fr-text--bold" style={{ padding: "0 0.5rem" }}>
          {legend}
        </legend>
        <div className="fr-grid-row fr-grid-row--gutters" style={{ alignItems: "flex-end" }}>
          <div className="fr-col-12 fr-col-md-6">
            <label className="fr-label" htmlFor="formation-level">
              {levelLabel}
            </label>
            <select
              id="formation-level"
              className="fr-select"
              value={level}
              onChange={(event) => setLevel(event.target.value)}
            >
              <option value="">{levelPlaceholder}</option>
              {levels.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="fr-col-12 fr-col-md-6">
            <label className="fr-label" htmlFor="formation-field">
              {fieldLabel}
            </label>
            <input
              id="formation-field"
              className="fr-input"
              type="text"
              name="field"
              placeholder={fieldPlaceholder}
            />
          </div>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <button type="submit" className="fr-btn">
            {submitLabel}
          </button>
        </div>
        <p className="fr-text--sm" style={{ margin: "0.75rem 0 0", color: "var(--ads-color-text-muted)" }}>
          {hint}
        </p>
      </fieldset>
    </form>
  );
}