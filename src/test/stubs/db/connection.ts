export const connection = {
	query: async (query: string, params: any[] = []) => {
		return [{ "?column?": 1 }];
	},
};

export const client = connection;

export async function checkConnection() {
	try {
		await connection.query("SELECT 1");
		return true;
	} catch (error) {
		return false;
	}
}

export async function query(query: string, params: any[] = []): Promise<any> {
	return connection.query(query, params);
}
