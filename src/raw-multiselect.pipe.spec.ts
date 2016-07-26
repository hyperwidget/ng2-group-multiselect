
import {
  beforeEach,
  describe,
  expect,
  it,
} from '@angular/core/testing';

import { FilterPipe } from './raw-multiselect.pipe.ts';

describe('Side nav filter: Pipe', () => {
  let pipe: FilterPipe;

  beforeEach(() => {
    pipe = new FilterPipe();
  });

  it('should run!', () => {
    expect(1).toBe(1);
  });

  it('should filter items on a search term', () => {
    expect(pipe.transform(demo1Vals, undefined, 'dispVal')).toEqual(demo1Vals);
    expect(pipe.transform(demo1Vals, 'r', 'dispVal')).toEqual(filteredDemo1Vals);
    expect(pipe.transform(demo1Vals, 'p', 'dispVal')).toEqual(filteredDemo1Vals2);
    expect(pipe.transform(demo1Vals, 'Blue', 'dispVal')).toEqual(filteredDemo1Vals3);
  });

  const demo1Vals = [{ id: 1, dispVal: "Blue Jays" }, { id: 2, dispVal: "Maple Leafs" }, { id: 3, dispVal: "Raptors" }, { id: 4, dispVal: "Argos" }];

  const filteredDemo1Vals = [{ id: 3, dispVal: "Raptors" }, { id: 4, dispVal: "Argos" }];
  const filteredDemo1Vals2 = [{ id: 2, dispVal: "Maple Leafs" },{ id: 3, dispVal: "Raptors" }];
  const filteredDemo1Vals3 = [{ id: 1, dispVal: "Blue Jays" }];

});