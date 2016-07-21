import {
  Component,
  ViewEncapsulation,
  Inject,
  ApplicationRef,
  ViewContainerRef,
  Input,
  Output,
  EventEmitter,
  OnInit
} from "@angular/core";

import {FilterPipe} from './raw-multiselect.pipe';


@Component({
  selector: "raw-multiselect",
  directives: [],
  // Global styles imported in the app component.
  encapsulation: ViewEncapsulation.None,
  styles: [require("./raw-multiselect.component.css")],
  template: require("./raw-multiselect.component.html"),
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

  constructor() {
    this.selectedItems = [];
  }

  getSelectedItems(items): Array<any> {
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
    this.outbound.emit(this.getSelectedItems(this.inbound));
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

  ngOnInit() {
    this.createGroups();
    if (this.allSelected) {
      this.selectAll();
    }
  }
};