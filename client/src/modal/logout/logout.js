"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var login_1 = require("../../pages/login/login");
var LogoutModal = (function () {
    function LogoutModal(navCtrl, navParams, viewCtrl, auth) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.auth = auth;
        this.attrs = [];
    }
    LogoutModal.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.auth.getCredentials().subscribe(function (creds) {
            console.dir(_this.auth.cognitoUser);
            _this.auth.cognitoUser['getUserAttributes'](function (err, results) {
                if (err) {
                    return console.log('err getting attrs', err);
                }
                _this.attrs = results;
            });
        });
    };
    LogoutModal.prototype.signout = function () {
        this.auth.signout();
        this.navCtrl.setRoot(login_1.LoginPage);
    };
    LogoutModal.prototype.dismiss = function () { this.viewCtrl.dismiss(); };
    return LogoutModal;
}());
LogoutModal = __decorate([
    core_1.Component({
        selector: 'modal-logout',
        templateUrl: 'logout.html'
    })
], LogoutModal);
exports.LogoutModal = LogoutModal;
