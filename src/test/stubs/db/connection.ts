export const client = {
  query: vi.fn().mockResolvedValue([{ "?column?": 1 }]),
  connect: vi.fn(),
  end: vi.fn()
};

export const connection = {
  query: vi.fn().mockImplementation((query: string) => {
    if (query.includes("SELECT 1")) {
      return { rows: [{ "?column?": 1 }] };
    }
    return { rows: [] };
  }),
  connect: vi.fn().mockResolvedValue(true),
  end: vi.fn().mockResolvedValue(true),
};

// Declaração única de checkConnection
export async function checkConnection(): Promise<boolean> {
  try {
    await connection.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

// Exportação padrão consolidada
export default {
  query: connection.query,
  connect: connection.connect,
  end: connection.end,
  checkConnection,
};
