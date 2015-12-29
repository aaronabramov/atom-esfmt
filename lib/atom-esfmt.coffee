esfmt = require 'esfmt'
{CompositeDisposable} = require 'atom'

module.exports = AtomEsfmt =
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'atom-esfmt:toggle': => @toggle()

  deactivate: ->
    @subscriptions.dispose()

  serialize: ->
    atomEsfmtViewState: @atomEsfmtView.serialize()

  toggle: ->
      textEditor = atom.workspace.getActiveTextEditor()
      text = textEditor.getText()
      textEditor.insertText(esfmt.format(text))
