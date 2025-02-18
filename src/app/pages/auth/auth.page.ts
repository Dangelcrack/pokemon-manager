import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { CustomInputComponent } from "../../shared/components/custom-input/custom-input.component";
import { lockClosedOutline, mailOutline, logInOutline, personAddOutline } from 'ionicons/icons'
import { addIcons } from 'ionicons';
import { LogoComponent } from "../../shared/components/logo/logo.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [RouterLink, IonIcon, HeaderComponent, IonContent, CommonModule, FormsModule, CustomInputComponent, ReactiveFormsModule, IonButton, LogoComponent],
})
export class AuthPage implements OnInit {
  form = new FormGroup( {
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',Validators.required)
  })
  constructor() { addIcons({logInOutline,personAddOutline,mailOutline,lockClosedOutline});}

  ngOnInit() {
  }

  submit(){
    console.log(this.form.value);
  }

}
