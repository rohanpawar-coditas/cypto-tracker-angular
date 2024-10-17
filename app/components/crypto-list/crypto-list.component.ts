import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { forkJoin } from 'rxjs';
import { CryptoComponentState } from '../../models/crypto.model';

@Component({
  selector: 'app-crypto-list',
  templateUrl: './crypto-list.component.html',
  styleUrls: ['./crypto-list.component.scss']
})
export class CryptoListComponent implements OnInit {
  public state: CryptoComponentState = {
    cryptocurrencies: [],
    errorMessage: null,
    isLoading: false
  };

  private readonly defaultCryptoIds: string[] = ['bitcoin', 'ethereum', 'dogecoin'];

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.loadCryptocurrencyData(this.defaultCryptoIds);
  }

  public loadCryptocurrencyData(cryptoIds: string[]): void {
    this.state.isLoading = true;
    this.state.errorMessage = null;

    forkJoin(cryptoIds.map(id => this.cryptoService.fetchCryptoData(id))).subscribe({
      next: (data) => {
        this.state.cryptocurrencies = data;
        this.state.isLoading = false;
      },
      error: (error) => {
        this.state.errorMessage = error;
        this.state.isLoading = false;
      }
    });
  }
}