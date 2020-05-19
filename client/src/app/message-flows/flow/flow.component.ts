import { Component, OnInit, Inject } from '@angular/core';
import { FlowService } from '../flow.service'
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.css'],
  providers: [FlowService]
})
export class FlowComponent implements OnInit {

  flows = [];
  showEditor: boolean = false;
  isDisabled: boolean = false;

  constructor(private flowService: FlowService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getFlows();   
  }

  getFlows() {
    this.flowService.getFlows().subscribe(flow => {
      this.flows = flow
      this.flows.forEach(element => {
        console.log(element);
      })
    })  
  }  

  openDialog($event): void {
    const id = $event.target['id']
    const name = $event.target['name']
    console.log(id)
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      width: '300px',
      position: { top: '20px'},
      data: {'name': name, 'id': id, 'delete': false}
    });  

    dialogRef.afterClosed().subscribe(result  => {
      console.log('The dialog was closed');
      console.log(result);
      if(result == true) {
        this.flowService.deleteFlow(id).subscribe(res => {
          if (res['msg']) {
            this.getFlows()
          }
        });
      }
    });
  }


}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './confirm-delete.html',
  styleUrls: ['./flow.component.css']
})
export class ConfirmDeleteDialog {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialog>, @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

