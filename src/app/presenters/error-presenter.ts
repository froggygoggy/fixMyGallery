import { de } from '../i18n/de';

const KNOWN_ERROR_MAP: Record<string, string> = {
  'At least one folder must be selected.': 'Bitte wähle mindestens einen Ordner aus.',
  'Old cleanup plan quota must be greater than zero.': 'Das Pensum für alte Fotos muss größer als 0 sein.',
  'New cleanup plan quota must be greater than zero.': 'Das Pensum für neue Fotos muss größer als 0 sein.',
  'Reminder time must be in HH:mm format.': 'Erinnerungszeit muss im Format HH:mm sein.',
  'New photos window days must be greater than zero.': 'Der Zeitraum für neue Fotos muss größer als 0 sein.',
};

export class ErrorPresenter {
  toUserMessage(error: string): string {
    return KNOWN_ERROR_MAP[error] ?? de.common.unknownError;
  }

  toUserMessages(errors: string[]): string[] {
    return errors.map((e) => this.toUserMessage(e));
  }
}
