export interface IRace {
  id: string;
  name: string;
  description?: string;
  startsAt: Date;
  endsAt?: Date | null;
}
