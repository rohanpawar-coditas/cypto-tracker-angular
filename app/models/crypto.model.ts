export interface CryptoMetrics {
  id: string;
  name: string;
  currentPrice: number;
  marketCap: number;
  totalVolume: number;
  priceChangePercentage24h: number;
}

export interface CryptoComponentState {
  cryptocurrencies: CryptoMetrics[];
  errorMessage: string | null;
  isLoading: boolean;
}

export type CryptoApiResponse = {
  [key: string]: {
    usd: number;
    usd_market_cap: number;
    usd_24h_vol: number;
    usd_24h_change: number;
  };
};