import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-goods-exchange',
  templateUrl: './goods-exchange.component.html',
  styleUrls: ['./goods-exchange.component.scss']
})
export class GoodsExchangeComponent implements OnInit {

  showfilials : boolean = false

  constructor() { }

  ngOnInit() {
  }

  OnShowFilialsChange(status) {
    this.showfilials = status;
  }

}
