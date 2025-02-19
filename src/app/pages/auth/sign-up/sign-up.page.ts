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
  IonHeader,
  IonToolbar,
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { CustomInputComponent } from 'src/app/shared/components/custom-input/custom-input.component';
import { addIcons } from 'ionicons';
import {
  lockClosedOutline,
  mailOutline,
  personAddOutline,
  personOutline,
  alertCircleOutline,
} from 'ionicons/icons';
import { IonButton } from '@ionic/angular/standalone';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    HeaderComponent,
    IonContent,
    CommonModule,
    FormsModule,
    CustomInputComponent,
    ReactiveFormsModule,
    IonButton,
    LogoComponent,
  ],
})
export class SignUpPage implements OnInit {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  constructor() {
    addIcons({
      mailOutline,
      lockClosedOutline,
      personAddOutline,
      personOutline,
      alertCircleOutline,
    });
  }

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();
      this.firebaseService
        .signUp(this.form.value as User)
        .then(async (res) => {
          this.firebaseService.updateUser(this.form.value.name!)
          console.log(res)
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