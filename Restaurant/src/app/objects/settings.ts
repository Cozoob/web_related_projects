import {ISettings} from "../interfaces/settings.object";

export class Settings implements ISettings{
  persistence: number;
  key: string;

  constructor(key: string, persistence: number) {
    this.key = key;
    this.persistence = persistence;
  }
}
