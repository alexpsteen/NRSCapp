"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var login_1 = require("../../modal/login/login");
var logout_1 = require("../../modal/logout/logout");
var event_details_1 = require("../event-details/event-details");
var event_overview_1 = require("../event-overview/event-overview");
var HomePage = (function () {
    function HomePage(navCtrl, modalCtrl, auth, eventStore) {
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.auth = auth;
        this.eventStore = eventStore;
    }
    HomePage.prototype.doRefresh = function (refresher) {
        var subscription = this.eventStore.refresh().subscribe({
            complete: function () {
                subscription.unsubscribe();
                if (refresher) {
                    refresher.complete();
                }
            }
        });
    };
    HomePage.prototype.addTapped = function () {
        this.navCtrl.push(event_details_1.EventDetailsPage, {
            title: 'Edit Event Details'
        });
    };
    HomePage.prototype.editEvent = function (index) {
        var _this = this;
        this.eventStore.getEvent(index).subscribe(function (event) {
            if (!event) {
                return console.log('could not find event. Please check logs');
            }
            _this.navCtrl.push(event_overview_1.EventOverviewPage, {
                event: event
            });
        });
    };
    HomePage.prototype.getIconColor = function (event) {
        switch (event.status) {
            case 0:
                return 'primary';
            case 1:
                return 'secondary';
            default:
                return 'primary';
        }
    };
    HomePage.prototype.getIcon = function (event) {
        switch (event.status) {
            case 0:
                return 'alert';
            case 1:
                return 'checkmark-circle';
            default:
                return 'alert';
        }
    };
    HomePage.prototype.openLoginModal = function () {
        var modal = this.modalCtrl.create(this.auth.isUserSignedIn() ? logout_1.LogoutModal : login_1.LoginModal);
        modal.present();
    };
    Object.defineProperty(HomePage.prototype, "userColor", {
        get: function () {
            return this.auth.isUserSignedIn() ? 'secondary' : 'primary';
        },
        enumerable: true,
        configurable: true
    });
    return HomePage;
}());
HomePage = __decorate([
    core_1.Component({
        selector: 'page-home',
        templateUrl: 'home.html'
    })
], HomePage);
exports.HomePage = HomePage;
