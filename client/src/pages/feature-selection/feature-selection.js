"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var feature_details_1 = require("../feature-details/feature-details");
var FeatureSelectionPage = (function () {
    function FeatureSelectionPage(navCtrl, viewCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.viewCtrl = viewCtrl;
        this.navParams = navParams;
        if (this.navParams.get('eventId')) {
            this.eventId = this.navParams.get('eventId');
        }
        this.featureTypes = [
            { type: 0, name: 'Venue' },
            { type: 1, name: 'Food' },
            { type: 2, name: 'Drinks' },
            { type: 3, name: 'Cake' },
            { type: 4, name: 'Flowers' },
            { type: 5, name: 'Music' },
        ];
    }
    FeatureSelectionPage.prototype.select = function (index) {
        var _this = this;
        this.navCtrl.push(feature_details_1.FeatureDetailsPage, {
            type: index,
            eventId: this.eventId
        }).then(function () {
            var index = _this.viewCtrl.index;
            _this.navCtrl.remove(index);
        });
    };
    return FeatureSelectionPage;
}());
FeatureSelectionPage = __decorate([
    core_1.Component({
        selector: 'page-feature-selection',
        templateUrl: 'feature-selection.html'
    })
], FeatureSelectionPage);
exports.FeatureSelectionPage = FeatureSelectionPage;
