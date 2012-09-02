var global = {
	username: null,
	servername: "Osler",
	mainTabPanel: null,
	viewport: null
}

var usernameValid = false, passwordValid = false;

function getTopNavMsg() {
	return (global.username ? "Welcome " + global.username + ", <a href='#' id='main_logout'>Logout</a> " : "") + global.servername + " server"; 
}

function mainLayout() {
	global.viewport = new Ext.Viewport({
	    layout: 'border',
	    items: [{
	        region: 'north',
	        html: '<h1 class="x-panel-header">White Shark Information System <span style="text-align:right; float:right;" id="topnav_msg">' + getTopNavMsg() + "</span></h1>",
	        border: false,
	        margins: '0 0 5 0',
	    }, {
	        region: 'south',
	        html: '<h2 class="x-panel-header main-footer">&Copy; Copyright AgileSonic Corp., 2012</h2>',
	        autoHeight: true,
	        border: false
	    }, {
	        region: 'center',
	        xtype: 'panel',
	        id: 'main_center',
			tbar : new Ext.Toolbar({
				hidden: true,
				items : []
			}),
	        items: [{
	        	xtype: 'tabpanel',
	        	id: 'mainTabPanel',
		        items: []
	        }]
	    }]
	});
	global.mainTabPanel = global.viewport.getComponent('main_center').getComponent('mainTabPanel');
	Ext.select('#topnav_msg').on('click', function(e) {
		doLogout();
	});
}

function showLoginWin() {
	usernameValid = false; passwordValid = false;
	var login_win = new Ext.Window({
		renderTo: Ext.getBody(),
		title: 'Login',
		width: 300,
		modal: true,
		closable: false,
		draggable: false,
		resizable: false,
		layout: 'form',
		id: 'login_win',
		cls: 'my-panel-class',
		bodyStyle: 'padding: 4px;',
		items: [
			{
				xtype: 'label',
				id: 'login_msg',
				hidden: true,
				style: {
					color: 'red',
					'font-size': '1em'
				}
			},
			{
				xtype: 'textfield',
				fieldLabel: 'User name',
				name: 'username',
				id: 'login_Username',
				allowBlank: false,
				enableKeyEvents: true,
				listeners: {
					valid: function() {
						userNameValid = true;
						if( passwordValid )
							Ext.ComponentMgr.get('login_LoginBtn').enable(); 
					},
					invalid: function() {
						userNameValid = false;
						Ext.ComponentMgr.get('login_LoginBtn').disable(); 
					},
					specialkey: function(field, eventObj) {
						if( field.getValue() != "" && eventObj.getKey() == Ext.EventObject.ENTER ) {
							userNameValid = true;
							doLogin();
						}
					}
				}
			},
			{
				xtype: 'textfield',
				fieldLabel: 'Password',
				inputType: 'password',
				name: 'password',
				id: 'login_Password',
				allowBlank: false,
				enableKeyEvents: true,
				listeners: {
					valid: function() {
						passwordValid = true;
						if( userNameValid )
							Ext.ComponentMgr.get('login_LoginBtn').enable(); 
					},
					invalid: function() {
						passwordValid = false;
						Ext.ComponentMgr.get('login_LoginBtn').disable(); 
					},
					specialkey: function(field, eventObj) {
						if( field.getValue() != "" && eventObj.getKey() == Ext.EventObject.ENTER ) {
							passwordValid = true;
							doLogin();
						}
					}
				}
			}
		],
		buttons: [
			{
				text: 'Login',
				id: 'login_LoginBtn',
				disabled: true,
				handler: function(){
					doLogin();
				}
			}
		]
	}).show();
}

function doLogin() {
	if( userNameValid && passwordValid ) {
		Ext.Ajax.request({
			url: 'wsis/login',
			method: 'post',
			params: {
				username: Ext.ComponentMgr.get('login_Username').getValue(),
				password: Ext.ComponentMgr.get('login_Password').getValue()
			},
			success: function(resp) {
				var obj = Ext.decode(resp.responseText);
				if( obj.success ) {
					Ext.ComponentMgr.get('login_msg').setText('').hide();
					Ext.ComponentMgr.get('login_win').close();
					global.username = obj.username;
					initMainScreen();
				} else {
					Ext.ComponentMgr.get('login_msg').setText('Login failed.').show();
				}
			},
			failure: function(resp) {
				Ext.ComponentMgr.get('login_msg').setText('Login failed.').show();
			}
		});
	}
}

function doLogout() {
	Ext.Ajax.request({
		url: 'wsis/logout',
		method: 'post'
	});
	global.username = null;
	Ext.get('topnav_msg').dom.innerHTML = getTopNavMsg();
	global.mainTabPanel.ownerCt.getTopToolbar().hide();
	global.mainTabPanel.removeAll();
	showLoginWin();
}

