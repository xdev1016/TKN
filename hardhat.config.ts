import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import '@openzeppelin/hardhat-upgrades';
import '@nomicfoundation/hardhat-verify';
import "@typechain/hardhat";

require('@openzeppelin/hardhat-upgrades');
require('dotenv').config();

export default {
	solidity: {
		version: '0.8.17',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	namedAccounts: {
		deployer: {
			default: 0,
			42: '0x9De5B00012A27b3efd50d5B90bF2e07413cED178',
		},
	},
	typechain: {
		outDir: 'typechain',
		target: 'ethers-v5',
	},
	networks: {
		localhost: {
			url: `http://127.0.0.1:8545`,
		},
		sepolia: {
			url: process.env.ETHTEST_NET_API_URL,
			accounts: [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_ALICE],
			saveDeployments: true,
		},
		mainnet: {
			url: process.env.ETHMAIN_NET_API_URL,
			accounts: [process.env.PRIVATE_KEY],
			saveDeployments: true,
		},
	},
	paths: {
		deploy: 'deploy',
		deployments: 'deployments',
		imports: 'imports',
	},
	etherscan: {
		apiKey: process.env.ETH_API_KEY,
	},
	mocha: {
		timeout: 1000000000,
	},
	sourcify: {
		enabled: false,
	},
};
