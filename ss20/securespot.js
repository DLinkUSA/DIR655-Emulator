/**
 * --------------------------------------------------------------------------------
 * Copyright (C) 2008 Bsecure Technologies, Inc. All rights reserved 
 * Revision : $Revision: 1.233 $ 
 * Revised : $Date: 2009/02/05 22:39:29 $ 
 * Purpose : Javascript functions 
 * 
 * Notice: This code is the sole property of Bsecure Technologies, Inc. and may 
 * not be copied, used or distributed in any form not expressly authorized by 
 * Bsecure Technologies, Inc.
 * --------------------------------------------------------------------------------
 */

var Firebug = true;

//Paths
var PATH_MYACCOUNT = '~/AccountCtrl/AccountCtrl.ascx'; //My Account Control Path

/**
* Unhighlights the last selected Network Map Icon. Highlights the Network Map
* Icon with the same index of the provided index. Moves the Delete button under
* the selected Network Map Icon
* 
* @param (int)
*          pintIndex Index of the Network Map Icon clicked
*/
function NetworkMap_OnIndexChanged(pintIndex)
{
	if (Firebug) console.info('NetworkMap_OnIndexChanged', pintIndex);

	if (!UI.NetworkMap)
		return;

	for (var i = 0; i <= Map.Item.length - 1; i++)
	{
		var mapObj = $get(Map.ID + '_PCDivBg' + i);
		if (mapObj)
		{
			var objAttrib = mapObj.getAttribute(attributeClass());
			mapObj.setAttribute(attributeClass(), objAttrib.replace(/ Chosen/, ''));

			mapObj = $get(Map.ID + '_PCDivBg' + i + '_PCDiv' + i);
			objAttrib = mapObj.getAttribute(attributeClass());
			mapObj.setAttribute(attributeClass(), objAttrib.replace(/ Chosen/, ''));
		}
	}

	var selObj = $get(Map.ID + '_PCDivBg' + pintIndex);
	if (selObj == null)
		return;

	var selAttrib = selObj.getAttribute(attributeClass());
	selObj.setAttribute(attributeClass(), selAttrib + " Chosen");

	// Moves the Delete button under the selected icon
	var btnDelete = $get(Map.ID + "_DeleteDevice");
	btnDelete.style.top = (parseInt(selObj.offsetTop) + 122) + 'px';
	btnDelete.style.left = (parseInt(selObj.offsetLeft) + 10) + 'px';
	btnDelete.style.display = (pintIndex > 1) ? 'block' : 'none';

	selObj = null;
	selAttrib = null;
}

/**
* Builds value to send to server containing client information
* 
* @return (string) A string containing the selected Device Type, Device MAC
*         Address, and the Device's ID separated by "|"
*/
function NetworkMapIcon_Selected()
{
	if (Firebug) console.info('NetworkMapIcon_Selected');

	var str = $get(MasterControls.hidCurrentType).value + "|";
	str += $get(MasterControls.hidCurrentMac).value + "|";
	str += $get(MasterControls.hidCurrentID).value;
	return str;
}

/**
* Exits if the clicked on Service is not available. Hides the Thin Client
* download link. Sets the Service Index cookie. Calls function to unhighlight
* the Services. Highlights the clicked on Service.
* 
* @param (int)
*          pintIndex Index of the Service clicked
*/
function ServicePanel_OnClick(pintIndex)
{
	if (Firebug) console.info('ServicePanel_OnClick', pintIndex);

	//If the page is the quick Tour, exit this function
	if (is_QuickTour) return false;

	if ($get(srvPanel + '_srv' + pintIndex + '_available').getAttribute(attributeClass()) == 'disabled')
		return;

	Div_CssUpdate('divThinClientDownload', 'display', 'none');

	UI.PrevServiceID = UI.ServiceID;
	UI.ServiceID = pintIndex;
	setCookie(COOKIE_SERVICE, pintIndex);

	ServicePanel_Reset();
	$get(srvPanel + '_srv' + pintIndex).setAttribute(attributeClass(), "service selected");
}

/**
* Unhighlights all the Services
*/
function ServicePanel_Reset()
{
	if (Firebug) console.info('ServicePanel_Reset');

	for (var i = 0; i <= 7; i++)
		$get(srvPanel + '_srv' + i).setAttribute(attributeClass(), "service");
}

/**
* Verifies the selected Service is available. Displays the "Manage Account"
* prompt if the service does not manage itself and the Router is not selected.
* The prompt will also not be displayed if editing a DSD account.
* 
* @param (int)
*          pintIndex Index of the Service clicked
*/
function LoadControl_Verify(pintIndex)
{
	if (Firebug) console.info('LoadControl_Verify', pintIndex);

	var managePrompt = 0;
	if ($get(srvPanel + '_srv' + pintIndex + '_available').getAttribute(attributeClass()) == 'enabled')
    //DSD Manage Prompt
    if(IsClientDSD())
    {
      // Show 'Manage Where' prompt
      var ckSelDevice = getCookie(COOKIE_DEVICE);
      if(Map.Item[ckSelDevice]){
        if(!Map.Item[ckSelDevice].HasServices)
        {
          managePrompt = 1;
          ManageDsdAccount_Prompt();          
        }    
      }
    }
    else if (UI.Services != null)
		{
		  //DIR Manage Prompt
			if (!UI.Services[pintIndex].ManagesSelf && UI.Device.DeviceType != 'Router' && !IsClientDSD())
      {
	      ManageAccount_Prompt(); // Show 'Manage Where' prompt
	      managePrompt = 1;
      }
	  }

	return managePrompt;
}

/**
* Displays the Thin Client and associated loading mask. Removes itself from the
* AJAX End Request event.
*/
function ThinClientDownload_Render()
{
	if (Firebug) console.info('ThinClientDownload_Render');

	var cookieTab = ckCookieNumVal(getCookie(COOKIE_TAB));
	if (cookieTab == 0)
	{
		Div_CssUpdate('loading_screen_footer', 'display', 'block');
		/* Light mask so you can read the description and links */
		$get('loading_screen_footer').style.backgroundImage = 'url("images/loading_bg_trans.gif")';
		Div_CssUpdate('divThinClientDownload', 'display', 'block');
	}
}

/*
*	Function sets the display properties for these HTML div elements.
*	It prevents the Loading Screen Footer and the ThinClient Download screens from appearing.
*/
function ClearTC()
{
	if (Firebug) console.info('ClearTC');

	Div_CssUpdate('loading_screen_footer', 'display', 'none');
	Div_CssUpdate('divThinClientDownload', 'display', 'none');
}
/**
* Verifies the Service being hovered over is enabled and not already selected.
* Modifies the class.
* 
* @param (int)
*          pintIndex Index of the Service clicked
*/
function ServiceLink_OnMouseOver(pintIndex)
{
	if (Firebug) console.info('ServiceLink_OnMouseOver', pintIndex);

	if ($get(srvPanel + '_srv' + pintIndex + '_available').getAttribute(attributeClass()) == 'enabled')
		if ($get(srvPanel + '_srv' + pintIndex).getAttribute(attributeClass()) != 'service selected')
		$get(srvPanel + '_srv' + pintIndex).setAttribute(attributeClass(), 'service hover');
}

/**
 * Verifies the Service being hovered over is enabled and not already selected.
 * Modifies the class.
 * 
 * @param (int)
 *          pintIndex Index of the Service clicked
 */
function ServiceLink_OnMouseOut ( pintIndex )
{
	if ( Firebug ) console.info ( 'ServiceLink_OnMouseOut', pintIndex );

	if ( $get ( srvPanel + '_srv' + pintIndex + '_available' ).getAttribute ( attributeClass () ) == 'enabled' )
		if ( $get ( srvPanel + '_srv' + pintIndex ).getAttribute ( attributeClass () ) != 'service selected' ) 
			$get ( srvPanel + '_srv' + pintIndex ).setAttribute ( attributeClass (), 'service' );
}

/**
* Returns if the selected Client's ID is 0, which determines if the selected
* client is a DSD or not.
* 
* @return (bool)
*/
function IsDSD ()
{
	if ( Firebug ) console.info ( 'IsDSD' );

	// First check to see if UI.Device is available
	if ( UI.Device != 'undefined' && UI.Device != null )
	{
		// Secondly, Check if the router is selected
		if ( UI.Device.DeviceType == 'Router' )
		{
			// Check the deviceID. DSD < 3
			return ( UI.Device.DeviceID < 3 ) ? true : false;
		}
		else
		{
			// Check the clientid and categoryid
			return ( UI.ClientID == 0 && UI.Device.CategoryID == 0 ) ? true : false;
		}
	}
	else
	{
		return false;
	}
}

function IsClientDSD ()
{
	if ( Firebug ) console.info ( 'IsClientDSD' );

	// First check to see if UI.Device is available
	if ( UI.Device != 'undefined' && UI.Device != null )
	{
		// Secondly, Check if the router is selected
		if ( UI.Device.DeviceType == 'Router' )
		{
			return false;
		}
		else
		{
			// Check the clientid and categoryid
			return ( UI.ClientID <= 0 && UI.Device.CategoryID == 0 ) ? true : false;
		}
	}
	else
	{
		return false;
	}
}

