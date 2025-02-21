import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { inject } from '@angular/core';
import { UtilsService } from '../services/utils.service';

export const noauthGuard: CanActivateFn = async (route, state) => {
  const firebaseService = inject ( FirebaseService)
  const utilsService = inject(UtilsService)

  const isAuthenticated = await firebaseService.isAuthenticated();

  if (!isAuthenticated){
    return true;
  }else {
    return utilsService.urlTree('/main/home')
  }
};
