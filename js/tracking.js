class App {

	constructor() {
		this.seconds = 0;
		this.date = 0;
		this.limit = Infinity;
        this.textBlock = document.createElement('span');
        this.timerBlock = document.createElement('div');
        this.limitContainer = document.createElement('div');
	}

	createContainer() {
		let container = document.createElement('div');

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

    createLimitContainer() {
        this.limitContainer.className = 'vk-daily-limit';

        let limitTextBlock = document.createElement('div');
        let limitImageBlock = document.createElement('div');
        limitTextBlock.className = 'vk-daily-limit__text';
        limitImageBlock.className = 'vk-daily-limit__image';
        limitTextBlock.innerHTML = "Ваш лимит пребывания Вконтакте на сегодня исчерпан.";
        this.limitContainer.appendChild(limitImageBlock);
        this.limitContainer.appendChild(limitTextBlock);
        return this.limitContainer;
    }

	init() {
		console.log('run');
		document.body.insertBefore(this.createContainer(), document.body.firstChild);
        document.body.appendChild(this.createLimitContainer());

		chrome.extension.sendMessage(
			{ action: 'loadData' },
			(response) => {
                this.seconds = response.seconds || 0;
                this.date =  response.date || this.getCurrentDate();
                this.limit = response.limit || Infinity;
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

        if(this.seconds >= (this.limit / 100 * 80)) {
            this.timerBlock.style.color = '#B16D6D';
            this.timerBlock.style.background = 'rgba(236, 194, 194, 0.28);';
            this.textBlock.innerHTML = 'Время на исходе:';
        }

        if(this.seconds >= this.limit) {
            this.limitContainer.style.display = 'block';
            document.body.style.overflow = 'hidden';
            //document.body.style.WebkitFilter = 'blur(3px)';
        }
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