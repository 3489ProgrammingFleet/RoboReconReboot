import { Injectable } from '@angular/core';
import { Questions, QuestionItem } from '../interfaces/match';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  public questionsList: QuestionItem[];

  public questions: Questions;


  constructor(private appSettings: SettingsService) { }


  /**
   * Load list of questions
   */
  public load() {
    this.questions = {
      Autonomous: [
        {
          id: 'AQ1',
          questionText: 'Cargo loaded at start of match?',
          questionType: 2,
          questionItems: [
            {
              value: 0,
              itemText: 'No'
            },
            {
              value: 1,
              itemText: 'Yes'
            }
          ],
          answer: 0
        },
        {
          id: 'AQ2',
          questionText: 'Fully exited the tarmac at least once?',
          questionType: 2,
          questionItems: [
            {
              value: 0,
              itemText: 'No'
            },
            {
              value: 1,
              itemText: 'Yes'
            }
          ],
          answer: 0
        },
        {
          id: 'AQ3',
          questionText: 'Cargo scored in low goal?',
          questionType: 1,
          questionItems: [
          ],
          answer: 0
        },
        {
          id: 'AQ4',
          questionText: 'Cargo scored in high goal?',
          questionType: 1,
          questionItems: [
          ],
          answer: 0
        },
        {
          id: 'AQ5',
          questionText: 'Human player shot cargo?',
          questionType: 2,
          questionItems: [
            {
              value: 0,
              itemText: 'No'
            },
            {
              value: 1,
              itemText: 'Yes'
            },
            {
              value: 2,
              itemText: 'Yes-scored'
            }
          ],
          answer: 0
        }
      ],

      Teleop: [
        {
          id: 'TQ1',
          questionText: 'Cargo in low goal?',
          questionType: 1,
          questionItems: [
          ],
          answer: 0
        },
        {
          id: 'TQ2',
          questionText: 'Cargo in high goal?',
          questionType: 1,
          questionItems: [
          ],
          answer: 0
        },
        {
          id: 'TQ3',
          questionText: 'Max cargo ever in robot?',
          questionType: 2,
          questionItems: [
            {
              value: 0,
              itemText: '0'
            },
            {
              value: 1,
              itemText: '1'
            },
            {
              value: 2,
              itemText: '2'
            },
            {
              value: 3,
              itemText: '>2'
            }
          ],
          answer: 0
        }
      ],

      EndGame: [
        {
          id: 'EQ1',
          questionText: 'Bar climbed?',
          questionType: 2,
          questionItems: [
            {
              value: 0,
              itemText: 'No attempt'
            },
            {
              value: 1,
              itemText: 'Failed'
            },
            {
              value: 2,
              itemText: 'Low'
            },
            {
              value: 3,
              itemText: 'Mid'
            },
            {
              value: 4,
              itemText: 'High'
            },
            {
              value: 5,
              itemText: 'Traversal'
            }
          ],
          answer: 0
        },
        {
          id: 'EQ2',
          questionText: 'Time taken to climb?',
          questionType: 1,
          questionItems: [
          ],
          answer: 0
        }
      ]
    };

    console.log("Questions load function called");
  };

  public add(question: QuestionItem) {
    console.log("Question add function called");
  };

  public update(id: number) {
    console.log("Question update function called");
  };

  public delete(id: number) {
    console.log("Question delete function called");
  };


}
