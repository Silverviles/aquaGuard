export interface WaterSourceLocationEntry {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
  images?: string[];
  upVotes: number;
  downVotes: number;
}

export interface MapDisplayPosition {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface WaterReportEntry {
  id: string;
  title: string;
  description: string;
  town: string;
  district: string;
  images?: string[];
}
