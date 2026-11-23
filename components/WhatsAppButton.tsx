import { site } from "@/lib/data";

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${site.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#1ebe5b]"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden="true">
        <path d="M20.5 3.5A11 11 0 0 0 3.2 17.4L2 22l4.7-1.2A11 11 0 1 0 20.5 3.5zM12 20a8.9 8.9 0 0 1-4.5-1.2l-.3-.2-2.8.7.8-2.7-.2-.3A8.9 8.9 0 1 1 12 20zm4.9-6.6c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.6.1a7.3 7.3 0 0 1-3.600-3.100c-.3-.5.3-.5.8-1.500.1-.2 0-.3 0-.5l-.8-1.900c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.200 5.200 5.200 0 0 0 1.100 2.800 11.800 11.800 0 0 0 4.500 4c1.700.7 2.300.8 3.200.700.5-.1 1.600-.7 1.800-1.300.2-.6.2-1.100.2-1.200-.1-.1-.3-.2-.6-.3z" />
      </svg>
    </a>
  );
}
