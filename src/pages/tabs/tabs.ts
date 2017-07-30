import { Component } from '@angular/core';

import { FeedPage } from '../feed/feed';
import { FormPage } from '../form/form';
import { ListPage } from '../list/list';

import { ModalController } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = ListPage;
  tab2Root = FeedPage;
  
  constructor(public modalCtrl: ModalController) {

  }

  presentModal() {
    let modal = this.modalCtrl.create(FormPage);
    modal.present();
  }
}
