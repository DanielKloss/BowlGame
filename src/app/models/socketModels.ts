export class views {
    lobbyView: boolean = false;
    clueingView: boolean = false;
    guessingView: boolean = false;
    waitingView: boolean = false;

    public constructor(init?: Partial<views>) {
        Object.assign(this, init);
    }
}

export class joinRoomModel {
    username: string;
    roomNumber: string;
    numberOfTeams: number;
    team: number;
    submissions: string[];

    public constructor(init?: Partial<joinRoomModel>) {
        Object.assign(this, init);
    }
}

export class team {
    teamNumber: number;
    players: string[];
    score: number;

    public constructor(init?: Partial<team>) {
        Object.assign(this, init);
    }
}

export class turnModel {
    clueGiver: string;
    teamNumber: string;
    time: number;
    percantageWordsGuessed: number;
    wordsLeft: number;

    public constructor(init?: Partial<turnModel>) {
        Object.assign(this, init);
    }
}

export class clueModel {
    word: string;
    clueGiver: string;
    teamNumber: string;
    time: number;
    percantageWordsGuessed: number;
    wordsLeft: number;
    roundInstructions: string;

    public constructor(init?: Partial<clueModel>) {
        Object.assign(this, init);
    }
}

export class clueResult {
    word: string;
    percantageWordsGuessed: number;
    wordsLeft: number;

    public constructor(init?: Partial<clueResult>) {
        Object.assign(this, init);
    }
}

export class timer {
    intervalId: any;

    constructor(public counter, public timerPercentage, public start) {
        this.start = counter;
        this.timerPercentage = timerPercentage;
    }

    timerStart(){
        this.intervalId = setInterval(() => {
            this.counter = this.counter - 1;
            this.timerPercentage = Math.round((this.counter / this.start) * 100);
            console.log(this.timerPercentage);
            if (this.counter === 0) clearInterval(this.intervalId)
        }, 1000)
    }
}