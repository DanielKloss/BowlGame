import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../server.service';
import { team, turnModel, clueModel, views, timer, clueResult } from '../models/socketModels';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  username: string;
  roomNumber: string;
  isClueGiver: boolean;

  guessingTeam: string;
  clueGiver: string;
  teams: team[];

  views: views;

  clue: string;
  roundInstructions: string;
  guessedItems: string[] = [];

  timer: timer;

  wordsLeft: number;
  percantageWordsGuessed: number;
  bowlImage: string;

  constructor(private route: ActivatedRoute, private serverService: ServerService) { }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username');
    this.roomNumber = this.route.snapshot.paramMap.get('roomNumber');

    this.timer = new timer(60, 100, 60);
    this.percantageWordsGuessed = 100;
    this.getBowlImage();
    this.wordsLeft = 5;

    this.views = new views();
    this.lobbyView();

    this.serverService.listen("newPlayerJoined").subscribe((data: Array<team>) => {
      this.teams = data;
      this.wordsLeft += 5;
    });

    this.serverService.listen("startTurnButton").subscribe(() => {
      this.isClueGiver = true;
    });

    this.serverService.listen("cluer").subscribe((data: string) => {
      let model: clueModel = JSON.parse(data);
      this.timer = new timer(model.time, 100, 60);
      this.timer.timerStart();
      this.clue = model.word;
      this.clueGiver = model.clueGiver;
      this.guessingTeam = model.teamNumber;
      this.guessedItems = [];
      this.wordsLeft = model.wordsLeft;
      this.percantageWordsGuessed = model.percantageWordsGuessed;
      this.getBowlImage();
      this.roundInstructions = model.roundInstructions;
      this.clueView();
    });

    this.serverService.listen("guessing").subscribe((data: string) => {
      let model: turnModel = JSON.parse(data);
      this.timer = new timer(model.time, 100, 60);
      this.timer.timerStart();
      this.clueGiver = model.clueGiver;
      this.guessingTeam = model.teamNumber;
      this.guessedItems = [];
      this.wordsLeft = model.wordsLeft;
      this.percantageWordsGuessed = model.percantageWordsGuessed;
      this.getBowlImage();
      this.guessView();
    });

    this.serverService.listen("waiting").subscribe((data: string) => {
      let model: turnModel = JSON.parse(data);
      this.timer = new timer(model.time, 100, 60);
      this.timer.timerStart();
      this.clueGiver = model.clueGiver;
      this.guessingTeam = model.teamNumber;
      this.guessedItems = [];
      this.wordsLeft = model.wordsLeft;
      this.percantageWordsGuessed = model.percantageWordsGuessed;
      this.getBowlImage();
      this.waitView();
    });

    this.serverService.listen("lobby").subscribe(() => {
      this.isClueGiver = false;
      this.guessedItems = [];
      clearInterval(this.timer.intervalId);
      this.lobbyView();
    });

    this.serverService.listen("newClue").subscribe((data: string) => {
      let model: clueModel = JSON.parse(data);
      this.clue = model.word;
      this.wordsLeft = model.wordsLeft;
      this.percantageWordsGuessed = model.percantageWordsGuessed;
      this.getBowlImage();
    });

    this.serverService.listen("newClueResult").subscribe((data: string) => {
      let model: clueResult = JSON.parse(data);
      this.guessedItems.push(model.word);
      this.wordsLeft = model.wordsLeft;
      this.percantageWordsGuessed = model.percantageWordsGuessed;
      this.getBowlImage();
      this.addScore();
    });
  }
  getBowlImage() {
    if (this.percantageWordsGuessed > 75) {
      this.bowlImage = "../../assets/bowlFull.svg";
    } else if (this.percantageWordsGuessed > 50) {
      this.bowlImage = "../../assets/bowl75.svg";
    } else if (this.percantageWordsGuessed > 25) {
      this.bowlImage = "../../assets/bowl50.svg";
    } else if (this.percantageWordsGuessed > 0) {
      this.bowlImage = "../../assets/bowl25.svg";
    } else {
      this.bowlImage = "../../assets/bowlEmpty.svg";
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.returnValue = true;
  }

  canDeactivate() {
    return window.confirm('You are about to leave the game. Once you leave you will not be able to get back in.');
  }

  startGame() {
    this.serverService.emit('startTurn', { roomNumber: this.roomNumber });
  }

  gotClue() {
    this.serverService.emit('gotClue', { roomNumber: this.roomNumber, gotClue: this.clue });
    this.addScore();
  }

  addScore() {
    this.teams.find(t => t.teamNumber == Number(this.guessingTeam)).score++;
  }

  clueView() {
    this.views.clueingView = true;
    this.views.guessingView = false;
    this.views.waitingView = false;
    this.views.lobbyView = false;
  }

  guessView() {
    this.views.clueingView = false;
    this.views.guessingView = true;
    this.views.waitingView = false;
    this.views.lobbyView = false;
  }

  waitView() {
    this.views.clueingView = false;
    this.views.guessingView = false;
    this.views.waitingView = true;
    this.views.lobbyView = false;
  }

  lobbyView() {
    this.views.clueingView = false;
    this.views.guessingView = false;
    this.views.waitingView = false;
    this.views.lobbyView = true;
  }
}
