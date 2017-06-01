import {
    inject
} from '@angular/core/testing';

import {
    ElementRef
} from "@angular/core";

import { MultiSelectComponent } from './index';

describe('MultiSelect: Component', () => {
    let component: MultiSelectComponent;

    it('should run!', () => {
        expect(1).toBe(1);
    });

    beforeEach(() => {
        this.component = new MultiSelectComponent(new ElementRef('div'));
    });

    it('should start with an empty selectedItems', () => {
        expect(this.component.selectedItems).toEqual([]);
    });

    it('should start with no groups', () => {
        expect(this.component.groups).toBe(undefined);
    });

    it('should correctly make empty dummy group', () => {
        this.component.inbound = this.demo1Vals;
        this.component.createGroups();
        expect(this.component.groups).not.toBe(undefined);
        expect(this.component.groups).toEqual(this.expectedDummyGroup);
    });

    it('should correctly init groups', () => {
        this.component.inbound = this.demo2Vals;
        this.component.groupBy = 'type';
        this.component.createGroups();
        expect(this.component.groups).not.toBe(undefined);
        expect(this.component.groups).toEqual(this.expectedTypeGroups);
    });

    it('should correctly select all', () => {
        this.component.inbound = this.demo2Vals;
        this.component.groups = this.demoGroups;
        this.component.selectAll();
        expect(this.component.inbound).toEqual(this.selectAllVals);
        expect(this.component.groups).toEqual(this.selectAllGroups);
        expect(this.component.selectedItems).toEqual(this.selectAllVals);
    });


    it('should correctly init without groups or select all', () => {
        this.component.inbound = this.demo1Vals;
        this.component.ngOnInit();
        expect(this.component.groups).toEqual(this.expectedDummyGroup);
        expect(this.component.selectedItems).toEqual([]);
    });

    it('should correctly init with groups and no select all', () => {
        this.component.inbound = this.demo2Vals;
        this.component.groupBy = 'type';
        this.component.ngOnInit();
        expect(this.component.groups).toEqual(this.expectedTypeGroups);
        expect(this.component.selectedItems).toEqual([]);
    });

    it('should correctly init with groups and select all', () => {
        this.component.inbound = this.demo2Vals;
        this.component.groupBy = 'type';
        this.component.allSelected = true;
        this.component.ngOnInit();
        expect(this.component.groups).toEqual(this.selectAllGroups);
        expect(this.component.selectedItems).toEqual(this.selectAllVals);
    });

    it('should deselect item correctly', () => {
        this.component.selectedItems = [{ rawMSSelected: true, name: 'removeMe' }, { rawMSSelected: true, name: 'keepMe' }, { rawMSSelected: true, name: 'keepMe2' }];
        this.component.deselectItem(this.component.selectedItems[0]);
        expect(this.component.selectedItems).toEqual([{ rawMSSelected: true, name: 'keepMe' }, { rawMSSelected: true, name: 'keepMe2' }])
    });

    it('should select item correctly', () => {
        this.component.selectedItems = [{ rawMSSelected: true, name: 'keepMe' }, { rawMSSelected: true, name: 'keepMe2' }];
        this.component.selectItem({ rawMSSelected: true, name: 'addMe' });
        expect(this.component.selectedItems.length).toBe(3);
    });

    it('should correctly select none', () => {
        this.component.inbound = this.demo2Vals;
        this.component.groups = this.expectedTypeGroups;
        this.component.selectNone();
        expect(this.component.inbound).toEqual(this.selectNoneVals);
        expect(this.component.groups).toEqual(this.selectNoneGroups);
        expect(this.component.selectedItems).toEqual([]);
    });

    it('should accurately detect group check', () => {
        this.component.inbound = this.groupCheckVals;
        this.component.groupBy = 'type';
        this.component.groups = this.demoGroups;
        this.component.checkGroupSelected(this.component.groups[0].rawMSName);
        expect(this.component.groups[0].rawMSSelected).toEqual(false);

        this.component.inbound = this.groupCheckVals2;
        this.component.checkGroupSelected(this.component.groups[0].rawMSName);
        expect(this.component.groups[0].rawMSSelected).toEqual(true);
    });

    it('should correctly toggle selection on an item', () => {
        let item = { rawMSSelected: false, name: 'TestItem' };
        this.component.groups = [];
        this.component.toggleSelection(item, new Event('test'));
        expect(item.rawMSSelected).toBe(true);

        item['groupProp'] = 'companion';
        this.component.groupBy = 'groupProp';
        this.component.groups = [{ rawMSName: 'companion', rawMSSelected: true, rawMSIsGroup: true }];
        this.component.inbound = [item];
        this.component.toggleSelection(item, new Event('test'));
        expect(item.rawMSSelected).toBe(false);
    });

    it('should correctly toggle selection on a group', () => {
        let item = { rawMSName: 'companion', rawMSSelected: false, rawMSIsGroup: true };
        this.component.inbound = this.selectNoneVals;
        this.component.groupBy = 'type';
        this.component.toggleSelection(item, new Event('test'));
        expect(item.rawMSSelected).toBe(true);

        expect(this.component.inbound[0].rawMSSelected).toBe(true);
        expect(this.component.inbound[1].rawMSSelected).toBe(true);
        expect(this.component.inbound[2].rawMSSelected).toBe(true);

        this.component.toggleSelection(item, new Event('test'));
        expect(item.rawMSSelected).toBe(false);
        expect(this.component.inbound[0].rawMSSelected).toBe(false);
        expect(this.component.inbound[1].rawMSSelected).toBe(false);
        expect(this.component.inbound[2].rawMSSelected).toBe(false);
    });

    it('should correctly return selected items', () => {
        this.component.selectedItems = [{ rawMSSelected: true, name: 'removeMe' }, { rawMSSelected: true, name: 'keepMe' }, { rawMSSelected: true, name: 'keepMe2' }];

        expect(this.component.getSelectedItems()).toEqual([{ rawMSSelected: true, name: 'removeMe' }, { rawMSSelected: true, name: 'keepMe' }, { rawMSSelected: true, name: 'keepMe2' }]);
    });

    it('should correctly toggle on outside click', inject([TestComponentBuilder], (tcb) => {

        return tcb
            .overrideProviders(MultiSelectComponent)
            .createAsync(MultiSelectComponent)
            .then((fixture) => {
                let nativeElement = fixture.nativeElement;
                fixture.detectChanges();

                fixture.componentInstance.dropDownVisible = true;
                document.body.click();
                fixture.detectChanges();

                expect(fixture.componentInstance.dropDownVisible).toBe(false);
            });
    }));

    it('should correctly not toggle on inside click', inject([TestComponentBuilder], (tcb) => {
        return tcb
            .overrideProviders(MultiSelectComponent)
            .createAsync(MultiSelectComponent)
            .then((fixture) => {
                let nativeElement = fixture.nativeElement;
                fixture.detectChanges();

                fixture.componentInstance.dropDownVisible = true;
                document.getElementById('root1').click();

                expect(fixture.componentInstance.dropDownVisible).toBe(true);
            });
    }));

});


