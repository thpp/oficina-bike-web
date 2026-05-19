import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private accessToken?: string;

  definirAccessToken(token: string): void {
    this.accessToken = token;
  }

  obterAccessToken(): string | undefined {
    return this.accessToken;
  }

  limpar(): void {
    this.accessToken = undefined;
  }
}
