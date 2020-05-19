import { Component, OnInit } from '@angular/core';
import { CashbackService } from './cashback.service';
import { Cashback } from './cashback';

@Component({
  selector: 'app-cashback',
  templateUrl: './cashback.component.html',
  styleUrls: ['./cashback.component.css'],
  providers: [CashbackService]
})
export class CashbackComponent implements OnInit {

  cashbacks: Cashback[];
  outlets;
  selectedOutlet;

  constructor(private cashbackService: CashbackService) { }

  ngOnInit(): void {
    this.outlets = [
      {name:"TestCompany", outlet_id: 88},
      {name:"CompanyTwo", outlet_id: 90}
    ]
  }

  getCashbacks(outlet_id): void {
    this.cashbackService.getCashback(outlet_id).subscribe(cashback => {
      this.cashbacks = cashback;
      this.cashbacks.forEach((element,index) => {
        this.getCashbackAmt(element.psid, index)
      })
    });
  }

  getCashbackAmt(psid,index) {
    this.cashbackService.getCashbackAmt(psid).subscribe(amt => {
      let cashback_amt = (amt[0] == undefined ) ? 0 : amt[0].sum
      this.cashbacks[index].cashback_amt = cashback_amt;
    })
  }
}
