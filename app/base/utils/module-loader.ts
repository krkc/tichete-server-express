/**
 * This function is called by an index.ts file as a way
 * to dynamically import all modules from its current directory.
 *
 * @param directoryPath Path of the calling index.ts file's current directory.
 * @returns A promise to yield an array of modules.
 */
export default async (directoryPath: string) => {
    return new Promise<any[]>(
        (res: any, rej: any): void => {
            const walker = require("walker");

            const modules: any = [];
            walker(directoryPath)
                .on('file', (file: any) => {
                    if (!file.match(/(?<!index)(?:\.js)$/m)) return;

                    const mods = require(file);
                    for (const modName in mods) {
                        if (mods.hasOwnProperty(modName)) {
                            const mod = mods[modName];
                            modules.push(mod);
                        }
                    }
                })
                .on('error', (err: any, entry: any) => rej(`Got error ${err} on entry ${entry}`))
                .on('end', () => res(modules));
        }
    );
};
