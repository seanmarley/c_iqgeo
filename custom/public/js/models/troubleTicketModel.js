import myw from 'myWorld-client';

import {CompleteFieldViewer} from "../controls/completeFieldViewer";

class troubleTicketModel extends myw.MyWorldFeature {
    static {
        this.prototype.customStyleFieldNames = ['status'];
        this.prototype.fieldViewers = {
            status: CompleteFieldViewer
        };
        // this.prototype.readonlyFields = ['datetime_completed'];
        // this.prototype.usePopupEditor = true;
    }
    // Trigger
    preUpdate(featureJson, app) {
        if (this.properties.status != 'completed' && featureJson.properties.status == 'completed'){
            featureJson.properties.datetime_completed = new Date();
        }
        return Promise.resolve();
    }
    // Transaction hook
    async buildDeleteTransaction() {
        const transaction = super.buildDeleteTransaction();
        const features = await this.datasource.getRelationship(this, 'associated_object');
        for (let feature of features) {
            if(feature.getType().startsWith('trouble')){
                transaction.addDelete(feature); 
            }
        }
        return transaction;
    }  
    // Calc method
    async associatedObjectLength(){
        const features = await this.datasource.getRelationship(this, 'associated_object');
        if (features.length == 0){
            return;
        }
        const feature = features[0];
        if (feature.getType() != 'trouble_line'){
            return;
        }
        await myw.geometry.init();
        const value = feature.getGeometry().length();
        return value.toFixed(2);
    }

    // Custom styles
    getCustomStyles(defaultStyles) {
        if (this.properties.status == 'completed') {
             let normal = defaultStyles.normal;
             if (normal.lookup) normal = normal.getStyleFor(this);
             normal = normal.clone(); //clone style does not affect other features
             normal.size = 36;
             return { normal };
         }
         return defaultStyles;
      }

}

myw.featureModels['trouble_ticket'] = troubleTicketModel;


export {
    troubleTicketModel
}