// Runs before first paint so the saved (or system) theme applies without a flash.
// Keep the storage key in sync with components/admin/layout/ThemeToggle.tsx.
const themeScript = `try{var t=localStorage.getItem("care-admin-theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
