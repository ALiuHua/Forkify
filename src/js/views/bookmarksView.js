import View from './View.js';
import previewView from './previewView.js';
import icons from '../../img/icons.svg';

class BookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';
  addHandlerRenderBookmark(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmark => {
        return previewView.render(bookmark, false);
      })
      .join('');
  }
}
export default new BookmarksView();
