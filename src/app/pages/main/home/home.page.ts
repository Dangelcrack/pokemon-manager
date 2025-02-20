import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonIcon, IonLabel, IonItem, IonItemSliding, IonList, IonItemOptions, IonItemOption, IonAvatar, IonChip, IonSkeletonText, IonRefresher, IonRefresherContent, RefresherEventDetail, IonCard } from '@ionic/angular/standalone';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { addIcons } from 'ionicons';
import { add, createOutline, trashOutline, bodyOutline } from 'ionicons/icons';
import { AddUpdateMiniatureComponent } from 'src/app/shared/components/add-update-miniature/add-update-miniature.component';
import { Miniature } from 'src/app/models/miniature.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [ IonAvatar, IonItemOption, IonItemOptions, IonList, IonItemSliding, IonItem, IonLabel, IonIcon, IonFabButton, IonFab, IonContent, CommonModule, FormsModule, HeaderComponent]
})
export class HomePage implements OnInit {
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  miniatures: Miniature[] = [];
  constructor() { addIcons({createOutline,trashOutline,bodyOutline,add}); }

  ngOnInit() {}

  // signOut() {
  //   this.firebaseService.signOut().then(() => {
  //     this.utilsService.routerLink('/auth');
  //   });
  // }

  async getMiniatures(){
    const user = this.utilsService.getLocalStorageUser();
    const path : string = `users/${user.uid}/miniatures`;

    let sub = (await this.firebaseService.getCollectionData(path)).subscribe({
      next: (res : any) => {
        sub.unsubscribe();
        this.miniatures = res;
      },
    });
  }

  addUpdateMiniature(){
    this.utilsService.presentModal({component: AddUpdateMiniatureComponent, cssClass : "add-update-modal" })
  }

  ionViewWillEnter(){
    this.getMiniatures();
  }



}