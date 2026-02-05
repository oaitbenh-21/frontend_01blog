import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MediaService {
  private readonly allowedTypes = ['image/', 'video/mp4'];

  constructor(private http: HttpClient) { }

  isValidFile(file: File): boolean {
    return (
      !!file.type &&
      this.allowedTypes.some(type =>
        type.endsWith('/')
          ? file.type.startsWith(type)
          : file.type === type
      )
    );
  }

  async fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async urlToDataUrl(url: string): Promise<string> {
    const blob = await firstValueFrom(
      this.http.get(url, { responseType: 'blob' })
    );
    return this.blobToDataUrl(blob);
  }

  private async blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async normalizeMedia(
    files: File[],
    existing: string[]
  ): Promise<string[]> {
    const result: string[] = [];

    for (const file of files) {
      if (!this.isValidFile(file)) {
        throw new Error('INVALID_FILE_TYPE');
      }
      result.push(await this.fileToDataUrl(file));
    }

    for (const item of existing) {
      if (!item) continue;

      if (!item.startsWith('data:') && this.isUrl(item)) {
        result.push(await this.urlToDataUrl(item));
      }
    }
    return result;
  }

  private isUrl(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
}
