import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonLabel, IonItem, IonItemSliding, IonList, IonItemOptions, IonItemOption, IonAvatar, IonContent, IonFab, IonFabButton, IonSkeletonText, IonRefresher, IonRefresherContent, RefresherEventDetail, IonCard } from '@ionic/angular/standalone';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { addIcons } from 'ionicons';
import { add, createOutline, trashOutline, bodyOutline, alertCircleOutline } from 'ionicons/icons';
import { AddUpdateMiniatureComponent } from 'src/app/shared/components/add-update-miniature/add-update-miniature.component';
import { Miniature } from 'src/app/models/miniature.model';
import { SupabaseService } from 'src/app/services/supabase.service';
import { User } from 'firebase/auth';
import { QueryOptions } from 'src/app/services/query-options.interface';
import { IonRefresherCustomEvent } from '@ionic/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonCard, IonRefresherContent, IonRefresher, IonSkeletonText, IonAvatar, IonItemOption, IonItemOptions, IonList, IonItemSliding, IonItem, IonLabel, IonIcon, IonFabButton, IonFab, IonContent, CommonModule, FormsModule, HeaderComponent]
})
export class HomePage implements OnInit {


  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  supabaseService = inject(SupabaseService);
  miniatures: Miniature[] = [];
  loading: boolean = false;
  constructor() { addIcons({ createOutline, trashOutline, alertCircleOutline, add, bodyOutline }); }

  ngOnInit() { }

  // signOut() {
  //   this.firebaseService.signOut().then(() => {
  //     this.utilsService.routerLink('/auth');
  //   });
  // }

  async getMiniatures() {
    this.loading = true;
    const user = this.utilsService.getLocalStorageUser();
    const path: string = `users/${user.uid}/miniatures`;
    const queryOptions: QueryOptions = { orderBy: { field: "basepoints", direction: "asc" } };

    let timer: any;

    const resetTimer = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        sub.unsubscribe();
      }, 5000)
    };



    let sub = (await this.firebaseService.getCollectionData(path, queryOptions)).subscribe({
      next: (res: any) => {
        this.miniatures = res;
        this.loading = false;
        resetTimer();
      },
    });
  }

  async addUpdateMiniature(miniature?: Miniature) {
    let success = await this.utilsService.presentModal({ component: AddUpdateMiniatureComponent, cssClass: "add-update-modal", componentProps: { miniature } });
    if (success) {
      this.getMiniatures();
    }
  }

  ionViewWillEnter() {
    this.getMiniatures();
  }

  confirmDeleteMiniature(miniature: Miniature) {
    this.utilsService.presentAlert({
      header: "Eliminar miniatura",
      message: "¿Estás seguro de que deseas eliminar esta miniatura?",
      buttons: [
        {
          text: "No",
        }, {
          text: "Sí",
          handler: () => {
            this.deleteMiniature(miniature);
          }
        }
      ]
    });
  }


  async deleteMiniature(miniature: Miniature) {
    const loading = await this.utilsService.loading();
    await loading.present();
    const user: User = this.utilsService.getLocalStorageUser();
    const path: string = `users/${user.uid}/miniatures/${miniature.id}`;
    const imagePath = this.supabaseService.getFilePath(miniature.image);
    await this.supabaseService.deleteFile(imagePath!);

    this.firebaseService.deleteDocument(path).then(res => {
      this.miniatures = this.miniatures.filter(listedMiniature => listedMiniature.id !== miniature.id)
      this.utilsService.presentToast({
        color: "success",
        message: "Miniatura eliminada correctamente",
        duration: 1500,
        position: "middle",
        icon: "trash-outline"
      })
    }).catch(error => {
      this.utilsService.presentToast({
        color: "danger",
        message: "Error al eliminar la miniatura",
        duration: 1500,
        position: "middle",
        icon: "alert-circle-outline"
      })
    }).finally(() => {
      loading.dismiss();
    });
  }
  doRefresh($event: any) {
    setTimeout(() => {
      this.getMiniatures();
      $event.target.complete();
    }, 2000);
  }
  getTotalPower() {
    return this.miniatures.reduce((acc, miniature) => acc + (miniature.units * miniature.basepoints), 0);
    }
}