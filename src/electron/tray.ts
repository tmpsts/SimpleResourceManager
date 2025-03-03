import { app, BrowserWindow, Menu, Tray } from "electron";
import { getAssetPath } from "./pathResolver.js";
import path from "path";

export function createTray(mainWindow: BrowserWindow) {
  const tray = new Tray(
    path.join(
      getAssetPath(),
      process.platform === "darwin" ? "trayiconTemplate@4x.png" : "trayicon.png"
    )
  );

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Show",
        click: () => {
          mainWindow.show();
          if (app.dock) {
            app.dock.show();
          }
        },
      },
      {
        label: "Quit",
        click: () => app.quit(),
      },
    ])
  );
}
