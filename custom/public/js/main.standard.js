import myw from 'myWorld-client';
import 'main.standard';                       
import './models/troubleTicketModel';
import {SelectPlugin} from './plugins/selectPlugin';
import {DrawPlugin} from './plugins/drawPlugin';
// import "./controls/completeFieldViewer";


myw.localisation.loadModuleLocale('custom');

// Register plugin
myw.applicationDefinition.plugins["select"] = SelectPlugin;
myw.applicationDefinition.plugins["draw"] = DrawPlugin;

// Add toolbar button
const desktopLayoutDef = myw.applicationDefinition.layouts.desktop;
const desktopToolbarButtons = desktopLayoutDef.controls.toolbar[1].buttons;
desktopToolbarButtons.push('select.dialog');
desktopToolbarButtons.push('draw.draw');