function initMainScreen() {
	Ext.get('topnav_msg').dom.innerHTML = getTopNavMsg();
	buildMainMenu();
	global.mainTabPanel.removeAll();
}

function buildMainMenu() {
	var menuHandler = function(menuOption) {
		Ext.Msg.alert("You clicked " + menuOption.text, "Not implemented yet");
	};

	global.mainTabPanel.ownerCt.getTopToolbar().add({
        text: 'File',
        menu: {
            xtype: 'menu',
            plain: true,
            items: [{
                text: 'Logout',
                handler: doLogout
            }]
        }
	});    
	global.mainTabPanel.ownerCt.getTopToolbar().add({
        text: 'Operations',
        menu: {
            xtype: 'menu',
            plain: true,
            items: [{
                text: 'Client Management',
                handler: menuHandler
            }, {
                text: 'Job Management',
                handler: menuHandler
            }]
        }
	});
	global.mainTabPanel.ownerCt.getTopToolbar().addFill();
	global.mainTabPanel.ownerCt.getTopToolbar().addField(new Ext.form.TextField({
		emptyText: "Smart search",
		id: "mainToolBarSmartSearch",
		listeners: {
			specialkey: function(field, eventObj) {
				if( field.getValue() != "" && eventObj.getKey() == Ext.EventObject.ENTER ) {
					doSmartSearch(field.getValue());
				}
			}
		}
	}));
	global.mainTabPanel.ownerCt.getTopToolbar().addField(new Ext.Button({
		text: "Search",
		handler: function() {
			if( Ext.ComponentMgr.get('mainToolBarSmartSearch').getValue() != "" ) {
				doSmartSearch(Ext.ComponentMgr.get('mainToolBarSmartSearch').getValue());
			}
		}
	}));
	
	global.mainTabPanel.ownerCt.getTopToolbar().show();
}

function doSmartSearch(key) {
	ajaxCall('wsis/smartSearch', 'GET', {key: key}, function(obj) {
		var clients = obj.clients;
		if( clients.length > 0 ) {
			var clientTab = getClientTab(clients[0].CFID);
			if( clientTab < 0 ) {
				openClientTab(clients[0]);
			} else {
				global.mainTabPanel.setActiveTab(clientTab);
			}
		} else {
			Ext.Msg.alert("Smart Search", "No client found matching " + key);
		}
	}, function() {
		Ext.Msg.alert("Smart Search", "Smart search failed");
	})
}

function openClientTab(client) {
	var clientForm = new Ext.form.FormPanel({
		xtype: 'form',
		width: 280,
		border: false,
		client: client,
		items: [{
			xtype: 'textfield',
			fieldLabel: 'CFID',
			name: 'Client ID',
			value: client.CFID,
			id: "cfid_" + client.CFID + "_CFID",
			readOnly: true
		}, {
			xtype: 'textfield',
			fieldLabel: 'First name',
			name: 'firstname',
			value: client.firstname,
			id: "cfid_" + client.CFID + "_firstname"
		}, {
			xtype: 'textfield',
			fieldLabel: 'Last name',
			name: 'lastname',
			value: client.lastname,
			id: "cfid_" + client.CFID + "_lastname"
		}],
		buttons: [{
			text: "Save",
//				disabled: true,
			handler: function() {
				ajaxCall('wsis/updateClient', 'POST', {
					CFID: clientForm.initialConfig.client.CFID,
					firstname: Ext.ComponentMgr.get('cfid_' + client.CFID + '_firstname').getValue(),
					lastname: Ext.ComponentMgr.get('cfid_' + client.CFID + '_lastname').getValue()
				}, function(obj) {
					Ext.Msg.alert("Client Management", "Client info updated successfully.");
				}, function(resp) {
					Ext.Msg.alert("Client Management", "Client info update failed.");
				})
			}
		}]
	});
	global.mainTabPanel.add({
		title: "Client: " + client.firstname + " " + client.lastname,
		closable: true,
		items: [clientForm]
	});
	global.mainTabPanel.setActiveTab(global.mainTabPanel.items.length - 1);
}

function getClientTab(cfid) {
	var tabIndex = -1;
	global.mainTabPanel.items.each(function(item, index) {
		var items = item.initialConfig.items;
		if( items && items[0] && items[0].initialConfig.client && items[0].initialConfig.client.CFID == cfid ) {
			tabIndex = index;
			return false;
		} 
	});
	return tabIndex;
}

function ajaxCall(url, method, params, successFunc, failFunc) {
	Ext.Ajax.request({
		url: url,
		method: method,
		params: params,
		success: function(resp) {
			var obj = Ext.decode(resp.responseText);
			if( obj.success ) {
				successFunc(obj);
			} else {
				failFunc(resp);
			}
		},
		failure: failFunc
	});
}
