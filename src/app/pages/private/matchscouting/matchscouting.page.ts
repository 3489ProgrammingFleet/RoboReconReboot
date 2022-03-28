import { Component, OnInit } from '@angular/core';
import { QuestionItem, QuestionOptionItem, ScoutingData, ResponseData, PrevNoteItem, MatchListItem, Questions } from '../../../interfaces/match';
import { Team } from '../../../interfaces/team';
import { Scout } from '../../../interfaces/scout';
import { ScoutDataService } from '../../../services/scout-data.service';
import { TeamDataService } from '../../../services/team-data.service';
import { MatchscoutingDataService } from '../../../services/matchscouting-data.service';
import { MatchDataService } from '../../../services/match-data.service';
import { ConfigService } from '../../../services/config.service';
import { AlertService } from '../../../services/alert.service';
import { QuestionsService } from '../../../services/questions.service';
import { SettingsService } from '../../../services/settings.service';


@Component({
  selector: 'app-matchscouting',
  templateUrl: './matchscouting.page.html',
  styleUrls: ['./matchscouting.page.scss'],
})
export class MatchscoutingPage implements OnInit {

  public selectedMatch: number = 0;
  public MatchNum: number = 1;
  public MatchId: number = 0;
  public TeamNum: number = 0;
  public actScoutId: number = 0;
  public actScoutName: string = '';

  public matchesArr: MatchListItem[] = [];

  public scouts: Scout[] = [];
  public teams: Team[] = [];
  public matchTeamsList: number[] = [];

  public matchNote: string = '';

  public previousMatchNotes: PrevNoteItem[] = [];

  public scoutingDataId: number = 0;

  public displayQuestions: boolean = false;

  public questions: Questions;

  public alliance: String;


  constructor(
              public scoutData: ScoutDataService,
              private teamDataService: TeamDataService,
              public questionsService: QuestionsService,
              private scoutingData: MatchscoutingDataService,
              private matchData: MatchDataService,
              private settingsService: SettingsService,
              private configService: ConfigService,
              private alertService: AlertService 
            ) {
    this.teamDataService.teams.subscribe((data) => {
      this.teams = data;
    });

    this.scoutData.scouts.subscribe((data) => {
      this.scouts = data;
    });

    this.scoutingData.prevComments.subscribe((data) => {
      this.previousMatchNotes = data;
    });

    this.matchData.matches.subscribe((data) => {
      this.matchesArr = data;
      console.log("matches loaded");
      //console.log(this.matchesArr);
      //this.selectedMatch = 0;
      this.onChangeMatch();
    });

    this.questions = this.questionsService.questions;

    // Create list for the match numbers
    // var i: number;
    // for (i = 1; i <= 64; i++) {
    //   var matchNoItem: {matchNo: string; matchId: number} = { matchNo: '', matchId: 0};
    //   matchNoItem.matchNo = 'Q' + i;
    //   matchNoItem.matchId = i;
    //   this.matchNoArr.push(matchNoItem);
    //}
  }

  ngOnInit() {

  }

  private loadPreviousComments(teamNo: number) {
    this.scoutingData.loadPreviousNotes(teamNo);
  }

  ionViewWillEnter() {
    this.scoutData.load();
    this.matchData.load(this.configService.config.selectedEvent, 'qm');  // TODO: get eventid from configuration
    this.alliance = this.settingsService.settings.value.scoutAlliance.toString().toUpperCase();
    
  }

  public onChangeMatch() {
    if (this.selectedMatch < this.matchesArr.length) {
      this.MatchId = this.matchesArr[this.selectedMatch].matchId;
      this.MatchNum = this.matchesArr[this.selectedMatch].matchNo;

      if ( this.settingsService.settings.value.scoutAlliance == 'red') {
        this.matchTeamsList = [
          this.matchesArr[this.selectedMatch].red1TeamNumber,
          this.matchesArr[this.selectedMatch].red2TeamNumber,
          this.matchesArr[this.selectedMatch].red3TeamNumber
        ];
      } else {
        this.matchTeamsList = [
          this.matchesArr[this.selectedMatch].blue1TeamNumber,
          this.matchesArr[this.selectedMatch].blue2TeamNumber,
          this.matchesArr[this.selectedMatch].blue3TeamNumber
        ];
      }
      this.matchTeamsList.sort(function (a, b) { return a - b });

      console.log("Match changed. SelectedMatch:" + this.selectedMatch + " MatchNo:" + this.MatchNum + "  MatchId:" + this.MatchId);
    } else {
      console.log("onChangeMatch: invalid selected index");
    }
  }

