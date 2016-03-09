class App {

	constructor() {
		this.seconds = 0;
		this.date = 0;
		this.limit = Infinity;
        this.textBlock = document.createElement('span');
        this.iconBlock = document.createElement('div');
        this.timerBlock = document.createElement('div');
        this.limitContainer = document.createElement('div');
	}

	container() {
		let container = document.createElement('div');

		container.className = 'vk-daily';
		this.textBlock.className = 'vk-daily__text';
		this.iconBlock.className = 'vk-daily__icon';
		this.timerBlock.className = 'vk-daily__timer';

		//text.innerHtml = 'Вы онлайн уже';
		this.timerBlock.innerHTML = 'Пожалуйста, подождите..';

		container.appendChild(this.textBlock);
		container.appendChild(this.iconBlock);
		container.appendChild(this.timerBlock);

		return container;
	}

	init() {
		console.log('run');
		document.body.insertBefore(this.container(), document.body.firstChild);

		chrome.extension.sendMessage(
			{ action: 'loadData' },
			(response) => {
                this.seconds = response.seconds || 0;
                this.date =  response.date || this.getCurrentDate();
                window.setInterval(() => {
                    this.track();
                }, 1000);
			}
		);
	}

    track() {
        let currentDate;

        if( (currentDate = this.getCurrentDate()) != this.date ) {
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

    update() {
        let hours, minutes, seconds;
        
        hours = Math.floor(this.seconds / 3600);
        minutes = Math.floor( (this.seconds - hours*3600) / 60 );
        seconds = this.seconds - minutes*60 - hours*3600;
        
        if( hours < 10 ) hours = "0" + hours;
        if( minutes < 10 ) minutes = "0" + minutes;
        if( seconds < 10 ) seconds = "0" + seconds;
        
        this.timerBlock.innerHTML = hours+":"+minutes+":"+seconds;
    }

	getCurrentDate() {
        const today = new Date();
		const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
		const month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
		const year = today.getFullYear();

		return [day, month, year].join('');
	}

}

let app = new App();
app.init();