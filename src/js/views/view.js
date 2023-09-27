import icons from 'url:../../img/icons.svg'; //use as filepath in html

export default class View {
  _data;
  //proper JS DOC
  // 1 - multiline code /**
  //
  //ideas to improve
  //display number of pages ☑️
  //sort results by #of ingredients or duration
  //validate ingredients before submit addrecipe form.
  //Add ingredients to a list (new link to view),
  //add to meal planner (next 7 days),
  //nutritional data for each ingredients eg calories (new API spoonacular)

  /**
   * Render the object to the DOM
   * @param {Object | Object[]} data The data to be rendered (eg.recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render is false
   * @this {Object} View instance
   * @author Simon Davies
   * @toDo Finish implementation
   */

  render(data, render = true) {
    //check if data exists OR data is empty array
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    //empty container div
    this._clear();
    //insert data into html
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  //render new HTML > compare to current html > only render updated data/HTML
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    this._data = data;
    const newMarkup = this._generateMarkup();
    //create var (virtual DOM object) in MEMORY
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    //selet ALL new elements in var / convert to array'.from'
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    //select ALL current elements
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    //DEV
    // console.log('new ->', newElements, 'current ->', curElements);

    //UPDATE TEXT
    //loop over each array at the same time > compare
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //compare method
      // console.log('compare', curEl, newEl.isEqualNode(curEl));
      //conditional, check if vales are different then
      // && target text only (child node, has text value, not empty string)
      // ?optional chaining, 1st child may not exist
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('child node text ->', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      //UPDATE ATTRIBUTES //make -/+ buttons function
      if (!newEl.isEqualNode(curEl))
        //convert obj to array > loop over and copy attributes from new to current
        // console.log('Attributes --->', Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
            <div>
              <svg>
                <use href="src/img/${icons}.svg#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
            <div>
              <svg>
                <use href="src/img/${icons}.svg#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
