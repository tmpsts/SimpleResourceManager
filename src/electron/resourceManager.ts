import si from "systeminformation";
import { BrowserWindow } from "electron";
import { ipcWebContentsSend } from "./util.js";

const POLLING_INTERVAL = 500;

export function pollResources(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = await getRamUsage();
    const storageData = await getStorageData();

    ipcWebContentsSend("statistics", mainWindow.webContents, {
      cpuUsage,
      ramUsage,
      storageUsage: storageData.usage,
    });
  }, POLLING_INTERVAL);
}

export async function getStaticData(): Promise<StaticData> {
  const [cpu, mem, storage] = await Promise.all([
    si.cpu(),
    si.mem(),
    getStorageData(),
  ]);

  return {
    totalStorage: storage.total,
    cpuModel: cpu.brand,
    totalMemoryGB: Math.floor(mem.total / 1073741824), // Convert bytes to GB
  };
}

async function getCpuUsage() {
  const load = await si.currentLoad();
  console.log("CPU raw data:", load);
  console.log("CPU usage percentage:", load.currentLoad);
  return load.currentLoad; // This returns the current CPU load percentage
}

async function getRamUsage() {
  const memory = await si.mem();
  console.log("RAM raw data:", memory);
  const ramPercentage = (memory.used / memory.total) * 100;
  console.log("RAM usage percentage:", ramPercentage);
  return ramPercentage;
}

async function getStorageData() {
  const fsSize = await si.fsSize();
  console.log("Storage raw data:", fsSize);
  // Get the main drive (usually the first one)
  const mainDrive = fsSize[0];

  const totalGB = Math.floor(mainDrive.size / 1_000_000_000);
  const usagePercentage = (mainDrive.used / mainDrive.size) * 100;

  console.log("Storage total GB:", totalGB);
  console.log("Storage usage percentage:", usagePercentage);

  return {
    total: totalGB, // Convert to GB
    usage: usagePercentage, // Convert to percentage
  };
}