/**
* Updates the Info Tab
* 
* @param (JSON)
*          pjsonDevice Selected client's information in JSON format.
*/
function InfoPanel_Update(pjsonDevice)
{
	if (Firebug) console.info('InfoPanel_Update', pjsonDevice);

	if (pjsonDevice === null && !isRefreshed())
	{
		NetworkMapIcon_OnClick(0);
		return;
	}
	// Populate the text boxes
	if (pjsonDevice != null)
	{

		if (pjsonDevice.OSID == 2 || pjsonDevice.DeviceType == 'Router') // Router or computer selected
		{
			$get(NewDeviceControls.lblVersionLabel).innerHTML = (pjsonDevice.CategoryID === 1) ? "Client Ver.:" : "   Ver.";
			$get(NewDeviceControls.ddlDeviceType).value = "19";
			$get(NewDeviceControls.ddlOperatingSystem).value = "1";

			var fwv = pjsonDevice.Version;

			if (fwv.indexOf(",") > 0)
				fwv = fwv.split(",")[1];

			InfoInput_Update(NewDeviceControls.txtVersion, fwv, false);
		}
		else
		{
			$get(NewDeviceControls.lblVersionLabel).innerHTML = "";
			$get(NewDeviceControls.ddlDeviceType).value = "";
			$get(NewDeviceControls.ddlOperatingSystem).value = "";
			$get(NewDeviceControls.txtVersion).value = "";
		}

		InfoInput_Update ( NewDeviceControls.txtNewName, pjsonDevice.Description, !pjsonDevice.IsEditable );
		if(!IsClientDSD())InfoInput_Update ( NewDeviceControls.txtNewIP, pjsonDevice.IPAddress, true );
		InfoInput_Update ( NewDeviceControls.txtNewMac, pjsonDevice.MAC, true );

		// MAC Adress controls
		$get(NewDeviceControls.hlMacPrevious).style.display = "none";
		$get(NewDeviceControls.hlMacNext).style.display = (pjsonDevice.MACAddresses.length > 1) ? "block" : "none";

		// IP Adress controls
		$get(NewDeviceControls.hlIpPrevious).style.display = "none";
		$get(NewDeviceControls.hlIpNext).style.display = (pjsonDevice.IPAddresses.length > 1) ? "block" : "none";
		// If there is no IP address hide the row.
		$get('trIPAddressRow').style.visibility = ($get(NewDeviceControls.txtNewIP).value.length === 0 || IsDSD()) ? 'hidden' : 'visible';

		// If "IsEditable" is false, this indicates the router is selected.
		// If the router is selected, then there is no need to populate the dropdown boxes.
		$get(NewDeviceControls.tblddSelections).style.display = (!pjsonDevice.IsEditable || IsDSD()) ? "none" : "block";
		$get(NewDeviceControls.pnlUpdateButton).style.display = $get(NewDeviceControls.tblddSelections).style.display;

		$get(NewDeviceControls.ddlOperatingSystem).value = IsDSD() ? 1 : pjsonDevice.OSID;
    
		if (pjsonDevice.CategoryID != 5)
			$get(NewDeviceControls.ddlDeviceCategory).value = pjsonDevice.CategoryID;

		// Triggers dropdown population
		InfoTab_ddlDeviceCategory_OnChange (); 
		
		$get ( NewDeviceControls.ddlDeviceType ).value = pjsonDevice.DeviceTypeID; // Cannot set until after dropdown population

		var deviceID = (UI.Device.DeviceType == "Router") ? UI.Device.DeviceID : "";
		Device_Images_Render("NetworkItem " + UI.Device.DeviceType + deviceID);
	}
}

/**
* Updates the value of the passed input control and enables/disables the
* control.
* 
* @param (string)
*          pstrInput ID of the input control to update
* @param (string)
*          pstrValue Value to set the input control equal to
* @param (bit)
*          pbitEnabled Determines if the input control is enabled or not
*/
function InfoInput_Update(pstrInput, pstrValue, pbitEnabled)
{
	if (Firebug) console.info('InfoInput_Update', pstrInput, pstrValue, pbitEnabled);

	var objInput = $get(pstrInput);
	objInput.value = pstrValue;
	objInput.disabled = pbitEnabled;
}

/**
* Function updates the Security Tab by marking the individual services 
* as enabled or disabled if the service is available or not, 
* active or inactive if the service is enabled or not, 
* and on or off if the service is enabled or not.
* 
* @param (JSON)
*          pjsonServices Services of the selected client in JSON format
*/
function ServicePanel_Update(pjsonServices)
{
	if (Firebug) console.info('ServicePanel_Update', pjsonServices);

	// Unhighlights all the services.
	ServicePanel_Reset();
	var selService = -1;
  var showEndpointBox = false;
  
	for (var i = 0; i < pjsonServices.length; i++)
	{
		var jsonService = pjsonServices[i];
		$get(srvPanel + '_srv' + i + '_available').setAttribute(attributeClass(), (jsonService.IsAvailable) ? "enabled" : "disabled");
		$get(srvPanel + '_srv' + i + '_active').setAttribute(attributeClass(), (jsonService.IsAvailable) ? ((jsonService.IsEnabled) ? "active yes" : "active no") : "active");
		$get(srvPanel + '_srv' + i + '_active_text').innerHTML = (jsonService.IsAvailable) ? ((jsonService.IsEnabled) ? "ON" : "OFF") : "N/A";
		$get(srvPanel + '_srv' + i + '_status').title = ServiceToolTip(jsonService);
		if(!jsonService.IsAvailable && i > 0)showEndpointBox = true;
		
		if ($get(srvPanel + '_srv' + i).getAttribute(attributeClass()).indexOf('selected') > -1)
			selService = i;			
			
	}
  // Show the endpoint message for the service tab only
  $get(Tabs.EndpointServices).style.display  = (showEndpointBox) ? 'block' : 'none';

	if (selService > -1)
		loadControl(UI.LoadedPanel, UI.ContentTarget == 'rightFull');
}

/**
* Executed after the Network Map is rendered. Selects the last client, tab, and
* service selected.
*/
function NetworkMap_OnLoad()
{
	if (Firebug) console.info('NetworkMap_OnLoad');
	
	//If the page is the quick Tour, exit this function
	if (is_QuickTour) return false;
		
	// Check for selected NetworkItem
	var cookieItem = parseInt(getCookie(COOKIE_DEVICE));
	if (!isNaN(cookieItem))
	{
		// Webcam, Guest & Unknown saving / Service on-off / service RP
		// configuration saving
		if (UI.Device == null)
			UI.Device = getCookie(COOKIE_UI).Device;

		if (UI.Device != null)
		{
			if (((UI.Device.DeviceType != 'Guest' && UI.Device.DeviceType != 'Unknown' && UI.Device.DeviceType != 'WebCam') || (UI.Device.DeviceType == 'Router')) && (typeof UI.Services != 'undefined'))
				NetworkMapIcon_OnClick(cookieItem);
		}
		else
			NetworkMapIcon_OnClick(cookieItem);
	}
	else
		NetworkMapIcon_OnClick(0); // Router

	if (isRefreshed())
	{
		// Check for selected Tab
		var cookieTab = parseInt(getCookie(COOKIE_TAB));
		if (!isNaN(cookieTab))
			Tab_OnClick(cookieTab);

		// Check for selected Service
		var cookieService = parseInt(getCookie(COOKIE_SERVICE));
		if (!isNaN(cookieService))
			ServicePanel_OnClick(cookieService);
	}
	
	resetNetworkMap();
}

