import { useEffect, useMemo, useState } from "react";
import { useStatistics } from "./useStatistics";
import { Chart } from "./Chart";

function App() {
  const staticData = useStaticData();
  const statistics = useStatistics(10);
  const [activeView, setActiveView] = useState<View>("CPU");
  const cpuUsages = useMemo(
    () => statistics.map((stat) => stat.cpuUsage),
    [statistics],
  );
  const ramUsages = useMemo(
    () => statistics.map((stat) => stat.ramUsage),
    [statistics],
  );
  const storageUsages = useMemo(
    () => statistics.map((stat) => stat.storageUsage),
    [statistics],
  );
  const activeUsages = useMemo(() => {
    switch (activeView) {
      case "CPU":
        return cpuUsages;
      case "RAM":
        return ramUsages;
      case "STORAGE":
        return storageUsages;
    }
  }, [activeView, cpuUsages, ramUsages, storageUsages]);

  useEffect(() => {
    return window.electron.subscribeChangeView((view) => setActiveView(view));
  }, []);

  return (
    <div className="h-screen bg-[#101010] text-base leading-6 text-white antialiased">
      <Header />
      <div className="flex flex-col p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">
            [PC Name]'s Computer Performance
          </h1>
        </div>
        <div className="mt-6 grid max-w-[900px] grid-cols-4 items-center gap-1">
          <div className="flex flex-col gap-y-2">
            <SelectOption
              onClick={() => setActiveView("CPU")}
              title="CPU"
              view="CPU"
              subTitle={staticData?.cpuModel ?? ""}
              data={cpuUsages}
            />
            <SelectOption
              onClick={() => setActiveView("RAM")}
              title="RAM"
              view="RAM"
              subTitle={(staticData?.totalMemoryGB.toString() ?? "") + " GB"}
              data={ramUsages}
            />
            <SelectOption
              onClick={() => setActiveView("STORAGE")}
              title="STORAGE"
              view="STORAGE"
              subTitle={(staticData?.totalStorage.toString() ?? "") + " GB"}
              data={storageUsages}
            />
          </div>
          <div className="col-span-3 ml-1 h-full overflow-clip rounded-md bg-neutral-900">
            <Chart
              selectedView={activeView}
              data={activeUsages}
              maxDataPoints={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectOption(props: {
  title: string;
  view: View;
  subTitle: string;
  data: number[];
  onClick: () => void;
}) {
  return (
    <button
      className="w-full cursor-pointer overflow-clip rounded-lg bg-neutral-900 text-left select-none hover:bg-[#333]"
      onClick={props.onClick}
    >
      <div className="flex items-baseline justify-between gap-2 p-2">
        <div className="font-semibold">{props.title}</div>
        <div className="line-clamp-1 text-xs text-white/60">
          {props.data[props.data.length - 1]?.toFixed(2) ?? "0.00"}%
        </div>
      </div>
      <div className="h-12 w-full cursor-pointer">
        <Chart selectedView={props.view} data={props.data} maxDataPoints={10} />
      </div>
    </button>
  );
}

function Header() {
  return (
    <header className="drag box-border flex w-full items-center justify-between bg-neutral-900 p-2 pl-4">
      <div className="text-sm leading-none tracking-tight text-white/50">
        Simple Resource Monitor
      </div>
      <div className="flex">
        <button
          className="nodrag m-1 size-4 rounded-full bg-green-500"
          onClick={() => window.electron.sendFrameAction("MAXIMIZE")}
        />
        <button
          className="nodrag m-1 size-4 rounded-full bg-yellow-500"
          onClick={() => window.electron.sendFrameAction("MINIMIZE")}
        />
        <button
          className="nodrag m-1 size-4 rounded-full bg-red-500"
          onClick={() => window.electron.sendFrameAction("CLOSE")}
        />
      </div>
    </header>
  );
}

function useStaticData() {
  const [staticData, setStaticData] = useState<StaticData | null>(null);

  useEffect(() => {
    (async () => {
      setStaticData(await window.electron.getStaticData());
    })();
  }, []);

  return staticData;
}

export default App;
