export interface IRaceDTO {
  id: string;
  name: string;
  description?: string;
  startsAt: string;  // ISO
  endsAt: string;    // ISO
}

export interface IRace {
  id: string;
  name: string;
  description?: string;
  startsAt: Date;    // Date объект
  endsAt: Date;      // Date объект
}

export interface IRaceCreateDTO {
  name: string;
  description?: string;
  startsAt: string;
  endsAt: string;
}

export interface IRaceUpdateDTO {
  name?: string;
  description?: string;
  startsAt?: string;
  endsAt?: string;
}