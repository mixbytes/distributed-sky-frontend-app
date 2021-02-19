const { ApiPromise, WsProvider } = require('@polkadot/api');

class ManagerBC {
    async connect_to_node() {
        const provider = new WsProvider('ws://127.0.0.1:9944');
        const api = await ApiPromise.create({
            provider: provider,
            types: {
                AccountRole: 'u8',
            }
        });

        const [chain, nodeName, nodeVersion] = await Promise.all([
           api.rpc.system.chain(),
           api.rpc.system.name(),
           api.rpc.system.version(),
        ]);

        await console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
    }
}

module.exports = ManagerBC;