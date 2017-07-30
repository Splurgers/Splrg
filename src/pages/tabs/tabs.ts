import { Component } from '@angular/core';

import { FeedPage } from '../feed/feed';
import { ListPage } from '../list/list';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = ListPage;
  tab2Root = FeedPage;
  
  constructor() {}
}
