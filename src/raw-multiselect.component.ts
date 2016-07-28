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
  ElementRef
} from "@angular/core";

import {FilterPipe} from "./raw-multiselect.pipe";

let styles = `.rawMSButton {
    border-radius: 4px;
    background: white;
    padding: 8px;
    background-image: linear-gradient(#FFF, #F2F2F2);
}

.rawMSInput {
    border-radius: 4px;
    padding: 8px;
    background: #FFF;
    width: 100%;
}

.rawMSDropDown {
    position: absolute;
    background-color: #FFF;
    z-index: 999;
    border: 1px solid rgba(0, 0, 0, .15);
    border-radius: 4px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, .15);
}

.rawMSControllerBox, .rawMSOptionsBox {
    padding: 15px;
    margin: 0;
}

.rawMSControllerBox {
    border-bottom: 1px solid rgba(221, 221, 221, 1);
}

.rawMSGroup h4 {
    margin-right: 10px;
    min-width: 200px;
    padding: 4px;
    border-radius: 4px;
    border: 1px solid #c3c3c3;
}

h4.option {
    margin-bottom: 5px;
}

.rawMSGroup:first-of-type>h4 {
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

.rawMSRight {
    float: right;
}

.rawMSLeft {
    float: left;
}`;

let template = `<button (click)="dropDownVisible=!dropDownVisible;" class="rawMSButton">
    <template ngIf="selectedItems.length > 0">
        <span *ngFor="let val of selectedItems; let isLast=last">
                {{val[displayKey]}}{{isLast ? '&#9660;' : ', '}}
        </span>
    </template>
    <span *ngIf="selectedItems.length === 0">None Selected</span>
</button>
<div *ngIf="dropDownVisible" class="rawMSDropDown">
    <div class="rawMSControllerBox">
        <div>
            <input type="search" [(ngModel)]="filterVal" class="rawMSInput" placeholder="Filter Options">
        </div>
        <div>
            <button (click)="selectAll();" class="rawMSButton">All</button>
            <button (click)="selectNone();" class="rawMSButton">None</button>
        </div>
    </div>
    <div *ngIf="inbound.length > 0" class="rawMSOptionsBox">
        <div *ngFor="let group of groups" (click)="toggleSelection(group);" class="rawMSGroup">
            <h4 class="option" [ngClass]="{selected: group.rawMSSelected}" *ngIf="groups[0].name!=='rawMSPlaceHolderGroup';">{{group.rawMSName}}
                <span class="rawMSRight" *ngIf="group.rawMSSelected">&#10003;</span>
            </h4>
            <template ngFor let-option [ngForOf]="inbound | filter:filterVal:displayKey">
                <div *ngIf="option[groupBy] === group.rawMSName || groups[0]['displayKey']==='rawMSPlaceHolderGroup';" (click)="toggleSelection(option, $event);"
                    class="option listItem" [ngClass]="{selected: option.rawMSSelected}">
                    {{option[displayKey]}}
                    <span class="rawMSRight" *ngIf="option.rawMSSelected">&#10003;</span>
                </div>
            </template>
        </div>
    </div>
</div>`;

@Component({
  selector: "raw-multiselect",
  directives: [],
  host: {
    "(document:click)": "collapse($event)",
  },
  // Global styles imported in the app component.
  encapsulation: ViewEncapsulation.None,
  styles: [styles],
  template: template,
  pipes: [FilterPipe]
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

  constructor(private _eref: ElementRef) {
    this.selectedItems = [];
  }

  getSelectedItems(): Array<any> {
    return this.selectedItems;
  }

  toggleSelection(item, event) {
    if (item.rawMSIsGroup) {
      item.rawMSSelected = !item.rawMSSelected;
      this.inbound.forEach(subItem => {
        if (subItem[this.groupBy] === item.rawMSName) {
          if (item.rawMSSelected) {
            this.selectItem(subItem);
          } else {
            this.deselectItem(subItem);
          }
        }
      });
    } else {
      if (item.rawMSSelected) {
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
    let group = this.groups.filter(item => item.rawMSName === groupName)[0];
    let noCount = this.inbound.filter(item => item[this.groupBy] === groupName)
      .reduce(function (count, item) {
        return count + !item.rawMSSelected | 0;
      }, 0);
    group.rawMSSelected = noCount === 0;
  }

  selectItem(item) {
    item.rawMSSelected = true;
    this.selectedItems = [...this.selectedItems, item];
  }

  deselectItem(item) {
    item.rawMSSelected = false;
    const index = this.selectedItems.indexOf(item);
    this.selectedItems = [
      ...this.selectedItems.slice(0, index),
      ...this.selectedItems.slice(index + 1)
    ];
  }

  selectAll() {
    this.groups.forEach(object => {
      object.rawMSSelected = true;
    });
    this.inbound.forEach(object => {
      object.rawMSSelected = true;
    });

    this.selectedItems = [...this.inbound];
    this.notifyParent();
  }

  selectNone() {
    this.groups.forEach(object => {
      object.rawMSSelected = false;
    });
    this.inbound.forEach(object => {
      object.rawMSSelected = false;
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
        this.groups.push({ rawMSName: group, rawMSSelected: false, rawMSIsGroup: true });
      });
    } else {
      this.groups = [{ name: "rawMSPlaceHolderGroup" }];
    }
  }

  collapse() {
    // Checks to see if click is inside element; if not, collapse element
    if (!this._eref.nativeElement.contains(event.target)) {
      this.dropDownVisible = false;
    }
  }

  ngOnInit() {
    this.createGroups();
    if (this.allSelected) {
      this.selectAll();
    }
  }
};