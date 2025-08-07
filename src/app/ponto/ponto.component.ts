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
readonly EMPRESA_LAT = -22.5126777;
readonly EMPRESA_LON = -43.1813659;

readonly RAIO_METROS = 100; // 100 metros de raio

  constructor(private http: HttpClient) {}

  registrarPonto() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
  this.latitude = position.coords.latitude;
  this.longitude = position.coords.longitude;

  const distancia = this.getDistanciaEmMetros(
    this.latitude,
    this.longitude,
    this.EMPRESA_LAT,
    this.EMPRESA_LON
  );

  if (distancia > this.RAIO_METROS) {
    this.erro = `Você está fora da área permitida. Distância: ${Math.round(distancia)} metros.`;
  } else {
    this.erro = null;
  }

  this.buscarEndereco(this.latitude, this.longitude);
},

        (error) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      this.erro = 'Ponto não poderá ser aferido por falta de acesso';
      break;
    case error.POSITION_UNAVAILABLE:
      this.erro = 'Informação de localização indisponível.';
      break;
    case error.TIMEOUT:
      this.erro = 'Tempo de espera para obter localização excedido.';
      break;
    default:
      this.erro = 'Erro desconhecido ao obter localização.';
      break;
  }
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
  getDistanciaEmMetros(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const rad = (x: number) => x * Math.PI / 180;

  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

}
