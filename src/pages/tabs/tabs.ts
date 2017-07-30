import { Component } from '@angular/core';

import { FeedPage } from '../feed/feed';
import { ListPage } from '../list/list';

import { SplurgeService } from '../../services/splurges.service';

@Component({
  templateUrl: 'tabs.html',
  providers: [SplurgeService]
})
export class TabsPage {
  tab1Root = ListPage;
  tab2Root = FeedPage;
  
  constructor(private splurgeService: SplurgeService) {}

  presentModal() {
    this.splurgeService.goToSplurgeForm();
  }
}
