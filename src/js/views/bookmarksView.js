import icons from 'url:../../img/icons.svg'; //use as filepath in html
import View from './View.js';
import previewView from './previewView.js';

class BookmarksView extends View {
  //define parent to attach methods
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it !';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    // console.log('markup func', this._data); //contains all results
    return this._data
      .map(bookmark => previewView.render(bookmark, false)) //instead of render / return as string from child object
      .join(''); //map results into array(loop function below)
  }
}

export default new BookmarksView();
