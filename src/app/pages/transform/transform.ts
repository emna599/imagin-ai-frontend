import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transform',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './transform.html',
  styleUrls: ['./transform.css']
})
export class TransformComponent {
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  transformedImage: string | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  // On injecte ChangeDetectorRef pour forcer Angular à rafraîchir l'écran
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (!file) return;

    // Vérification du type
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Veuillez sélectionner une image valide.';
      return;
    }

    this.selectedFile = file;
    this.errorMessage = '';
    this.transformedImage = null;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      // On met à jour la variable et on force le rafraîchissement
      this.imagePreview = e.target.result;
      this.cdr.detectChanges();
      console.log('Aperçu généré avec succès');
    };

    reader.readAsDataURL(file);
  }

  transform(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Aucune image sélectionnée.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    // Envoi vers ton Backend Flask (Port 5000 par défaut)
    this.http.post<any>('http://localhost:5000/transform', formData).subscribe({
      next: (response) => {
        if (response.imageUrl) {
          this.transformedImage = 'http://localhost:5000' + response.imageUrl;
        } else if (response.imageBase64) {
          this.transformedImage = 'data:image/jpeg;base64,' + response.imageBase64;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur de connexion avec le serveur Flask.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  downloadImage(): void {
    if (!this.transformedImage) return;
    const link = document.createElement('a');
    link.href = this.transformedImage;
    link.download = 'artify_result.jpg';
    link.click();
  }
}