/**
* Executes when a tab is clicked on. Unhightlights all tabs and highlights the
* tab with the supplied index. Loads associated controls and functions to call
* after loading.
* 
* @param (int)
*          pintIndex Index of the clicked tab
*/
function Tab_OnClick( pintIndex ) // function selectTab( tab )
{
	if (Firebug) console.info('Tab_OnClick', pintIndex);

	//If the page is the quick Tour, exit this function
	if (is_QuickTour) return false;

	if (!UI.NetworkMap)
		return false;
	if (typeof UI.Device != 'undefined')
		if (UI.Device.DeviceType == 'WebCam')
		return false;

  ClearTC();
  
  // Do not save the Shopping Cart Tab, it will reload when redirected back to the UI.
  if (pintIndex != 4) 
  {
    UI.Tab = pintIndex;
    setCookie(COOKIE_TAB, pintIndex);
  }else{
    rotateLoadingAnim(0);
  }

	var Tab =
	{
		Items: [
		{
			Name: 'SecurityTab',
			Panel: Tabs.SecurityPanel,
			Control: '~/WelcomeCtrl/WelcomeCtrlBeta.ascx',
			ControlFullPanel: 'rightFull',
			OnLoad: 'reloadNetworkMap();'
		},
		{
			Name: 'InfoTab',
			Panel: 'InfoPanel',
			Control: '~/TabInfoControl/TabInfoControl.ascx',
			ControlFullPanel: 'rightFull',
			OnLoad: 'InfoPanel_Update( UI.Device );'
		},
		{
			Name: 'SupportTab',
			Panel: Tabs.pnlSupport,
			Control: '~/TabSupportControl/SupportInfoCtrl.ascx',
			ControlFullPanel: 'rightFull',
			OnLoad: null
		},
		{
			Name: 'UpgradeTab',
			Panel: Tabs.pnlUpgrade,
			Control: '~/TabUpgradeControl/UpgradeCtrl.ascx',
			ControlFullPanel: 'rightFull',
			OnLoad: null
		},
		{
			Name: MasterControls.PurchaseNowTab,
			Panel: Tabs.pnlPurchase,
			Control: null,
			ControlFullPanel: null,
			OnLoad: 'window.location = "ShoppingCartCtrl/default.aspx";'
    }]
	};

		if (typeof UI.Device != 'undefined')
		{
			// Hide all panels and show the panel associated with the clicked tab
			// Reset each tab's class and highlight the clicked tab
			for (var i = 0; i < Tab.Items.length; i++)
			{
			  var objTab = Tab.Items[i];
			  if (objTab.Panel !== null) 
			  {
				  if (!is_IE6)
				    $get(objTab.Panel).setAttribute(attributeClass(), (i == pintIndex) ? "TabPanelVisible" : "TabPanelInvisible");
  					
				  $get(objTab.Panel).style.display = (i == pintIndex) ? "block" : "none";
				}
			  
				if ($get(objTab.Name))
					$get(objTab.Name).setAttribute(attributeClass(), (i == pintIndex) ? "tab selected" : "tab");
	    } // for 
						
			// Select Guest Setup if the selected Device is a Guest
	    if (pintIndex === 0 && UI.Device.DeviceType == 'Guest')
				NetworkMapIcon_OnClick(1);

		if (Tab.Items[pintIndex].OnLoad !== null)
		  eval(Tab.Items[pintIndex].OnLoad);

		if (Tab.Items[pintIndex].Control !== null)
			{
				var cookieService = getCookie(COOKIE_SERVICE);
				if (pintIndex == 0 && cookieService != '')
				{
					// A service is selected > load the service panel
					set_ContentTarget('right');

					if ($get('divShoppingCart') != null)
						Sys.WebForms.PageRequestManager.getInstance().add_endRequest(pageRefresh);
					else
						pageRefresh();
				}
				else if (UI.Device.DeviceType != 'Guest' && UI.Device.DeviceType != 'Unknown' && UI.Device.DeviceType != 'WebCam')
				{
				  UI.ContentTarget = Tab.Items[pintIndex].ControlFullPanel; //Don't set the content target cookie
					UI.LoadPanel(Tab.Items[pintIndex].Control);
				}
			}
		}
	}

	/**
	* Sets the UI content target panel and the cookie
	*/
	function set_ContentTarget(target)
	{
		if (Firebug) console.info('set_ContentTarget', target);

		if (target.length > 0)
		{
			UI.ContentTarget = target;
			setCookie(COOKIE_TARGET, target); //set the cookie for the target panel
		}
	}

	/**
	* Populates the input controls in the Unknown Device Wizard
	*/
	function Wizard_OnLoad()
	{
		if (Firebug) console.info('Wizard_OnLoad');

		Wizard_OnInit();
		$get(RegisterDeviceControls.txtRegisterIP).value = UI.Device.IPAddress;
		$get(RegisterDeviceControls.txtRegisterMac).value = UI.Device.MAC;
	}

	/**
	* Resets the Wizard input controls to default values
	*/
	function Wizard_OnInit()
	{
		if (Firebug) console.info('Wizard_OnInit');
		$get(RegisterDeviceControls.txtRegisterIP).value = '';
		$get(RegisterDeviceControls.txtRegisterMac).value = '';
		$get(RegisterDeviceControls.txtRegisterName).value = '';
		$get(RegisterDeviceControls.ddlRegisterDeviceCategory).selectedIndex = 0;
		$get(RegisterDeviceControls.ddlRegisterDeviceType).selectedIndex = 0;
		$get(RegisterDeviceControls.ddlRegisterOperatingSystem).selectedIndex = 0;
	}

	/**
	* Populates the device types and determines the visibility of OS options.
	*/
	function UnknownWizard_ddlRegisterDeviceCategory_OnChange(deviceTypeIndex)
	{
		if (Firebug) console.info('UnknownWizard_ddlRegisterDeviceCategory_OnChange');

		var ddlCat = $get(RegisterDeviceControls.ddlRegisterDeviceCategory);
		var ddlType = $get(RegisterDeviceControls.ddlRegisterDeviceType);
		var selCat = eval(ddlCat.value);
    var selType = eval(ddlType.value);
    var deviceTypeIndex = eval(deviceTypeIndex);
    
    // Populates Device Categories and Types dropdown lists
		DropDownList_Populate(ddlCat, ddlType); 

		$get(RegisterDeviceControls.pnlOS).style.display = (selCat == 1) ? 'block' : 'none';
		$get(RegisterDeviceControls.pnlDeviceTypes).style.display = (selCat > 0) ? 'block' : 'none';
		$get(RegisterDeviceControls.pnlInfo).style.display = (selCat > 0) ? 'block' : 'none';
		$get(RegisterDeviceControls.pnlNextBtn).style.display = (selCat > 0) ? 'block' : 'none';
    //webcam
    if((selType == 8 || deviceTypeIndex == 8) && selCat == 3)
    {
      $get(RegisterDeviceControls.pnlWebCams).style.display = "block";
      $get(RegisterDeviceControls.pnlWebCamInfo).style.display = "block";
    }
    else
    {
      $get(RegisterDeviceControls.pnlWebCams).style.display = "none";
      $get(RegisterDeviceControls.pnlWebCamInfo).style.display = "none";
      //$get(RegisterDeviceControls.txtNewName).value = "";
      //$get(RegisterDeviceControls.txtNewIP).value = "";
      $get(RegisterDeviceControls.txtUsername).value = "";
      $get(RegisterDeviceControls.txtPassword).value = "";
      $get(RegisterDeviceControls.txtTCPports).value = "";
      $get(RegisterDeviceControls.txtUDPports).value = "";
      $get(RegisterDeviceControls.txtHTTPport).value = "";
      $get(RegisterDeviceControls.ddlWebCams).value = 0;
    }
    	  
	  if(deviceTypeIndex > 0)$get(RegisterDeviceControls.ddlRegisterDeviceType).value = deviceTypeIndex;
  }
  
	/**
	* Populates the device types and determines the visibility of the webcam options.
	*/
  function UnknownWizard_ddlRegisterDeviceType_OnChange(deviceTypeIndex)
  {
	  if (Firebug)console.info ( 'UnknownWizard_ddlRegisterDeviceType_OnChange' );

    var ddlType = $get(RegisterDeviceControls.ddlRegisterDeviceType);
    var selType = eval(ddlType.value);

    //webcam
    $get(RegisterDeviceControls.pnlWebCams).style.display = (selType == 8) ? 'block' : 'none'; 
    $get(RegisterDeviceControls.pnlWebCamInfo).style.display = (selType == 8) ? 'block' : 'none'; 
  }

	/**
	* Updates the Device Types and visibility of the OS options based on the value
	* of the Device Category.
	*/
	function InfoTab_ddlDeviceCategory_OnChange()
	{
		if (Firebug) console.info('InfoTab_ddlDeviceCategory_OnChange');

    var ddlCat = $get ( NewDeviceControls.ddlDeviceCategory );
	  var ddlType = $get ( NewDeviceControls.ddlDeviceType );  
	  var ddlOS = $get ( NewDeviceControls.ddlOperatingSystem );
	  if(IsClientDSD()){ //DSD does not have these values in the JSON object
      ddlCat.value = 1; //Computing
      ddlCat.disabled = true;
      ddlType.value = 2; //PC
      ddlType.disabled = true;
      ddlOS.value = 2; //Windows
      ddlOS.disabled = true;
    }
	  var selCat = eval ( ddlCat.value );

	  DropDownList_Populate ( ddlCat, ddlType ); // Populates Device Categories and
	  // Types dropdown lists

	  ddlType.style.display = ( selCat === 0 ) ? 'none' : 'block';
	  $get ( NewDeviceControls.lblDeviceType ).style.display = ddlType.style.display;
	  $get ( NewDeviceControls.pnlUpdateButton ).style.display = ddlType.style.display;
	  $get ( NewDeviceControls.ddlOperatingSystem ).style.display = ( selCat == 1 ) ? 'block' : 'none';
	  $get ( NewDeviceControls.lblOperatingSystem ).style.display = $get ( NewDeviceControls.ddlOperatingSystem ).style.display;
  }

	/**
	* Populates the passed Device Type dropdownlist based on the value of the
	* passed dropdownlist of Device Types
	* 
	* @param (dropdownlist)
	*          ddlCat Dropdownlist of Device Categories
	* @param (dropdownlist)
	*          ddlType Dropdownlist of Device Types
	*/
	function DropDownList_Populate(ddlCat, ddlType)
	{
		if (Firebug) console.info('DropDownList_Populate', ddlCat, ddlType);

		var selCat = eval(ddlCat.value);
		ddlType.length = null;
		ddlType.style.display = (selCat === 0) ? 'none' : 'block';

		for (var i = 0; i < DeviceTypes.Categories.length; i++)
			if (DeviceTypes.Categories[i].ID == selCat)
		{
			var max = (is_IE) ? DeviceTypes.Categories[i].Types.length - 1 : DeviceTypes.Categories[i].Types.length;
			for (var j = 0; j < max; j++)
			{
				var opt = new Option(DeviceTypes.Categories[i].Types[j].Description, DeviceTypes.Categories[i].Types[j].ID);
				ddlType.options[ddlType.options.length] = opt;
			}
		}
	}

	/**
	* Determines the class name of the images for the selected client.
	*/
	function InfoTab_Image_Update()
	{
		if (Firebug) console.info('InfoTab_Image_Update');

		var ddlType = $get(NewDeviceControls.ddlDeviceType);
		var ddlOS = $get(NewDeviceControls.ddlOperatingSystem);
		var intDevice = ddlType.value;
		if (intDevice !== '')
		{
			var strDevice = ddlType.options[ddlType.selectedIndex].text;
			var strOS = ddlOS.options[ddlOS.selectedIndex].text;
			strOS = (intDevice == '2' || intDevice == '9' || intDevice == '11') ? strOS : '';
			Device_Images_Render("NetworkItem " + strDevice + strOS);
		}
		else if (UI.Device !== null)
			Device_Images_Render("NetworkItem " + UI.Device.DeviceType + UI.Device.DeviceID);
	}

	/**
	* Updates the image on the Info Tab, then clones it to the header of the right
	* panel.
	* 
	* @param (string)
	*          cssClass Class to assign to the images.
	*/
	function Device_Images_Render(cssClass)
	{
		if (Firebug) console.info('Device_Images_Render', cssClass);

		var divDevice = $get(NewDeviceControls.divDeviceItem);
		divDevice.setAttribute(attributeClass(), cssClass);

		// Build the Right-Panel Content
		var rpHeader = $get('layout_options_header');
		var rpIcon = divDevice.cloneNode(true);

		rpHeader.innerHTML = '';
		rpHeader.appendChild(rpIcon);

		if (UI.Device !== null)
			rpHeader.innerHTML += '<div class="PCName">' + UI.Device.Description + contentMap.settings + '</div>';

		rpHeader.innerHTML += '<div id="SecurityServiceIcon" class="selected"></div>';

		var cookieDevice = getCookie(COOKIE_DEVICE);
		if (cookieDevice != null)
			if (Map.Item[cookieDevice] != null)
			if (Map.Item[cookieDevice].Type == "WebCam")
			ServicesBack_HTML_webcam();
	}

	/**
	* Generates the HTML markup for the "Back to..." button
	* 
	* @param (string)
	*          cssClass Class of the Service selected to assign to the back button
	* @param (string)
	*          strControlPath Path of the selected Service to link back to
	* @param (string)
	*          strService Name of the Service selected
	*/
	function ServicesBack_HTML(cssClass, strControlPath, strService)
	{
		if (Firebug) console.info('ServicesBack_HTML', cssClass, strControlPath, strService);
		  
		//Draw the HTML source		  
		var backIcon = $get('SecurityServiceIcon');
		if (cssClass == '' && strService == '')
			backIcon.innerHTML = "";
		else if (backIcon != null)
		{
			var HTMLsrc = "";
			HTMLsrc += "<div id=\"BackTo\"></div>";
			HTMLsrc += "<div id=\"SubRP\" style=\"display:none;\">"
			HTMLsrc += "<div class=\"iconbackcontainer\">";
			HTMLsrc += "<div class=\"icon " + cssClass + "\">&nbsp;</div>";
			HTMLsrc += "<a href=\"javascript:void(0);\" onclick=\"loadControl('" + strControlPath + "', false);hideBackTo();\">";
			HTMLsrc += "<img src=\"images/dot.gif\" width=\"70\" height=\"27\"></a></div>";
			HTMLsrc += "</div>";
			HTMLsrc += "<div id=\"MainRP\" style=\"display:block;\">"
			HTMLsrc += "<div class=\"icon " + cssClass + "\">&nbsp;";
			HTMLsrc += "<a onclick=\"hideBackTo();\">";
			HTMLsrc += "<img src=\"images/dot.gif\" width=\"44\" height=\"27\"></a></div>";
			HTMLsrc += "</div>"
			
			HTMLsrc += "<div class=\"secname\">" + strService + "</div>";
			backIcon.innerHTML = HTMLsrc;
		}	    
		
	  //if the page is refreshed and the right panel has a sub-panel loaded, show the back-to in the header
		var ckRP = getCookie(COOKIE_RIGHTPANEL);
		var cookieRP = ckRP.replace("~/", "").split("/");
		var cookieRP1 = cookieRP[1];
		var cookieRP2 = cookieRP[2];
		var uiRP = strControlPath.replace("~/", "").split("/");
		var uiRP1 = uiRP[1]+"";
		
		var cookieTarget = getCookie(COOKIE_TARGET);
  	var RenderIt = false;
		//If the control loaded doesn't match the source calling control then it is a sub (child) panel
		if(cookieTarget == 'right' && cookieRP[0] == uiRP[0])
		  if (!ckUndefined(cookieRP2)) 
		  {
		     if (cookieRP2 != uiRP1) RenderIt = true;
		  }
		  else if(MyAccount(strControlPath,false)) //check to see if the MA panel is loaded - do not render the "back to" icon
		  {
		    if (cookieRP1 != uiRP1) RenderIt = true;
		  }
		  else
		  {
		    if (cookieRP1 != uiRP1) RenderIt = true;
		  }
		  if (RenderIt) renderBackTo();
	}

	/**
	* Displays the Network Map
	*/
	function Display_NetworkMap()
	{
		if (Firebug) console.info('Display_NetworkMap');

		if (UI.ContentTarget == 'cart' || $get('divShoppingCart') != null)
			loadMainControl('NetworkMap', 'main');
	}

	/**
	* Selectes the Support Tab and loads the My Account menu
	*/
	function MyAccount_OnClick()
	{
		if (Firebug) console.info('MyAccount_OnClick');
  
		if (UI.NetworkMap)
		{
		  UI.ServiceID=-1;
		  setCookie(COOKIE_SERVICE,'');
		  MyAccount('',true); //load the back to icon for MA
			Tab_OnClick(2);
			UI.LoadRightSide(PATH_MYACCOUNT);
		}
	}

	/**
	* Displays the "DSD Manage Account" prompt
	*/
	function ManageDsdAccount_Prompt()
	{
		if (Firebug) console.info('ManageDsdAccount_Prompt');

		Div_CssUpdate(DefaultControls.pdManageDSD, 'display', 'block');
	}

	/**
	* Displays the "Manage Account" prompt
	*/
	function ManageAccount_Prompt()
	{
		if (Firebug) console.info('ManageAccount_Prompt');

		Div_CssUpdate('divManageWhere', 'display', 'block');
	}

	/**
	* Hides the "Manage Account" prompt and selects the Router on the Network Map
	*/
	function ManageAccount_No_OnClick()
	{
		if (Firebug) console.info('ManageAccount_No_OnClick');

		Div_CssUpdate('divManageWhere', 'display', 'none');
		NetworkMapIcon_OnClick(0);
	}

	/**
	* Hides the "DSD Manage Account" prompt and selects the Router on the Network
	* Map
	*/
	function ManageDsdAccount_No_OnClick()
	{
		if (Firebug) console.info('ManageDsdAccount_No_OnClick');

		Div_CssUpdate(DefaultControls.pdManageDSD, 'display', 'none');
		NetworkMapIcon_OnClick(0);
	}

	/**
	* Hides the Access Control Warning Dialog Box
	*/
	function AccessControlMsg_No_OnClick()
	{
		if (Firebug) console.info('AccessControlMsg_No_OnClick');

		Div_CssUpdate(DefaultControls.pdWarnAccess, 'display', 'none');
	}

	/**
	* Hides the "DSD Manage Account" prompt and marks the selected object as now
	* having services, then executes the NetworkMapIcon_OnClick event again. The
	* client is then marked as having services which disables the "Manage Where"
	* prompt next time the client is selected. Then the NetworkMapIcon of the
	* client has it's status changed to reflect it having services.
	*/
	function ManageDsdAccount_Yes_OnClick()
	{
		if (Firebug) console.info('ManageDsdAccount_Yes_OnClick');

		Div_CssUpdate(DefaultControls.pdManageDSD, 'display', 'none');   
    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(ManageDsdAccount_Yes_JS);
	  clickButton($get(DefaultControls.btnBackgroundReauth)); //Built in the code-behind on Templates/GUI3Panel.master.cs
	}
  function ManageDsdAccount_Yes_JS(){
   if (Firebug) console.info('ManageDsdAccount_Yes_JS');

		Map.Item[UI.NetworkMapIndex].HasServices = true;
		DoClientCallBack();
		NetworkMapIcon_OnClick(UI.NetworkMapIndex);
		updateNetworkMapStatusIcon ('Status Normal');
		UI.PrevClientID = -1;	
		$get(MasterControls.hidPageRefresh).value == '';  
		update();
   
    Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(ManageDsdAccount_Yes_JS);
  }
  
	/**
	* Hides the "Manage Account" prompt and marks all of the services associated
	* with the selected client to manage themselves.
	*/
	function ManageAccount_Yes_OnClick()
	{
		if (Firebug) console.info('ManageAccount_Yes_OnClick');

 		Div_CssUpdate('divManageWhere', 'display', 'none');
		
		var serviceCount = UI.Services.length;
		// if ( is_IE ) serviceCount--;

		for (var i = 0; i < serviceCount; i++)
			UI.Services[i].ManagesSelf = true;

		// Load the right panel > this will update the service to manage itself
		var cookieService = getCookie(COOKIE_SERVICE);
		UI.LoadPanel(UI.Services[cookieService].FrameSrc);
		ServicePanel_OnClick(cookieService);
		ServiceBack_Render();

		UI.PrevClientID = -1;
    clickButton($get(DefaultControls.btnBackgroundReauth)); //Built in the code-behind on Templates/GUI3Panel.master.cs
	}

	/**
	* Updates the value of the 'asyncCalls' input control
	* 
	* @param (int)
	*          val Number to add to the existing value
	*/
	function AsyncCalls_Update(val)
	{
		if (Firebug) console.info('AsyncCalls_Update', val);

		var txtCalls = $get('asyncCalls');
		if (txtCalls)
		{
			var intCalls = parseInt(txtCalls.value);
			txtCalls.value = intCalls + val;
		}
	}

	/**
	* Attached to the beginning of all AJAX requests. Displays the "Loading"
	* message and masks.
	* 
	* @param (object)
	*          sender
	* @param (object)
	*          args
	*/
	function Ajax_OnBeginRequest(sender, args)
	{
		if (Firebug) console.info('Ajax_OnBeginRequest', sender, args);

		AsyncCalls_Update(1);
		Div_CssUpdate('loading_screen_footer', 'display', 'block');
		Div_CssUpdate('loading_screen', 'display', 'block');
		Div_CssUpdate('loading', 'display', 'block');
	}

	/**
	* Attached to the ending of all AJAX requests. Hides the "Loading" message and
	* masks.
	* 
	* @param (object)
	*          sender
	* @param (object)
	*          args
	*/
	function Ajax_OnEndRequest(sender, args)
	{
		if (Firebug) console.info('Ajax_OnEndRequest', sender, args);

		AsyncCalls_Update(-1);
		Div_CssUpdate('loading_screen_footer', 'display', 'none');
		if(!is_QuickTour)Div_CssUpdate('loading_screen', 'display', 'none');
		Div_CssUpdate('loading', 'display', 'none');
	}

	/**
	 * Updates the object with the provided ID, with the style and value provided.
	 * 
	 * @param (string)
	 *          strID ID of the object to update.
	 * @param (string)
	 *          strStyle Style attribute to update
	 * @param (string)
	 *          strValue Value of the style to be modified to
	 */
