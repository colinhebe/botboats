export class Model {
  id?: string;
  name!: string;
  modelUrl!: string;
  description?: string;
  detailUrl?: string;
  promptTemplate!: string;
  sizeMB?: number;
  maxRAMMB?: number;
  n_ctx?: number; // context window size
  n_threads?: number; // number of threads to use
  configs?: Record<string, any>; // Additional model-specific configurations
  createdAt?: number; // Timestamp of model creation
  updatedAt?: number; // Timestamp of last update

  static defaults: Partial<Model> = {
    n_ctx: 1024,
    n_threads: 1,
  };

  constructor(param: Partial<Model> = {}) {
    Object.assign(this, Model.defaults, param);
    this.id =
      param.id ??
      `model_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
