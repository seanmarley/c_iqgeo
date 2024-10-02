import myw from 'myWorld-client';

class DrawPlugin extends myw.Plugin {
    static {
        this.prototype.buttons = {
            //First you define the buttons that will be shown in the toolbar. Each button has an ID and can do a different action
            draw: class extends myw.PluginButton {
                static {
                    this.prototype.imgSrc = 'modules/custom/images/draw.svg'; 
                }

                action() {
                    //and this is the action to be executed by the plugin. For now only opening a new tab
                    this.owner.draw();
                }
            }
        };
    }
    constructor(owner, options) {
        super(owner, options);
        this.map = this.app.map;
    }
    draw(){
        const drawOptions = {
            create: {
                polygon: {
                    color: '#0000FF',
                    fillOpacity: 0.5,
                    lineOpacity: 1
                }
            }
        };
        this.geomDraw = new myw.GeomDrawMode(this.map, drawOptions);
        this.geomDraw.setGeomType('Polygon');
        this.map.on('geomdraw-end', this._onGeomDrawEnd.bind(this));
        this.map.setInteractionMode(this.geomDraw);
        
    }
    async _onGeomDrawEnd(){
        if(this.geomDraw){
            const geom = this.geomDraw.getGeometry();
            this.map.un('geomdraw-end', this._onGeomDrawEnd);
            this.geomDraw = null;
            const features = await this.app.database.getFeatures("trouble_ticket", {"geom": geom});
            this.openDialog();
            this.label.setValue("");
            const names = features.map((f) => f.getTitle())
            this.label.setValue(names.join("\n"));
            this.map.endCurrentInteractionMode();
            
        }
        
    }
    openDialog(){
        this.dialog = new myw.Dialog({
            title: "Selected features",
            modal: false,
            resizable: true,
            buttons: {
                Close: {
                    text: 'Close',
                    class: 'right',
                    click: () => {
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
        this.form = new myw.Form({
            rows: [ {
                label: 'Features:',
                components: [this.label]
            } ],
        });
        this.dialog.$el.html(this.form.$el);
        this.features = [];
        
    }
  
}
export {
    DrawPlugin
}