function Div_CssUpdate ( strID, strStyle, strValue )
{
	if ( Firebug ) console.info ( 'Div_CssUpdate', strID, strStyle, strValue );

	var el = $get ( strID );
	if ( el ) 
		el.style[strStyle] = strValue;
}

	/**
	 * Toggles an object's display property from 'block' to 'none', or vice versa.
	 * 
	 * @param (string)
	 *          strID ID of the object to update.
	 */
function Div_Toggle ( strID )
{
	if ( Firebug ) console.info ( 'Div_Toggle', strID );

	var el = $get ( strID );
	if ( el ) 
		el.style['display'] = ( el.style['display'] == 'none' ) ? 'block' : 'none';
}

	/**
	 * Displays the "Reauth" prompt
	 * 
	 * @param (string)
	 *          pstrMsg Message to have hidden in the "Reauth" prompt
	 */
function Reauth_Prompt ( pstrMsg )
{
	if ( Firebug ) console.info ( 'Reauth_Prompt', pstrMsg );
  console.trace();
  
	$get ( 'divReauthMessage' ).innerHTML = pstrMsg;
	Div_CssUpdate ( 'divReauth', 'display', 'block' );

  if (typeof UI == 'undefined')
    return; 

	if ( UI.Device.DeviceType != 'Router' )
	{
		if ( IsClientDSD () )
		{
			Div_CssUpdate ( 'lblDIRText', 'display', 'block' );
			
			//only show the message if the user is in the firewall section
			var servID = getCookie(COOKIE_SERVICE);
			if(UI.Services[servID].Name.toLowerCase() == "firewall" && LoadControl_Verify(UI.ServiceID) == 1)
			{
			  Div_CssUpdate ( 'lblDIRText', 'display', 'none' );
			  Div_CssUpdate ( 'lblDSDText', 'display', 'block' );
			  Div_CssUpdate ( 'activateEndPoint', 'display', 'none' );
			  Div_CssUpdate ( 'reauthEndPoint', 'display', 'block' );
			}
			else
			{
			  Div_CssUpdate ( 'divReauth', 'display', 'block' );
			}
		}
	}
	else
	{
		if ( IsDSD () )
		{
			Div_CssUpdate ( 'lblDSDText', 'display', 'none' );
			Div_CssUpdate ( 'lblDIRText', 'display', 'block' );
		}
	}
}

	/**
	* Function used when you are on the info center panel and you click on a
	* service Called from TabInfoControl/TabInfoControl.ascx
	* 
	* @param (int)
	*          srvID > Index of the service on the security tab
	*/
	function selectService(srvID)
	{
		if (Firebug) console.info('selectService', srvID);

		//SetURL();
		//StuffCookieJar();

		//If the page is the quick Tour, exit this function
		if (is_QuickTour) return false;

		setCookie(COOKIE_SERVICE, srvID);

		if (typeof UI.Services != 'undefined')
			if (UI.Services[srvID].IsAvailable)
			Tab_OnClick(0);
		else if (srvID === 0)
		{
			selectRouter();
			Tab_OnClick(0);
			selCookieService(srvID);
		}
		else
			alert('The service is not available for this device')
	}

