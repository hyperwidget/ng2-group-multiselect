import {
  Component,
  ViewEncapsulation,
  Inject,
  ApplicationRef,
  ViewContainerRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  NgModule
} from "@angular/core";

let styles = `.hyperMSButton {
    border-radius: 4px;
    background: white;
    padding: 8px;
    background-image: linear-gradient(#FFF, #F2F2F2);
  }

  .hyperMSInput {
      border-radius: 4px;
      padding: 8px;
      background: #FFF;
      width: 100%;
  }

  .hyperMSDropDown {
      position: absolute;
      background-color: #FFF;
      z-index: 999;
      border: 1px solid rgba(0, 0, 0, .15);
      border-radius: 4px;
      box-shadow: 0 6px 12px rgba(0, 0, 0, .15);
  }

  .hyperMSControllerBox, .hyperMSOptionsBox {
      padding: 15px;
      margin: 0;
  }

  .hyperMSControllerBox {
      border-bottom: 1px solid rgba(221, 221, 221, 1);
  }

  .hyperMSGroup h4 {
      margin-right: 10px;
      min-width: 200px;
      padding: 4px;
      border-radius: 4px;
      border: 1px solid #c3c3c3;
  }

  h4.option {
      margin-bottom: 5px;
  }

  .hyperMSGroup:first-of-type>h4 {
      margin-top: 0;
  }

  .option {
      cursor: pointer;
  }

  .option.selected {
      background-color: rgba(214, 214, 214, 1)
  }

  .option.listItem {
      display: inline-block;
      margin-right: 10px;
      min-width: 200px;
      padding: 4px;
      border-radius: 4px;
      border: 1px solid #c3c3c3;
  }


  /*Utility Classes*/

  .hyperMSRight {
      float: right;
  }

  .hyperMSLeft {
      float: left;
  }`;

let template = `<button (click)="dropDownVisible=!dropDownVisible;" class="hyperMSButton">
    <ng-template ngIf="selectedItems.length > 0">
        <span *ngFor="let val of selectedItems; let isLast=last">
                {{val[displayKey]}}{{isLast ? '&#9660;' : ', '}}
        </span>
    </ng-template>
    <span *ngIf="selectedItems.length === 0">None Selected</span>
</button>
<div *ngIf="dropDownVisible" class="hyperMSDropDown">
    <div class="hyperMSControllerBox">
        <div>
            <input type="search" [(ngModel)]="filterVal" (keyup)="onKey()" class="hyperMSInput" placeholder="Filter Options">
        </div>
        <div>
            <button (click)="selectAll();" class="hyperMSButton">All</button>
            <button (click)="selectNone();" class="hyperMSButton">None</button>
        </div>
    </div>
    <div *ngIf="inbound.length > 0" class="hyperMSOptionsBox">
        <div *ngFor="let group of groups" (click)="toggleSelection(group);" class="hyperMSGroup">
            <h4 class="option" [ngClass]="{selected: group.hyperMSSelected}" *ngIf="groups[0].name!=='hyperMSPlaceHolderGroup';">{{group.hyperMSName}}
                <span class="hyperMSRight" *ngIf="group.hyperMSSelected">&#10003;</span>
            </h4>
            <ng-template ngFor let-option [ngForOf]="inboundSelector">
                <div *ngIf="option[groupBy] === group.hyperMSName || groups[0]['displayKey']==='hyperMSPlaceHolderGroup';" (click)="toggleSelection(option, $event);"
                    class="option listItem" [ngClass]="{selected: option.hyperMSSelected}">
                    {{option[displayKey]}}
                    <span class="hyperMSRight" *ngIf="option.hyperMSSelected">&#10003;</span>
                </div>
            </ng-template>
        </div>
    </div>
</div>`;

//PIPE ON ngForOf Inbound | filter:filterVal:displayKey 

@Component({
  selector: "hyper-multiselect",
  host: {
    "(document:click)": "collapse($event)",
  },
  // Global styles imported in the app component.
  encapsulation: ViewEncapsulation.None,
  styles: [styles],
  template: template
})

