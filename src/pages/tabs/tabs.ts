import { Component } from '@angular/core';

import { AboutPage } from '../feed/feed';
import { ContactPage } from '../form/form';
import { HomePage } from '../list/list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
