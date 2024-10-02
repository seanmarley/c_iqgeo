# CGI Training

## Prepare
- Clone `https://github.com/kpawlik/training.git`
- Copy files to custom folder in your project, or modify compose file
- Connect to container shell and execute

```python
/opt/iqgeo/platform/Tools/myw_db $MYW_DB_NAME load /opt/iqgeo/platform/WebApps/myworldapp/modules/custom/install/enums/*enum
/opt/iqgeo/platform/Tools/myw_db $MYW_DB_NAME load /opt/iqgeo/platform/WebApps/myworldapp/modules/custom/install/features/*def
/opt/iqgeo/platform/Tools/myw_db $MYW_DB_NAME load /opt/iqgeo/platform/WebApps/myworldapp/modules/custom/install/layers/*layer
/opt/iqgeo/platform/Tools/myw_db $MYW_DB_NAME load /opt/iqgeo/platform/WebApps/myworldapp/modules/custom/install/applications/*application
/opt/iqgeo/platform/Tools/myw_db $MYW_DB_NAME load /opt/iqgeo/platform/WebApps/myworldapp/modules/custom/install/applications/water.application 
```

- Add permission to the application to Admin role in `Configuration`  > `Roles`

## Extend application
- Create `main.standard.js` file in custom module. This is a starting point of your application.
- Add a new Application definition in  the`Configuration`  > `Applications`
- Set Layers, Snapping, Read-only,
- Add permissions to the application to the role in `Configuration`  > `Roles`
- Edit `main.standard.js` to Add/Remove plugins, toolbar buttons,  etc.
    
## Extend Feature model
- In module custom `public/js/models` create new class extend `myw.MyWorldFeature`
- Register class in `myw.featureModels`
- Make this available in application. Import to `main.standard.js`

## Customize model
- Set `readonlyFields`  in featueModel will remove fields from editor
    - Set Readonly in Configuration will disable field in editor (still visible)
- Triggers (preInsert/Update/Delete posInsert/Update/Delete)
    - Triggers (JS triggers are run only if you run operation from editor)
- Transaction hooks
    - Transaction  (JS triggers are run only if you run operation from editor) - not cascade
- Calculated field
    - Define method in model class
    - Register method in Configuration app
- getCustomStyles
    - make sure to change layer class to `myw.MywVectorLayer`
    - set `customStyleFieldNames`  if needed

## Viewer
- Feature viewer
- field viewer
## Editor
- Feature editor
- Field editor
    - 2 ways to set editor/viewer to field
        - register class as viewer/editor in `featureModel`
        - Export class to `myw` name space and set viewer/editor in Configuration
## Plugin
- toolbar add new button to toolbar
- Map interactions
    - Custom Select mode
        - `map.setInteractionMode()` and  `map.endCurrentInteractionMode();`
    - Draw mode

## Server

### Controller
- API spec, to insert record
- Implementation
- Authentication
    - remove iqgeo
    - add custom authentication JWT, OAuth,…

### Command
- Command to list features from db

 

# Exercises:

## 1 deleteTransaction

Modify file `custom\public\js\models\troubleTicketModel.js` method `buildDeleteTransaction()`  to remove cascade `associated_object` type `trouble*`

Remark: Please notify that `associated_object` can have reverse associated object. Avoid Infinitive loop. You can use method `getUrn()` on feature to get unique identifier of record.

## 2 Feature model

Define model for trouble_line object

## 3 Calculated field

Define  for trouble_line which will display length of geometry.

## 4. Plugin

Create plugin which catch URL query parameter with name ‘cgi’ and display the value in popup

Remark: method `setStateFromAppLink` implemented on plugin will get as parameter values from URL  with the same name as name of registered plugin

## 4. Rest API

- Add method to remove and update record via controller
- Add validation of fields

## 5. Command

Extend command to remove all completed trouble tickets