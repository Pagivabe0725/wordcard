import { Component, OnInit } from '@angular/core';
import { WordCard } from '../../../Shared/Interfaces/wordcard';

@Component({
  selector: 'app-learning-part',
  standalone: true,
  imports: [],
  templateUrl: './learning-part.component.html',
  styleUrl: './learning-part.component.scss',
})
export class LearningPartComponent implements OnInit {
  cardArray: Array<WordCard> = [];

  ngOnInit(): void {
    
  }
}
