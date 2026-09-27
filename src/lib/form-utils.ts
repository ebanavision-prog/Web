export function localizedField(formData: FormData, name: string) {
  return {
    es: String(formData.get(`${name}_es`) ?? ""),
    en: String(formData.get(`${name}_en`) ?? ""),
    fr: String(formData.get(`${name}_fr`) ?? ""),
  };
}

export function localizedListField(formData: FormData, name: string) {
  const toList = (value: string) =>
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  return {
    es: toList(String(formData.get(`${name}_es`) ?? "")),
    en: toList(String(formData.get(`${name}_en`) ?? "")),
    fr: toList(String(formData.get(`${name}_fr`) ?? "")),
  };
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
