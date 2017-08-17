import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import moment from 'moment'

import { Observable } from "rxjs/Observable";
import { SplurgeService } from '../../services/splurges.service';
import { SplurgeActionsService } from '../../services/splurge_actions.service';
import { UserService } from '../../services/user.service';
import { SPLURGE } from '../../models/splurge.model';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
  providers: [SplurgeService, SplurgeActionsService, UserService]
})
export class ListPage {
  SPLURGES: Observable<any>;
  CameraOptions: CameraOptions;

  constructor(public navCtrl: NavController,
              public splurgeService: SplurgeService,
              public splurgeActionsService: SplurgeActionsService,
              public userService: UserService,
              public toastCtrl: ToastController,
              public actionSheetCtrl: ActionSheetController,
              private camera: Camera) {

    this.CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.SPLURGES = splurgeService.SPLURGES;
    splurgeService.get();
  }

  addSplurge() {
    this.splurgeActionsService.goToSplurgeForm();
  }

  takePicture() {
    this.camera.getPicture(this.CameraOptions).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        console.log(base64Image);
      }, (err) => {
        // Handle error
      });

  }

  showSplurgeCardActions(splurge: SPLURGE) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Splurge Actions',
      buttons: [
        {
          text: 'Edit',
          role: 'destructive',
          handler: () => {
            this.splurgeActionsService.goToSplurgeForm(splurge);
          }
        },{
          text: 'Delete',
          handler: () => {
            this.splurgeService.delete(splurge);
            let toast = this.toastCtrl.create({
              message: `You deleted ${splurge.description}`,
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
        }
      ]
    });
    actionSheet.present();
  }

  useSplurge({ $event, splurge, SPLURGES_LEFT }) {
    $event.stopPropagation();

    // TODO: Add disabled class to naughty tickers that have a zero value
    if (SPLURGES_LEFT === 0) return;

    this.splurgeService.addUseDateToSplurge(splurge);
    let toast = this.toastCtrl.create({
      message: `You Splurged with "${splurge.description}". Enjoy!`,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  logout() {
    this.userService.logout();
    this.navCtrl.push(LoginPage);
  }
}
