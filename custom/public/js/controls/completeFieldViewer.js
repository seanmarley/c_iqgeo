import myw from 'myWorld-client';

class CompleteFieldViewer extends myw.FieldViewer {
    renderValue(fieldValue){
        if (this.feature.properties.status == 'completed'){
            return;
        }
        return super.renderValue(fieldValue);
    }
}
// You can use this to export class to myw namespace and used this in configuration
// myw.CompleteFieldViewer = CompleteFieldViewer;

export {
    CompleteFieldViewer
}