//	function GetCurrentURLPageNumber()
//	{
//		//	var strLoc = location.href;
//		//    var intIndex = strLoc.indexOf("p=");
//		//    
//		//    try
//		//    {
//		//		if (Firebug == true)
//		//		console.info ("intIndex: " + intIndex);
//		//		
//		//		if (intIndex == -1)
//		//			return -1
//		//		
//		//		return (strLoc.substring(intIndex + 2, document.location.href.length));
//		//    }
//		//    catch (ex)
//		//    {
//		//		console.info ("Error: " + ex);
//		//	}
//	}

//	function SetURL()
//	{
//		//    var strLoc = document.location.href;
//		//    var intIndex = strLoc.indexOf("=");
//		//    var p = 0;

//		//    try
//		//    {      
//		//        if (intIndex == -1)
//		//        {
//		//            location.href = location.href + "p=0";
//		//        }
//		//        else
//		//        {
//		//            p = strLoc.substring(intIndex + 1, strLoc.length);
//		//            p++ ;            
//		//            //alert("p = " + p);
//		//            
//		//            // After replacing the last occurrence of "p=x" with the new "p=x" value where "x" is the current page,
//		//            // set the URL location to a new pretended location based on the value of "p".
//		//            location.href = location.href.replace(location.href.substring(location.href.indexOf("p="), location.href.length), "") + "p=" + p;
//		//        }
//		//        
//		//        //alert(location.href);
//		//    }
//		//    catch (err)
//		//    {
//		//        alert("Error: " + err);
//		//    }   
//	}

//	function EatFromCookieJar(jarNumber, hand)
//	{
//		//	if (jarNumber.indexOf("CookieJar") > -1)
//		//		return (document.cookie.substring(document.cookie.jarNumber, document.cookie.indexOf(";")).substring(document.cookie.indexOf(hand), document.cookie.indexOf("|")));
//		//		
//		//	return "";		
//	}

//	function StuffCookieJar()
//	{
//		//	var COOKIE_SERVICE        = "service";
//		//	var COOKIE_DEVICE         = "device";
//		//	var COOKIE_TAB            = "tab";
//		//	var COOKIE_TARGET         = "target";
//		//	var COOKIE_WELCOMEPAGE    = "welcomepage";
//		//	var COOKIE_WELCOMEBANNER  = "WelcomeBanner";
//		//	var COOKIE_RIGHTPANEL     = "rightpanel";
//		//	var COOKIE_RIGHTPANELFULL = "rightpanelfull";
//		//	var COOKIE_DEVICETYPE     = "devicetype";
//		//	var COOKIE_DOWNARROW      = "DownArrow";
//		//	var COOKIE_RIGHTARROW     = "RightArrow";
//		//	var COOKIE_UI             = "UI";

