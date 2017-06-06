const Settings = require('electron-config');
const settings = new Settings();


if(!settings.get('settings')){
    settings.set('settings', {
      downloadFolder: ''
    });
  }


export const getSettings = () => {
  return settings.get('settings');
}

export const setSettings = (newSettings) => {
  settings.set('settings', newSettings);
}
