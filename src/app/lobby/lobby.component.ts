import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { ServerService } from '../server.service';
import { joinRoomModel } from '../models/socketModels';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  username: string;
  roomNumber: string;
  numberOfTeams: number;
  submittedName: string;
  submittedPlace: string;
  submittedSong: string;
  submittedBook: string;
  submittedFilm: string;

  errorMessage: string;

  constructor(private router: Router, private serverService: ServerService) { }

  ngOnInit() {
    this.serverService.listen("joinedRoom").subscribe((data: string) => {
      let model: joinRoomModel = JSON.parse(data);
      this.errorMessage = "";
      this.router.navigate(['/game', this.username, model.roomNumber, model.team]);
    });

    this.serverService.listen("createdRoom").subscribe((data: string) => {
      let model: joinRoomModel = JSON.parse(data);
      if (model.roomNumber == null) {
        this.errorMessage = "ROOM NOT CREATED. SOMETHING WENT WRONG";
      } else {
        this.errorMessage = "";
        this.router.navigate(['/game', this.username, model.roomNumber, model.team])
      }
    });

    this.serverService.listen("err").subscribe((data: string) => {
      this.errorMessage = data.toUpperCase();
    });
  }

  joinRoom() {
    if (this.username == undefined || this.username.length < 1) {
      this.errorMessage = "YOU MUST ENTER A USERNAME";
    } else if (this.roomNumber == undefined || this.roomNumber.length < 1) {
      this.errorMessage = "YOU MUST ENTER A VALID ROOM NUMBER"
    } else {
      this.errorMessage = "";
      this.username = this.username.toUpperCase();
      this.roomNumber = this.roomNumber.toUpperCase();
      let submissions = [this.submittedName, this.submittedPlace, this.submittedSong, this.submittedBook, this.submittedFilm]
      this.serverService.emit("joinRoom", { username: this.username, roomNumber: this.roomNumber, submissions: submissions });
    }
  }

  createRoom() {
    if (this.username == undefined || this.username.length < 1) {
      this.errorMessage = "YOU MUST ENTER A USERNAME";
    } else if (this.numberOfTeams == undefined || this.numberOfTeams < 2) {
      this.errorMessage = "YOU MUST HAVE AT LEAST 2 TEAMS";
    } else {
      this.username = this.username.toUpperCase();
      let submissions = [this.submittedName, this.submittedPlace, this.submittedSong, this.submittedBook, this.submittedFilm]
      this.serverService.emit("createRoom", { username: this.username, numberOfTeams: this.numberOfTeams, submissions: submissions });
    }
  }
}