  public valueMinus(questionSection: number, numValue: number) {
    //console.log("valueMinus called: QS=" + questionSection + "  numValue="+ numValue);
    switch (questionSection) {
      case 0:
        // SandStorm
        if (this.questions.Autonomous[numValue].answer > 0) {
          this.questions.Autonomous[numValue].answer--;
        }
        break;
      case 1:
        // SandStorm
        if (this.questions.Teleop[numValue].answer > 0) {
          this.questions.Teleop[numValue].answer--;
        }
        break;
      case 2:
        // SandStorm
        if (this.questions.EndGame[numValue].answer > 0) {
          this.questions.EndGame[numValue].answer--;
        }
        break;
    }
  }

  public valuePlus(questionSection: number, numValue: number) {
    //console.log("valuePlus called: QS=" + questionSection + "  numValue="+ numValue);
    switch (questionSection) {
      case 0:
        // SandStorm
        this.questions.Autonomous[numValue].answer++;
        break;
      case 1:
        // Teleop
        this.questions.Teleop[numValue].answer++;
        break;
      case 2:
        // EndGame
        this.questions.EndGame[numValue].answer++;
        break;
    }
  }

  public updateScoutName() {
    var tmpScout: Scout;

    tmpScout = this.scouts.find(scout => scout.scout_id == this.actScoutId);
    if (tmpScout != null) {
      this.actScoutName = tmpScout.firstname + ' ' + tmpScout.lastname;
    } else {
      this.actScoutName = '';
    }



  }


  public loadScoutData() {
    console.log('loadScoutData called. MatchId:' + this.MatchId + 
                '  Teamnum:' + this.TeamNum + 
                '  ScoutId:' + this.actScoutId);
    this.scoutingData.read(this.MatchId, this.TeamNum, this.actScoutId).then((data) => {
      console.log('Matchscouting: received data:');
      console.log(data);

      // Save database record id, it will be required for the update
      this.scoutingDataId = data.id;

      if (data.data != null) {
        // Restore saved answers from the received data
        data.data.forEach((response) => {
          this.questions.Autonomous.forEach((question) => {
            if (question.id == response.id) {
              question.answer = response.response;
            }
          });

          this.questions.Teleop.forEach((question) => {
            if (question.id == response.id) {
              question.answer = response.response;
            }
          });

          this.questions.EndGame.forEach((question) => {
            if (question.id == response.id) {
              question.answer = response.response;
            }
          });

        });
      } else {
        this.resetScoutData();
      }

      // Restore note
      this.matchNote = data.note;

      this.displayQuestions = true;
    });

    // Load previos notes
    this.loadPreviousComments(this.TeamNum);
  }

  /**
   * Setting the answers to 0 or ''
   */
  public resetScoutData() {
    this.questions.Autonomous.forEach((question) => {
      switch (question.questionType) {
        case 1:
        case 2:
          question.answer = 0;
          break;
        default:
          question.answer = '';
      }
    });

    this.questions.Teleop.forEach((question) => {
      switch (question.questionType) {
        case 1:
        case 2:
          question.answer = 0;
          break;
        default:
          question.answer = '';
      }
    });

    this.questions.EndGame.forEach((question) => {
      switch (question.questionType) {
        case 1:
        case 2:
          question.answer = 0;
          break;
        default:
          question.answer = '';
      }
    });

    this.matchNote = '';

    this.previousMatchNotes = [];
  }

  public save() {
    var scoutingData: ScoutingData = {
      id: this.scoutingDataId,
      match_id: this.MatchId,
      team_no: this.TeamNum,
      scout_id: this.actScoutId,
      data: [],
      note: this.matchNote
    };

    // Check notes for newline characters
    console.log('ensuring notes do not contain newlines');
    scoutingData.note = scoutingData.note.replace(/\n/g, " ");

    console.log('save function called.');
    console.log('actScoutId: ' + scoutingData.scout_id);
    console.log('scoutingDataId:' + this.scoutingDataId);

    //Save Sandstorm answers
    this.questions.Autonomous.forEach((question) => {
      var response: ResponseData = { id: '', response: '' };
      response.id = question.id;
      response.response = question.answer;

      scoutingData.data.push(response);
    });

    //Save Teleop answers
    this.questions.Teleop.forEach((question) => {
      var response: { id: string, response: any } = { id: '', response: '' };
      response.id = question.id;
      response.response = question.answer;

      scoutingData.data.push(response);
    });

    //Save EndGame answers
    this.questions.EndGame.forEach((question) => {
      var response: { id: string, response: any } = { id: '', response: '' };
      response.id = question.id;
      response.response = question.answer;

      scoutingData.data.push(response);
    });


    console.log(scoutingData);
    this.scoutingData.save(scoutingData).then((response) => {
      console.log('Scouting data saved');
      this.alertService.presentToast(response);
    });
  }

  public saveNext() {
    this.save();
    this.resetScoutData();
    this.selectedMatch++;
    this.TeamNum = 0;

    this.displayQuestions = false;
  }
}
