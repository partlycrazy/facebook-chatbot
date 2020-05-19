import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FlowService } from '../flow.service';
import { FlowContent } from '../flowContent';

import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-flow-editor',
  templateUrl: './flow-editor.component.html',
  styleUrls: ['./flow-editor.component.css'],
  providers: [FlowService]
})
export class FlowEditorComponent implements OnInit {


  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  newFlow: boolean = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA]

  flow$: Observable<Object[]>
  flows: any[] = [];
  flowContents: FlowContent[] = [];
  flowName: string;
  flowKeywords: string[];


  movies = [
    "Testing 123",
    "Testing 321"
  ]

  constructor(private flowService: FlowService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id'] === "new") {
        this.newFlow = true;
        this.flows = [{
          "keywords": [],
          "name": "",
          "content": []
        }]
        this.flowName = "";
        this.flowKeywords = [];
      }
      if (this.newFlow == false) {
        this.flowService.getFlowsById(params['id']).subscribe(flow => {
          this.flows = flow;
          this.flowName = this.flows[0].name;
          this.flowKeywords = this.flows[0].keywords;
          console.log(this.flows[0]);
          this.initEditor();
        })
      }
    })
  }

  addKeyword(event: MatChipInputEvent): void {
    const input = event.input
    const value = event.value;

    if ((value || '').trim()) {
      this.flowKeywords.push(value.trim())
    }

    if (input) {
      input.value = "";
    }
    console.log(this.flowKeywords)
  }

  removeKeyword(keyword: string): void {
    const index = this.flowKeywords.indexOf(keyword);

    if (index >= 0) {
      this.flowKeywords.splice(index, 1)
    }
  }

  drop(event: CdkDragDrop<FlowContent[]>) {
    moveItemInArray(this.flowContents, event.previousIndex, event.currentIndex);
    console.log(this.flowContents);
  }

  goBack() {
    this.router.navigate(['/flow']);
  }

  // Convert flows = flowContent for easy manipulation
  initEditor() {
    if (!this.newFlow) {
      this.flows[0].content.forEach(response => {
        if ("text" in response.response) {
          this.appendFlowContent("text", response.response.text)
        }
      })
    }
  }

  appendFlowContent(type: string, text?: string) {
    const newContent = new FlowContent();
    newContent.type = type;
    newContent.id = this.flowContents.length;
    newContent.content = { "text": "", "button": [] }
    if (text) {
      newContent.content['text'] = text
    }
    this.flowContents.push(newContent);
    console.log(this.flowContents);
  }

  save() {
    this.ContenttoFlow();
    console.log(this.flows[0])
    console.log(this.flowContents);
    if (this.newFlow == false) {
      console.log("UPDATING");
      this.flowService.updateFlowsById(this.flows[0]._id, this.flows).subscribe(output => {
        if (output['ok'] == 1) {
          this.goBack();
        }
      })
    } else if (this.newFlow == true) {
      console.log("NEW FLOW")
      this.flowService.postFlow(this.flows).subscribe(output => {
        if (output['msg']) {
          this.goBack();
        }
      })
    }
  }

  ContenttoFlow() {
    this.flows[0].name = this.flowName;
    this.flows[0].keywords = this.flowKeywords;
    this.flows[0].content = []
    this.flowContents.forEach(Content => {
      if (Content.type != "hidden") {
        this.flows[0].content.push({ "response": { "text": Content.content['text'] } })
      }
    })
  }

  deleteFlowContent(event) {
    var target = event.target;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue;
    console.log(value);
    this.flowContents[value].type = "hidden";
  }

  addButton(event) {
    var target = event.target;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue;
    this.flowContents[value].content['button'].push({ "name": "New Button" });
  }
}
