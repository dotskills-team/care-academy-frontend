"use client";

import { useEffect, useState } from "react";
import { Eye, Globe, ImageIcon, Info, Link2, ListChecks, LoaderCircle, Star } from "lucide-react";
import { toast } from "sonner";
import Flag from "@/components/Flag";
import Modal from "@/components/admin/ui/Modal";
import { Field, Section, Toggle, inputClass } from "@/components/admin/ui/FormControls";
import ImagePicker from "@/components/admin/ui/ImagePicker";
import { useCreateCountry, useUpdateCountry } from "@/lib/admin/countries";
import { assetUrl } from "@/lib/api/client";
import { ApiError } from "@/lib/api/types";
import type { AdminCountry, CountryPayload } from "@/lib/api/adminCountries";

const FORM_ID = "country-form";

// Same limits as the API (media.constants.ts), checked here to fail before uploading
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const IMAGE_NAME = /\.(jpe?g|png|webp|gif)$/i;

// One entry per line in the textarea
const toLines = (value: string) => value.split("\n").map((line) => line.trim()).filter(Boolean);

interface Props {
  /** undefined = create */
  country?: AdminCountry;
  /** Suggested sort position for a new country */
  nextOrder: number;
  onClose: () => void;
}

export default function CountryFormModal({ country, nextOrder, onClose }: Props) {
  const isNew = !country;
  const [initial] = useState(() => ({
    name: country?.name ?? "",
    code: country?.code ?? "",
    intro: country?.intro ?? "",
    image: country?.image ?? "",
    tuition: country?.tuition ?? "",
    visa: country?.visa ?? "",
    workRules: country?.workRules ?? "",
    intakes: country?.intakes.join("\n") ?? "",
    highlights: country?.highlights.join("\n") ?? "",
    order: String(country?.order ?? nextOrder),
    isFeatured: country?.isFeatured ?? false,
    isPublished: country?.isPublished ?? false,
  }));
  const [form, setForm] = useState(initial);
  const set = <K extends keyof typeof initial>(key: K, value: (typeof initial)[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const create = useCreateCountry();
  const update = useUpdateCountry();
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

  const intakes = toLines(form.intakes);
  const highlights = toLines(form.highlights);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (intakes.length > 12 || highlights.length > 10) {
      toast.error("Use at most 12 intakes and 10 highlights.");
      return;
    }

    const payload: CountryPayload = {
      name: form.name.trim(),
      code: form.code.trim().toLowerCase(),
      intro: form.intro.trim(),
      tuition: form.tuition.trim(),
      visa: form.visa.trim(),
      workRules: form.workRules.trim(),
      intakes,
      highlights,
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
        await update.mutateAsync({ id: country._id, payload, imageFile: imageFile ?? undefined });
        toast.success(`${payload.name} updated`);
      }
      onClose();
    } catch (error) {
      const detail = error instanceof ApiError ? error.errorSources[0] : undefined;
      toast.error(
        detail ? `${detail.path}: ${detail.message}` : error instanceof Error ? error.message : "Could not save.",
      );
    }
  }

  const code = form.code.trim().toLowerCase();
  const codeValid = /^[a-z]{2}$/.test(code);
  const missing = [
    form.name.trim().length < 2 && "name",
    !codeValid && "country code",
    form.intro.trim().length < 10 && "introduction (10+ characters)",
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
          {busy ? "Saving…" : isNew ? "Add country" : "Save changes"}
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      title={isNew ? "Add country" : `Edit ${country.name}`}
      subtitle={isNew ? "Create a new study destination" : "Update how this destination appears on the website"}
      icon={<Globe className="h-5 w-5" />}
      size="max-w-3xl"
      footer={footer}
      onClose={requestClose}
    >
      <form id={FORM_ID} onSubmit={submit} className="space-y-4">
        <Section icon={Info} title="Basic information" description="The name, flag and short description.">
          <div className="grid gap-4 sm:grid-cols-[1fr_190px]">
            <Field label="Country name" required counter={`${form.name.length}/80`} error={fieldError("name")}>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                maxLength={80}
                placeholder="e.g. Sweden"
                className={inputClass}
                autoFocus
              />
            </Field>
            <Field label="Country code" required hint="Two letters, for the flag." error={fieldError("code")}>
              <span className="relative block">
                <input
                  value={form.code}
                  onChange={(e) => set("code", e.target.value.replace(/[^a-z]/gi, ""))}
                  maxLength={2}
                  placeholder="se"
                  className={`${inputClass} pr-14 uppercase`}
                />
                {codeValid && (
                  <span className="pointer-events-none absolute right-3 top-1/2 mt-[3px] -translate-y-1/2">
                    <Flag code={code} name={form.name || code} className="h-5 w-7" />
                  </span>
                )}
              </span>
            </Field>
          </div>

          <p className="flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <Link2 className="h-4 w-4 shrink-0" />
            {isNew ? (
              "The page address is created automatically from the name."
            ) : (
              <span className="min-w-0 truncate">
                Page address: <strong className="text-slate-700 dark:text-slate-200">/destinations/{country.slug}</strong>
              </span>
            )}
          </p>

          <Field label="Introduction" required counter={`${form.intro.length}/2000`} error={fieldError("intro")}>
            <textarea
              rows={3}
              value={form.intro}
              onChange={(e) => set("intro", e.target.value)}
              maxLength={2000}
              placeholder="What makes this destination a good place to study?"
              className={inputClass}
            />
          </Field>
        </Section>

        <Section icon={ImageIcon} title="Cover image" description="Shown on the destination card and page banner. A wide photo works best.">
          <ImagePicker
            src={shownImage}
            fileName={imageFile?.name}
            disabled={busy}
            error={fieldError("image")}
            onPick={pickImage}
            onRemove={removeImage}
          />
        </Section>

        <Section icon={ListChecks} title="Key facts" description="Empty fields show “To be confirmed” on the website.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tuition" error={fieldError("tuition")}>
              <textarea rows={3} value={form.tuition} onChange={(e) => set("tuition", e.target.value)} maxLength={1000} placeholder="Typical yearly fees" className={inputClass} />
            </Field>
            <Field label="Visa" error={fieldError("visa")}>
              <textarea rows={3} value={form.visa} onChange={(e) => set("visa", e.target.value)} maxLength={1000} placeholder="Visa type and requirements" className={inputClass} />
            </Field>
            <Field label="Work rules" error={fieldError("workRules")}>
              <textarea rows={3} value={form.workRules} onChange={(e) => set("workRules", e.target.value)} maxLength={1000} placeholder="Part-time and post-study work" className={inputClass} />
            </Field>
            <Field label="Intakes" counter={`${intakes.length}/12`} invalid={intakes.length > 12} hint="One per line.">
              <textarea rows={3} value={form.intakes} onChange={(e) => set("intakes", e.target.value)} placeholder={"September\nJanuary"} className={inputClass} />
            </Field>
          </div>
          <Field label="Why study here" counter={`${highlights.length}/10`} invalid={highlights.length > 10} hint="One point per line.">
            <textarea rows={4} value={form.highlights} onChange={(e) => set("highlights", e.target.value)} placeholder={"Globally recognised degrees\nScholarships for international students"} className={inputClass} />
          </Field>
        </Section>

        <Section icon={Eye} title="Visibility" description="Control where this destination appears.">
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle
              icon={Eye}
              title="Published"
              description="Visible on the website"
              checked={form.isPublished}
              onChange={(checked) => set("isPublished", checked)}
            />
            <Toggle
              icon={Star}
              title="Featured"
              description="Shown on the home page"
              checked={form.isFeatured}
              onChange={(checked) => set("isFeatured", checked)}
            />
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
