import React, { useState } from "react";
import { useAtom } from "jotai";
import { modelAtom, allModels } from "../atoms/modelAtom";
import { Model } from "../types/model";

function sortModels(models: Model[], field: keyof Model, asc: boolean) {
  return [...models].sort((a, b) => {
    const va = a[field];
    const vb = b[field];
    if (va === undefined || vb === undefined) return 0;
    if (typeof va === "string") {
      return asc
        ? va.localeCompare(vb as string)
        : (vb as string).localeCompare(va);
    }
    return asc
      ? (va as number) - (vb as number)
      : (vb as number) - (va as number);
  });
}

const isMobile = () => window.innerWidth <= 768;

const formatDate = (ts?: number) => (ts ? new Date(ts).toLocaleString() : "-");

const MODEL_INFO_FIELDS = [
  { key: "name", label: "Name", type: "text" },
  { key: "id", label: "ID", type: "text" },
  { key: "sizeMB", label: "Size(MB)", type: "number" },
  { key: "maxRAMMB", label: "Max RAM(MB)", type: "number" },
  { key: "createdAt", label: "Created", type: "text", format: formatDate },
  { key: "updatedAt", label: "Updated", type: "text", format: formatDate },
  { key: "promptTemplate", label: "Prompt Template", type: "text" },
  { key: "description", label: "Description", type: "text" },
  { key: "detailUrl", label: "Detail URL", type: "text" },
  { key: "modelUrl", label: "Model URL", type: "text" },
  { key: "n_ctx", label: "n_ctx", type: "number" },
  { key: "n_threads", label: "n_threads", type: "number" },
];

