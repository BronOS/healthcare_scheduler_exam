import {User} from "../interfaces/types";
import {v4 as uuidv4} from 'uuid';
import {promises as fs, readFileSync} from 'fs';
import {injectable} from "inversify";
import {Mutex} from "async-mutex";

export interface UserRepository {
    create(user: User): Promise<User>;

    findById(id: string): Promise<User | undefined>;

    findByEmail(email: string): Promise<User | undefined>;
}

@injectable()
export class FileUserRepository implements UserRepository {

    constructor(
        private readonly filePath: string,
        private readonly cache: Map<string, User> = new Map(),
        private readonly mutex = new Mutex(),
    ) {
        // warm up the cache at startup
        this.load().forEach(user => {
            this.cache.set(user.email, user);
        });
    }

    create(user: User): Promise<User> {
        return this.mutex.runExclusive(async () => {
            const id = uuidv4();
            const newUser = {...user, id};
            this.cache.set(user.email, newUser);
            await this.flush(Array.from(this.cache.values()));
            return newUser;
        });
    }

    findByEmail(email: string): Promise<User | undefined> {
        return this.mutex.runExclusive(async () => {
            return this.cache.get(email);
        });
    }

    findById(id: string): Promise<User | undefined> {
        return this.mutex.runExclusive(async () => {
            return Array.from(this.cache.values()).find(user => user.id === id);
        });
    }

    private flush(providers: User[]): Promise<void> {
        // write the providers to the file
        return fs.writeFile(this.filePath, JSON.stringify(providers, null, 2));
    }

    private load(): User[] {
        return JSON.parse(readFileSync(this.filePath, 'utf-8'));
    }
}