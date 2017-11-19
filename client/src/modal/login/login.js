"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var LoginModal = (function () {
    function LoginModal(navCtrl, navParams, viewCtrl, auth) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.auth = auth;
        this.page = 'login';
        this.credentials = {};
    }
    LoginModal.prototype.ionViewDidLoad = function () { };
    LoginModal.prototype.signin = function () {
        var _this = this;
        this.auth.signin(this.credentials).then(function (user) {
            _this.dismiss();
        }).catch(function (err) {
            console.log('error signing in', err);
            _this.setError(err.message);
        });
    };
    LoginModal.prototype.register = function () {
        var _this = this;
        this.auth.register(this.credentials).then(function (user) {
            console.log('register: success', user);
            _this.page = 'confirm';
        }).catch(function (err) {
            console.log('error registering', err);
            _this.setError(err.message);
        });
    };
    LoginModal.prototype.confirm = function () {
        var _this = this;
        this.auth.confirm(this.credentials).then(function (user) {
            _this.page = 'login';
            _this.setMessage('You have been confirmed. Please sign in.');
        }).catch(function (err) {
            console.log('error confirming', err);
            _this.setError(err.message);
        });
    };
    LoginModal.prototype.setMessage = function (msg) {
        this.message = msg;
        this.error = null;
    };
    LoginModal.prototype.setError = function (msg) {
        this.error = msg;
        this.message = null;
    };
    LoginModal.prototype.dismiss = function () { this.viewCtrl.dismiss(); };
    LoginModal.prototype.reset = function () { this.error = null; this.message = null; };
    LoginModal.prototype.showConfirmation = function () { this.page = 'confirm'; };
    return LoginModal;
}());
LoginModal = __decorate([
    core_1.Component({
        selector: 'modal-login',
        templateUrl: 'login.html'
    })
], LoginModal);
exports.LoginModal = LoginModal;
