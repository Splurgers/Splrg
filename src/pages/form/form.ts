import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { ViewController, Platform, NavParams, ToastController } from 'ionic-angular';

import { PERIOD_OPTIONS } from '../../models/splurge.model';
import { SplurgeService } from '../../services/splurges.service';

@Component({
  selector: 'page-form',
  templateUrl: 'form.html',
  providers: [SplurgeService]
})
export class FormPage {
  private splurge : FormGroup;
  PERIOD_OPTIONS = PERIOD_OPTIONS;

  constructor(public platform: Platform,
              public params: NavParams,
              public viewCtrl: ViewController,
              private formBuilder: FormBuilder,
              private _navParams: NavParams,
              public toastCtrl: ToastController,
              public splurgeService: SplurgeService) {

    this.splurge = this.formBuilder.group({
      uses_per_period: [this._navParams.get('uses_per_period') || '', Validators.required],
      description: [this._navParams.get('description') || '', Validators.required],
      period: [this._navParams.get('period') || '', Validators.required]
    });

  }

  submitForm() {
    let payload = this.splurge.value;
    let description = this.splurge.value.description;
    let splurgeId = this._navParams.get('id');

    if (splurgeId) {
      payload.id =  splurgeId;
      this.splurgeService.update(payload)
        .subscribe(() => {
          let toast = this.toastCtrl.create({
            message: `Updated splurge! "${description}"`,
            duration: 3000,
            position: 'top'
          });
          toast.present();
          }
        );
    } else {
      this.splurgeService.create(payload)
        .subscribe(() => {
          let toast = this.toastCtrl.create({
            message: `Created splurge! "${description}"`,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        });
    }
    this.viewCtrl.dismiss();

  }
}
