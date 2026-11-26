"use client";

import { useEffect, useState } from "react";
import { BadgeDollarSign, Eye, GraduationCap, ImageIcon, Info, Landmark, Link2, LoaderCircle, Star } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/components/admin/ui/Modal";
import { ChipGroup, Field, Section, Toggle, inputClass } from "@/components/admin/ui/FormControls";
import ImagePicker from "@/components/admin/ui/ImagePicker";
import { useAdminCountries } from "@/lib/admin/countries";
import { useCreateUniversity, useUpdateUniversity } from "@/lib/admin/universities";
import { assetUrl } from "@/lib/api/client";
import { ApiError } from "@/lib/api/types";
import type { AdminUniversity, UniversityPayload } from "@/lib/api/adminUniversities";
import { INTAKE_MONTHS, STUDY_LEVELS, UNIVERSITY_TYPES, type UniversityType } from "@/lib/universityOptions";

const FORM_ID = "university-form";

// Same limits as the API (media.constants.ts), checked here to fail before uploading
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const IMAGE_NAME = /\.(jpe?g|png|webp|gif)$/i;

// One entry per line in the textarea
const toLines = (value: string) => value.split("\n").map((line) => line.trim()).filter(Boolean);
// An empty box means "not known yet"
const toNumber = (value: string) => (value.trim() === "" ? null : Number(value));

interface Props {
  /** undefined = create */
  university?: AdminUniversity;
  /** Suggested sort position for a new university */
  nextOrder: number;
  onClose: () => void;
}

