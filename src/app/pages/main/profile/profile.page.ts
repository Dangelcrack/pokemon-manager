import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonAvatar, IonButton, IonIcon, IonLabel, IonItem } from '@ionic/angular/standalone';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SupabaseService } from 'src/app/services/supabase.service';
import { User } from 'src/app/models/user.model';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { addIcons } from 'ionicons';
import { cameraOutline, personOutline, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonItem, IonLabel, IonIcon, IonButton, IonAvatar, IonContent, CommonModule, FormsModule, HeaderComponent]
})
export class ProfilePage implements OnInit {

  utilsService = inject(UtilsService);
  firebaseService = inject(FirebaseService);
  supabaseService = inject(SupabaseService);
  user: User;
  newImage: string | null = null; // Propiedad temporal para almacenar la nueva imagen

  constructor() { 
    this.user = this.utilsService.getLocalStorageUser();
    addIcons({ personCircleOutline, cameraOutline, personOutline });
  }

  ngOnInit() {
  }

  async takeImage() {
    const imageDataUrl = (await this.utilsService.takePicture("Imagen de perfil")).dataUrl;
    this.newImage = imageDataUrl ?? null; // Almacenar la nueva imagen temporalmente
    this.user.image = imageDataUrl ?? ''; // Actualizar la imagen localmente
  }

  async updateProfile() {
    if (!this.newImage) {
      this.utilsService.presentToast({
        color: "warning",
        duration: 1500,
        message: "No hay una nueva imagen para actualizar",
        position: "middle",
        icon: 'alert-circle-outline'
      });
      return;
    }
  
    const loading = await this.utilsService.loading();
    await loading.present();
  
    const path: string = `users/${this.user.uid}`;
    const imagePath = `${this.user.uid}/profile`;
    const imageUrl = await this.supabaseService.uploadImage(imagePath, this.newImage!);
  
    // Añade un parámetro único a la URL de la imagen
    const uniqueImageUrl = `${imageUrl}?${new Date().getTime()}`;
    this.user.image = uniqueImageUrl;
  
    this.firebaseService.updateDocument(path, { image: this.user.image }).then(res => {
      this.utilsService.saveInLocalStorage('user', this.user);
      this.newImage = null; // Limpiar la imagen temporal
      this.utilsService.presentToast({
        color: "success",
        duration: 1500,
        message: "Perfil actualizado exitosamente",
        position: "middle",
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      this.utilsService.presentToast({
        color: "danger",
        duration: 2500,
        message: error.message,
        position: "middle",
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }
  }