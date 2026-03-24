import { ExerciseType } from '@cro/shared';
import type { TFunction } from 'i18next';

export function getExerciseTypeLabel(type: ExerciseType, t: TFunction): string {
  switch (type) {
    case ExerciseType.JEDNINA_MNOZINA:
      return t('exercises.types.jedninaMnozina');
    case ExerciseType.FLASHCARDS:
      return t('exercises.types.flashcards');
    case ExerciseType.FILL_IN_BLANK:
      return t('exercises.types.fillInBlank');
    default:
      return type;
  }
}
