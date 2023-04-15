import { LocationPositionModel } from "./LocationPositionModel";

export interface LocationModel {
  position: LocationPositionModel;
  country: string;
  locality: string;
}

export interface LocationHistoryModel extends LocationModel {
  timestamp: number;
}
