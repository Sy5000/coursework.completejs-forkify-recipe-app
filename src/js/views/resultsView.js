import icons from 'url:../../img/icons.svg'; //use as filepath in html
import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  //define parent to attach methods
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for that query!';
  _message = '';

  _generateMarkup() {
    // console.log(this._data); //contains all results
    return this._data
      .map(result => previewView.render(result, false)) //instead of render / return as string from child object
      .join(''); //map results into array(loop function below)
  }
}

export default new ResultsView();
