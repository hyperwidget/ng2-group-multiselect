import { Ng2GroupMultiselectPage } from './app.po';

describe('ng2-group-multiselect App', () => {
  let page: Ng2GroupMultiselectPage;

  beforeEach(() => {
    page = new Ng2GroupMultiselectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
