import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-found',
  templateUrl: './no-found.component.html',
  styleUrls: ['./no-found.component.scss']
})
export class NoFoundComponent implements OnInit {

  @Input() text: string = 'No hay elementos encontrados';
  @Input() subtitle: string = 'Por favor verifique sus datos o agregue un elemento nuevo';

  constructor() { }

  ngOnInit(): void {
  }

}
