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
              private formBuilder: FormBuilder) {

    this.splurge = this.formBuilder.group({
      number: ['', Validators.required],
      description: ['', Validators.required],
      period: ['', Validators.required]
    });

  }

  logForm() {
    console.log(this.splurge.value);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
