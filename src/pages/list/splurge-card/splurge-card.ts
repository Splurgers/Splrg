import { Component, Input, Output, EventEmitter } from '@angular/core';

import moment from 'moment';

@Component({
    selector: 'splurge-card',
    templateUrl: 'splurge-card.html'
})
export class SplurgeCard {
    @Input() SPLURGE;
    @Output() showSplurgeCardActions = new EventEmitter();
    @Output() useSplurge = new EventEmitter();
    SPLURGES_LEFT: number;

    ngOnInit() {
        this.SPLURGES_LEFT = this.getSplurgesLeft(this.SPLURGE);
    }

    getSplurgesLeft(splurge) {
        let done_count = 0;
        let createdAt = moment(splurge.created_at);
        let currentTime = moment();

        let diff = currentTime.diff(createdAt, splurge.period.toLowerCase(), true);
        // TODO: Check if this Math.floor is necessary
        let startOfLatestInterval = createdAt.add(Math.floor(diff), splurge.period.toLowerCase());

        for (let i = 0; i < splurge.uses_per_period; i++) {
            let use = splurge.use_dates[splurge.use_dates.length - (i + 1)];
            if (use && typeof use === 'object' && use.hasOwnProperty('date')) {
                if (moment(use.date).isBetween(startOfLatestInterval, currentTime)) done_count++
            }
        }
        return splurge.uses_per_period - done_count;
    }
}