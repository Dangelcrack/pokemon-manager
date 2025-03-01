import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonLabel, IonItem, IonItemSliding, IonList, IonItemOptions, IonItemOption, IonAvatar, IonContent, IonFab, IonFabButton, IonSkeletonText, IonRefresher, IonRefresherContent, IonCard, IonGrid, IonCardContent, IonCardTitle, IonCardSubtitle, IonCardHeader, IonRow, IonCol } from '@ionic/angular/standalone';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { addIcons } from 'ionicons';
import { add, createOutline, trashOutline, bodyOutline, alertCircleOutline } from 'ionicons/icons';
import { AddUpdateMiniatureComponent } from 'src/app/shared/components/add-update-miniature/add-update-miniature.component';
import { Miniature } from 'src/app/models/miniature.model';
import { SupabaseService } from 'src/app/services/supabase.service';
import { User } from 'firebase/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [ IonCard, IonRefresherContent, IonRefresher, IonSkeletonText, IonAvatar, IonItemOption, IonItemOptions, IonList, IonItemSliding, IonItem, IonLabel, IonIcon, IonFabButton, IonFab, IonContent, CommonModule, FormsModule, HeaderComponent]
})
export class HomePage implements OnInit, OnDestroy {
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  supabaseService = inject(SupabaseService);
  miniatures: Miniature[] = [];
  loading: boolean = false;
  private miniatureSubscription: Subscription | undefined;

  constructor() {
    addIcons({ createOutline, trashOutline, alertCircleOutline, add, bodyOutline });
  }

  ngOnInit() {
    this.getMiniatures();
  }

  ngOnDestroy() {
    if (this.miniatureSubscription) {
      this.miniatureSubscription.unsubscribe();
    }
  }

  async getMiniatures() {
    this.loading = true;
    const user = this.utilsService.getLocalStorageUser();
    if (!user) {
      this.loading = false;
      return;
    }

    const path: string = `users/${user.uid}/miniatures`;
    try {
      this.miniatureSubscription = (await this.firebaseService.getCollectionData(path)).subscribe({
        next: (res: any) => {
          this.miniatures = res;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          console.error('Error fetching miniatures:', error);
        }
      });
    } catch (error) {
      this.loading = false;
      console.error('Error fetching miniatures:', error);
    }
  }

  getTotalStats(miniature: Miniature): number {
    return miniature.hp + miniature.attack + miniature.defense + miniature.specialAttack + miniature.specialDefense + miniature.speed;
  }

  getBestStat(miniature: Miniature): string {
    const stats = {
      hp: miniature.hp,
      ataque: miniature.attack,
      defensa: miniature.defense,
      "ataque especial": miniature.specialAttack,
      "defensa especial": miniature.specialDefense,
      velocidad: miniature.speed
    };
    return Object.keys(stats).reduce((a, b) => stats[a as keyof typeof stats] > stats[b as keyof typeof stats] ? a : b);
  }
  

  async addUpdateMiniature(miniature?: Miniature) {
    const success = await this.utilsService.presentModal({
      component: AddUpdateMiniatureComponent,
      cssClass: 'add-update-modal',
      componentProps: { miniature }
    });
    if (success) {
      this.getMiniatures();
    }
  }

  confirmDeleteMiniature(miniature: Miniature) {
    this.utilsService.presentAlert({
      header: 'Eliminar miniatura',
      message: '¿Estás seguro de que deseas eliminar esta miniatura?',
      buttons: [
        { text: 'No' },
        { text: 'Sí', handler: () => this.deleteMiniature(miniature) }
      ]
    });
  }

  async deleteMiniature(miniature: Miniature) {
    const loading = await this.utilsService.loading();
    await loading.present();
    try {
      const user = this.utilsService.getLocalStorageUser();
      if (!user) {
        loading.dismiss();
        return;
      }
      const path: string = `users/${user.uid}/miniatures/${miniature.id}`;
      await this.firebaseService.deleteDocument(path);
      this.miniatures = this.miniatures.filter(m => m.id !== miniature.id);
      this.utilsService.presentToast({
        color: 'success',
        message: 'Miniatura eliminada correctamente',
        duration: 1500,
        position: 'middle',
        icon: 'trash-outline'
      });
    } catch (error) {
      console.error('Error deleting miniature:', error);
    } finally {
      loading.dismiss();
    }
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.getMiniatures();
      event.target.complete();
    }, 2000);
  }
}