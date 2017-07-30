import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { ViewController, Platform, NavParams } from 'ionic-angular';

import { PERIOD_OPTIONS } from '../../models/splurge.model';

@Component({
  selector: 'page-form',
  templateUrl: 'form.html'
})
export class FormPage {
  private splurge : FormGroup;
  PERIOD_OPTIONS = PERIOD_OPTIONS;

  constructor(public platform: Platform,
              public params: NavParams,
              public viewCtrl: ViewController,
              private formBuilder: FormBuilder, 
              private _navParams: NavParams) {

    this.splurge = this.formBuilder.group({
      number: [this._navParams.get('number') || '', Validators.required],
      description: [this._navParams.get('description') || '', Validators.required],
      period: [this._navParams.get('period') || '', Validators.required]
    });

  }

  logForm() {
    let splurgeId = this._navParams.get('id');

    //TODO: Do Update to Splurge
    console.log(splurgeId, this.splurge.value);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