const ModelInfoEditor: React.FC<{
  model: Model;
  editConfigs: Record<string, any>;
  setEditConfigs: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  onSave?: () => void;
  onCancel?: () => void;
}> = ({ model, editConfigs, setEditConfigs, onSave, onCancel }) => {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newConfigKey, setNewConfigKey] = useState("");
  const [newConfigValue, setNewConfigValue] = useState("");

  const configEntries = Object.entries({
    ...model.configs,
    ...Object.keys(editConfigs).reduce((acc, k) => {
      if (!(k in (model.configs || {})) && k.startsWith("config:")) {
        acc[k.replace("config:", "")] = editConfigs[k];
      }
      return acc;
    }, {} as Record<string, any>),
  });

  return (
    <div>
      <div className="font-semibold mb-1">Model Info</div>
      {MODEL_INFO_FIELDS.map(({ key, label, type }) => (
        <div key={key} className="mb-2 flex items-center gap-2">
          <span className="font-semibold w-32">{label}:</span>
          {editingKey === key ? (
            <input
              type={type}
              autoFocus
              defaultValue={
                editConfigs[key] ??
                (key === "createdAt" || key === "updatedAt"
                  ? formatDate(model[key as keyof Model] as number | undefined)
                  : model[key as keyof Model] ?? "-")
              }
              className="border w-full rounded px-2 py-1"
              onBlur={() => setEditingKey(null)}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                setEditConfigs((cfgs) => ({ ...cfgs, [key]: e.target.value }))
              }
            />
          ) : (
            <span
              className="cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                setEditingKey(key);
              }}
            >
              {editConfigs[key] ??
                (key === "createdAt" || key === "updatedAt"
                  ? formatDate(model[key as keyof Model] as number | undefined)
                  : model[key as keyof Model] ?? "-")}
            </span>
          )}
        </div>
      ))}
      <div className="font-semibold mb-1 mt-4">Configs</div>
      {configEntries.length === 0 ? (
        <div className="text-gray-400">No configs</div>
      ) : (
        configEntries.map(([k, v]) => {
          const isCustom =
            `config:${k}` in editConfigs &&
            !(model.configs && k in model.configs);
          return (
            <div key={k} className="flex items-center gap-2 mb-2">
              <span className="font-semibold w-32">{k}:</span>
              {editingKey === `config:${k}` ? (
                <input
                  type="text"
                  autoFocus
                  defaultValue={editConfigs[`config:${k}`] ?? v}
                  className="border rounded px-2 py-1"
                  onBlur={() => setEditingKey(null)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    setEditConfigs((cfgs) => ({
                      ...cfgs,
                      [`config:${k}`]: e.target.value,
                    }))
                  }
                />
              ) : (
                <span
                  className="cursor-pointer hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingKey(`config:${k}`);
                  }}
                >
                  {editConfigs[`config:${k}`] ?? v}
                </span>
              )}
              {isCustom && (
                <button
                  className="ml-2 text-xs text-alert border rounded px-1 py-0.5 hover:bg-alert"
                  type="button"
                  onClick={() => {
                    setEditConfigs((cfgs) => {
                      const newCfgs = { ...cfgs };
                      delete newCfgs[`config:${k}`];
                      return newCfgs;
                    });
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          );
        })
      )}
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="Config Key"
          value={newConfigKey}
          className="border rounded px-2 py-1"
          onChange={(e) => setNewConfigKey(e.target.value)}
        />
        <input
          type="text"
          placeholder="Config Value"
          value={newConfigValue}
          className="border rounded px-2 py-1"
          onChange={(e) => setNewConfigValue(e.target.value)}
        />
        <button
          className="btn-sm border rounded px-2 py-1 bg-primary-light"
          type="button"
          onClick={() => {
            if (newConfigKey) {
              setEditConfigs((cfgs) => ({
                ...cfgs,
                [`config:${newConfigKey}`]: newConfigValue,
              }));
              setNewConfigKey("");
              setNewConfigValue("");
            }
          }}
        >
          Add
        </button>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button
          className="btn-sm border rounded px-4 py-1 bg-primary hover:bg-primary"
          type="button"
          onClick={onSave}
        >
          Save
        </button>
        <button
          className="btn-sm border rounded px-4 py-1 bg-secondary hover:bg-secondary"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const ModelsPage: React.FC = () => {
  const [models] = useAtom(allModels);
  const [selected, setSelected] = useAtom(modelAtom);
  const [sortField, setSortField] = useState<keyof Model>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editConfigs, setEditConfigs] = useState<Record<string, any>>({});

  const sortedModels = sortModels(models, sortField, sortAsc);

  const handleApply = (model: Model) => {
    setSelected(model);
    setExpandedId(null);
  };

  const handleExpend = (id: string | null) => {
    console.debug("Expanding model:", id);
    setExpandedId(id);
    if (id !== null) {
      setEditConfigs(models.find((m) => m.id === id)?.configs || {});
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <div className="mb-2 flex items-center">
        <button className="btn-lg">
          <a href="/">
            <span className="text-lg mr-1">←</span> Home
          </a>
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Model Management</h1>
      <div className="mb-4 flex items-center gap-2">
        <span className="font-semibold">Current Model:</span>
        {selected ? (
          <a
            href={selected.detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            {selected.name}
          </a>
        ) : (
          <span>None</span>
        )}
      </div>
      <div className="card">
        <div className="grid grid-cols-12 font-bold mb-2 items-center gap-2 text-sm">
          <span className="col-span-2 truncate flex items-center">
            Name
            <button
              className={`ml-1 btn-sm ${
                sortField === "name" ? "text-primary" : "text-secondary"
              }`}
              onClick={() => {
                setSortField("name");
                setSortAsc(sortField === "name" ? !sortAsc : true);
              }}
              title="Sort by Name"
              type="button"
            >
              {sortField === "name" ? (sortAsc ? "↑" : "↓") : "↕"}
            </button>
          </span>
          {!isMobile() && [
            <span key="size" className="col-span-1 truncate flex items-center">
              Size(MB)
              <button
                className={`ml-1 btn-sm ${
                  sortField === "sizeMB" ? "text-primary" : "text-secondary"
                }`}
                onClick={() => {
                  setSortField("sizeMB");
                  setSortAsc(sortField === "sizeMB" ? !sortAsc : true);
                }}
                title="Sort by Size"
                type="button"
              >
                {sortField === "sizeMB" ? (sortAsc ? "↑" : "↓") : "↕"}
              </button>
            </span>,
            <span key="ram" className="col-span-1 truncate flex items-center">
              RAM(MB)
              <button
                className={`ml-1 btn-sm ${
                  sortField === "maxRAMMB" ? "text-primary" : "text-secondary"
                }`}
                onClick={() => {
                  setSortField("maxRAMMB");
                  setSortAsc(sortField === "maxRAMMB" ? !sortAsc : true);
                }}
                title="Sort by RAM"
                type="button"
              >
                {sortField === "maxRAMMB" ? (sortAsc ? "↑" : "↓") : "↕"}
              </button>
            </span>,
            <span
              key="created"
              className="col-span-1 truncate flex items-center"
            >
              Created
              <button
                className={`ml-1 btn-sm ${
                  sortField === "createdAt" ? "text-primary" : "text-secondary"
                }`}
                onClick={() => {
                  setSortField("createdAt");
                  setSortAsc(sortField === "createdAt" ? !sortAsc : true);
                }}
                title="Sort by Created"
                type="button"
              >
                {sortField === "createdAt" ? (sortAsc ? "↑" : "↓") : "↕"}
              </button>
            </span>,
            <span
              key="updated"
              className="col-span-1 truncate flex items-center"
            >
              Updated
              <button
                className={`ml-1 btn-sm ${
                  sortField === "updatedAt" ? "text-primary" : "text-secondary"
                }`}
                onClick={() => {
                  setSortField("updatedAt");
                  setSortAsc(sortField === "updatedAt" ? !sortAsc : true);
                }}
                title="Sort by Updated"
                type="button"
              >
                {sortField === "updatedAt" ? (sortAsc ? "↑" : "↓") : "↕"}
              </button>
            </span>,
          ]}
          <span className="desc col-span-5 truncate">Description</span>
          <span className="action col-span-1">Action</span>
        </div>
        <ul className="divide-y">
          {sortedModels.map((model) => {
            const expanded = expandedId === model.id;
            const infoCols = !isMobile()
              ? [
                  <span key="size" className="col-span-1 truncate">
                    {model.sizeMB ?? "-"}
                  </span>,
                  <span key="ram" className="col-span-1 truncate">
                    {model.maxRAMMB ?? "-"}
                  </span>,
                  <span key="created" className="col-span-1 truncate">
                    {formatDate(model.createdAt)}
                  </span>,
                  <span key="updated" className="col-span-1 truncate">
                    {formatDate(model.updatedAt)}
                  </span>,
                ]
              : null;
            const modelSelected = selected?.id === model.id;
            return (
              <li
                key={model.id}
                className="py-2 cursor-pointer transition-colors"
                onClick={() =>
                  handleExpend(
                    expandedId === model.id ? null : model.id ?? null
                  )
                }
              >
                <div className="grid grid-cols-12 items-center gap-2 text-sm">
                  <a
                    className="link col-span-2 truncate"
                    href={model.detailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {model.name}
                  </a>
                  {infoCols}
                  <span className="desc col-span-5 truncate">
                    {model.description}
                  </span>
                  <div className="action col-span-1 flex items-center gap-2">
                    <button
                      className={`action text-xs px-1 ${
                        modelSelected ? "text-secondary" : "link"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(model);
                      }}
                    >
                      {modelSelected ? "Selected" : "Select"}
                    </button>
                    <button
                      type="button"
                      className="action link col-span-1 text-xs px-1"
                      onClick={(_) => {
                        handleExpend(
                          expandedId === model.id ? null : model.id ?? null
                        );
                      }}
                    >
                      {expanded ? "⬆" : "⬇"}
                    </button>
                  </div>
                </div>
                {expanded && (
                  <div className="card gap-4 mb-4 text-sm">
                    <ModelInfoEditor
                      model={model}
                      editConfigs={editConfigs}
                      setEditConfigs={setEditConfigs}
                      onSave={() => {
                        handleExpend(null);
                      }}
                      onCancel={() => {
                        handleExpend(null);
                      }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ModelsPage;
