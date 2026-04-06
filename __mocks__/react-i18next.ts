export const useTranslation = () => ({
  t: (key: string, opts?: Record<string, unknown>) => {
    if (opts && typeof opts === "object") {
      let result = key;
      for (const [k, v] of Object.entries(opts)) {
        result = result.replace(`{{${k}}}`, String(v));
      }
      return result;
    }
    return key;
  },
  i18n: {
    language: "en",
    changeLanguage: jest.fn(),
  },
});

export const initReactI18next = {
  type: "3rdParty",
  init: jest.fn(),
};
