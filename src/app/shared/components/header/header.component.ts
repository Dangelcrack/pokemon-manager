import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { IonHeader, IonToolbar,IonTitle,IonButtons,IonBackButton, IonIcon,IonButton} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [ IonHeader, IonToolbar, IonTitle,IonButtons,IonBackButton, CommonModule, IonIcon,IonButton]
})
export class HeaderComponent  implements OnInit {
  @Input({required: true}) title!:string;
  @Input() backButtonURL: string | null = null;
  @Input() isModal: boolean = false;
  utilsService = inject(UtilsService);
  constructor() { addIcons({closeCircleOutline}) }

  ngOnInit() {}

  dismissModal(){
    this.utilsService.dissmissModal();
  }

}
