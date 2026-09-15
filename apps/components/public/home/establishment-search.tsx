"use client";

import * as React from "react";
import { useRouter } from "@/i18n/navigation";
import { educationHome } from "@/lib/home-content";

/**
 * Search interface of the future national directory of establishments.
 *
 * There is no directory backend yet, so the component is the seam where it
 * plugs in: the visitor chooses a type of establishment and an optional
 * location, and the submit routes to the matching directory section (the URL
 * plan of the header navigation). When the directory service ships, only the
 * submit handler changes — the accessible form, its labels and its layout stay
 * the same.
 *
 * The markup follows the ADS form primitives (`fr-label`, `fr-select`,
 * `fr-input`, `fr-btn`); it is a real, keyboard-operable form, never a
 * hover-only control.
 */
export function EstablishmentSearch({
  legend,
  typeLabel,
  typePlaceholder,
  locationLabel,
  locationPlaceholder,
  submitLabel,
  hint,
  types,
}: {
  legend: string;
  typeLabel: string;
  typePlaceholder: string;
  locationLabel: string;
  locationPlaceholder: string;
  submitLabel: string;
  hint: string;
  types: ReadonlyArray<{ key: string; label: string }>;
}) {
  const router = useRouter();
  const [type, setType] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selected = educationHome.establishment.types.find((item) => item.key === type);
    router.push(selected?.href ?? educationHome.establishment.href);
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
            <label className="fr-label" htmlFor="establishment-type">
              {typeLabel}
            </label>
            <select
              id="establishment-type"
              className="fr-select"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="">{typePlaceholder}</option>
              {types.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="fr-col-12 fr-col-md-6">
            <label className="fr-label" htmlFor="establishment-location">
              {locationLabel}
            </label>
            <input
              id="establishment-location"
              className="fr-input"
              type="text"
              name="location"
              placeholder={locationPlaceholder}
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