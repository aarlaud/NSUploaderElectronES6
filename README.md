# NSUploaderElectronES6

Electron app built with React and using the NetStorageKit-Node package to ping Akamai netstorage APIs.

# How to use
1. download repository
2. run "npm install"
3. Modify /node_modules/netstorageapi/lib/api-request.js.
                  Add "res.setEncoding('binary');" line 43 (remove double quotes)
                  Replace line 61 or 62 from "fs.writeFileSync(local_destination, rawData)"" by "fs.writeFileSync(local_destination, rawData, 'binary')" (remove double quotes)
4. run "npm start"

This will spin up the electron app in dev mode. Access the devtools by pressing F12.

Packages:
React
react-dropzone (dropzone)
react-skylight (modal overlay)
NetStorageKit-Node (NS API wrapper)
electron-config (electron config persistence between app reboots)
Babel (ES6 support including import keywords)