this.demo1Vals = [{ id: 1, dispVal: "Blue Jays" }, { id: 2, dispVal: "Maple Leafs" }, { id: 3, dispVal: "Raptors" }, { id: 4, dispVal: "Argos" }];
this.demo2Vals = [{ id: 1, name: "Rose Tyler", type: "companion" }, { id: 2, name: "Donna Noble", type: "companion" }, { id: 3, name: "Martha Jones", type: "companion" }, { id: 4, name: "Dalek", type: "enemy" }];
this.demoGroups = [{ rawMSName: 'companion', rawMSSelected: true, rawMSIsGroup: true }, { rawMSName: 'enemy', rawMSSelected: false, rawMSIsGroup: true }];

this.selectAllVals = [{ id: 1, name: "Rose Tyler", type: "companion", rawMSSelected: true }, { id: 2, name: "Donna Noble", type: "companion", rawMSSelected: true }, { id: 3, name: "Martha Jones", type: "companion", rawMSSelected: true }, { id: 4, name: "Dalek", type: "enemy", rawMSSelected: true }];
this.groupCheckVals = [{ id: 1, name: "Rose Tyler", type: "companion", rawMSSelected: true }, { id: 2, name: "Donna Noble", type: "companion", rawMSSelected: false }, { id: 3, name: "Martha Jones", type: "companion", rawMSSelected: true }, { id: 4, name: "Dalek", type: "enemy", rawMSSelected: true }];
this.groupCheckVals2 = [{ id: 1, name: "Rose Tyler", type: "companion", rawMSSelected: true }, { id: 2, name: "Donna Noble", type: "companion", rawMSSelected: true }, { id: 3, name: "Martha Jones", type: "companion", rawMSSelected: true }, { id: 4, name: "Dalek", type: "enemy", rawMSSelected: true }];
this.selectNoneVals = [{ id: 1, name: "Rose Tyler", type: "companion", rawMSSelected: false }, { id: 2, name: "Donna Noble", type: "companion", rawMSSelected: false }, { id: 3, name: "Martha Jones", type: "companion", rawMSSelected: false }, { id: 4, name: "Dalek", type: "enemy", rawMSSelected: false }];

this.expectedDummyGroup = [{ name: "rawMSPlaceHolderGroup" }];
this.expectedTypeGroups = [{ rawMSName: 'companion', rawMSSelected: false, rawMSIsGroup: true }, { rawMSName: 'enemy', rawMSSelected: false, rawMSIsGroup: true }];
this.selectAllGroups = [{ rawMSName: 'companion', rawMSSelected: true, rawMSIsGroup: true }, { rawMSName: 'enemy', rawMSSelected: true, rawMSIsGroup: true }];
this.selectNoneGroups = [{ rawMSName: 'companion', rawMSSelected: false, rawMSIsGroup: true }, { rawMSName: 'enemy', rawMSSelected: false, rawMSIsGroup: true }];