export default function UniversityFormModal({ university, nextOrder, onClose }: Props) {
  const isNew = !university;
  const [initial] = useState(() => ({
    name: university?.name ?? "",
    country: university?.country?._id ?? "",
    city: university?.city ?? "",
    type: (university?.type ?? "") as UniversityType | "",
    website: university?.website ?? "",
    intro: university?.intro ?? "",
    image: university?.image ?? "",
    levels: university?.levels ?? [],
    subjects: university?.subjects.join("\n") ?? "",
    intakes: university?.intakes ?? [],
    ielts: String(university?.ielts ?? ""),
    tuitionFee: String(university?.tuitionFee ?? ""),
    feeNote: university?.feeNote ?? "",
    order: String(university?.order ?? nextOrder),
    isFeatured: university?.isFeatured ?? false,
    isPublished: university?.isPublished ?? false,
  }));
  const [form, setForm] = useState(initial);
  const set = <K extends keyof typeof initial>(key: K, value: (typeof initial)[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const countries = useAdminCountries({ page: 1, limit: 200 });
  const countryList = countries.data?.countries ?? [];
  const selectedCountry = countryList.find((c) => c._id === form.country);

  const create = useCreateUniversity();
  const update = useUpdateUniversity();
  // The picked file is only sent when the form is saved
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!imageFile) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const shownImage = preview || (form.image ? assetUrl(form.image) : "");

  const busy = create.isPending || update.isPending;
  const err = create.error ?? update.error;
  const fieldError = (field: string) => (err instanceof ApiError ? err.fieldMessage(field) : undefined);

  // Escape or a stray click on the backdrop must not silently throw away a long form
  const requestClose = () => {
    if (busy) return;
    const dirty = !!imageFile || JSON.stringify(form) !== JSON.stringify(initial);
    if (!dirty || window.confirm("Discard your unsaved changes?")) onClose();
  };

  function pickImage(file: File) {
    if (!IMAGE_NAME.test(file.name)) {
      toast.error("Choose a JPG, PNG, WebP or GIF image.");
    } else if (file.size > MAX_IMAGE_BYTES) {
      toast.error("The image must be 10 MB or smaller.");
    } else {
      setImageFile(file);
    }
  }

  // First drops a newly picked file; otherwise marks the saved image for removal
  function removeImage() {
    if (imageFile) setImageFile(null);
    else set("image", "");
  }

  const subjects = toLines(form.subjects);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.type) return;
    if (subjects.length > 30) {
      toast.error("Use at most 30 subjects.");
      return;
    }

    const payload: UniversityPayload = {
      name: form.name.trim(),
      country: form.country,
      city: form.city.trim(),
      type: form.type,
      website: form.website.trim(),
      intro: form.intro.trim(),
      levels: form.levels,
      subjects,
      intakes: form.intakes,
      ielts: toNumber(form.ielts),
      tuitionFee: toNumber(form.tuitionFee),
      feeNote: form.feeNote.trim(),
      order: Number(form.order) || 0,
      isFeatured: form.isFeatured,
      isPublished: form.isPublished,
    };
    // The saved image is kept unless it was removed or a new file replaces it
    if (!imageFile && initial.image && !form.image) payload.image = "";

    try {
      if (isNew) {
        await create.mutateAsync({ payload, imageFile: imageFile ?? undefined });
        toast.success(`${payload.name} added`);
      } else {
        await update.mutateAsync({ id: university._id, payload, imageFile: imageFile ?? undefined });
        toast.success(`${payload.name} updated`);
      }
      onClose();
    } catch (error) {
      const detail = error instanceof ApiError ? error.errorSources[0] : undefined;
      toast.error(
        detail?.path ? `${detail.path}: ${detail.message}` : error instanceof Error ? error.message : "Could not save.",
      );
    }
  }

  const missing = [
    form.name.trim().length < 2 && "name",
    !form.country && "country",
    form.city.trim().length < 2 && "city",
    !form.type && "listing type",
  ].filter(Boolean);
  const valid = missing.length === 0;

  const footer = (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
        {valid ? "All required fields are filled in." : `Still needed: ${missing.join(", ")}`}
      </p>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={requestClose}
          disabled={busy}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          form={FORM_ID}
          disabled={busy || !valid}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {busy ? "Saving…" : isNew ? "Add university" : "Save changes"}
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      title={isNew ? "Add university" : `Edit ${university.name}`}
      subtitle={isNew ? "Create a new university listing" : "Update this university's profile"}
      icon={<Landmark className="h-5 w-5" />}
      size="max-w-3xl"
      footer={footer}
      onClose={requestClose}
    >
      <form id={FORM_ID} onSubmit={submit} className="space-y-4">
        <Section icon={Info} title="Basic information" description="Name, location and listing badge.">
          <Field label="University name" required counter={`${form.name.length}/150`} error={fieldError("name")}>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={150} className={inputClass} autoFocus />
          </Field>

          <p className="flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <Link2 className="h-4 w-4 shrink-0" />
            {isNew ? (
              "The page address is created automatically from the name."
            ) : (
              <span className="min-w-0 truncate">
                Page address: <strong className="text-slate-700 dark:text-slate-200">/universities/{university.slug}</strong>
              </span>
            )}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Country"
              required
              error={fieldError("country") ?? (countries.isError ? "Could not load the countries." : undefined)}
              hint={
                !countries.isPending && countryList.length === 0
                  ? "Add a country first."
                  : selectedCountry && !selectedCountry.isPublished
                    ? "This country is a draft, so the university stays hidden."
                    : undefined
              }
            >
              <select value={form.country} onChange={(e) => set("country", e.target.value)} className={inputClass}>
                <option value="">{countries.isPending ? "Loading…" : "Select a country"}</option>
                {/* Keeps the saved choice selected while the list is still loading */}
                {university?.country && !selectedCountry && (
                  <option value={university.country._id}>{university.country.name}</option>
                )}
                {countryList.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}{c.isPublished ? "" : " (draft)"}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="City" required error={fieldError("city")}>
              <input value={form.city} onChange={(e) => set("city", e.target.value)} maxLength={80} className={inputClass} />
            </Field>
            <Field label="Listing type" required hint="Shown as a badge on the website." error={fieldError("type")}>
              <select value={form.type} onChange={(e) => set("type", e.target.value as UniversityType | "")} className={inputClass}>
                <option value="">Select a type</option>
                {UNIVERSITY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Website" error={fieldError("website")}>
              <input type="url" value={form.website} onChange={(e) => set("website", e.target.value)} maxLength={300} placeholder="https://…" className={inputClass} />
            </Field>
          </div>

          <Field label="Overview" counter={`${form.intro.length}/3000`} error={fieldError("intro")}>
            <textarea rows={3} value={form.intro} onChange={(e) => set("intro", e.target.value)} maxLength={3000} className={inputClass} />
          </Field>
        </Section>

        <Section icon={ImageIcon} title="Cover image" description="Shown on the university card and profile banner.">
          <ImagePicker
            src={shownImage}
            fileName={imageFile?.name}
            disabled={busy}
            error={fieldError("image")}
            onPick={pickImage}
            onRemove={removeImage}
          />
        </Section>

        <Section icon={GraduationCap} title="Academics" description="Visitors filter by these.">
          <ChipGroup label="Study levels" options={STUDY_LEVELS} value={form.levels} onChange={(v) => set("levels", v)} />
          <Field label="Subjects" counter={`${subjects.length}/30`} invalid={subjects.length > 30} hint="One per line. Use the same spelling across universities.">
            <textarea rows={4} value={form.subjects} onChange={(e) => set("subjects", e.target.value)} placeholder={"Computer Science\nBusiness"} className={inputClass} />
          </Field>
          <ChipGroup label="Intakes" options={INTAKE_MONTHS} value={form.intakes} onChange={(v) => set("intakes", v)} />
        </Section>

        <Section icon={BadgeDollarSign} title="Requirements & fees" description="Leave a field empty if it is not confirmed yet.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Minimum IELTS" hint="Overall band, e.g. 6.5" error={fieldError("ielts")}>
              <input type="number" min={0} max={9} step={0.5} value={form.ielts} onChange={(e) => set("ielts", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Tuition from (€ per year)" hint="Whole euros, used by the fee filter." error={fieldError("tuitionFee")}>
              <input type="number" min={0} max={1000000} step={1} value={form.tuitionFee} onChange={(e) => set("tuitionFee", e.target.value)} className={inputClass} />
            </Field>
          </div>
          <Field label="Fee note" counter={`${form.feeNote.length}/300`} error={fieldError("feeNote")}>
            <input value={form.feeNote} onChange={(e) => set("feeNote", e.target.value)} maxLength={300} placeholder="e.g. Fees differ by programme" className={inputClass} />
          </Field>
        </Section>

        <Section icon={Eye} title="Visibility" description="Control where this university appears.">
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle icon={Eye} title="Published" description="Visible on the website" checked={form.isPublished} onChange={(v) => set("isPublished", v)} />
            <Toggle icon={Star} title="Featured" description="Shown on the home page" checked={form.isFeatured} onChange={(v) => set("isFeatured", v)} />
          </div>
          <div className="sm:w-1/2 sm:pr-1.5">
            <Field label="Display order" hint="Lower numbers come first." error={fieldError("order")}>
              <input type="number" min={0} max={10000} value={form.order} onChange={(e) => set("order", e.target.value)} className={inputClass} />
            </Field>
          </div>
        </Section>
      </form>
    </Modal>
  );
}