//		//	var CookieJar = "CookieJar" + GetCurrentURLPageNumber() + "=" +
//		//		"SERVICE:" + getCookie(COOKIE_SERVICE) + "|" +
//		//		"DEVICE:" + getCookie(COOKIE_DEVICE) +  "|" +
//		//		"TAB:" + getCookie(COOKIE_TAB) + "|" +
//		//		"TARGET:" + getCookie(COOKIE_TARGET) + "|" + 
//		//		"WELCOMEPAGE:" + getCookie(COOKIE_WELCOMEPAGE) + "|" +
//		//		"WELCOMEBANNER:" + getCookie(COOKIE_WELCOMEBANNER) + "|" +
//		//		"RIGHTPANEL:" + getCookie(COOKIE_RIGHTPANEL) + "|" +
//		//		"RIGHTPANELFULL:" + getCookie(COOKIE_RIGHTPANELFULL) + "|" +
//		//		"DEVICETYPE:" + getCookie(COOKIE_DEVICETYPE) + "|" +
//		//		"DOWNARROW:" + getCookie(COOKIE_DOWNARROW) + "|" +
//		//		"RIGHTARROW:" + getCookie(COOKIE_RIGHTARROW) + "|" +
//		//		"UI:" + getCookie(COOKIE_UI) + ";";
//		//	
//		//	if (Firebug == true)
//		//	console.info("CookieJar = \n" + CookieJar);
//		//	document.cookie = CookieJar;
//	}


	/**
	* Function used when loading Ajax Toolkit controls Safari browsers do not have
	* a native way to indicate that a client-script file has completed loading.
	*/
	function safariLoadComplete()
	{
		if (Firebug) console.info('safariLoadComplete');

		var RP = getCookie(COOKIE_RIGHTPANEL);
		if (is_Safari)
			if ($get('asyncCalls').value == 1 && RP != '')
			Ajax_OnEndRequest();
	}

	/**
	* Function used when redirecting to the browsers homepage
	*/
	function RedirectHomePage()
	{
		if (Firebug) console.info('RedirectHomePage');

		if (is_IE)
			document.location = 'about:home';
		else if (is_Safari)
			document.location = 'http://www.apple.com/startpage/';
		else if (window.home)
			window.home();
	}

	/**
	* Function used when redirecting to the browsers homepage
	* 
	* @param (string)
	*          name Name of the querystring name/value pair you are looking for
	*/
	function jsQs(name)
	{
		var url = window.location.search.substring(1);
		var param = url.split("&");
		for (var i = 0; i < param.length; i++)
		{
			var value = param[i].split("=");
			if (value[0] == name)
				return this.unescape(value[1]);
		}
	}

	// *********************************************************************************//
	// Ajax Requests

	/**
	* Function called after the AJAX call for loading Client information. Set the
	* Device and Services properties of the UI class. Calls the function to update
	* the Service Tab. Calls the function to update the Info Tab.
	* 
	* @param (string)
	*          pstrResult Returned string value in JSON format.
	* @param (string)
	*          pstrContext
	*/
	function Client_OnTransactionCompleted(pstrResult, pstrContext) {
	  console.trace();
		// loaded on a page load / refresh or clicking on a networkmap device
		if (Firebug) console.info('Client_OnTransactionCompleted', pstrResult, pstrContext);
	
		$get(MasterControls.hidCommand).value = '';

		var func = new Function("return " + pstrResult);
		var obj = func();

		// Set the UI properties.
		UI.Device = obj.pc;
		UI.Services = obj.srv;

		if (!isRefreshed())
			ClearTC();

		setCookie(COOKIE_UI, pstrResult);

		// Updates Service Tab
		ServicePanel_Update(obj.srv);

		// Updates Info Tab
		InfoPanel_Update(obj.pc);

		// Show Endpoint download
		var cookieSrv = getCookie(COOKIE_SERVICE);
    var cookieTab = ckCookieNumVal(getCookie(COOKIE_TAB));
		if (cookieSrv.length > 0)
			if (UI.Services[cookieSrv].RequiresThinClient && !UI.Device.ThinClientInstalled && UI.Device.OSID == 2 && cookieTab == 0)
			Sys.WebForms.PageRequestManager.getInstance().add_endRequest(ThinClientDownload_Init);

		pageRefresh();
		//for network item clicks - the MA "back to" icon needs to be rendered
		if (!isRefreshed() && cookieSrv.length == 0)ServiceBack_Render();

		if (typeof (Sys) !== 'undefined')
			Sys.Application.notifyScriptLoaded();
	}
	
	/**
	* Function called return if the object or variable is undefined
	* 
	* @param (obj)
	*/  
  function ckUndefined(obj)
  {
    if (Firebug) console.info('ckUndefined', obj);

    var result = false;
    if(obj == undefined) result = true;
    if(obj == 'undefined') result = true;
    if(typeof obj == undefined) result = true;
    return result 
  }
  
	/**
	* Function called to load the service and Right Panel Based on the cookie
	* values
	* 
	* @param (string)
	*          ServiceID > service ID from the security tab
	*/
	function selCookieService(ServiceID)
	{
		if (Firebug) console.info('selCookieService', ServiceID);

		if (UI.Services != null && ckCookieNumVal(ServiceID) > -1)
		{
			if (typeof UI.Services[ServiceID] != 'undefined')
			{
				if (UI.Services[ServiceID].IsAvailable)
				{
					// Do not load the right panel if there is a "manage service" prompt.
					// This will prevent the right panel from updating the service to manage
					// itself
					setCookie(COOKIE_SERVICE,ServiceID);
					var verify = LoadControl_Verify(ServiceID);
					if (verify == 0)
					{
						Sys.WebForms.PageRequestManager.getInstance().add_endRequest(ServiceBack_Render);
						// Highlights the selected service
						ServicePanel_OnClick(ServiceID);

						// load the right panel
						var cookieRP = getCookie(COOKIE_RIGHTPANEL);
						var cookieTarget = getCookie(COOKIE_TARGET);
						var uiRP = UI.Services[ServiceID].FrameSrc;

						// check to see if a sub-panel is loaded
						var cookieRP2 = cookieRP.replace("~/", "").split("/");
						var uiRP2 = uiRP.replace("~/", "").split("/");

						//If the control loaded doesn't match the source calling control
						//Then it is a sub (child) panel
						var loadPanelFromCookie = false;
						if (!ckUndefined(cookieRP2[1]) && isRefreshed()) // Sub panels
						{
							if (cookieRP2[1] != uiRP2[1] && cookieRP2[0] == uiRP2[0] && cookieTarget == 'right') loadPanelFromCookie = true;
						  //exceptions > These subpanels do not belong in the same folder, so cookieRP2[2] & uiRP2[1] will not match
						  if (cookieRP2[0] == "AccountCtrl" && uiRP2[0] == "AccessControlCtrl") loadPanelFromCookie = true;						
						}
												
						//Full and main panels
						if ((cookieRP2[0] == uiRP2[0] || (cookieRP2[1] == uiRP2[1] && cookieTarget == 'right')) && isRefreshed()) loadPanelFromCookie = true;

						if (loadPanelFromCookie)
							UI.LoadRightSide(cookieRP); // sub-panel - from a cookie
						else
							UI.LoadRightSide(UI.Services[ServiceID].FrameSrc); // main panel source
           
						// Show Endpoint download - (For no refresh -
						// Client_OnTransactionCompleted not called)
						if (UI.Services[ServiceID].RequiresThinClient && !UI.Device.ThinClientInstalled && UI.Device.OSID == 2)
							Sys.WebForms.PageRequestManager.getInstance().add_endRequest(ThinClientDownload_Init);
					}
				}
			}
			setCookie(COOKIE_SERVICE, ServiceID)
		}
		Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(selCookieService);
	}

	/**
	* Function called to reload the network map Called from the cart page (Back To
	* Network Map) link
	*/
	function reloadNetworkMap()
	{
		if (Firebug) console.info('reloadNetworkMap');

		UI.NetworkMap = true;
		Display_NetworkMap();
		if (!isRefreshed())
			Sys.WebForms.PageRequestManager.getInstance().add_endRequest(selService);
	}

	/**
	* Function called when refreshing the page to reload the network map
	*/
	function refreshNetworkMap()
	{
		if (Firebug) console.info('refreshNetworkMap');

		var url = window.location + "";
		if (url.indexOf("cmd=cart") > 0)
		{
			clearCookies();
			window.location = "default3.aspx";
		}
		else
			reloadNetworkMap();
	}

	/**
	* Function called to load the service and Right Panel Based on the cookie
	* values Called from reloadNetworkMap() which is called from the cart page
	* (Back To Network Map) link
	*/
	function selService()
	{
		if (Firebug) console.info('selService');

		var cookieService = getCookie(COOKIE_SERVICE);
		selCookieService(cookieService);
		Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(selService);
	}

	/**
	* Adds 'ThinClientDownload_Render' to the AJAX Request End event. Updates the
	* Thin Client download link with the name of the selected Service. Called from
	* Client_OnTransactionCompleted() & selCookieService()
	*/
	function ThinClientDownload_Init()
	{
		if (Firebug) console.info('ThinClientDownload_Init');

		var divThinClient = $get('divThinClientDownload');

		if (divThinClient)
			ThinClientDownload_Render();

		var divServiceText = $get('TCserviceTxt');

		/*if (divServiceText)
			if (UI.Services[UI.ServiceID].Name != "")
			  divServiceText.innerHTML = UI.Services[UI.ServiceID].Name;*/

		Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(ThinClientDownload_Init);
	}

	/**
	* Renders the "Back to..." button in the header of the right panel, providing a
	* link back to the main menu of the selected service. Called from
	* selCookieService()
	*/
	function ServiceBack_Render() // PopulateRPService( srv )
	{
		if (Firebug) console.info('ServiceBack_Render');

		if (UI.Services != null)
			if (UI.ServiceID > -1)
			  ServicesBack_HTML(UI.Services[UI.ServiceID].ImageStyle, UI.Services[UI.ServiceID].FrameSrc, UI.Services[UI.ServiceID].Name);
      else
        MyAccount('',true);
        
		Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(ServiceBack_Render);
	}

	/**
	 * Function called after a page refresh. This selects the first available
	 * service and display the right panel options
	 */
	function pageRefresh ()
	{
		if ( Firebug == true )
			console.info ( 'pageRefresh' );
	
		if ( Firebug == true )
		{
			// console.info ("Current Page Number: " + GetCurrentURLPageNumber());
			// console.info ("CookieJar Location: " +
			// document.cookie.indexOf("CookieJar" + GetCurrentURLPageNumber()));
			// console.info ("COOKIE_TAB from CookieJar" + GetCurrentURLPageNumber() +
			// ": " + EatFromCookieJar("CookieJar" + GetCurrentURLPageNumber(), "TAB"));
		}
	
		var valServiceId = '';
		var cookieTab = ckCookieNumVal ( getCookie ( COOKIE_TAB ) );
		var srvCookie = ckCookieNumVal ( getCookie ( COOKIE_SERVICE ) );
	
		if ( Firebug )
		{
			console.info ( "cookieTab:" + cookieTab );
			console.info ( "srvCookie:" + srvCookie );
		}
	
		if ( !isRefreshed () && cookieTab === 0 )
		{
			// Select the service based on the cookie.
			// if the service is available, then select the service and load the right
			// panel
			if ( UI.Services != null )
			{
				if ( UI.Services[srvCookie].IsAvailable )
				{
					set_ContentTarget ( 'right' );
					selCookieService ( srvCookie );
				}
				else
				{
					// Loop through all the services and select the first available one and
					// load the right panel
					for ( var i = 0;i <= 7; i++ )
						if ( UI.Services[i].IsAvailable )
						{
							set_ContentTarget ( 'right' );
							selCookieService ( i );
							break;
						}
				}
			}
		}
	
		// This is a fresh page load - use cookies to recover the values
		if ( isRefreshed () )
		{
			// Set the refresh value = 1 after all requests have finished
			//if (LoadControl_Verify(srvCookie) == 1)
			  Sys.WebForms.PageRequestManager.getInstance ().add_endRequest ( setRefreshValue );
	
			var rpValue = getCookie ( COOKIE_RIGHTPANEL );
			var srvValue = ckCookieNumVal ( getCookie ( COOKIE_SERVICE ) );
			var cookieTarget = getCookie ( COOKIE_TARGET );
	
			if ( rpValue === '' )
				setWelcomePage (); // Set Welcome Page
			else
			{
				switch ( cookieTab )
				{
					case '0': // Security
					case 0:
						// UI.Services = getCookie(COOKIE_UI).Services;
						if ( UI.Services != null )
							// Prevents an infinite loop since the service does not exist
							if ( UI.Services[srvValue].IsAvailable )
							{
								set_ContentTarget ( 'right' );
								selCookieService ( srvValue );
							}
							else
								setWelcomePage ();
						break;
					case '2': // Support
					case 2:
					  if(rpValue != '~/TabSupportControl/SupportInfoCtrl.ascx'){
						  Tab_OnClick ( 2 );
						  UI.LoadRightSide ( rpValue );
						  MyAccount('',true); //load the back to icon for MA
						}else{
						  //Support Full Panel
							set_ContentTarget ( cookieTarget );
						  UI.LoadPanel ( rpValue );		
						}
						break;
					case '4': // Buy Now
					case 4:
						UI.LoadRightSide ( rpValue );
						break;
					default:// Info
						Tab_OnClick ( cookieTab );
						set_ContentTarget ( cookieTarget );
						UI.LoadPanel ( rpValue );
						if ( Map.Item[getCookie ( COOKIE_DEVICE )].Type == "WebCam" )
							ServicesBack_HTML_webcam ();
						break;
				}
			}
	
			Sys.WebForms.PageRequestManager.getInstance ().remove_endRequest ( pageRefresh );
		}
	}
						
	/**
	 * Function that Sets the refresh value to 1 after the page has fully loaded
	 * Called from pageRefresh()
	 */
	function setRefreshValue()
	{
		if (Firebug) console.info('setRefreshValue');

		$get(MasterControls.hidPageRefresh).value = "1";
		Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(setRefreshValue);
	}

	/**
	* Function called when a panel is updated. This is called from default.aspx
	*/
	function update()
	{
		if (Firebug) console.info('update');

		UI.ClientID = -1;
		if (is_IE)
			Sys.WebForms.PageRequestManager.getInstance().add_endRequest(updateForIE);
		else
			Sys.WebForms.PageRequestManager.getInstance().add_endRequest(updateForOther);
	}

	/**
	* Function called from the update function for IE browsers only Called from
	* update()
	*/
	function updateForIE()
	{
		if (Firebug) console.info('updateForIE');

		UI.ClientID = -1;
		if(!is_QuickTour)$get(DefaultControls.btnUpdatePC).click();
		Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(updateForIE);
	}

	/**
	* Function called from the update function for non-IE browsers Called from
	* update()
	*/
	function updateForOther()
	{
		if (Firebug) console.info('updateForOther');

		UI.ClientID = -1;
		if(!is_QuickTour)simulateClick($get(DefaultControls.btnUpdatePC));
		Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(updateForOther);
	}

	/**
	* Prompts the user to confirm the deletion of the selected client. If the
	* client is deleted, the Device Cookie needs to be set to the router so the
	* page does not try to reload the client that was deleted.
	*/
	function NetworkMapIcon_OnDelete()
	{
		if (Firebug) console.info('NetworkMapIcon_OnDelete');

    if(getCookie(COOKIE_DEVICETYPE).toLowerCase() == "webcam"){
		  var confirmDelete = confirm("Are you sure you want to delete this device?\nYou will also need to delete the Port Forwarding Rules.");
		}else{
		  var confirmDelete = confirm("Are you sure you want to delete this device?");
		}
		if (confirmDelete)
		{
			setCookie(COOKIE_DEVICE, 0);
			pageRefresh();
			Sys.WebForms.PageRequestManager.getInstance().add_endRequest(selectRouter);
			clickButton($get(DefaultControls.btnDeletePC));
		}
		else
			return false;
	}

	/**
	* Function called to select the router on the network map Called from
	* NetworkMapIcon_OnDelete()
	*/
	function selectRouter()
	{
		if (Firebug) console.info('selectRouter');

		UI.Device.DeviceType = 'Router';
		NetworkMapIcon_OnClick(0);
		Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(selectRouter);
	}

	/**
	* Redirects the browser to the download page. Currently only redirects to
	* Windows installation. When the Router has to be selected before redirecting
	* to the install, the script needs to pause for a second to allow the Router
	* information to be populated.
	*/
	function Download_ThinClient()
	{
		if (Firebug) console.info('Download_ThinClient');

		window.location = '/install/gw/download.asp?dmac=' + Map.Item[0].MAC;
	}

	/**
	* Sets UI variables. If a new device is clicked, then call the AJAX callback.
	* Sets the Device Index cookie. Loads the right panel for certain device types.
	* Begins Down Arrow animation.
	* 
	* @param (int)
	*          pintIndex Index of the Network Map Icon clicked
	*/
	function NetworkMapIcon_OnClick(pintIndex)
	{
		if (Firebug) console.info('NetworkMapIcon_OnClick', pintIndex);

		//If the page is the quick Tour, exit this function
		if (is_QuickTour) return false;

		var lastSelected = getCookie(COOKIE_DEVICE);
		setCookie(COOKIE_DEVICE, pintIndex);
		var selDevice = Map.Item[pintIndex];

		UI.PrevClientID = UI.ClientID;
		UI.ClientID = selDevice.ID;
		UI.PrevClientMac = UI.ClientMac;
		UI.ClientMac = selDevice.MAC;
		UI.NetworkMapIndex = pintIndex;

		if (selDevice.Type == 'Install')
		{
			if (checkOS() == 'Mac')
			{
				alert('Thin Client (endpoint protection) services are not available for the Mac at this time.');
				NetworkMapIcon_OnClick(lastSelected);
			} else
			{
				Download_ThinClient();
			}
			return;
		}

		NetworkMap_OnIndexChanged(pintIndex); // Highlights the selected NetworkMap Icon

		if (UI.NewClient())
		{
			$get(MasterControls.hidCurrentIndex).value = pintIndex;
			$get(MasterControls.hidCurrentType).value = selDevice.Type;
			$get(MasterControls.hidCurrentMac).value = selDevice.MAC;
			$get(MasterControls.hidCurrentID).value = selDevice.ID;
      
      //if the device is a computer and DSD and does not have any services - show the manage prompt
			if (IsDSD() && selDevice.Type != 'Router' && !selDevice.HasServices)
			{
        ManageDsdAccount_Prompt();
			}
			else
			{
			  DoClientCallBack();
			}
		}

		// Certain devices need the right panel changed
		switch (selDevice.Type)
		{
			case 'Guest':
				Tab_OnClick(1);
				setCookie(COOKIE_DEVICETYPE, selDevice.Type);
				UI.LoadRightSide('~/Wizards/RegisterDevice.ascx');
				break;
			case 'Unknown':
				Tab_OnClick(1);
				setCookie(COOKIE_DEVICETYPE, selDevice.Type);
				UI.LoadRightSide('~/Wizards/RegisterDevice.ascx');
				break;
			case 'WebCam':
				Tab_OnClick(1);
				setCookie(COOKIE_DEVICETYPE, selDevice.Type);
				UI.LoadRightSide('~/ParentalCtrl/WebcamCtrl.ascx');
				Sys.WebForms.PageRequestManager.getInstance().add_endRequest(ServicesBack_HTML_webcam);
				break;
			default:
				var cookieTab = ckCookieNumVal(getCookie(COOKIE_TAB));
				var cookieDevice = getCookie(COOKIE_DEVICETYPE);
				var cookieRP = getCookie(COOKIE_RIGHTPANEL);
				// Select the Security tab if the tab selected is not security or info
				if (cookieTab > 1 && getCookie(COOKIE_DEVICE) != pintIndex && typeof UI.Services != 'undefined')
					Tab_OnClick(0);

				if ((cookieTab < 2) && cookieDevice != '')
				{
					// if the device is not a guest, webcam or unknown, then select the welcome page
					setWelcomePage();
					setCookie(COOKIE_DEVICETYPE, '');
				}else if(MyAccount(cookieRP,false)){
					// adds the 'Back to my account' icon after reauth
					MyAccount('',true);
				}
				break;
		}

		setCookie(COOKIE_DEVICE, pintIndex);
	}

	/**
	* This is for the WebCam Only. Renders the "Back to..." button in the header of
	* the right panel, providing a link back to the main menu of the selected
	* service. Called from NetworkMapIcon_OnClick() & PageRefreshed()
	*/
	function ServicesBack_HTML_webcam()
	{
		if (Firebug) console.info('ServicesBack_HTML_webcam');

		var webCamPath = "~/ParentalCtrl/WebcamCtrl.ascx";
		ServicesBack_HTML("upgrade", webCamPath, "WebCam");
		Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(ServicesBack_HTML_webcam);
	}

	/**
	* Function used when you are on the cart and you click on "Back to network Map"
	* Called from sitemanager.js > UI.LoadPanel() & selectService(id)
	*/
	function selectSecurityTab()
	{
		if (Firebug) console.info('selectSecurityTab');

		Tab_OnClick(0);
		Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(selectSecurityTab);
	}

	/**
	* Updates the Purchase Tab's content.
	* 
	* @param (str)
	*          strText Text to be placed on the tab
	*/
	function PurchaseTab_Update(strText)
	{
		if (Firebug) console.info('PurchaseTab_Update');

		var pnt = $get(MasterControls.PurchaseNowTab);
		if (pnt)
			pnt.innerHTML = strText;
	}

	/**
	* Hides the "Cancel Account" prompt and clicks the hidden "Cancel Account"
	* button
	*/
	function CancelAccount_Yes_OnClick()
	{
		if (Firebug) console.info('CancelAccount_Yes_OnClick');

		Div_CssUpdate(DefaultControls.pdCancelAccount, 'display', 'none');
		clickButton($get(DefaultControls.btnCancelAccount));
	}
	
	function AccessControlMsg_Yes_OnClick()
	{
		if (Firebug) console.info('AccessControlMsg_Yes_OnClick');

		Div_CssUpdate(DefaultControls.pdWarnAccess, 'display', 'none');
		clickButton($get(ACControls.btnACStatusOff));
	}

	/**
	* Function used when you are on the cart and you click on "Back to network Map"
	* Called from tab_onclick if the buy now tab is clicked
	*/
	function loadCart()
	{
		if (Firebug) console.info('loadCart');

		set_ContentTarget('cart');
		if (UI.Device.DeviceID < 3) // DSD is device ID 2
			UI.LoadPanel("~/ShoppingCartCtrl/DSDCart.ascx");
		else
			UI.LoadPanel("~/ShoppingCartCtrl/Cart.ascx");
		Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(loadCart);
	}

	/**
	* Function used when you are on the parental control > category > custom
	* section and you click on clear or slect all buttons
	*/
	function catSet(setting)
	{
		if (Firebug) console.info('catSet', setting);

		var temp = document.getElementById(CategoryControls.cblCategories);
		temp = temp.getElementsByTagName('input');
		for (var i = 0; i < temp.length; i++)
		{
			if (temp[i].type == 'checkbox')
				temp[i].checked = setting;
		}
	}

	/**
	* Function used to determine the users Operating System
	* used to block installs on a Mac or specifed OS
	*/
	function checkOS()
	{
		if (Firebug) console.info('checkOS');
		if (navigator.platform.indexOf('Mac') != -1)
		{ var pOS = "Mac"; }
		else if (navigator.platform.indexOf('Win') != -1)
		{ var pOS = "Win"; }
		else
		{ var pOS = "NA"; }

		return pOS;
	}

	/**
	* Function used to assign a classname to a div
	* used on the Quick Tour guide
	*/
	function assignCN(div, cn)
	{
		if (Firebug) console.info('assignCN', div, cn);

		var div = $get(div);
		if (div) div.className = cn;
	}

	/**
	 * Function to reset the cookies and move to the first step when the page
	 * loads used on the Quick Tour guide
	 */	
	function QuickTourStart(){
		if (Firebug) console.info('QuickTourStart');
		
    setCookie(COOKIE_QUICKTOURSTEPS, 100); // forces a reset when
																						// QuickTourSteps is loaded
    setCookie(COOKIE_QUICKTOURCHAR, 0); // reset the character back to 1
    QuickTourSteps('next');
	}
	
	
	/**
	* Function used to manage the quick Tour on quicktour.aspx
	*/
	function QuickTourSteps(direction)
	{
		if (Firebug) console.info('QuickTourSteps', direction);

		var qtJSON = QuickTourJSON.Steps;  //JSON object from scripts/QuickTourJSON.js 
		var endpos = qtJSON.length;
		var ckPos = getCookie(COOKIE_QUICKTOURSTEPS);
    var ckRp = getCookie(COOKIE_QUICKTOUR_RP);
    var ckDir = getCookie(COOKIE_QUICKTOURDIR);
    var ckSteps = getCookie(COOKIE_QUICKTOURSTEPS);
    
		ckPos = (ckPos.length == 0) ? 0 : (ckPos > endpos) ? -1 : parseInt(ckPos);
		ckPos = (direction.toLowerCase() == "back") ? ckPos - 1 : ckPos + 1;
		
		if(is_IE6){
		  try {
		    document.execCommand("BackgroundImageCache", false, true);
      } catch(err) {}
    }
    
		if (ckPos < 0 || ckPos > endpos - 1)
		{
		  if(ckRp.length > 0 && ckRp != "undefined")
		  {
		    //if the right panel was loaded, redirect back to the last position
		    //The update panel resets the page which restarts the quick tour
	      setCookie(COOKIE_QUICKTOUR_RP,"");
	      setCookie(COOKIE_QUICKTOURSTEPS,ckSteps-1);
	      QuickTourSteps(ckDir);
			}
		}
		else
		{
			setCookie(COOKIE_QUICKTOURSTEPS, ckPos);	
			setCookie(COOKIE_QUICKTOURDIR, direction);		
			qt = qtJSON[ckPos]; //quick tour JSON object
			rpcp = qt.RPCP; //right panel control path
		  
		  //Load the Right Panel
	    setCookie(COOKIE_QUICKTOUR_RP,rpcp);
		  if(rpcp)UI.LoadFullPanel(rpcp);
		  		  
		  //position of the quick tour guide
			$get('Guide').style.cssText = "width:450px;"; //reset the guide position

			for (key in qt.Divs) //show or hide screens
				Div_CssUpdate(key, 'display', qt.Divs[key]);

			for (key in qt.cssClass) //assign classes to divs
				assignCN(key, qt.cssClass[key]);

			for (key in qt.Position) //position of the guide
				Div_CssUpdate('Guide', key.toLowerCase(), qt.Position[key] + "px");

			for (key in qt.InlineStyles) //position of the arrow(s)
				$get(key).style.cssText = qt.InlineStyles[key];

			$get('DivQT_Title').innerHTML = qt.Title + ' (' + (ckPos + 1) + ' of ' + (endpos - 1) + ')'; //Title and screen number for the quick tour guide
			$get('DivQT_Content_Text').innerHTML = qt.Content; //content for the quick tour guide

			if (qt.NextBtn) $get('QT_Next').innerHTML = qt.NextBtn; //content for the quick tour buttons
			if (qt.Step == 1) $get('NextBtn').focus = true;
			if (qt.FinalLink) $get('QT_Next').href = "javascript:clearCookies();location.href='default3.aspx';"; //link to the home page
			if (parseInt(getCookie(COOKIE_QUICKTOURCHAR)) == 5) assignCN('DivQT_Character', 'character'); //For Fun

			//disable the bubble pointer for the dlink images
			$get('DivQT_Pointer').style.display = (parseInt(getCookie(COOKIE_QUICKTOURCHAR)) > 1) ? "block" : "none";
		}
	}
	
	/**
	* Function used to change the character on the quick Tour - quicktour.ascx
	*/
	function changeCharacter(e)
	{
		if (Firebug) console.info('changeCharacter', e);

		var QTchar = parseInt(getCookie(COOKIE_QUICKTOURCHAR));
		var QTsteps = parseInt(getCookie(COOKIE_QUICKTOURSTEPS));
		var QTcharDiv = $get('DivQT_Character');

		switch (QTchar)
		{
			case 1:
				QTcharDiv.style.backgroundImage = 'url("images/QuickTour/CharacterRoboDog.gif")';
				setCookie(COOKIE_QUICKTOURCHAR, 2);
				break;
			case 2:
				QTcharDiv.style.backgroundImage = 'url("images/QuickTour/CharacterStick.gif")';
				setCookie(COOKIE_QUICKTOURCHAR, 3);
				break
			case 3:
				QTcharDiv.style.backgroundImage = 'url("images/QuickTour/CharacterSun.gif")';
				setCookie(COOKIE_QUICKTOURCHAR, 4);
				break;
			case 4:
				if (isCtrl && !is_IE && QTsteps == 7)
				{
					QTcharDiv.style.backgroundImage = 'url("images/QuickTour/CharacterDB.gif")';
					setCookie(COOKIE_QUICKTOURCHAR, 5);
					isCtrl = false;
				} else
				{
					QTcharDiv.style.backgroundImage = 'url("images/QuickTour/CharacterDlink.jpg")';
					setCookie(COOKIE_QUICKTOURCHAR, 0);
				}
				break;
			case 5:
				QTcharDiv.style.backgroundImage = 'url("images/QuickTour/CharacterDlink.jpg")';
				setCookie(COOKIE_QUICKTOURCHAR, 0);
				break;
			default:
				setCookie(COOKIE_QUICKTOURCHAR, 1);
				changeCharacter();
				//Do Nothing
				break;
		}
		//disable the bubble pointer for the dlink images
		QTchar = parseInt(getCookie(COOKIE_QUICKTOURCHAR));
		$get('DivQT_Pointer').style.display = (QTchar == 0) ? "none" : "block";

	}

	/**
	 * Function used to trim a string
	 */
	function trim(s)
	{
		var temp = s;
		return temp.replace(/^s+/, '').replace(/s+$/, '');
	}

	/**
	 * Function used to show or hide the help box on the top-right corner of the
	 * network map
	 */
	function ToggleHelpLinks()
	{
		if (Firebug) console.info('ToggleHelpBox');

		var pnlHelp = $get(Map.ID.replace('_NetworkMap1', '') + '_pnlHelpLinks');
		var helpLinks = $get('HelpLinks');
		var showhide = $get('HelpLinks_ShowHide');
		var action = (helpLinks.style.display) ? ((helpLinks.style.display == "block") ? "hide" : "show") : "hide";
		switch (action)
		{
			case "show":
				pnlHelp.style.width = "220px";
				helpLinks.style.display = "block";
				showhide.innerHTML = "&raquo;";
				break;
			default:
				pnlHelp.style.width = "25px";
				helpLinks.style.display = "none";
				showhide.innerHTML = "?";
				break;
		}
	}
	
