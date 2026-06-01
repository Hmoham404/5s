import { Languages } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";

function FlagBadge({ languageCode }) {
  const baseClassName = "relative h-7 w-10 overflow-hidden rounded-md border border-slate-200/80 shadow-sm";

  if (languageCode === "fr") {
    return (
      <span className={`${baseClassName} bg-[linear-gradient(90deg,#1d4ed8_0_33.33%,#ffffff_33.33%_66.66%,#dc2626_66.66%_100%)]`} aria-hidden="true" />
    );
  }

  if (languageCode === "it") {
    return (
      <span className={`${baseClassName} bg-[linear-gradient(90deg,#16a34a_0_33.33%,#ffffff_33.33%_66.66%,#dc2626_66.66%_100%)]`} aria-hidden="true" />
    );
  }

  if (languageCode === "zh") {
    return (
      <svg
        viewBox="0 0 30 21"
        className={baseClassName}
        aria-hidden="true"
      >
        <rect width="30" height="21" fill="#de2910" />
        <polygon
          points="5.5,2.2 6.4,4.9 9.2,4.9 6.9,6.6 7.8,9.3 5.5,7.6 3.2,9.3 4.1,6.6 1.8,4.9 4.6,4.9"
          fill="#ffde00"
        />
        <polygon
          points="12,2.3 12.4,3.4 13.6,3.4 12.6,4.1 13,5.2 12,4.5 11,5.2 11.4,4.1 10.4,3.4 11.6,3.4"
          fill="#ffde00"
        />
        <polygon
          points="14.7,4.7 15.1,5.8 16.3,5.8 15.3,6.5 15.7,7.6 14.7,6.9 13.7,7.6 14.1,6.5 13.1,5.8 14.3,5.8"
          fill="#ffde00"
        />
        <polygon
          points="14.3,8.6 14.7,9.7 15.9,9.7 14.9,10.4 15.3,11.5 14.3,10.8 13.3,11.5 13.7,10.4 12.7,9.7 13.9,9.7"
          fill="#ffde00"
        />
        <polygon
          points="11.6,11.2 12,12.3 13.2,12.3 12.2,13 12.6,14.1 11.6,13.4 10.6,14.1 11,13 10,12.3 11.2,12.3"
          fill="#ffde00"
        />
      </svg>
    );
  }

  if (languageCode === "ar") {
    return (
      <svg
        viewBox="0 0 30 21"
        className={baseClassName}
        aria-hidden="true"
      >
        <rect width="30" height="21" fill="#e70013" />
        <circle cx="15" cy="10.5" r="5.3" fill="#fff" />
        <circle cx="14.2" cy="10.5" r="3.2" fill="#e70013" />
        <circle cx="15" cy="10.5" r="2.7" fill="#fff" />
        <polygon
          points="17.8,8.3 18.4,9.9 20.1,9.9 18.7,11 19.2,12.6 17.8,11.5 16.4,12.6 16.9,11 15.5,9.9 17.2,9.9"
          fill="#e70013"
        />
      </svg>
    );
  }

  return (
    <span className={`${baseClassName} bg-[#012169]`} aria-hidden="true">
      <span className="absolute left-1/2 top-1/2 h-[150%] w-[18%] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
      <span className="absolute left-1/2 top-1/2 h-[150%] w-[18%] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-white" />
      <span className="absolute left-1/2 top-1/2 h-[150%] w-[9%] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#c8102e]" />
      <span className="absolute left-1/2 top-1/2 h-[150%] w-[9%] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-[#c8102e]" />
      <span className="absolute inset-y-0 left-1/2 w-[30%] -translate-x-1/2 bg-white" />
      <span className="absolute inset-x-0 top-1/2 h-[34%] -translate-y-1/2 bg-white" />
      <span className="absolute inset-y-0 left-1/2 w-[16%] -translate-x-1/2 bg-[#c8102e]" />
      <span className="absolute inset-x-0 top-1/2 h-[18%] -translate-y-1/2 bg-[#c8102e]" />
    </span>
  );
}

export default function TranslationBar() {
  const { language, setLanguage, languages, t } = useTranslation();

  return (
    <div className="fixed right-4 top-4 z-50 max-w-[calc(100vw-1rem)]">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur">
        <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-slate-700">
          <Languages className="h-4 w-4 text-red-600" />
          <span className="text-xs font-bold uppercase tracking-wide">{t("translator.title")}</span>
        </div>

        {languages.map((item) => {
          const isActive = item.code === language;

          return (
            <button
              key={item.code}
              onClick={() => setLanguage(item.code)}
              className={`flex min-w-[82px] cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                isActive
                  ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <FlagBadge languageCode={item.code} />
              <span className="flex flex-col leading-none">
                <span className="font-bold">{item.shortLabel}</span>
                <span className={`hidden text-[10px] sm:block ${isActive ? "text-red-100" : "text-slate-400"}`}>
                  {item.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
