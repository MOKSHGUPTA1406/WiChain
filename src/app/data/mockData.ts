import contracts from '../../config/contracts.json';

const getContractHash = (appletName: string) => {
  // @ts-ignore - contracts.json structure
  return contracts.testnet?.[appletName]?.contractHash;
};

export const mockApplets = [
  {
    id: '1',
    name: 'AI Model Training',
    provider: 'Neural Networks Inc.',
    category: 'AI' as const,
    description: 'Distributed AI model training with privacy-preserving techniques',
    gasCost: 250,
    icon: 'brain',
    contractHash: getContractHash('example-applet'), // Mapping example-applet to this UI item
    metrics: [
      { label: "Accuracy", value: "99.8%" },
      { label: "Params", value: "1.2B" }
    ]
  },
  {
    id: '2',
    name: 'Decentralized Oracle',
    provider: 'Data Streams Ltd.',
    category: 'Oracle' as const,
    description: 'Real-time price feeds and off-chain data aggregation',
    gasCost: 200,
    icon: 'radio',
    metrics: [
      { label: "Uptime", value: "99.99%" },
      { label: "Feeds", value: "50+" }
    ]
  },
  {
    id: '3',
    name: 'Smart Contract Auditor',
    provider: 'Security Experts',
    category: 'Audit' as const,
    description: 'Automated vulnerability scanning and security analysis',
    gasCost: 350,
    icon: 'shield',
    metrics: [
      { label: "Speed", value: "<1 min" },
      { label: "Vulns", value: "Top 10" }
    ]
  },
  {
    id: '4',
    name: 'Decentralized Oracle+',
    provider: 'Oracle Pro Services',
    category: 'Oracle' as const,
    description: 'Premium oracle with guaranteed uptime and accuracy',
    gasCost: 300,
    icon: 'radio',
    metrics: [
      { label: "Uptime", value: "100%" },
      { label: "Feeds", value: "500+" }
    ]
  },
  {
    id: '5',
    name: 'IPFS File Manager',
    provider: 'Storage Solutions',
    category: 'Storage' as const,
    description: 'Decentralized file storage with content addressing',
    gasCost: 180,
    icon: 'database',
    metrics: [
      { label: "Pins", value: "Auto" },
      { label: "Nodes", value: "12k" }
    ]
  },
  {
    id: '6',
    name: 'DeFi Yield Optimizer',
    provider: 'Yield Farmers Co.',
    category: 'DeFi' as const,
    description: 'Automated yield farming strategies across protocols',
    gasCost: 400,
    icon: 'sparkles',
    metrics: [
      { label: "APY", value: "Up to 15%" },
      { label: "TVL", value: "$4.2M" }
    ]
  },
  {
    id: '7',
    name: 'Zero-Knowledge Compute',
    provider: 'Privacy Labs',
    category: 'Compute' as const,
    description: 'Execute sensitive computations with ZK proofs',
    gasCost: 500,
    icon: 'code',
    metrics: [
      { label: "Proof", value: "SNARK" },
      { label: "Privacy", value: "High" }
    ]
  },
  {
    id: '8',
    name: 'Multi-Sig Treasury',
    provider: 'DAO Tools Inc.',
    category: 'DeFi' as const,
    description: 'Collaborative treasury management with governance',
    gasCost: 275,
    icon: 'sparkles',
    metrics: [
      { label: "Signers", value: "M-of-N" },
      { label: "Security", value: "Audited" }
    ]
  },
];

export const mockExecutions = [
  {
    id: 1,
    name: 'AI Model Training',
    status: 'success' as const,
    fee: 210,
    timestamp: '2m ago',
  },
  {
    id: 2,
    name: 'Smart Contract Audit',
    status: 'success' as const,
    fee: 340,
    timestamp: '5m ago',
  },
  {
    id: 3,
    name: 'Oracle Price Feed',
    status: 'success' as const,
    fee: 195,
    timestamp: '12m ago',
  },
  {
    id: 4,
    name: 'File Upload',
    status: 'failed' as const,
    fee: 85,
    timestamp: '18m ago',
  },
  {
    id: 5,
    name: 'ZK Computation',
    status: 'pending' as const,
    timestamp: '22m ago',
  },
  {
    id: 6,
    name: 'Yield Optimization',
    status: 'success' as const,
    fee: 380,
    timestamp: '31m ago',
  },
  {
    id: 7,
    name: 'Treasury Vote',
    status: 'success' as const,
    fee: 265,
    timestamp: '1h ago',
  },
];