/**
 * Function used to pull the ToolTip associated with the service and it's status
 * 
 * @param (obj)
 *          objService Service to get the tooltip for
 */
function ServiceToolTip ( objService )
{
	if ( Firebug ) console.info ( 'ServiceToolTip' );

	for ( var i = 0;i < ToolTips.length; i++ )
	{
		if ( objService.Name == ToolTips[i].Name )
		{
			if ( objService.IsAvailable )
			{
				if ( objService.IsEnabled )
				{
					return ToolTips[i].Active;
				}
				else
				{
					return ToolTips[i].Inactive;
				}
			}
			else
			{
				return ToolTips[i].Unavailable;
			}
		}
	}
}

/**
* Sets the hidden input for the selected state from the state dropdownbox
* 
* @param (obj)
*          strDdState ID of dropdown to select the State ID from
* @param (obj)
*          strHidState ID of hidden input to assign the value to
*/
function setState(strDdState, strHidState) 
{
  if (Firebug) console.info( 'setState' );

  if ($get(strDdState))
    $get(strHidState).value = $get(strDdState).value;
}	

function updateNetworkMapIcon ( objPC, boolHasServices )
{
  if (Firebug) console.info('updateNetworkMapIcon', objPC, boolHasServices);
  
	var mapObj = $get ( Map.ID + '_PCDivBg' + UI.NetworkMapIndex + '_PCName' + UI.NetworkMapIndex );
	if ( mapObj )
		mapObj.innerHTML = objPC.pc.Description;

	mapObj = $get ( Map.ID + '_PCDivBg' + UI.NetworkMapIndex + '_PCDiv' + UI.NetworkMapIndex );
	if ( mapObj )
	{
			var objAttrib = mapObj.getAttribute(attributeClass());
			mapObj.setAttribute(attributeClass(), 'NetworkItem ' + objPC.pc.DeviceType);
	}
  
  Map.Item[UI.NetworkMapIndex] = new NetworkMapItem(objPC.pc.ID, objPC.pc.MACAddresses[0], objPC.pc.DeviceType, boolHasServices);
  console.dir(Map.Item[UI.NetworkMapIndex]);
}

