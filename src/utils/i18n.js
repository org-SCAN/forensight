export const loadLanguage = async (lang) => {
  try {
    const response = await import(`../i18/${lang}.json`);
    return response.default;
  } catch (error) {
    console.error(`Error loading ${lang}.json, falling back to English.`, error);
    const fallback = await import(`../i18/en.json`);
    return fallback.default;
  }
};