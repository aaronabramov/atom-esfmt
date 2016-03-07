var esfmt = require('esfmt');
var CompositeDisposable = require('atom').CompositeDisposable;
var AtomEsfmt;

module.exports = AtomEsfmt = {
  modalPanel: null,
  subscriptions: null,

  activate: function(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that formatSelections this view
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'atom-esfmt:formatSelection': function() {
            return this.formatSelection();
        }.bind(this),
        'atom-esfmt:formatFile': function() {
            return this.formatFile();
        }.bind(this)
      })
    );

    atom.workspace.observeTextEditors(function(editor) {
      this.subscriptions.add(editor.getBuffer().onWillSave(this.fileSaved.bind(this, editor)));
    }.bind(this));
  },
  deactivate: function() {
    this.subscriptions.dispose();
  },
  serialize: function() {
    return {
      atomEsfmtViewState: this.atomEsfmtView.serialize()
    }
  },
  formatSelection: function() {
    var textEditor = atom.workspace.getActiveTextEditor();
    var text = textEditor.getSelectedText();

    return textEditor.insertText(esfmt.format(text));
  },
  _formatAllForEditor: function(editor) {
    var text = editor.getText();

    return editor.setText(esfmt.format(text));
  },
  formatFile: function() {
    var textEditor = atom.workspace.getActiveTextEditor();

    return this._formatAllForEditor(textEditor);
  },
  fileSaved: function(editor) {
    if (editor.isModified()) {
      return this._formatAllForEditor(editor);
    }
  }
};
