export interface IDataPayload {
  energia?: number;
  diagnostico?: string;
  radar?: any;
  alerta?: boolean;
  iaStatus?: string;
  fluxo?: number;
}

class DataService {
  private listeners: ((data: IDataPayload) => void)[] = [];
  subscribe(fn: (data: IDataPayload) => void) { this.listeners.push(fn); }
  emit(data: IDataPayload) { this.listeners.forEach(fn => fn(data)); }
}

export const dataService = new DataService();
