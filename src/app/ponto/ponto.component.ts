import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-ponto',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './ponto.component.html',
  styleUrls: ['./ponto.component.css']
})
export class PontoComponent {
  latitude: number | null = null;
  longitude: number | null = null;
  endereco: string | null = null;
  erro: string | null = null;

  constructor(private http: HttpClient) {}

  registrarPonto() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.erro = null;

          this.buscarEndereco(this.latitude, this.longitude);
        },
        (error) => {
          this.erro = `Erro: ${error.message}`;
          this.endereco = null;
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      this.erro = 'Geolocalização não é suportada pelo navegador.';
      this.endereco = null;
    }
  }

  buscarEndereco(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.endereco = data.display_name || 'Endereço não encontrado';
      },
      error: () => {
        this.endereco = 'Não foi possível obter o endereço';
      }
    });
  }
}
