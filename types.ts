export interface KeywordStat {
  keyword: string;
  count: number;
  context?: string;
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
}

export interface ScrapeResult {
  summary: string;
  stats: KeywordStat[];
  sources: GroundingSource[];
  timestamp: string;
}

export interface ScrapeRequest {
  topic: string;
  keywords: string[];
}
