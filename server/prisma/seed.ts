import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockApplets = [
    {
        name: 'AI Model Training',
        provider: 'Neural Networks Inc.',
        category: 'AI',
        description: 'Distributed AI model training with privacy-preserving techniques',
        gasCost: 250,
        icon: 'brain',
        metrics: [
            { label: "Accuracy", value: "99.8%" },
            { label: "Params", value: "1.2B" }
        ],
        estTime: "~5-10 min",
        securityStatus: "Audited",
        version: "v2.3.0",
        compliance: "GDPR"
    },
    {
        name: 'Decentralized Oracle',
        provider: 'Data Streams Ltd.',
        category: 'Oracle',
        description: 'Real-time price feeds and off-chain data aggregation',
        gasCost: 200,
        icon: 'radio',
        metrics: [
            { label: "Uptime", value: "99.99%" },
            { label: "Feeds", value: "50+" }
        ],
        estTime: "~1-2 sec",
        securityStatus: "Verified",
        version: "v1.0.5",
        compliance: "ISO27001"
    },
    {
        name: 'Smart Contract Auditor',
        provider: 'Security Experts',
        category: 'Audit',
        description: 'Automated vulnerability scanning and security analysis',
        gasCost: 350,
        icon: 'shield',
        metrics: [
            { label: "Speed", value: "<1 min" },
            { label: "Vulns", value: "Top 10" }
        ],
        estTime: "~45 sec",
        securityStatus: "High Assurance",
        version: "v4.1.2",
        compliance: "NIST"
    },
    {
        name: 'Decentralized Oracle+',
        provider: 'Oracle Pro Services',
        category: 'Oracle',
        description: 'Premium oracle with guaranteed uptime and accuracy',
        gasCost: 300,
        icon: 'radio',
        metrics: [
            { label: "Uptime", value: "100%" },
            { label: "Feeds", value: "500+" }
        ],
        estTime: "~500 ms",
        securityStatus: "Pro Verified",
        version: "v3.0.0",
        compliance: "SOC2"
    },
    {
        name: 'IPFS File Manager',
        provider: 'Storage Solutions',
        category: 'Storage',
        description: 'Decentralized file storage with content addressing',
        gasCost: 180,
        icon: 'database',
        metrics: [
            { label: "Pins", value: "Auto" },
            { label: "Nodes", value: "12k" }
        ],
        estTime: "~2-5 sec",
        securityStatus: "Standard",
        version: "v0.9.8",
        compliance: "None"
    },
    {
        name: 'DeFi Yield Optimizer',
        provider: 'Yield Farmers Co.',
        category: 'DeFi',
        description: 'Automated yield farming strategies across protocols',
        gasCost: 400,
        icon: 'sparkles',
        metrics: [
            { label: "APY", value: "Up to 15%" },
            { label: "TVL", value: "$4.2M" }
        ],
        estTime: "~15-30 sec",
        securityStatus: "Audited",
        version: "v2.5.1",
        compliance: "DeFi Safety"
    },
    {
        name: 'Zero-Knowledge Compute',
        provider: 'Privacy Labs',
        category: 'Compute',
        description: 'Execute sensitive computations with ZK proofs',
        gasCost: 500,
        icon: 'code',
        metrics: [
            { label: "Proof", value: "SNARK" },
            { label: "Privacy", value: "High" }
        ],
        estTime: "~1-3 min",
        securityStatus: "ZK-Proven",
        version: "v1.1.0",
        compliance: "HIPAA"
    },
    {
        name: 'Multi-Sig Treasury',
        provider: 'DAO Tools Inc.',
        category: 'DeFi',
        description: 'Collaborative treasury management with governance',
        gasCost: 275,
        icon: 'sparkles',
        metrics: [
            { label: "Signers", value: "M-of-N" },
            { label: "Security", value: "Audited" }
        ],
        estTime: "~Instant",
        securityStatus: "Multi-Sig",
        version: "v3.2.4",
        compliance: "ISO27001"
    },
];

async function main() {
    console.log('Seeding applets...');

    // Clear existing applets
    await prisma.execution.deleteMany(); // Clear executions first due to foreign key constraints
    await prisma.applet.deleteMany();

    for (const applet of mockApplets) {
        // Separate metrics for stringification
        // @ts-ignore - metrics property mismatch pending client regeneration
        const { metrics, ...appletData } = applet;
        await prisma.applet.create({
            data: {
                ...appletData,
                // @ts-ignore - metrics field missing in stale client
                metrics: JSON.stringify(metrics),
            },
        });
    }

    console.log('Seeding complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
