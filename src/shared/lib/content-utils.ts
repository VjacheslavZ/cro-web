interface LocalizedItem {
  nameHr: string;
  nameRu: string;
  nameUk: string;
  nameEn: string;
}

export function getLocalizedName(item: LocalizedItem, lang: string | null): string {
  switch (lang) {
    case 'RU':
      return item.nameRu;
    case 'UK':
      return item.nameUk;
    default:
      return item.nameEn;
  }
}

interface TranslatableItem {
  translationRu: string;
  translationUk: string;
  translationEn: string;
}

export function getTranslation(item: TranslatableItem, lang: string | null): string {
  switch (lang) {
    case 'RU':
      return item.translationRu;
    case 'UK':
      return item.translationUk;
    default:
      return item.translationEn;
  }
}

export function normalizeAnswer(input: string): string {
  return input.trim().toLowerCase().normalize('NFC');
}
