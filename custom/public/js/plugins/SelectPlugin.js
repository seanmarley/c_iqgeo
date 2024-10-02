import myw from 'myWorld-client';

class SelectPlugin extends myw.Plugin {
    static {
        this.prototype.messageGroup = 'SelectPlugin';
        this.prototype.buttons = {
            dialog: class extends myw.PluginButton {
                static {
                    this.prototype.imgSrc = 'modules/custom/images/select.svg'; 
                }
                action() {
                    this.owner.openDialog();
                }
            }
        };
    }
 
    openDialog(){
        this.dialog = new myw.Dialog({
            title: this.msg("dialog_title"),
            modal: false,
            resizable: true,
            buttons: {
                Close: {
                    text: 'Close',
                    class: 'right',
                    click: () => {
                        this.app.getMaps().forEach(map => {
                            map.endCurrentInteractionMode();
                        });
                        this.dialog.close();
                    }
                }
            },
            autoOpen: true,
            width: 400,
            height: 400,
            position:{
                my: "right center",
                at: "right bottom",
            }
        });
        this.label = new myw.Textarea();
        this.label.addAttribute("readonly", "readonly")
        this.label.addAttribute("cols", "30")
        this.label.addAttribute("rows", "5")
        this.label.addAttribute("style", "height: 200px; width: 230px;");
        this.renderForm();
        this.label.setValue(this.msg("dialog_note"));
        this._enableSelectionMode();
        this.features = [];
        
    }
    renderForm(state = {}) {
        this.form = new myw.Form({
            rows: [ {
                label: 'Features:',
                components: [this.label]
            } ],
        });
        this.dialog.$el.html(this.form.$el);
    }
    _enableSelectionMode() {
        if (!this._selectModeByMap) this._selectModeByMap = new Map();
        this.app.getMaps().forEach(map => {
            let selectionMode = this._selectModeByMap.get(map);
            if (!selectionMode) {
                selectionMode = new myw.SelectionMode(map, {
                    fireAppEvents: false,
                    // restrict feature types
                    // featureTypes: ['trouble_ticket'],
                    selectionHandler: features => this.mapSelectionHandler(features)
                });
                this._selectModeByMap.set(map, selectionMode);
            }
            if (map.currentInteractionMode() !== selectionMode) {
                map.setInteractionMode(selectionMode);
            }
        });
    }

    mapSelectionHandler(features){
        this.label.setValue("");
        for (let feature of features){
            if (this.features.find((f)=>{ return f.getUrn() == feature.getUrn(); })){
                continue;
            }
            this.features.push(feature);
        }
        const names = this.features.map((f) => f.getTitle())
        this.label.setValue(names.join("\n"));
    }
}

export {
    SelectPlugin
}