function updateNetworkMapStatusIcon (className)
{
	//Update the status icon
  mapObj = $get ( Map.ID + '_PCDivBg' + UI.NetworkMapIndex + '_PCStatus' + UI.NetworkMapIndex );
  if ( mapObj )
  {
	    var objAttrib = mapObj.getAttribute(attributeClass());
	    mapObj.setAttribute(attributeClass(), className);
  }
}

/**
* Function shows or disables a div element or a button based on the parameters passed in
* 
* @param (div)
*						div = ID of the div element or button
*						enable = Shows or hides the div element or button
*/
function registrationSetAttr(div, enable)
{
  if (Firebug) console.info('registrationSetAttr', div);

  //alert('div: ' + div);

  var tmpDiv = $get(div);

  //alert('tmpDiv: ' + tmpDiv);
   
  if(tmpDiv)
  {
  	if (enable)
  	{
  		tmpDiv.setAttribute('onclick', 'javascript:return true;');
  		assignCN(div, 'WhiteAlias btnGrayHov');
  	}
  	else
  	{
  		tmpDiv.setAttribute('onclick', 'javascript:return false;');
  		if(is_IE)tmpDiv.disabled = true;
  		assignCN(div, 'WhiteAlias btnGray btnDisabled');
  		tmpDiv.setAttribute('onmouseover', '');
			tmpDiv.setAttribute('onmouseout', ''); 
  	}  
  }
}
/**
* Function to animate the loading image
* 
* @param (step)
*						step = the current frame in the animation. To initialize, pass 0.
*           The animation will start over when it reaches the 7th frame
*/
function rotateLoadingAnim(step){
   if (Firebug) console.info('rotateLoadingAnim', step);
     
   div = "loadingAnimDiv";
   tmpdiv = $get(div);
   if(tmpdiv)
  {
    var newStep = eval(step)+1;
    if(newStep > 7)newStep = 1
    var newDiv = "loadingAnim"+newStep;
    assignCN(div, "loadingAnim "+newDiv);
    setTimeout("rotateLoadingAnim("+newStep+")",100);
  }
}
/**
* Function to reload the page after de-selecting "Manage at computer"
* 
*/
function manageServicesAtDevice(){
  if (Firebug) console.info('manageServicesAtDevice');

  //if the device is a DSD, update the status icon programatically without refreshing the page
  if(IsDSD()){
    updateNetworkMapStatusIcon ('Status Error');
		Map.Item[UI.NetworkMapIndex].HasServices = false;
  }
  //clear the cookies so the page refresh function will re-select everything
  clearCookies();
  $get(MasterControls.hidPageRefresh).value == '';
  //selects the current service
  selectService(UI.ServiceID)
}
/**
* Function to detect if the my account panel is loaded
* 
* @param (RPloaded)
*						RPloaded = the object string to compare
* @param (drawBackTo)
*						drawBackTo = true/false - draw the "back to" icon
*/
function MyAccount(RPloaded,drawBackTo){
  if (Firebug) console.info('MyAccount',RPloaded,drawBackTo);

  var loaded = false;
  passedPath = RPloaded.replace("~/", "").split("/");
  pathMA = PATH_MYACCOUNT.replace("~/", "").split("/");
	if(passedPath.length > 0)
	  if(passedPath[0].toLowerCase() == pathMA[0].toLowerCase())
	    loaded = true;
	    
	if(drawBackTo)
	  ServicesBack_HTML('my account', PATH_MYACCOUNT, contentMap.myAccount);
	  
	return loaded;
}