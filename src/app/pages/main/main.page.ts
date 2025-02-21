import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonRouterOutlet, IonMenu, IonMenuToggle, IonItem, IonIcon, IonLabel, IonFooter, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { homeOutline, personOutline, pizza, logOutOutline, personCircleOutline } from 'ionicons/icons';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [IonFooter, RouterLinkActive, IonLabel, IonIcon, IonItem, IonMenuToggle, IonMenu, IonRouterOutlet, IonContent, CommonModule, FormsModule, RouterLink, HeaderComponent]
})
export class MainPage implements OnInit {
  user: User;
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  router = inject(Router);
  pages = [
    {
      title: "Inicio",
      url: "/main/home",
      icon: "home-outline"
    },
    {
      title: "Perfil",
      url: "/main/profile",
      icon: "person-outline"
    }
  ]
  constructor() {
    addIcons({ personCircleOutline, logOutOutline, pizza, homeOutline, personOutline });
    this.user = this.utilsService.getLocalStorageUser();
  }
  signOut() {
    this.firebaseService.signOut().then(() => {
      this.router.navigate(['/auth']).then(() => {
        window.location.reload();
      });
    });
  }
  ngOnInit() {

  }
}