export class MultiSelectComponent implements OnInit {
  @Input() inbound: Array<any>;
  @Input() displayKey: String;
  @Input() allSelected: Boolean;
  @Input() groupBy: string;

  @Output() outbound: EventEmitter<Array<any>> = new EventEmitter();

  groups: Array<any>;
  dropDownVisible: boolean = false;
  selectedItems: Array<any>;
  inboundSelector: Array<any>;
  filterVal: String;

  constructor(private _eref: ElementRef) {
    this.selectedItems = [];
  }

  getSelectedItems(): Array<any> {
    return this.selectedItems;
  }

  toggleSelection(item, event) {
    if (item.hyperMSIsGroup) {
      item.hyperMSSelected = !item.hyperMSSelected;
      this.inbound.forEach(subItem => {
        if (subItem[this.groupBy] === item.hyperMSName) {
          if (item.hyperMSSelected) {
            this.selectItem(subItem);
          } else {
            this.deselectItem(subItem);
          }
        }
      });
    } else {
      if (item.hyperMSSelected) {
        this.deselectItem(item);
      } else {
        this.selectItem(item);
      }
      if (this.groups.length > 0) {
        this.checkGroupSelected(item[this.groupBy]);
      }
      event.stopPropagation();
    }
    this.notifyParent();
  }

  notifyParent() {
    this.outbound.emit(this.getSelectedItems());
  }

  checkGroupSelected(groupName) {
    let group = this.groups.filter(item => item.hyperMSName === groupName)[0];
    let noCount = this.inbound.filter(item => item[this.groupBy] === groupName)
      .reduce(function (count, item) {
        return count + !item.hyperMSSelected | 0;
      }, 0);
    group.hyperMSSelected = noCount === 0;
  }

  selectItem(item) {
    item.hyperMSSelected = true;
    this.selectedItems = [...this.selectedItems, item];
  }

  deselectItem(item) {
    item.hyperMSSelected = false;
    const index = this.selectedItems.indexOf(item);
    this.selectedItems = [
      ...this.selectedItems.slice(0, index),
      ...this.selectedItems.slice(index + 1)
    ];
  }

  selectAll() {
    this.groups.forEach(object => {
      object.hyperMSSelected = true;
    });
    this.inbound.forEach(object => {
      object.hyperMSSelected = true;
    });

    this.selectedItems = [...this.inbound];
    this.notifyParent();
  }

  selectNone() {
    this.groups.forEach(object => {
      object.hyperMSSelected = false;
    });
    this.inbound.forEach(object => {
      object.hyperMSSelected = false;
    });

    this.selectedItems = [];
    this.notifyParent();
  }

  createGroups() {
    this.groups = [];
    if (this.groupBy) {
      let groupVals = [];
      this.inbound.forEach(item => {
        if (groupVals.indexOf(item[this.groupBy].toLowerCase()) === -1) {
          groupVals.push(item[this.groupBy].toLowerCase());
        }
      });

      groupVals.forEach(group => {
        this.groups.push({ hyperMSName: group, hyperMSSelected: false, hyperMSIsGroup: true });
      });
    } else {
      this.groups = [{ name: "hyperMSPlaceHolderGroup" }];
    }
  }

  collapse() {
    // Checks to see if click is inside element; if not, collapse element
    if (!this._eref.nativeElement.contains(event.target)) {
      this.dropDownVisible = false;
    }
  }

  filterVals(filter, value, displayKey) {
    if (filter) {
      return value.filter(item => item[displayKey].indexOf(filter) !== -1);
    }
    return value;
  }

  onKey() {
    this.inboundSelector = this.filterVals(this.filterVal, this.inbound, this.displayKey);
  }

  ngOnInit() {
    this.createGroups();
    if (this.allSelected) {
      this.selectAll();
    }
    this.inboundSelector = this.filterVals('', this.inbound, this.displayKey);
  }
};