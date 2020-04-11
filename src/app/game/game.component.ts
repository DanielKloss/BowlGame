import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../server.service';
import { team, turnModel, clueModel, views } from '../models/socketModels';

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
  guessedItems: string[] = [];
  time: string;

  constructor(private route: ActivatedRoute, private serverService: ServerService) { }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username');
    this.roomNumber = this.route.snapshot.paramMap.get('roomNumber');

    this.views = new views();
    this.lobbyView();

    this.serverService.listen("newPlayerJoined").subscribe((data: Array<team>) => {
      this.teams = data;
    });

    this.serverService.listen("timeDown").subscribe((data: string) => {
      this.time = data;
    });

    this.serverService.listen("startTurnButton").subscribe(() => {
      this.isClueGiver = true;
    });

    this.serverService.listen("cluer").subscribe((data: string) => {
      let model: clueModel = JSON.parse(data);
      this.clue = model.word;
      this.clueView();
    });

    this.serverService.listen("guessing").subscribe((data: string) => {
      let model: turnModel = JSON.parse(data);
      this.clueGiver = model.clueGiver;
      this.guessingTeam = model.teamNumber;
      this.guessView();
    });

    this.serverService.listen("waiting").subscribe((data: string) => {
      let model: turnModel = JSON.parse(data);
      this.clueGiver = model.clueGiver;
      this.guessingTeam = model.teamNumber;
      this.waitView();
    });

    this.serverService.listen("lobby").subscribe((data: string) => {
      console.log("lobby");
      this.isClueGiver = false;
      this.lobbyView();
    });

    this.serverService.listen("newClue").subscribe((data: string) => {
      let model: clueModel = JSON.parse(data);
      this.clue = model.word;
    });

    this.serverService.listen("newClueResult").subscribe((data: string) => {
      let model: clueModel = JSON.parse(data);
      this.guessedItems.push(model.word);
    });
  }

  startGame() {
    this.serverService.emit('startTurn', { roomNumber: this.roomNumber });
  }

  gotClue() {
    this.serverService.emit('gotClue', { roomNumber: this.roomNumber, gotClue: this.clue });
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
