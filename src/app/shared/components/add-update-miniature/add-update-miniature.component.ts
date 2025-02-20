import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonAvatar
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { CustomInputComponent } from 'src/app/shared/components/custom-input/custom-input.component';
import { addIcons } from 'ionicons';
import {
  lockClosedOutline,
  mailOutline,
  bodyOutline,
  personOutline,
  alertCircleOutline,
  imageOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import { IonButton } from '@ionic/angular/standalone';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-add-update-miniature',
  templateUrl: './add-update-miniature.component.html',
  styleUrls: ['./add-update-miniature.component.scss'],
  imports: [
      IonIcon,
      HeaderComponent,
      IonContent,
      CommonModule,
      FormsModule,
      CustomInputComponent,
      ReactiveFormsModule,
      IonButton,
      IonAvatar,
    ],
})
export class AddUpdateMiniatureComponent  implements OnInit {

;

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  supabaseService = inject(SupabaseService)
  user : User = {} as User;


form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image: new FormControl('', [Validators.required]),
    units: new FormControl('', [Validators.required, Validators.minLength(1)]),
    basepoints: new FormControl('', [Validators.required, Validators.minLength(1)]),
  })
  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
      bodyOutline,
      personOutline,
      alertCircleOutline,
      imageOutline,
      checkmarkCircleOutline
    });
  }

  async takeImage(){
    const dataUrl = (await this.utilsService.takePicture("Imagen de la miniatura")).dataUrl
    if(dataUrl){
      this.form.controls.image.setValue(dataUrl);
    }
  }

  ngOnInit() {
    this.user = this.utilsService.getLocalStorageUser();
  }
  async submit() {
    const loading = await this.utilsService.loading();
    await loading.present();

    const path: string = `users/${this.user.uid}/miniatures`

    const imageDataUrl = this.form.value.image;
    const imagePath = `${this.user.uid}/${Date.now()}`
    const imageUrl = await this.supabaseService.uploadImage(imagePath, imageDataUrl!)
    this.form.controls.image.setValue(imageUrl)
    delete this.form.value.id;

    this.firebaseService.addDocument(path, this.form.value).then(res => {
      this.utilsService.dismissModal({ success: true });
      this.utilsService.presentToast({
        color: "success",
        duration: 1500,
        message: "Miniatura añadida exitosamente",
        position: "middle",
        icon: 'checkmark-circle-outline'
      })
    }).catch(error => {
      this.utilsService.presentToast({
        color: "danger",
        duration: 2500,
        message: error.message,
        position: "middle",
        icon: 'alert-circle-outline'
      })
    }).finally(() => {
      loading.dismiss();
    })
    }
  }
