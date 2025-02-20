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
  imageOutline
} from 'ionicons/icons';
import { IonButton } from '@ionic/angular/standalone';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

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

form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    image: new FormControl('', [Validators.required]),
    units: new FormControl('', [Validators.required, Validators.minLength(1)]),
    basepoints: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
      bodyOutline,
      personOutline,
      alertCircleOutline,
      imageOutline
    });
  }

  async takeImage(){
    const dataUrl = (await this.utilsService.takePicture("Imagen de la miniatura")).dataUrl
    if(dataUrl){
      this.form.controls.image.setValue(dataUrl);
    }
  }

  ngOnInit() {}
  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();
      this.firebaseService
        .signUp(this.form.value as User)
        .then(async (res) => {
          this.firebaseService.updateUser(this.form.value.name!);
          let uid = res.user!.uid;
        })
        .catch((error) => {
          this.utilsService.presentToast({
            message: error.message,
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }
}
