import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import {
  LoadingController,
  ToastController,
  ToastOptions,
  ModalController,
  ModalOptions,
} from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  loadingController = inject(LoadingController);
  toastController = inject(ToastController);
  router = inject(Router);
  modalController = inject(ModalController);

  loading() {
    return this.loadingController.create({ spinner: 'crescent' });
  }

  async presentToast(toastOptions?: ToastOptions | undefined) {
    const toast = await this.toastController.create(toastOptions);
    toast.present();
  }

  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  urlTree(url: string): UrlTree {
    return this.router.parseUrl(url);
  }

  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }
  getFromLocalStorage(key: string) {
    const valueString = localStorage.getItem(key);
    return valueString ? JSON.parse(valueString) : valueString;
  }

  async presentModal(ModalOptions: ModalOptions) {
    const modal = await this.modalController.create(ModalOptions);
    await modal.present();
    const { data } = await modal.onWillDismiss();

    return data ?? null;
  }

  dissmissModal(data?: any) {
    return this.modalController.dismiss(data);
  }
  constructor() {}
}
