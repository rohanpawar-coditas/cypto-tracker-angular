import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CryptoApiResponse, CryptoMetrics } from '../models/crypto.model';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private readonly API_URL = 'https://api.coingecko.com/api/v3/simple/price';

  constructor(private http: HttpClient) {}

  public fetchCryptoData(cryptoId: string): Observable<CryptoMetrics> {
    const params = this.createHttpParams([cryptoId]);

    return this.http.get<CryptoApiResponse>(this.API_URL, { params }).pipe(
      catchError(this.handleError),
      map(response => this.mapResponseToCryptoMetrics(response, cryptoId))
    );
  }

  public fetchMultipleCryptoData(cryptoIds: string[]): Observable<CryptoMetrics[]> {
    const params = this.createHttpParams(cryptoIds);

    return this.http.get<CryptoApiResponse>(this.API_URL, { params }).pipe(
      catchError(this.handleError),
      map(response => this.mapResponseToMultipleCryptoMetrics(response, cryptoIds))
    );
  }

  private createHttpParams(cryptoIds: string[]): HttpParams {
    return new HttpParams()
      .set('ids', cryptoIds.join(','))
      .set('vs_currencies', 'usd')
      .set('include_market_cap', 'true')
      .set('include_24hr_vol', 'true')
      .set('include_24hr_change', 'true');
  }

  private mapResponseToCryptoMetrics(response: CryptoApiResponse, cryptoId: string): CryptoMetrics {
    const data = response[cryptoId];
    if (!data) {
      throw new Error(`Cryptocurrency not found: ${cryptoId}`);
    }
    return {
      id: cryptoId,
      name: cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1),
      currentPrice: data.usd,
      marketCap: data.usd_market_cap,
      totalVolume: data.usd_24h_vol,
      priceChangePercentage24h: data.usd_24h_change
    };
  }

  private mapResponseToMultipleCryptoMetrics(response: CryptoApiResponse, cryptoIds: string[]): CryptoMetrics[] {
    return cryptoIds.map(id => {
      const data = response[id] || { usd: 0, usd_market_cap: 0, usd_24h_vol: 0, usd_24h_change: 0 };
      return {
        id: id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        currentPrice: data.usd ?? 0,
        marketCap: data.usd_market_cap ?? 0,
        totalVolume: data.usd_24h_vol ?? 0,
        priceChangePercentage24h: data.usd_24h_change ?? 0
      };
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('Error fetching cryptocurrency data:', error);
    const errorMessage = error.error?.message || 'Failed to fetch data. Please try again later.';
    return throwError(errorMessage);
  }
}