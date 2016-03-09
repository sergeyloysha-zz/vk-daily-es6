'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
    function App() {
        _classCallCheck(this, App);

        this.seconds = 0;
        this.date = 0;
        this.limit = Infinity;
        this.textBlock = document.createElement('span');
        this.timerBlock = document.createElement('div');
        this.limitContainer = document.createElement('div');
    }

    _createClass(App, [{
        key: 'createContainer',
        value: function createContainer() {
            var container = document.createElement('div');

            container.className = 'vk-daily';
            this.textBlock.className = 'vk-daily__text';
            this.timerBlock.className = 'vk-daily__timer';

            //text.innerHtml = 'Вы онлайн уже';
            this.timerBlock.innerHTML = 'Пожалуйста, подождите...';
            this.textBlock.innerHTML = 'Ваше время онлайн:';

            container.appendChild(this.textBlock);
            container.appendChild(this.timerBlock);

            return container;
        }
    }, {
        key: 'createLimitContainer',
        value: function createLimitContainer() {
            this.limitContainer.className = 'vk-daily-limit';

            var limitTextBlock = document.createElement('div');
            var limitImageBlock = document.createElement('div');
            limitTextBlock.className = 'vk-daily-limit__text';
            limitImageBlock.className = 'vk-daily-limit__image';
            limitTextBlock.innerHTML = "Ваш лимит пребывания Вконтакте на сегодня исчерпан.";
            this.limitContainer.appendChild(limitImageBlock);
            this.limitContainer.appendChild(limitTextBlock);
            return this.limitContainer;
        }
    }, {
        key: 'init',
        value: function init() {
            var _this = this;

            console.log('run');
            document.body.insertBefore(this.createContainer(), document.body.firstChild);
            document.body.appendChild(this.createLimitContainer());

            chrome.extension.sendMessage({ action: 'loadData' }, function (response) {
                _this.seconds = response.seconds || 0;
                _this.date = response.date || _this.getCurrentDate();
                _this.limit = response.limit || Infinity;
                window.setInterval(function () {
                    _this.track();
                }, 1000);
            });
        }
    }, {
        key: 'track',
        value: function track() {
            var currentDate = void 0;

            if ((currentDate = this.getCurrentDate()) != this.date) {
                this.seconds = 0;
            }

            this.seconds++;
            this.date = currentDate;
            this.update();

            chrome.extension.sendMessage({
                action: 'saveData',
                seconds: this.seconds,
                date: this.date
            });
        }
    }, {
        key: 'update',
        value: function update() {
            var hours = void 0,
                minutes = void 0,
                seconds = void 0;

            hours = Math.floor(this.seconds / 3600);
            minutes = Math.floor((this.seconds - hours * 3600) / 60);
            seconds = this.seconds - minutes * 60 - hours * 3600;

            if (hours < 10) hours = "0" + hours;
            if (minutes < 10) minutes = "0" + minutes;
            if (seconds < 10) seconds = "0" + seconds;

            this.timerBlock.innerHTML = hours + ":" + minutes + ":" + seconds;

            if (this.seconds >= this.limit / 100 * 80) {
                this.timerBlock.style.color = '#B16D6D';
                this.timerBlock.style.background = 'rgba(236, 194, 194, 0.28);';
                this.textBlock.innerHTML = 'Время на исходе:';
            }

            if (this.seconds >= this.limit) {
                this.limitContainer.style.display = 'block';
                document.body.style.overflow = 'hidden';
                //document.body.style.WebkitFilter = 'blur(3px)';
            }
        }
    }, {
        key: 'getCurrentDate',
        value: function getCurrentDate() {
            var today = new Date();
            var day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
            var month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
            var year = today.getFullYear();

            return [day, month, year].join('');
        }
    }]);

    return App;
}();

var app = new App();
app.init();
