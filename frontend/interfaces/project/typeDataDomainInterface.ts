interface TypeDataDomainInterface {
  domain: {
    name: string;
    chainId: number;
  };
  types: {
    ProjectDetail: Array<{ name: string; type: string }>;
  };
}

export type { TypeDataDomainInterface };
