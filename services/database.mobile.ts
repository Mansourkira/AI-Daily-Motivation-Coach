import * as SQLite from 'expo-sqlite';

// ---- Types ----
export interface Parametre {
    id: number;
    connexion_on_line: 'On' | 'Off';
    server_name?: string;
    database_name?: string;
    db_user?: string;
    db_password?: string;
    offline_file_path?: string;
    offline_verification_mode?: 'with' | 'without'; // 'with' = verify article exists, 'without' = allow any article
    backend_api_url?: string; // Backend API URL for connecting to SQL Server
}

export interface F_Article {
    Ar_Ref: string;
    Ar_Design: string;
}

export interface Article {
    CodeABar: string;      // Code à barre (barcode)
    Designation: string;   // Description
    Code: string;          // Code article
}

export interface Inventaire {
    id?: number;
    Code: string;
    Designation: string;
    Quantite: number;
    DateHeure: string;
}

// ---- Service ----
class DatabaseService {
    private db: SQLite.SQLiteDatabase | null = null;
    private dbName = 'inventaire.db';
    private isInitialized = false;
    private initPromise: Promise<void> | null = null;

    /**
     * Initialize DB exactly once per app run.
     * Uses PRAGMA user_version for schema versioning/migrations.
     */
    async initDatabase(): Promise<void> {
        if (this.isInitialized) return;
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            try {
                console.log('Starting database initialization...');
                // Open (or create) the DB if not open
                if (!this.db) {
                    this.db = await SQLite.openDatabaseAsync(this.dbName);
                    console.log('Database opened successfully');
                }

                // Read schema version
                const verRow = await this.db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
                const currentVersion = verRow?.user_version ?? 0;

                // Fresh install or upgrade path
                if (currentVersion < 1) {
                    await this.createSchemaV1();
                    await this.seedIfEmpty();
                    await this.db.execAsync('PRAGMA user_version = 1');
                }

                // Migration to V2: Add CodeABar field to Article table
                if (currentVersion < 2) {
                    await this.migrateToV2();
                    await this.db.execAsync('PRAGMA user_version = 2');
                }

                // Migration to V3: Add offline_verification_mode field to Parametre table
                if (currentVersion < 3) {
                    await this.migrateToV3();
                    await this.db.execAsync('PRAGMA user_version = 3');
                }

                // Migration to V4: Add db_user and db_password fields to Parametre table
                if (currentVersion < 4) {
                    await this.migrateToV4();
                    await this.db.execAsync('PRAGMA user_version = 4');
                }

                // Migration to V5: Add backend_api_url field to Parametre table
                if (currentVersion < 5) {
                    await this.migrateToV5();
                    await this.db.execAsync('PRAGMA user_version = 5');
                }

                this.isInitialized = true;
                console.log('Database initialization completed');
            } catch (error) {
                console.error('Error initializing database:', error);
                this.isInitialized = false;
                this.db = null;
                throw new Error(
                    `Database initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
                );
            }
        })();

        return this.initPromise;
    }

    // Add in DatabaseService
    async updateParametre(params: {
        connexion_on_line: 'On' | 'Off';
        server_name?: string;
        database_name?: string;
        db_user?: string;
        db_password?: string;
        offline_file_path?: string;
        offline_verification_mode?: 'with' | 'without';
        backend_api_url?: string;
    }): Promise<void> {
        this.ensureInitialized();
        await this.db!.execAsync('BEGIN TRANSACTION;');
        try {
            await this.db!.runAsync(
                `UPDATE Parametre
         SET connexion_on_line = ?,
             server_name = ?,
             database_name = ?,
             db_user = ?,
             db_password = ?,
             offline_file_path = ?,
             offline_verification_mode = ?,
             backend_api_url = ?
         WHERE id = 1`,
                [
                    params.connexion_on_line,
                    params.server_name ?? '',
                    params.database_name ?? '',
                    params.db_user ?? '',
                    params.db_password ?? '',
                    params.offline_file_path ?? '',
                    params.offline_verification_mode ?? 'with',
                    params.backend_api_url ?? 'http://192.168.1.19:3000',
                ]
            );
            await this.db!.execAsync('COMMIT;');
        } catch (e) {
            await this.db!.execAsync('ROLLBACK;');
            throw e;
        }
    }


    /**
     * Create schema (V1). Uses IF NOT EXISTS; safe to call on existing DB.
     */
    private async createSchemaV1(): Promise<void> {
        if (!this.db) throw new Error('Database not opened');

        await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS Parametre (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        connexion_on_line TEXT NOT NULL DEFAULT 'On',
        server_name TEXT,
        database_name TEXT,
        db_user TEXT,
        db_password TEXT,
        offline_file_path TEXT,
        offline_verification_mode TEXT DEFAULT 'with',
        backend_api_url TEXT DEFAULT 'http://192.168.1.19:3000'
      );

      CREATE TABLE IF NOT EXISTS F_Article (
        Ar_Ref TEXT PRIMARY KEY,
        Ar_Design TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Article (
        CodeABar TEXT PRIMARY KEY,
        Designation TEXT NOT NULL,
        Code TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS inventaire (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Code TEXT NOT NULL,
        Designation TEXT NOT NULL,
        Quantite INTEGER NOT NULL,
        DateHeure TEXT NOT NULL
      );
    `);
        console.log('Tables created (or already existed)');
    }

    /**
     * Seed only when tables are empty. No-op on subsequent runs.
     */
    private async seedIfEmpty(): Promise<void> {
        if (!this.db) throw new Error('Database not opened');

        const count = async (table: string) =>
            (await this.db!.getFirstAsync<{ c: number }>(`SELECT COUNT(*) AS c FROM ${table}`))?.c ?? 0;

        // Parametre
        if ((await count('Parametre')) === 0) {
            await this.db.runAsync(
                `INSERT INTO Parametre (id, connexion_on_line, server_name, database_name, db_user, db_password, offline_file_path, offline_verification_mode, backend_api_url)
         VALUES (1, 'On', '', '', '', '', '', 'with', 'http://192.168.1.19:3000')`
            );
        }

        // F_Article
        if ((await count('F_Article')) === 0) {
            await this.db.execAsync(`
        INSERT INTO F_Article (Ar_Ref, Ar_Design) VALUES
        ('123456789', 'Article SAGE Test 1'),
        ('987654321', 'Article SAGE Test 2'),
        ('111111111', 'Article SAGE Test 3');
      `);
        }

        // Article
        if ((await count('Article')) === 0) {
            await this.db.execAsync(`
        INSERT INTO Article (CodeABar, Designation, Code) VALUES
        ('BAR001', 'Article Local 1', 'LOC001'),
        ('BAR002', 'Article Local 2', 'LOC002'),
        ('BAR003', 'Article Local 3', 'LOC003');
      `);
        }

        console.log('Seeding done (only for empty tables)');
    }

    /**
     * Migration to V2: Add CodeABar field to Article table
     */
    private async migrateToV2(): Promise<void> {
        if (!this.db) throw new Error('Database not opened');

        console.log('Starting migration to V2: Adding CodeABar to Article table');

        // Check if CodeABar column already exists
        const tableInfo = await this.db.getAllAsync<{ name: string }>('PRAGMA table_info(Article)');
        const hasCodeABar = tableInfo.some(col => col.name === 'CodeABar');

        if (!hasCodeABar) {
            // Recreate the table with new structure
            await this.db.execAsync(`
                -- Create temporary table with new structure
                CREATE TABLE Article_new (
                    CodeABar TEXT PRIMARY KEY,
                    Designation TEXT NOT NULL,
                    Code TEXT NOT NULL
                );
                
                -- Copy existing data, using Code as CodeABar for backward compatibility
                INSERT INTO Article_new (CodeABar, Designation, Code)
                SELECT Code, Designation, Code FROM Article;
                
                -- Drop old table
                DROP TABLE Article;
                
                -- Rename new table
                ALTER TABLE Article_new RENAME TO Article;
            `);
            console.log('Migration to V2 completed: CodeABar column added');
        } else {
            console.log('Migration to V2 skipped: CodeABar column already exists');
        }
    }

    /**
     * Migration to V3: Add offline_verification_mode field to Parametre table
     */
    private async migrateToV3(): Promise<void> {
        if (!this.db) throw new Error('Database not opened');

        console.log('Starting migration to V3: Adding offline_verification_mode to Parametre table');

        // Check if offline_verification_mode column already exists
        const tableInfo = await this.db.getAllAsync<{ name: string }>('PRAGMA table_info(Parametre)');
        const hasVerificationMode = tableInfo.some(col => col.name === 'offline_verification_mode');

        if (!hasVerificationMode) {
            await this.db.execAsync(`
                ALTER TABLE Parametre ADD COLUMN offline_verification_mode TEXT DEFAULT 'with';
            `);
            console.log('Migration to V3 completed: offline_verification_mode column added');
        } else {
            console.log('Migration to V3 skipped: offline_verification_mode column already exists');
        }
    }

    /**
     * Migration to V4: Add db_user and db_password fields to Parametre table
     */
    private async migrateToV4(): Promise<void> {
        if (!this.db) throw new Error('Database not opened');

        console.log('Starting migration to V4: Adding db_user and db_password to Parametre table');

        // Check if columns already exist
        const tableInfo = await this.db.getAllAsync<{ name: string }>('PRAGMA table_info(Parametre)');
        const hasDbUser = tableInfo.some(col => col.name === 'db_user');
        const hasDbPassword = tableInfo.some(col => col.name === 'db_password');

        if (!hasDbUser) {
            await this.db.execAsync(`
                ALTER TABLE Parametre ADD COLUMN db_user TEXT DEFAULT '';
            `);
            console.log('Migration to V4: db_user column added');
        }

        if (!hasDbPassword) {
            await this.db.execAsync(`
                ALTER TABLE Parametre ADD COLUMN db_password TEXT DEFAULT '';
            `);
            console.log('Migration to V4: db_password column added');
        }

        console.log('Migration to V4 completed');
    }

    /**
     * Migration to V5: Add backend_api_url field to Parametre table
     */
    private async migrateToV5(): Promise<void> {
        if (!this.db) throw new Error('Database not opened');

        console.log('Starting migration to V5: Adding backend_api_url to Parametre table');

        // Check if column already exists
        const tableInfo = await this.db.getAllAsync<{ name: string }>('PRAGMA table_info(Parametre)');
        const hasBackendApiUrl = tableInfo.some(col => col.name === 'backend_api_url');

        if (!hasBackendApiUrl) {
            await this.db.execAsync(`
                ALTER TABLE Parametre ADD COLUMN backend_api_url TEXT DEFAULT 'http://192.168.1.19:3000';
            `);
            console.log('Migration to V5: backend_api_url column added');
        } else {
            console.log('Migration to V5 skipped: backend_api_url column already exists');
        }

        console.log('Migration to V5 completed');
    }

    private ensureInitialized(): void {
        if (!this.isInitialized || !this.db) {
            throw new Error('Database not initialized. Please call initDatabase() first.');
        }
    }

    // ---- Parametre helpers ----
    async getConnexionStatus(): Promise<'On' | 'Off'> {
        this.ensureInitialized();
        const result = await this.db!.getFirstAsync<Parametre>(
            'SELECT connexion_on_line FROM Parametre WHERE id = 1'
        );
        return (result?.connexion_on_line as 'On' | 'Off') || 'On';
    }

    async updateConnexionStatus(status: 'On' | 'Off'): Promise<void> {
        this.ensureInitialized();
        await this.db!.runAsync('UPDATE Parametre SET connexion_on_line = ? WHERE id = 1', [status]);
    }

    async getParametre(): Promise<Parametre> {
        this.ensureInitialized();
        const result = await this.db!.getFirstAsync<Parametre>('SELECT * FROM Parametre WHERE id = 1');
        return (
            result || {
                id: 1,
                connexion_on_line: 'On',
                server_name: '',
                database_name: '',
                db_user: '',
                db_password: '',
                offline_file_path: '',
                offline_verification_mode: 'with',
                backend_api_url: 'http://192.168.1.19:3000',
            }
        );
    }

    /**
     * Test SQL Server connection via backend API
     * Note: Backend API must be running on your PC
     */
    async testSqlServerConnection(params: {
        server_name: string;
        database_name: string;
        db_user: string;
        db_password: string;
    }): Promise<{ success: boolean; message: string; articlesCount?: number }> {
        this.ensureInitialized();

        console.log('Testing SQL Server connection via backend API');

        try {
            // Get backend URL from parameters
            const parametres = await this.getParametre();
            const BACKEND_URL = parametres.backend_api_url || 'http://192.168.1.19:3000';

            const response = await fetch(`${BACKEND_URL}/api/test-connection`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    server_name: params.server_name,
                    database_name: params.database_name,
                    db_user: params.db_user,
                    db_password: params.db_password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('✅ Connection test successful:', data);
                return {
                    success: data.success,
                    message: data.message,
                    articlesCount: data.articlesCount,
                };
            } else {
                console.error('❌ Connection test failed:', data);
                return {
                    success: false,
                    message: data.message || 'Erreur de connexion',
                };
            }

        } catch (error) {
            console.error('❌ Backend API error:', error);

            // Provide helpful error messages
            if (error instanceof TypeError && error.message.includes('Network request failed')) {
                return {
                    success: false,
                    message: 'Impossible de joindre le serveur backend. Vérifiez que l\'API est démarrée sur votre PC.',
                };
            }

            return {
                success: false,
                message: `Erreur API: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
            };
        }
    }

    /**
     * Search article by barcode in SQL Server via backend API
     */
    async searchArticleInSage(barcode: string): Promise<Article | null> {
        this.ensureInitialized();

        try {
            // Get saved parameters
            const params = await this.getParametre();

            if (!params.server_name || !params.database_name || !params.db_user || !params.db_password) {
                console.error('Missing SAGE connection parameters');
                return null;
            }

            const BACKEND_URL = params.backend_api_url || 'http://192.168.1.19:3000';

            const response = await fetch(`${BACKEND_URL}/api/search-article`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    server_name: params.server_name,
                    database_name: params.database_name,
                    db_user: params.db_user,
                    db_password: params.db_password,
                    barcode: barcode,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success && data.article) {
                console.log('✅ Article found in SAGE:', data.article);
                return {
                    CodeABar: data.article.CodeABar || barcode,
                    Designation: data.article.Designation || '',
                    Code: data.article.Code || '',
                };
            } else {
                console.log('❌ Article not found in SAGE');
                return null;
            }

        } catch (error) {
            console.error('❌ Error searching article in SAGE:', error);
            return null;
        }
    }

    /**
     * Fetch articles from SQL Server via backend API
     */
    async fetchArticlesFromSqlServer(params: {
        server_name: string;
        database_name: string;
        db_user: string;
        db_password: string;
    }): Promise<{ success: boolean; message: string; articles: Article[] }> {
        this.ensureInitialized();

        console.log('Fetching articles from SQL Server via backend API');

        try {
            // Get backend URL from parameters
            const parametres = await this.getParametre();
            const BACKEND_URL = parametres.backend_api_url || 'http://192.168.1.19:3000';

            const response = await fetch(`${BACKEND_URL}/api/fetch-articles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    server_name: params.server_name,
                    database_name: params.database_name,
                    db_user: params.db_user,
                    db_password: params.db_password,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log(`✅ Fetched ${data.articles?.length || 0} articles from SQL Server`);
                return {
                    success: true,
                    message: data.message,
                    articles: data.articles || [],
                };
            } else {
                console.error('❌ Failed to fetch articles:', data);
                return {
                    success: false,
                    message: data.message || 'Erreur lors de la récupération',
                    articles: [],
                };
            }

        } catch (error) {
            console.error('❌ Backend API error:', error);

            if (error instanceof TypeError && error.message.includes('Network request failed')) {
                return {
                    success: false,
                    message: 'Impossible de joindre le serveur backend',
                    articles: [],
                };
            }

            return {
                success: false,
                message: `Erreur API: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
                articles: [],
            };
        }
    }

    async getServerDb(): Promise<{ server: string; database: string }> {
        this.ensureInitialized();
        const result = await this.db!.getFirstAsync<{ server_name: string; database_name: string }>(
            'SELECT server_name, database_name FROM Parametre WHERE id = 1'
        );
        return { server: result?.server_name || '', database: result?.database_name || '' };
    }

    async getOfflineFilePath(): Promise<string> {
        this.ensureInitialized();
        const result = await this.db!.getFirstAsync<{ offline_file_path: string }>(
            'SELECT offline_file_path FROM Parametre WHERE id = 1'
        );
        return result?.offline_file_path || '';
    }

    async setConnexion(status: 'On' | 'Off'): Promise<void> {
        this.ensureInitialized();
        await this.db!.runAsync('UPDATE Parametre SET connexion_on_line = ? WHERE id = 1', [status]);
    }

    async setOfflineFilePath(path: string): Promise<void> {
        this.ensureInitialized();
        await this.db!.runAsync('UPDATE Parametre SET offline_file_path = ? WHERE id = 1', [path]);
    }

    async setServerDb(server: string, dbname: string): Promise<void> {
        this.ensureInitialized();
        await this.db!.runAsync('UPDATE Parametre SET server_name = ?, database_name = ? WHERE id = 1', [
            server,
            dbname,
        ]);
    }

    // ---- Articles (SAGE/local) ----
    async getSageArticle(code: string): Promise<F_Article | null> {
        this.ensureInitialized();
        const result = await this.db!.getFirstAsync<F_Article>(
            'SELECT Ar_Ref, Ar_Design FROM F_Article WHERE Ar_Ref = ?',
            [code]
        );
        return result || null;
    }

    async getLocalArticle(code: string): Promise<Article | null> {
        this.ensureInitialized();
        const result = await this.db!.getFirstAsync<Article>(
            'SELECT CodeABar, Designation, Code FROM Article WHERE Code = ?',
            [code]
        );
        return result || null;
    }

    async getLocalArticleByBarcode(codeABar: string): Promise<Article | null> {
        this.ensureInitialized();
        const result = await this.db!.getFirstAsync<Article>(
            'SELECT CodeABar, Designation, Code FROM Article WHERE CodeABar = ?',
            [codeABar]
        );
        return result || null;
    }

    async getAllLocalArticles(): Promise<Article[]> {
        this.ensureInitialized();
        const result = await this.db!.getAllAsync<Article>('SELECT CodeABar, Designation, Code FROM Article ORDER BY Code');
        return result || [];
    }

    async getArticles(): Promise<Article[]> {
        return this.getAllLocalArticles();
    }

    async clearArticle(): Promise<void> {
        this.ensureInitialized();
        await this.db!.runAsync('DELETE FROM Article');
    }

    async insertArticles(rows: { CodeABar: string; Designation: string; Code: string }[]): Promise<number> {
        this.ensureInitialized();

        await this.db!.execAsync('BEGIN TRANSACTION;');
        try {
            for (const r of rows) {
                await this.db!.runAsync(
                    'INSERT OR REPLACE INTO Article (CodeABar, Designation, Code) VALUES (?, ?, ?)',
                    [r.CodeABar.trim(), r.Designation.trim(), r.Code.trim()]
                );
            }
            await this.db!.execAsync('COMMIT;');
        } catch (error) {
            await this.db!.execAsync('ROLLBACK;');
            throw error;
        }

        const c = await this.db!.getFirstAsync<{ c: number }>('SELECT COUNT(*) as c FROM Article');
        return c?.c ?? 0;
    }

    async importArticlesFromText(textContent: string): Promise<{ imported: number; errors: string[] }> {
        this.ensureInitialized();

        const errors: string[] = [];
        let imported = 0;

        try {
            console.log('Starting import, content length:', textContent.length);
            const lines = textContent.split('\n').filter((line) => line.trim());
            console.log(`Found ${lines.length} non-empty lines`);

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                // Split by semicolon (;)
                // Format: BARCODE;DESIGNATION;CODE_ARTICLE;CATEGORY
                // Note: BARCODE can be empty (leading semicolon)
                const parts = line.split(';');

                if (parts.length < 3 || parts.length > 4) {
                    const errorMsg = `Line ${i + 1}: Invalid format (found ${parts.length} fields, expected 3-4): ${line.substring(0, 50)}...`;
                    console.warn(errorMsg);
                    errors.push(errorMsg);
                    continue;
                }

                // Handle both formats:
                // 3 fields: BARCODE;DESIGNATION;CODE (old format)
                // 4 fields: BARCODE;DESIGNATION;CODE;CATEGORY (new format)
                let codeABar: string;
                let designation: string;
                let code: string;

                if (parts.length === 4) {
                    // New format: BARCODE;DESIGNATION;CODE;CATEGORY
                    codeABar = parts[0].trim();
                    designation = parts[1].trim();
                    code = parts[2].trim();
                    // parts[3] is category/supplier code (we don't use it)

                    // If barcode is empty, use the article code as barcode
                    if (!codeABar) {
                        codeABar = code;
                    }
                } else {
                    // Old format: BARCODE;DESIGNATION;CODE
                    codeABar = parts[0].trim();
                    designation = parts[1].trim();
                    code = parts[2].trim();

                    // If barcode is empty, use the article code as barcode
                    if (!codeABar) {
                        codeABar = code;
                    }
                }

                // Validate required fields
                if (!designation || !code) {
                    const errorMsg = `Line ${i + 1}: Missing required field(s) - Designation:'${designation}' Code:'${code}'`;
                    console.warn(errorMsg);
                    errors.push(errorMsg);
                    continue;
                }

                try {
                    await this.db!.runAsync('INSERT OR REPLACE INTO Article (CodeABar, Designation, Code) VALUES (?, ?, ?)', [
                        codeABar,
                        designation,
                        code,
                    ]);
                    imported++;

                    // Log first few imports for debugging
                    if (imported <= 5) {
                        console.log(`Imported article ${imported}: Barcode='${codeABar}' | Designation='${designation.substring(0, 30)}...' | Code='${code}'`);
                    }
                } catch (error) {
                    const errorMsg = `Line ${i + 1}: Database error - ${String(error)}`;
                    console.error(errorMsg);
                    errors.push(errorMsg);
                }
            }

            console.log(`Import completed: ${imported} imported, ${errors.length} errors`);
        } catch (error) {
            const errorMsg = `Import error: ${String(error)}`;
            console.error(errorMsg);
            errors.push(errorMsg);
        }

        return { imported, errors };
    }

    async importArticlesFromFile(filePath: string): Promise<{ imported: number; errors: string[] }> {
        try {
            console.log('Reading file from:', filePath);
            // Use the legacy expo-file-system to avoid deprecation warnings
            const FileSystem = await import('expo-file-system/legacy');
            const textContent = await FileSystem.readAsStringAsync(filePath);
            console.log('File read successfully, length:', textContent.length);
            console.log('First 200 chars:', textContent.substring(0, 200));
            return await this.importArticlesFromText(textContent);
        } catch (error) {
            const errorMsg = `File read error: ${String(error)}`;
            console.error(errorMsg);
            return { imported: 0, errors: [errorMsg] };
        }
    }

    /**
     * Import articles from SAGE database (online mode)
     * Fetches articles from SQL Server via backend API and inserts them into local database
     */
    async importArticlesFromSage(): Promise<{ imported: number; errors: string[] }> {
        this.ensureInitialized();

        const errors: string[] = [];
        let imported = 0;

        try {
            // Get saved SAGE connection parameters
            const params = await this.getParametre();

            if (!params.server_name || !params.database_name || !params.db_user || !params.db_password) {
                const errorMsg = 'Paramètres de connexion SAGE incomplets';
                console.error(errorMsg);
                return { imported: 0, errors: [errorMsg] };
            }

            console.log('Fetching articles from SAGE database...');

            // Fetch articles from SQL Server via backend API
            const result = await this.fetchArticlesFromSqlServer({
                server_name: params.server_name,
                database_name: params.database_name,
                db_user: params.db_user,
                db_password: params.db_password,
            });

            if (!result.success) {
                const errorMsg = `Échec de récupération: ${result.message}`;
                console.error(errorMsg);
                return { imported: 0, errors: [errorMsg] };
            }

            const articles = result.articles;
            console.log(`Fetched ${articles.length} articles from SAGE`);

            if (articles.length === 0) {
                return { imported: 0, errors: ['Aucun article trouvé dans la base SAGE'] };
            }

            // Insert articles into local database
            await this.db!.execAsync('BEGIN TRANSACTION;');
            try {
                for (const article of articles) {
                    try {
                        await this.db!.runAsync(
                            'INSERT OR REPLACE INTO Article (CodeABar, Designation, Code) VALUES (?, ?, ?)',
                            [
                                article.CodeABar.trim(),
                                article.Designation.trim(),
                                article.Code.trim(),
                            ]
                        );
                        imported++;

                        // Log first few imports for debugging
                        if (imported <= 5) {
                            console.log(`Imported article ${imported}: Barcode='${article.CodeABar}' | Designation='${article.Designation.substring(0, 30)}...' | Code='${article.Code}'`);
                        }
                    } catch (error) {
                        const errorMsg = `Error inserting article ${article.Code}: ${String(error)}`;
                        console.error(errorMsg);
                        errors.push(errorMsg);
                    }
                }
                await this.db!.execAsync('COMMIT;');
                console.log(`Import completed: ${imported} articles imported from SAGE`);
            } catch (error) {
                await this.db!.execAsync('ROLLBACK;');
                const errorMsg = `Transaction error: ${String(error)}`;
                console.error(errorMsg);
                errors.push(errorMsg);
            }

            return { imported, errors };
        } catch (error) {
            const errorMsg = `Import error: ${String(error)}`;
            console.error(errorMsg);
            return { imported: 0, errors: [errorMsg] };
        }
    }

    // ---- Inventaire ----
    async saveInventaire(inventaire: Omit<Inventaire, 'id'>): Promise<void> {
        this.ensureInitialized();
        const now = new Date().toISOString();
        await this.db!.runAsync(
            `INSERT INTO inventaire (Code, Designation, Quantite, DateHeure) VALUES (?, ?, ?, ?)`,
            [inventaire.Code, inventaire.Designation, inventaire.Quantite, now]
        );
    }

    async updateInventaireQuantite(code: string, additionalQuantite: number): Promise<void> {
        this.ensureInitialized();
        await this.db!.runAsync('UPDATE inventaire SET Quantite = Quantite + ? WHERE Code = ?', [
            additionalQuantite,
            code,
        ]);
    }

    async getInventaireByCode(code: string): Promise<Inventaire | null> {
        this.ensureInitialized();
        const result = await this.db!.getFirstAsync<Inventaire>(
            'SELECT * FROM inventaire WHERE Code = ? ORDER BY DateHeure DESC LIMIT 1',
            [code]
        );
        return result || null;
    }

    async getAllInventaire(): Promise<Inventaire[]> {
        this.ensureInitialized();
        const result = await this.db!.getAllAsync<Inventaire>(
            'SELECT * FROM inventaire ORDER BY DateHeure DESC'
        );
        return result || [];
    }

    // Alias to match your call sites that used getInventaires()
    async getInventaires(): Promise<Inventaire[]> {
        return this.getAllInventaire();
    }

    async upsertInventaireLine(inventaire: Omit<Inventaire, 'id' | 'DateHeure'>): Promise<void> {
        this.ensureInitialized();
        const now = new Date().toISOString();

        const existing = await this.db!.getFirstAsync<Inventaire>(
            'SELECT * FROM inventaire WHERE Code = ?',
            [inventaire.Code]
        );

        if (existing) {
            await this.db!.runAsync(
                'UPDATE inventaire SET Quantite = Quantite + ?, DateHeure = ? WHERE Code = ?',
                [inventaire.Quantite, now, inventaire.Code]
            );
        } else {
            await this.db!.runAsync(
                `INSERT INTO inventaire (Code, Designation, Quantite, DateHeure) VALUES (?, ?, ?, ?)`,
                [inventaire.Code, inventaire.Designation, inventaire.Quantite, now]
            );
        }
    }

    async deleteInventaireById(id: number): Promise<void> {
        this.ensureInitialized();
        await this.db!.runAsync('DELETE FROM inventaire WHERE id = ?', [id]);
    }

    async resetInventaire(): Promise<void> {
        this.ensureInitialized();
        await this.db!.runAsync('DELETE FROM inventaire');
    }

    async listInventaire(): Promise<Inventaire[]> {
        return this.getAllInventaire();
    }

    async exportInventaireToText(): Promise<string> {
        this.ensureInitialized();
        const items = await this.getAllInventaire();

        if (items.length === 0) {
            return "Aucun article inventorié";
        }

        // Create header
        const header = "Code|Désignation|Quantité|Date/Heure\n";
        const separator = "----------------------------------------\n";

        // Create rows
        const rows = items.map(item => {
            const formattedDate = new Date(item.DateHeure).toLocaleString('fr-FR');
            return `${item.Code}|${item.Designation}|${item.Quantite}|${formattedDate}`;
        }).join('\n');

        // Add summary
        const totalQuantity = items.reduce((sum, item) => sum + item.Quantite, 0);
        const summary = `\n\nRÉSUMÉ:\nTotal articles: ${items.length}\nTotal quantité: ${totalQuantity}\nDate d'export: ${new Date().toLocaleString('fr-FR')}`;

        return header + separator + rows + summary;
    }

    // ---- Debug helpers ----
    async debugCounts(): Promise<{ parametre: number; f_article: number; article: number; inventaire: number }> {
        this.ensureInitialized();
        const q = async (sql: string) => (await this.db!.getFirstAsync<{ c: number }>(sql))?.c ?? 0;
        return {
            parametre: await q(`SELECT COUNT(*) AS c FROM Parametre`),
            f_article: await q(`SELECT COUNT(*) AS c FROM F_Article`),
            article: await q(`SELECT COUNT(*) AS c FROM Article`),
            inventaire: await q(`SELECT COUNT(*) AS c FROM inventaire`),
        };
    }

    async debugArticleTableSchema(): Promise<any> {
        this.ensureInitialized();
        const version = await this.db!.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
        const tableInfo = await this.db!.getAllAsync('PRAGMA table_info(Article)');
        return {
            version: version?.user_version,
            columns: tableInfo,
        };
    }

    async debugPeekInventaire(limit = 5): Promise<Inventaire[]> {
        this.ensureInitialized();
        return await this.db!.getAllAsync<Inventaire>(
            `SELECT * FROM inventaire ORDER BY DateHeure DESC LIMIT ?`,
            [limit]
        );
    }

    async getDatabasePath(): Promise<string | null> {
        // expo-sqlite stores under <documentDirectory>/SQLite/<name>
        return this.dbName;
    }
}

export const databaseService = new DatabaseService();
