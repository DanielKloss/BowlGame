import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LobbyComponent } from './lobby/lobby.component'
import { GameComponent } from './game/game.component'
import { CanDeactivateGuard } from './canDeactivateGuard';

const routes: Routes = [
  { path: '', redirectTo: '/lobby', pathMatch: 'full' },
  { path: 'lobby', component: LobbyComponent },
  { path: 'game/:username/:roomNumber/:team', component: GameComponent, canDeactivate: [CanDeactivateGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
