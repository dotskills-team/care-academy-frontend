import InquiryForm from "@/components/InquiryForm";
import { getCountries } from "@/lib/api/countries";

// Server wrapper: loads the country choices so they are in the server-rendered HTML.
// Only the fields the form needs are sent to the browser.
export default async function InquiryFormSection({ compact }: { compact?: boolean }) {
  const countries = await getCountries();
  return (
    <InquiryForm
      compact={compact}
      countryOptions={countries.map(({ slug, name, code }) => ({ slug, name, code }))}
    />
  );
}
