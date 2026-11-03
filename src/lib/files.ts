import { existsSync } from 'node:fs';
import { join } from 'node:path';

// Links to files in /public render only when the file is there, so the site never ships a dead link.
export const hasPublicFile = (path: string) => existsSync(join(process.cwd(), 'public', path));
