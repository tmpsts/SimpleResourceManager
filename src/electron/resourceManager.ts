import osu from "node-os-utils";
import fs from "fs";
import os from "os";
import { BrowserWindow } from "electron";
import { ipcWebContentsSend } from "./util.js";

const POLLING_INTERVAL = 500;
const cpu = osu.cpu;
const mem = osu.mem;

export function pollResources(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = (await getRamUsage()).usedMemMb;
    const storageData = getStorageData();
    ipcWebContentsSend("statistics", mainWindow.webContents, {
      cpuUsage,
      ramUsage,
      storageUsage: storageData.usage,
    });
  }, POLLING_INTERVAL);
}

export function getStaticData() {
  const totalStorage = getStorageData().total;
  const cpuModel = os.cpus()[0].model;
  const totalMemoryGB = Math.floor(mem.totalMem() / 1024);

  return {
    totalStorage,
    cpuModel,
    totalMemoryGB,
  };
}

function getCpuUsage() {
  return cpu.usage();
}

function getRamUsage() {
  return mem.used();
}

function getStorageData() {
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;

  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free / total,
  };
}
